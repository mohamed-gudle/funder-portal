import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Program, { IProgram } from '@/server/models/program.model';

// Helper to ensure DB connection
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not defined');
  await mongoose.connect(uri);
};

export async function GET() {
  try {
    await connectDB();
    const programs = await Program.find({})
      .select('name _id')
      .sort({ createdAt: -1 })
      .lean();

    // Transform _id to id for frontend consistency
    const formatted = programs.map((p) => ({
      ...p,
      id: (p._id as any).toString()
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Simple validation
    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const created = await Program.create({
      ...body,
      status: body.status || 'Active'
    });

    const program = Array.isArray(created) ? created[0] : created;

    const formatted = {
      ...(program.toObject ? program.toObject() : program),
      id: program._id.toString()
    };

    return NextResponse.json(formatted, { status: 201 });
  } catch (error) {
    console.error('Error creating program:', error);
    return NextResponse.json(
      { error: 'Failed to create program' },
      { status: 500 }
    );
  }
}
