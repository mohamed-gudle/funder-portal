import connectDB from '@/lib/db';
import { Opportunity } from '@/types/modules';
import { FilterQuery } from 'mongoose';
import OpportunityResult, {
  IOpportunityResult
} from '../models/opportunity-result.model';

type SaveFinderPayload = {
  opportunities: Opportunity[];
  query?: string;
  maxIterations?: number;
};

class OpportunityService {
  async saveFinderResults(payload: SaveFinderPayload) {
    const { opportunities, query, maxIterations } = payload;

    if (!opportunities?.length) {
      return { saved: [], stats: { upserted: 0, matched: 0, modified: 0 } };
    }

    await connectDB();

    const now = new Date();
    const operations = opportunities.map((item) => ({
      updateOne: {
        filter: { url: item.url },
        update: {
          $set: {
            title: item.title,
            organization: item.organization,
            description: item.description,
            amount: item.amount,
            deadline: item.deadline,
            energy_sector: item.energy_sector,
            eligibility: item.eligibility,
            relevance_score: Number(item.relevance_score) || 0,
            query,
            maxIterations,
            updatedAt: now
          },
          $setOnInsert: {
            createdAt: now
          }
        },
        upsert: true
      }
    }));

    const result = await OpportunityResult.bulkWrite(operations, {
      ordered: false
    });

    const saved = await OpportunityResult.find({
      url: { $in: opportunities.map((item) => item.url) }
    }).sort({ updatedAt: -1 });

    return {
      saved,
      stats: {
        upserted: result.upsertedCount ?? 0,
        matched: result.matchedCount ?? 0,
        modified: result.modifiedCount ?? 0
      }
    };
  }

  async findAll(search?: string) {
    await connectDB();
    const query: FilterQuery<IOpportunityResult> = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
        { energy_sector: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    return OpportunityResult.find(query).sort({ updatedAt: -1 });
  }
}

export const opportunityService = new OpportunityService();
