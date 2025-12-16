import connectDB from '@/lib/db';
import Contact from '@/server/models/contact.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: 'Engagement ID is required' },
        { status: 400 }
      );
    }

    await connectDB();
    const contacts = await Contact.find({ engagement: id }).sort({
      createdAt: -1
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: 'Engagement ID is required' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, role, email, phone, isPrimaryPointOfContact } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Contact name is required' },
        { status: 400 }
      );
    }

    await connectDB();
    const newContact = await Contact.create({
      engagement: id,
      name,
      role,
      email,
      phone,
      isPrimaryPointOfContact: isPrimaryPointOfContact || false
    });

    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to creating contact' },
      { status: 500 }
    );
  }
}
