import connectDB from '@/lib/db';
import BilateralEngagement, {
  IBilateralEngagement
} from '../models/bilateral-engagement.model';

export class BilateralEngagementService {
  async create(data: Partial<IBilateralEngagement>) {
    await connectDB();
    const engagement = await BilateralEngagement.create(data);
    return engagement;
  }

  async findAll(filter: any = {}) {
    await connectDB();
    const query: any = {};

    // Stage filter
    if (filter.stage) {
      query.status = filter.stage;
    }

    if (filter.status) {
      query.status = filter.status;
    }

    // Tag filter (reuse sector param for backward compatibility)
    if (filter.sector) {
      query.tags = filter.sector;
    }

    // Search filter
    if (filter.search) {
      query.$or = [
        { organizationName: { $regex: filter.search, $options: 'i' } },
        { contactPerson: { $regex: filter.search, $options: 'i' } },
        { internalOwner: { $regex: filter.search, $options: 'i' } },
        { email: { $regex: filter.search, $options: 'i' } },
        { tags: { $regex: filter.search, $options: 'i' } }
      ];
    }

    return BilateralEngagement.find(query).sort({ createdAt: -1 });
  }

  async findById(id: string) {
    await connectDB();
    return BilateralEngagement.findById(id);
  }

  async update(id: string, data: Partial<IBilateralEngagement>) {
    await connectDB();
    return BilateralEngagement.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    await connectDB();
    return BilateralEngagement.findByIdAndDelete(id);
  }

  async addNote(id: string, note: { content: string; author: string }) {
    await connectDB();
    const engagement = await BilateralEngagement.findById(id);
    if (!engagement) return null;

    const newNote = {
      id: Math.random().toString(36).substring(7),
      content: note.content,
      author: note.author,
      createdAt: new Date()
    };

    engagement.notes.push(newNote);
    await engagement.save();
    return engagement;
  }

  async addDocument(id: string, document: { name: string; url: string }) {
    await connectDB();
    const engagement = await BilateralEngagement.findById(id);
    if (!engagement) return null;

    const newDocument = {
      id: Math.random().toString(36).substring(7),
      name: document.name || 'Attachment',
      url: document.url || '',
      uploadedAt: new Date()
    };

    const existingDocuments = Array.isArray(engagement.documents)
      ? engagement.documents
      : [];

    const normalizedNotes = Array.isArray(engagement.notes)
      ? engagement.notes.filter((n: any) => n && typeof n === 'object')
      : [];

    engagement.set('documents', [...existingDocuments, newDocument]);
    engagement.set('notes', normalizedNotes);
    engagement.markModified('notes');

    await engagement.save();
    return engagement.toObject();
  }
}

export const bilateralEngagementService = new BilateralEngagementService();
