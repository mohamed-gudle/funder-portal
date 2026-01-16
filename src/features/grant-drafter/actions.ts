'use server';

import connectDB from '@/lib/db';
import ThreadModel from '@/server/models/thread.model';
import OpenCall from '@/server/models/open-call.model';
import { MongoDBSaver } from '@/lib/langgraph-checkpoint-mongo';
import { HumanMessage } from '@langchain/core/messages';
import { v4 as uuidv4 } from 'uuid';

// --- Open Calls ---

export async function getOpenCalls() {
  await connectDB();
  try {
    const calls = await OpenCall.find({}, 'title _id')
      .sort({ createdAt: -1 })
      .lean();
    return calls.map((call: any) => ({
      id: call._id.toString(),
      title: call.title
    }));
  } catch (error) {
    console.error('Error fetching open calls:', error);
    return [];
  }
}

// --- Thread Management (Replacing ChatSession) ---

export async function createOrGetChatSession(
  userId: string,
  openCallId?: string
) {
  await connectDB();
  try {
    const query: any = { 'metadata.userId': userId };

    if (openCallId && openCallId !== 'none') {
      query['metadata.openCallId'] = openCallId;
      const existingThread = await ThreadModel.findOne(query).sort({
        updatedAt: -1
      });
      if (existingThread) {
        return { success: true, sessionId: existingThread.thread_id };
      }
    }

    // Create new Thread ID
    // Note: Actual DB document is created by MongoDBSaver.put(), or we can preload it here
    // to ensure it shows up in "History" immediately with initial metadata?
    // Let's safe-guard by creating the Thread doc now.
    const thread_id = uuidv4();
    const initialMetadata = {
      userId,
      openCallId: openCallId === 'none' ? undefined : openCallId,
      title:
        openCallId && openCallId !== 'none'
          ? `Draft for Open Call`
          : 'New Grant Draft'
    };

    await ThreadModel.create({
      thread_id,
      metadata: initialMetadata
    });

    return { success: true, sessionId: thread_id };
  } catch (error) {
    console.error('Error creating chat session (thread):', error);
    return { success: false, error: 'Failed to create thread' };
  }
}

export async function getUserChatSessions(userId: string, openCallId?: string) {
  await connectDB();
  try {
    const query: any = { 'metadata.userId': userId };
    if (openCallId && openCallId !== 'none') {
      query['metadata.openCallId'] = openCallId;
    }

    // Fetch threads
    const threads = await ThreadModel.find(query)
      .sort({ updatedAt: -1 })
      .lean();

    return threads.map((t: any) => ({
      id: t.thread_id,
      title: t.metadata?.title || 'Untitled Draft',
      openCallId: t.metadata?.openCallId,
      updatedAt: t.updatedAt
    }));
  } catch (error) {
    console.error('Error fetching user threads:', error);
    return [];
  }
}

// --- Graph Interaction ---

export async function getChatHistory(sessionId: string) {
  const checkpointer = new MongoDBSaver();
  const config = { configurable: { thread_id: sessionId } };

  try {
    const state = await checkpointer.getTuple(config);
    if (!state || !state.checkpoint) return [];

    const messages = state.checkpoint.channel_values?.messages || [];

    return messages.map((msg: any) => ({
      role: msg.id
        ? msg.constructor.name === 'HumanMessage'
          ? 'user'
          : 'assistant'
        : msg.role || 'assistant',
      content:
        msg.content || (typeof msg === 'string' ? msg : JSON.stringify(msg)),
      createdAt: new Date()
    }));
  } catch (error) {
    console.error('Error fetching history from graph:', error);
    return [];
  }
}

export async function sendMessage(sessionId: string, message: string) {
  await connectDB();
  try {
    const thread = await ThreadModel.findOne({ thread_id: sessionId }).lean();
    if (!thread) return { success: false, error: 'Thread not found' };

    let context = {
      grantName: '',
      requirements: '',
      orgContext:
        'The user is from the organization associated with this portal.'
    };

    const openCallId = thread.metadata?.openCallId;

    if (openCallId) {
      const openCall = await OpenCall.findById(openCallId).lean();
      if (openCall) {
        context.grantName = openCall.title;
        context.requirements = `Description: ${openCall.description}\nFunder: ${openCall.funder}`;
      }
    }

    const checkpointer = new MongoDBSaver();
    const { createGrantGraph } = await import('./graph');
    const graph = createGrantGraph(checkpointer);

    // Pass metadata to config so it gets saved with the checkpoint
    const config = {
      configurable: {
        thread_id: sessionId
      },
      metadata: {
        ...thread.metadata,
        lastActive: new Date().toISOString()
      }
    };

    const result = await graph.invoke(
      {
        messages: [new HumanMessage(message)],
        grantName: context.grantName,
        requirements: context.requirements,
        orgContext: context.orgContext
      },
      config
    );

    const lastMessage = result.messages[result.messages.length - 1];
    const assistantResponse = lastMessage.content as string;

    return { success: true, message: assistantResponse };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error: 'Failed to process message' };
  }
}

export async function processGoogleDriveFile(
  sessionId: string,
  fileId: string,
  accessToken: string,
  fileName: string
) {
  const checkpointer = new MongoDBSaver();
  const { createGrantGraph } = await import('./graph');

  try {
    // 1. Fetch file content
    let content = '';

    // Try to export as text (works for Google Docs)
    const exportResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    if (exportResponse.ok) {
      content = await exportResponse.text();
    } else {
      // If export fails (e.g. not a Google Doc), try direct download
      const downloadResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      if (downloadResponse.ok) {
        // Check content type
        const contentType = downloadResponse.headers.get('content-type');
        if (contentType?.includes('text') || contentType?.includes('json')) {
          content = await downloadResponse.text();
        } else {
          content = `[Binary file selected: ${fileName}. Content not extracted in this version.]`;
        }
      } else {
        throw new Error('Failed to download file');
      }
    }

    if (!content) content = '[Empty File]';

    // 2. Inject into Graph history
    // We add a HumanMessage with the file content effectively acting as a prompt with context.
    // Or we could use a SystemMessage, but HumanMessage "Checking this file..." is often better for the flow.
    // Let's frame it as the user providing context.

    const messageContent = `I am sharing a file for context.\n\nFile Name: ${fileName}\n\nContent:\n${content}\n\nPlease use this context for future drafting.`;

    // Restore state to save
    const config = { configurable: { thread_id: sessionId } };

    // We can just invoke the graph with this message.
    const graph = createGrantGraph(checkpointer);

    await graph.invoke(
      {
        messages: [new HumanMessage(messageContent)]
        // optional: preserve existing context if needed, but the graph state management should handle it
      },
      config
    );

    return { success: true };
  } catch (error) {
    console.error('Error processing Drive file:', error);
    return { success: false, error: 'Failed to process Google Drive file' };
  }
}
