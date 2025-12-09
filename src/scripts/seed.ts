import { config } from 'dotenv';
import path from 'path';
import fs from 'fs/promises';

// Load environment variables FIRST
config({ path: path.resolve(process.cwd(), '.env.local') });
config({ path: path.resolve(process.cwd(), '.env') });

type SeedRecord = Record<string, any>;

async function readSeedFile(envKey: string) {
  const filePath = process.env[envKey];
  if (!filePath) {
    console.log(`ℹ️  ${envKey} not set; skipping.`);
    return [];
  }

  const resolved = path.resolve(process.cwd(), filePath);
  const raw = await fs.readFile(resolved, 'utf-8');
  const data = JSON.parse(raw);

  if (!Array.isArray(data)) {
    throw new Error(`${envKey} must point to a JSON array`);
  }

  return data as SeedRecord[];
}

function normalizeOpenCall(record: SeedRecord) {
  const { id, _id, ...rest } = record;
  const statusMap: Record<string, string> = {
    Reviewing: 'In Review',
    'In Review': 'In Review',
    Intake: 'In Review',
    'Go/No-Go': 'Go/No-Go',
    'Go No Go': 'Go/No-Go',
    'Application preparation': 'Proposal Writing',
    'Proposal Writing': 'Proposal Writing',
    'Internal Review': 'Internal Review',
    'Application submitted': 'Submission Stage',
    'Submission Stage': 'Submission Stage',
    Submitted: 'Submitted',
    Accepted: 'Accepted',
    Rejected: 'Rejected',
    Outcome: 'Submitted'
  };

  return {
    ...rest,
    title: rest.title || 'Untitled Open Call',
    description: rest.description || '',
    internalOwner: rest.internalOwner || 'Unassigned',
    deadline: rest.deadline || new Date(),
    callStatus: rest.callStatus || 'Open',
    priority: rest.priority || 'Medium',
    fundingType: rest.fundingType || 'Core Funding',
    status: statusMap[rest.status] || 'In Review',
    thematicAlignment: undefined,
    relatedProgram:
      rest.fundingType === 'Programmatic Funding'
        ? rest.relatedProgram || ''
        : undefined,
    sector: Array.isArray(rest.sector)
      ? rest.sector
      : rest.sector
        ? [rest.sector]
        : [],
    stagePermissions:
      rest.stagePermissions
        ?.filter((p: any) => p?.stage)
        .map((p: any) => ({
          stage: statusMap[p.stage] || p.stage,
          assignees: Array.isArray(p.assignees) ? p.assignees : []
        })) || [],
    documents: rest.documents || [],
    notes: rest.notes || []
  };
}

function normalizeBilateral(record: SeedRecord) {
  const { id, _id, ...rest } = record;
  const stageMap: Record<string, string> = {
    Identification: 'Cold Email',
    'Engagement ongoing': 'First Engagement',
    'Proposal under development': 'Proposal Stage',
    'Decision pending': 'Contracting',
    Paused: 'No Relationship',
    Closed: 'No Relationship',
    'Cold Email': 'Cold Email',
    'First Engagement': 'First Engagement',
    'Proposal Stage': 'Proposal Stage',
    Contracting: 'Contracting',
    Partner: 'Partner',
    Funder: 'Funder',
    'No Relationship': 'No Relationship'
  };

  return {
    ...rest,
    organizationName: rest.organizationName || 'Untitled Engagement',
    internalOwner: rest.internalOwner || 'Unassigned',
    status: stageMap[rest.status] || 'Cold Email',
    likelihoodToFund:
      typeof rest.likelihoodToFund === 'number' ? rest.likelihoodToFund : 10,
    estimatedValue:
      typeof rest.estimatedValue === 'number' ? rest.estimatedValue : 0,
    currency: rest.currency || 'USD',
    tags: Array.isArray(rest.tags) ? rest.tags : rest.tags ? [rest.tags] : [],
    documents: rest.documents || [],
    notes: rest.notes || []
  };
}

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

    const openCallSeeds = (await readSeedFile('SEED_OPEN_CALLS_FILE')) || [];
    const bilateralSeeds = (await readSeedFile('SEED_BILATERALS_FILE')) || [];

    if (!openCallSeeds.length) {
      console.log('ℹ️  Using mock module open calls as seed data');
      fakeOpenCalls.initialize();
    }

    if (!bilateralSeeds.length) {
      console.log('ℹ️  Using mock module bilateral engagements as seed data');
      fakeBilateralEngagements.initialize();
    }

    if (openCallSeeds.length || fakeOpenCalls.records.length) {
      console.log('🗑️  Clearing existing Open Calls...');
      await OpenCall.deleteMany({});

      const normalized = (
        openCallSeeds.length ? openCallSeeds : fakeOpenCalls.records
      ).map(normalizeOpenCall);

      console.log(`📝 Seeding ${normalized.length} Open Calls...`);
      await OpenCall.insertMany(normalized);
      console.log('✅ Open Calls seeded successfully');
    } else {
      console.log('ℹ️  No Open Call seed data provided; skipping insert.');
    }

    if (bilateralSeeds.length || fakeBilateralEngagements.records.length) {
      console.log('🗑️  Clearing existing Bilateral Engagements...');
      await BilateralEngagement.deleteMany({});

      const normalized = (
        bilateralSeeds.length
          ? bilateralSeeds
          : fakeBilateralEngagements.records
      ).map(normalizeBilateral);

      console.log(`📝 Seeding ${normalized.length} Bilateral Engagements...`);
      await BilateralEngagement.insertMany(normalized);
      console.log('✅ Bilateral Engagements seeded successfully');
    } else {
      console.log(
        'ℹ️  No Bilateral Engagement seed data provided; skipping insert.'
      );
    }

    console.log('✨ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
