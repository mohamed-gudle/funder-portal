import { auth } from '@/lib/auth';
import { emailClient } from '@/lib/email/emailClient';
import * as verificationEmail from '@/lib/email/templates/verificationEmail';
import { randomUUID } from 'crypto';
import { MongoClient, ObjectId } from 'mongodb';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      // If no session, maybe they provided email in body?
      // For security, let's strictly require session for now since the flow is "Sign up -> Auto Login -> Dashboard -> Redirect to Check Email".
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db();

    // Fetch user to confirm status
    const user = await db
      .collection('user')
      .findOne({ _id: new ObjectId(session.user.id) });

    if (!user) {
      await client.close();
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.emailVerified) {
      await client.close();
      return NextResponse.json(
        { message: 'Email already verified' },
        { status: 400 }
      );
    }

    // Generate new token
    const token = randomUUID();

    // Update user
    await db
      .collection('user')
      .updateOne({ _id: user._id }, { $set: { verificationToken: token } });
    await client.close();

    // Send email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const link = `${baseUrl}/verify-email?token=${token}`;

    await emailClient.send({
      to: user.email,
      subject: verificationEmail.subject(),
      html: verificationEmail.html({
        name: user.name,
        verificationLink: link
      })
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error resending verification email:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
