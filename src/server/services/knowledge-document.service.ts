import connectDB from '@/lib/db';
import KnowledgeDocument, {
  IKnowledgeDocument
} from '../models/knowledge-document.model';

export interface KnowledgeDocumentPayload {
  title: string;
  docType: string;
  sectors?: string[];
  specialties?: string[];
  engagementStages?: string[];
  applicationTypes?: string[];
  organizations?: string[];
  region?: string;
  year?: number;
  tags?: string[];
  sensitivity?: string;
  sourceUrl?: string;
  s3Key: string;
  s3Url: string;
  mimeType?: string;
  size?: number;
}

class KnowledgeDocumentService {
  async create(payload: KnowledgeDocumentPayload) {
    await connectDB();
    return KnowledgeDocument.create({
      ...payload,
      sectors: payload.sectors || [],
      specialties: payload.specialties || [],
      engagementStages: payload.engagementStages || [],
      applicationTypes: payload.applicationTypes || [],
      organizations: payload.organizations || [],
      tags: payload.tags || []
    });
  }

  async findAll() {
    await connectDB();
    return KnowledgeDocument.find().sort({ createdAt: -1 });
  }

  async findById(id: string) {
    await connectDB();
    return KnowledgeDocument.findById(id);
  }
}

export const knowledgeDocumentService = new KnowledgeDocumentService();
