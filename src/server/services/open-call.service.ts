import connectDB from '@/lib/db';
import OpenCall, { IOpenCall } from '../models/open-call.model';

export class OpenCallService {
  async create(data: Partial<IOpenCall>) {
    await connectDB();
    const openCall = await OpenCall.create(data);
    return openCall;
  }

  async findAll(filter: any = {}) {
    await connectDB();
    const query: any = {};

    // Status filter
    if (filter.status) {
      query.status = filter.status;
    }

    // Call lifecycle (open/closed)
    if (filter.callStatus) {
      query.callStatus = filter.callStatus;
    }

    // Priority filter
    if (filter.priority) {
      query.priority = filter.priority;
    }

    // Funding type filter
    if (filter.fundingType) {
      query.fundingType = filter.fundingType;
    }

    // Sector filter
    if (filter.sector) {
      query.sector = filter.sector;
    }

    // Search filter
    if (filter.search) {
      query.$or = [
        { title: { $regex: filter.search, $options: 'i' } },
        { funder: { $regex: filter.search, $options: 'i' } },
        { sector: { $regex: filter.search, $options: 'i' } },
        { internalOwner: { $regex: filter.search, $options: 'i' } },
        { description: { $regex: filter.search, $options: 'i' } }
      ];
    }

    return OpenCall.find(query).sort({ createdAt: -1 });
  }

  async findById(id: string) {
    await connectDB();
    return OpenCall.findById(id);
  }

  async update(id: string, data: Partial<IOpenCall>) {
    await connectDB();
    return OpenCall.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    await connectDB();
    return OpenCall.findByIdAndDelete(id);
  }

  async addNote(id: string, note: { content: string; author: string }) {
    await connectDB();
    const openCall = await OpenCall.findById(id);
    if (!openCall) return null;

    const newNote = {
      id: Math.random().toString(36).substring(7),
      content: note.content,
      author: note.author,
      createdAt: new Date()
    };

    openCall.notes.push(newNote);
    await openCall.save();
    return openCall;
  }

  async addDocument(id: string, document: { name: string; url: string }) {
    await connectDB();
    const openCall = await OpenCall.findById(id);
    if (!openCall) return null;

    const newDocument = {
      id: Math.random().toString(36).substring(7),
      name: document.name,
      url: document.url,
      uploadedAt: new Date()
    };

    openCall.documents.push(newDocument);
    await openCall.save();
    return openCall;
  }
}

export const openCallService = new OpenCallService();
