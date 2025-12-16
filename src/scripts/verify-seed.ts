import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env.local') });
config({ path: path.resolve(process.cwd(), '.env') });

async function verify() {
  try {
    const { default: connectDB } = await import('@/lib/db');
    const { default: OpenCall } = await import(
      '@/server/models/open-call.model'
    );
    const { default: BilateralEngagement } = await import(
      '@/server/models/bilateral-engagement.model'
    );

    console.log('🔍 Connecting to database...');
    await connectDB();
    console.log('✅ Connected to database\n');

    // Verify Open Calls
    const openCallCount = await OpenCall.countDocuments();
    console.log(`📊 Total Open Calls: ${openCallCount}`);

    const sampleOpenCalls = await OpenCall.find().limit(3).lean();
    console.log('\n📝 Sample Open Calls:');
    sampleOpenCalls.forEach((call, index) => {
      console.log(`\n${index + 1}. ${call.title}`);
      console.log(`   Funder: ${call.funder}`);
      console.log(`   Status: ${call.status}`);
      console.log(`   Priority: ${call.priority}`);
      console.log(`   Deadline: ${call.deadline}`);
      console.log(`   Sectors: ${call.sector.join(', ')}`);
      console.log(`   Description: ${call.description.substring(0, 100)}...`);
    });

    // Verify Bilateral Engagements
    const bilateralCount = await BilateralEngagement.countDocuments();
    console.log(`\n\n📊 Total Bilateral Engagements: ${bilateralCount}`);

    const sampleBilaterals = await BilateralEngagement.find().limit(3).lean();
    console.log('\n🤝 Sample Bilateral Engagements:');
    sampleBilaterals.forEach((engagement, index) => {
      console.log(`\n${index + 1}. ${engagement.organizationName}`);
      console.log(`   Contact: ${engagement.contactPerson}`);
      console.log(`   Status: ${engagement.status}`);
      console.log(`   Likelihood to Fund: ${engagement.likelihoodToFund}%`);
      console.log(`   Tags: ${engagement.tags.join(', ')}`);
    });

    console.log('\n\n✨ Verification completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

verify();
