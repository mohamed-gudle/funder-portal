import { auth } from '@/lib/auth'; // Adjust import path as needed
import { headers } from 'next/headers'; // This won't work in a script, need a different way or use an API route for one-off

// Actually, better-auth might not have a direct script way easily without a request context if using the plugin approach relying on headers sometimes.
// But we can use the internal db adapter or just direct DB call if we know the schema.
// Let's try to use the auth.api.signUp or similar if possible, but for update we need a user.

// Better approach for a script: Direct DB update since we have access to the DB.
// Or if better-auth exposes a management API.
// The admin plugin exposes admin actions.

// Let's try to make a script that connects to DB and updates the user role directly.
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// We need to know the User model name. usually 'user' in better-auth.

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined');
  process.exit(1);
}

const args = process.argv.slice(2);
const email = args[0];

if (!email) {
  console.error('Please provide an email address as an argument.');
  process.exit(1);
}

async function makeAdmin() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection failed');

    const result = await db
      .collection('user')
      .updateOne({ email: email }, { $set: { role: 'admin' } });

    if (result.matchedCount === 0) {
      console.log(`User with email ${email} not found.`);
    } else if (result.modifiedCount === 0) {
      console.log(`User ${email} is already an admin or role not updated.`);
    } else {
      console.log(`Successfully promoted ${email} to admin.`);
    }
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

makeAdmin();
