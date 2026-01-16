import {
  BaseCheckpointSaver,
  Checkpoint,
  CheckpointMetadata,
  CheckpointTuple
  // PendingWrite
} from '@langchain/langgraph';
import { RunnableConfig } from '@langchain/core/runnables';
import CheckpointModel from '@/server/models/checkpoint.model';
import ThreadModel from '@/server/models/thread.model';
import connectDB from '@/lib/db';

export class MongoDBSaver extends BaseCheckpointSaver {
  constructor() {
    super();
  }

  async getTuple(config: RunnableConfig): Promise<CheckpointTuple | undefined> {
    await connectDB();
    const thread_id = config.configurable?.thread_id;
    const checkpoint_id = config.configurable?.checkpoint_id;

    if (!thread_id) return undefined;

    let doc;
    if (checkpoint_id) {
      doc = await CheckpointModel.findOne({ thread_id, checkpoint_id }).lean();
    } else {
      // Get the latest
      doc = await CheckpointModel.findOne({ thread_id })
        .sort({ createdAt: -1 })
        .lean();
    }

    if (!doc) return undefined;

    const checkpoint: Checkpoint = doc.checkpoint as Checkpoint;
    const metadata: CheckpointMetadata = doc.metadata as CheckpointMetadata;
    const parentConfig = doc.parent_checkpoint_id
      ? { configurable: { thread_id, checkpoint_id: doc.parent_checkpoint_id } }
      : undefined;

    return {
      config: { configurable: { thread_id, checkpoint_id: doc.checkpoint_id } },
      checkpoint,
      metadata,
      parentConfig
    };
  }

  async *list(config: RunnableConfig): AsyncGenerator<CheckpointTuple> {
    await connectDB();
    const thread_id = config.configurable?.thread_id;
    if (!thread_id) return;

    const docs = await CheckpointModel.find({ thread_id })
      .sort({ createdAt: -1 })
      .lean();

    for (const doc of docs) {
      yield {
        config: {
          configurable: { thread_id, checkpoint_id: doc.checkpoint_id }
        },
        checkpoint: doc.checkpoint as Checkpoint,
        metadata: doc.metadata as CheckpointMetadata,
        parentConfig: doc.parent_checkpoint_id
          ? {
              configurable: {
                thread_id,
                checkpoint_id: doc.parent_checkpoint_id
              }
            }
          : undefined
      };
    }
  }

  async put(
    config: RunnableConfig,
    checkpoint: Checkpoint,
    metadata: CheckpointMetadata,
    newVersions: Record<string, string | number>
  ): Promise<RunnableConfig> {
    await connectDB();
    const thread_id = config.configurable?.thread_id;
    const checkpoint_id = checkpoint.id;

    // Save Checkpoint
    await CheckpointModel.create({
      thread_id,
      checkpoint_id,
      checkpoint,
      metadata
    });

    // Upsert Thread with latest metadata
    // This allows us to efficient list threads by metadata (user, etc)
    if (thread_id) {
      await ThreadModel.findOneAndUpdate(
        { thread_id },
        {
          $set: {
            metadata: metadata // Update metadata (e.g. title changes)
          },
          $setOnInsert: { thread_id }
        },
        { upsert: true, new: true }
      );
    }

    return {
      configurable: {
        thread_id,
        checkpoint_id
      }
    };
  }

  async putWrites(
    config: RunnableConfig,
    writes: any[],
    taskId: string
  ): Promise<void> {
    return;
  }

  async deleteThread(configurable: any): Promise<void> {
    if (!configurable?.thread_id) return;
    await connectDB();
    await CheckpointModel.deleteMany({ thread_id: configurable.thread_id });
    await ThreadModel.deleteOne({ thread_id: configurable.thread_id });
  }
}
