import { config } from 'dotenv';
import path from 'path';

// Load environment variables FIRST
config({ path: path.resolve(process.cwd(), '.env.local') });
config({ path: path.resolve(process.cwd(), '.env') });

async function seed() {
  try {
    // Dynamically import modules after env vars are loaded
    const { default: connectDB } = await import('@/lib/db');
    const { default: OpenCall } = await import(
      '@/server/models/open-call.model'
    );
    const { default: BilateralEngagement } = await import(
      '@/server/models/bilateral-engagement.model'
    );
    const { fakeOpenCalls, fakeBilateralEngagements } = await import(
      '@/constants/mock-modules'
    );

    console.log('🌱 Connecting to database...');
    await connectDB();
    console.log('✅ Connected to database');

    // Initialize mock data
    console.log('🔄 Initializing mock data...');
    fakeOpenCalls.initialize();
    fakeBilateralEngagements.initialize();

    // Seed Open Calls
    console.log('🗑️  Clearing existing Open Calls...');
    await OpenCall.deleteMany({});

    console.log(`📝 Seeding ${fakeOpenCalls.records.length} Open Calls...`);
    // Remove the 'id' field from mock data to let MongoDB generate _id
    const openCallsData = fakeOpenCalls.records.map(({ id, ...rest }) => rest);
    await OpenCall.insertMany(openCallsData);
    console.log('✅ Open Calls seeded successfully');

    // Seed Bilateral Engagements
    console.log('🗑️  Clearing existing Bilateral Engagements...');
    await BilateralEngagement.deleteMany({});

    console.log(
      `📝 Seeding ${fakeBilateralEngagements.records.length} Bilateral Engagements...`
    );
    // Remove the 'id' field from mock data to let MongoDB generate _id
    const bilateralData = fakeBilateralEngagements.records.map(
      ({ id, ...rest }) => rest
    );
    await BilateralEngagement.insertMany(bilateralData);
    console.log('✅ Bilateral Engagements seeded successfully');

    console.log('✨ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
