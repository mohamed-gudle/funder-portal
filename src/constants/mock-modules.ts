import { faker } from '@faker-js/faker';
import { matchSorter } from 'match-sorter';
import {
  OpenCall,
  BilateralEngagement,
  OpenCallStatus,
  BilateralEngagementStage
} from '@/types/modules';

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const fakeOpenCalls = {
  records: [] as OpenCall[],

  initialize() {
    const sampleOpenCalls: OpenCall[] = [];
    function generateRandomOpenCall(id: string): OpenCall {
      return {
        id,
        title: faker.company.catchPhrase(),
        funder: faker.company.name(),
        sector: faker.helpers.arrayElement([
          'Energy',
          'Agriculture',
          'Clean Cooking',
          'Water',
          'Health'
        ]),
        grantType: faker.helpers.arrayElement([
          'Traditional Grant',
          'TA Grant',
          'Blended Finance',
          'Impact Investment'
        ]),
        budget: faker.finance.amount({
          min: 10000,
          max: 1000000,
          dec: 0,
          symbol: '$'
        }),
        deadline: faker.date.future().toISOString(),
        url: faker.internet.url(),
        description: faker.lorem.paragraph(),
        priorityProject: faker.helpers.arrayElement([
          'Project Alpha',
          'Project Beta',
          'Project Gamma',
          undefined
        ]),
        thematicAlignment: faker.lorem.sentence(),
        internalOwner: faker.person.fullName(),
        status: faker.helpers.arrayElement([
          'Intake',
          'Reviewing',
          'Go/No-Go',
          'Application preparation',
          'Application submitted',
          'Outcome'
        ]) as OpenCallStatus,
        notes: [],
        documents: [],
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString()
      };
    }

    for (let i = 1; i <= 15; i++) {
      sampleOpenCalls.push(generateRandomOpenCall(i.toString()));
    }
    this.records = sampleOpenCalls;
  },

  async getAll({
    search,
    status,
    sector
  }: {
    search?: string;
    status?: string;
    sector?: string;
  }) {
    let data = [...this.records];

    if (status) {
      data = data.filter((item) => item.status === status);
    }
    if (sector) {
      data = data.filter((item) => item.sector === sector);
    }
    if (search) {
      data = matchSorter(data, search, {
        keys: ['title', 'funder', 'sector', 'internalOwner']
      });
    }
    return data;
  },

  async getById(id: string) {
    await delay(500);
    return this.records.find((item) => item.id === id);
  },

  async add(
    item: Omit<
      OpenCall,
      'id' | 'createdAt' | 'updatedAt' | 'notes' | 'documents'
    >
  ) {
    await delay(500);
    const newItem: OpenCall = {
      ...item,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: [],
      documents: []
    };
    this.records.unshift(newItem);
    return newItem;
  },

  async update(id: string, updates: Partial<OpenCall>) {
    await delay(500);
    const index = this.records.findIndex((item) => item.id === id);
    if (index === -1) return null;
    this.records[index] = {
      ...this.records[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return this.records[index];
  },

  async remove(id: string) {
    await delay(500);
    this.records = this.records.filter((item) => item.id !== id);
  }
};

export const fakeBilateralEngagements = {
  records: [] as BilateralEngagement[],

  initialize() {
    const sampleEngagements: BilateralEngagement[] = [];
    function generateRandomEngagement(id: string): BilateralEngagement {
      return {
        id,
        funder: faker.company.name(),
        sector: faker.helpers.arrayElement([
          'Energy',
          'Agriculture',
          'Clean Cooking'
        ]),
        engagementType: faker.helpers.arrayElement([
          'Early Discussion',
          'Proposal Stage',
          'Negotiation'
        ]),
        priorityProject: faker.helpers.arrayElement([
          'Project Alpha',
          'Project Beta'
        ]),
        internalOwner: faker.person.fullName(),
        stage: faker.helpers.arrayElement([
          'Identification',
          'Engagement ongoing',
          'Proposal under development',
          'Decision pending',
          'Paused',
          'Closed'
        ]) as BilateralEngagementStage,
        notes: [],
        documents: [],
        latestEmail: faker.lorem.paragraph(),
        nextFollowUpDate: faker.date.future().toISOString(),
        confidenceLevel: faker.helpers.arrayElement(['Low', 'Medium', 'High']),
        importanceScore: faker.number.int({ min: 1, max: 10 }),
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString()
      };
    }

    for (let i = 1; i <= 10; i++) {
      sampleEngagements.push(generateRandomEngagement(i.toString()));
    }
    this.records = sampleEngagements;
  },

  async getAll({
    search,
    stage,
    sector
  }: {
    search?: string;
    stage?: string;
    sector?: string;
  }) {
    let data = [...this.records];

    if (stage) {
      data = data.filter((item) => item.stage === stage);
    }
    if (sector) {
      data = data.filter((item) => item.sector === sector);
    }
    if (search) {
      data = matchSorter(data, search, {
        keys: ['funder', 'sector', 'internalOwner']
      });
    }
    return data;
  },

  async getById(id: string) {
    await delay(500);
    return this.records.find((item) => item.id === id);
  },

  async add(
    item: Omit<
      BilateralEngagement,
      'id' | 'createdAt' | 'updatedAt' | 'notes' | 'documents'
    >
  ) {
    await delay(500);
    const newItem: BilateralEngagement = {
      ...item,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: [],
      documents: []
    };
    this.records.unshift(newItem);
    return newItem;
  },

  async update(id: string, updates: Partial<BilateralEngagement>) {
    await delay(500);
    const index = this.records.findIndex((item) => item.id === id);
    if (index === -1) return null;
    this.records[index] = {
      ...this.records[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return this.records[index];
  },

  async remove(id: string) {
    await delay(500);
    this.records = this.records.filter((item) => item.id !== id);
  }
};

fakeOpenCalls.initialize();
fakeBilateralEngagements.initialize();
