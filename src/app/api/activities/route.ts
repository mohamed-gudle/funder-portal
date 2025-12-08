import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import Activity from '@/server/models/activity.model';
import dbConnect from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get('parentId');

    if (!parentId) {
      return NextResponse.json(
        { error: 'parentId is required' },
        { status: 400 }
      );
    }

    await dbConnect();
    const session = await auth.api.getSession({
      headers: req.headers
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const activities = await Activity.find({ parent: parentId })
      .populate('author', 'name email image')
      .sort({ createdAt: -1 });

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await auth.api.getSession({
      headers: req.headers
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type, content, sentiment, parent, parentModel } = body;

    // Basic validation
    if (!type || !content || !parent || !parentModel) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newActivity = await Activity.create({
      author: session.user.id,
      type,
      content,
      sentiment: sentiment || 'Neutral',
      parent,
      parentModel
    });

    // Populate author before returning
    await newActivity.populate('author', 'name email image');

    return NextResponse.json(newActivity, { status: 201 });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
