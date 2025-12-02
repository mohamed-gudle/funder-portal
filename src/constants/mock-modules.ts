import { faker } from '@faker-js/faker';
import { matchSorter } from 'match-sorter';
import {
  OpenCall,
  BilateralEngagement,
  OpenCallStatus,
  BilateralEngagementStage,
  TeamMember
} from '@/types/modules';

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const fakeOpenCalls = {
  records: [] as OpenCall[],

  initialize() {
    const sampleOpenCalls: OpenCall[] = [
      {
        id: '1',
        title: 'Renewable Energy for Rural Communities - Africa 2024',
        funder: 'African Development Bank (AfDB)',
        sector: 'Energy',
        grantType: 'Blended Finance',
        budget: '$50,000,000',
        deadline: new Date('2024-12-31').toISOString(),
        url: 'https://afdb.org/calls/renewable-energy-2024',
        description:
          'Supporting renewable energy projects in Sub-Saharan Africa with focus on grid connection and rural electrification.',
        priorityProject: 'Clean Energy Initiative',
        thematicAlignment:
          'Renewable energy transition and climate change mitigation',
        internalOwner: 'Sarah Okafor',
        status: 'Reviewing' as OpenCallStatus,
        notes: [],
        documents: [],
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date('2024-11-01').toISOString()
      },
      {
        id: '2',
        title: 'Climate-Smart Agriculture Innovation Fund',
        funder: 'Global Environment Facility (GEF)',
        sector: 'Agriculture',
        grantType: 'Traditional Grant',
        budget: '$30,000,000',
        deadline: new Date('2025-03-15').toISOString(),
        url: 'https://gef.org/calls/climate-smart-agriculture',
        description:
          'Funding for climate-smart agricultural practices and food security in developing countries.',
        priorityProject: undefined,
        thematicAlignment: 'Food security and climate adaptation',
        internalOwner: 'Emmanuel Mensah',
        status: 'Intake' as OpenCallStatus,
        notes: [],
        documents: [],
        createdAt: new Date('2024-10-20').toISOString(),
        updatedAt: new Date('2024-11-15').toISOString()
      },
      {
        id: '3',
        title: 'Clean Cooking Solutions Scale-Up Program',
        funder: 'World Bank - ESMAP',
        sector: 'Clean Cooking',
        grantType: 'Impact Investment',
        budget: '$25,000,000',
        deadline: new Date('2025-02-28').toISOString(),
        url: 'https://worldbank.org/esmap/clean-cooking-2024',
        description:
          'Scaling clean cooking solutions and phasing out inefficient biomass use across Sub-Saharan Africa.',
        priorityProject: 'Clean Cooking for All',
        thematicAlignment: 'Health, environment, and gender empowerment',
        internalOwner: 'Fatima Hassan',
        status: 'Go/No-Go' as OpenCallStatus,
        notes: [],
        documents: [],
        createdAt: new Date('2024-09-01').toISOString(),
        updatedAt: new Date('2024-11-10').toISOString()
      },
      {
        id: '4',
        title: 'Water and Sanitation Infrastructure Development',
        funder: 'USAID',
        sector: 'Water',
        grantType: 'Traditional Grant',
        budget: '$35,000,000',
        deadline: new Date('2025-04-30').toISOString(),
        url: 'https://usaid.gov/water-sanitation-2025',
        description:
          'Infrastructure development for water and sanitation services in East and West Africa.',
        priorityProject: 'Water Security Project',
        thematicAlignment: 'Access to clean water and sustainable development',
        internalOwner: 'Kwame Owusu',
        status: 'Application preparation' as OpenCallStatus,
        notes: [],
        documents: [],
        createdAt: new Date('2024-08-15').toISOString(),
        updatedAt: new Date('2024-11-08').toISOString()
      },
      {
        id: '5',
        title: 'Solar Mini-Grids in Remote Areas',
        funder: 'Scaling Off-Grid Energy Access (SOGEA)',
        sector: 'Energy',
        grantType: 'Blended Finance',
        budget: '$20,000,000',
        deadline: new Date('2025-01-31').toISOString(),
        url: 'https://sogea.org/calls/mini-grids',
        description:
          'Deployment of solar mini-grid systems in remote and off-grid areas across Africa.',
        priorityProject: 'Energy Access Initiative',
        thematicAlignment: 'Universal electricity access',
        internalOwner: 'Amara Ndiaye',
        status: 'Application submitted' as OpenCallStatus,
        notes: [],
        documents: [],
        createdAt: new Date('2024-07-10').toISOString(),
        updatedAt: new Date('2024-11-05').toISOString()
      },
      {
        id: '6',
        title: 'Agroforestry and Natural Resource Management',
        funder: 'International Fund for Agricultural Development (IFAD)',
        sector: 'Agriculture',
        grantType: 'Traditional Grant',
        budget: '$22,000,000',
        deadline: new Date('2025-05-15').toISOString(),
        url: 'https://ifad.org/calls/agroforestry-2024',
        description:
          'Supporting smallholder farmers in agroforestry and sustainable natural resource management.',
        priorityProject: undefined,
        thematicAlignment: 'Sustainable land management and income generation',
        internalOwner: 'Kofi Mensah',
        status: 'Reviewing' as OpenCallStatus,
        notes: [],
        documents: [],
        createdAt: new Date('2024-06-20').toISOString(),
        updatedAt: new Date('2024-11-12').toISOString()
      },
      {
        id: '7',
        title: 'Women Entrepreneurs in Clean Energy',
        funder: 'UK Aid',
        sector: 'Energy',
        grantType: 'Traditional Grant',
        budget: '$15,000,000',
        deadline: new Date('2025-03-31').toISOString(),
        url: 'https://ukaid.org/clean-energy-women',
        description:
          'Supporting women entrepreneurs in clean energy businesses and enterprises.',
        priorityProject: 'Gender & Energy Initiative',
        thematicAlignment: 'Gender equality and economic empowerment',
        internalOwner: 'Ada Okoro',
        status: 'Intake' as OpenCallStatus,
        notes: [],
        documents: [],
        createdAt: new Date('2024-11-01').toISOString(),
        updatedAt: new Date('2024-11-15').toISOString()
      },
      {
        id: '8',
        title: 'Waste-to-Energy Innovation Challenge',
        funder: 'European Bank for Reconstruction and Development (EBRD)',
        sector: 'Energy',
        grantType: 'Impact Investment',
        budget: '$18,000,000',
        deadline: new Date('2025-02-15').toISOString(),
        url: 'https://ebrd.org/waste-to-energy-challenge',
        description:
          'Innovation funding for waste-to-energy and circular economy solutions.',
        priorityProject: undefined,
        thematicAlignment: 'Circular economy and renewable energy',
        internalOwner: 'Ibrahim Osei',
        status: 'Go/No-Go' as OpenCallStatus,
        notes: [],
        documents: [],
        createdAt: new Date('2024-05-25').toISOString(),
        updatedAt: new Date('2024-11-09').toISOString()
      },
      {
        id: '9',
        title: 'Climate Resilient Agriculture Training',
        funder: 'FAO - African Agriculture Development',
        sector: 'Agriculture',
        grantType: 'TA Grant',
        budget: '$12,000,000',
        deadline: new Date('2025-06-30').toISOString(),
        url: 'https://fao.org/climate-resilient-training',
        description:
          'Capacity building and technical assistance for climate-resilient farming practices.',
        priorityProject: 'Climate Adaptation Initiative',
        thematicAlignment: 'Climate adaptation and capacity building',
        internalOwner: 'Grace Anane',
        status: 'Application preparation' as OpenCallStatus,
        notes: [],
        documents: [],
        createdAt: new Date('2024-04-10').toISOString(),
        updatedAt: new Date('2024-11-14').toISOString()
      },
      {
        id: '10',
        title: 'Clean Cooking Catalyst Fund - Tech Innovation',
        funder: 'Shell Foundation',
        sector: 'Clean Cooking',
        grantType: 'Impact Investment',
        budget: '$28,000,000',
        deadline: new Date('2025-01-15').toISOString(),
        url: 'https://shellfoundation.org/cooking-tech',
        description:
          'Investing in breakthrough technologies for clean cooking and sustainable fuels.',
        priorityProject: 'Clean Cooking for All',
        thematicAlignment: 'Technology innovation and SDG achievement',
        internalOwner: 'Solomon Gyamfi',
        status: 'Outcome' as OpenCallStatus,
        notes: [],
        documents: [],
        createdAt: new Date('2024-03-15').toISOString(),
        updatedAt: new Date('2024-11-20').toISOString()
      },
      {
        id: '11',
        title: 'Biogas Digesters for Farmers',
        funder: 'Green Climate Fund (GCF)',
        sector: 'Agriculture',
        grantType: 'Blended Finance',
        budget: '$40,000,000',
        deadline: new Date('2025-07-31').toISOString(),
        url: 'https://gcf.org/biogas-digesters',
        description:
          'Installing biogas digesters to increase farm productivity and reduce GHG emissions.',
        priorityProject: 'Sustainable Agriculture Initiative',
        thematicAlignment: 'Climate change mitigation and livelihoods',
        internalOwner: 'Abena Mensah',
        status: 'Intake' as OpenCallStatus,
        notes: [],
        documents: [],
        createdAt: new Date('2024-02-20').toISOString(),
        updatedAt: new Date('2024-11-11').toISOString()
      },
      {
        id: '12',
        title: 'Energy Efficiency in SMEs',
        funder: 'Asian Development Bank (ADB)',
        sector: 'Energy',
        grantType: 'Traditional Grant',
        budget: '$16,000,000',
        deadline: new Date('2025-04-15').toISOString(),
        url: 'https://adb.org/sme-energy-efficiency',
        description:
          'Supporting small and medium enterprises to improve energy efficiency.',
        priorityProject: undefined,
        thematicAlignment: 'Business sustainability and cost reduction',
        internalOwner: 'Musonda Chakwera',
        status: 'Application submitted' as OpenCallStatus,
        notes: [],
        documents: [],
        createdAt: new Date('2024-01-05').toISOString(),
        updatedAt: new Date('2024-11-18').toISOString()
      }
    ];

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
    const sampleEngagements: BilateralEngagement[] = [
      {
        id: '1',
        funder: 'World Bank Energy Sector Management Assistance Program',
        sector: 'Energy',
        engagementType: 'Negotiation',
        priorityProject: 'Energy Access Initiative',
        internalOwner: 'Dr. James Okonkwo',
        stage: 'Proposal under development' as BilateralEngagementStage,
        notes: [],
        documents: [],
        latestEmail:
          'Discussed pipeline of 15 renewable energy projects. WB interested in $50M co-financing arrangement. Next meeting scheduled for December 2024.',
        nextFollowUpDate: new Date('2024-12-15').toISOString(),
        confidenceLevel: 'High',
        importanceScore: 9,
        createdAt: new Date('2024-06-01').toISOString(),
        updatedAt: new Date('2024-11-20').toISOString()
      },
      {
        id: '2',
        funder: 'African Development Bank (AfDB)',
        sector: 'Agriculture',
        engagementType: 'Proposal Stage',
        priorityProject: 'Sustainable Agriculture Initiative',
        internalOwner: 'Victoria Ampah',
        stage: 'Engagement ongoing' as BilateralEngagementStage,
        notes: [],
        documents: [],
        latestEmail:
          'Submitted proposal for $35M climate-smart agriculture program covering 5 countries. AfDB team conducting due diligence. Expected feedback by January 2025.',
        nextFollowUpDate: new Date('2025-01-10').toISOString(),
        confidenceLevel: 'High',
        importanceScore: 8,
        createdAt: new Date('2024-04-15').toISOString(),
        updatedAt: new Date('2024-11-18').toISOString()
      },
      {
        id: '3',
        funder: 'European Union - African Union Partnership',
        sector: 'Clean Cooking',
        engagementType: 'Early Discussion',
        priorityProject: 'Clean Cooking for All',
        internalOwner: 'Ahmed Hassan',
        stage: 'Identification' as BilateralEngagementStage,
        notes: [],
        documents: [],
        latestEmail:
          'Initial meeting with EU delegation. Strong interest in clean cooking scale-up. Requested feasibility study and market assessment. Timeline for full proposal 6 months.',
        nextFollowUpDate: new Date('2024-12-10').toISOString(),
        confidenceLevel: 'Medium',
        importanceScore: 7,
        createdAt: new Date('2024-10-01').toISOString(),
        updatedAt: new Date('2024-11-19').toISOString()
      },
      {
        id: '4',
        funder: 'UK Foreign, Commonwealth & Development Office (FCDO)',
        sector: 'Energy',
        engagementType: 'Proposal Stage',
        priorityProject: 'Energy Access Initiative',
        internalOwner: 'Chidi Okafor',
        stage: 'Decision pending' as BilateralEngagementStage,
        notes: [],
        documents: [],
        latestEmail:
          'Proposal for $25M women-led clean energy enterprises program under review. Awaiting investment committee decision. Expected outcome March 2025.',
        nextFollowUpDate: new Date('2025-03-01').toISOString(),
        confidenceLevel: 'Medium',
        importanceScore: 7,
        createdAt: new Date('2024-05-20').toISOString(),
        updatedAt: new Date('2024-11-15').toISOString()
      },
      {
        id: '5',
        funder: 'Global Environment Facility (GEF) - LDCF',
        sector: 'Water',
        engagementType: 'Early Discussion',
        priorityProject: 'Water Security Project',
        internalOwner: 'Mary Mensah',
        stage: 'Identification' as BilateralEngagementStage,
        notes: [],
        documents: [],
        latestEmail:
          'Introductory call with GEF team. Interested in water infrastructure resilience project. Requesting more details on climate vulnerability assessment.',
        nextFollowUpDate: new Date('2024-12-05').toISOString(),
        confidenceLevel: 'Low',
        importanceScore: 5,
        createdAt: new Date('2024-09-10').toISOString(),
        updatedAt: new Date('2024-11-17').toISOString()
      },
      {
        id: '6',
        funder: 'International Finance Corporation (IFC)',
        sector: 'Clean Cooking',
        engagementType: 'Negotiation',
        priorityProject: 'Clean Cooking for All',
        internalOwner: 'Kofi Owusu',
        stage: 'Proposal under development' as BilateralEngagementStage,
        notes: [],
        documents: [],
        latestEmail:
          'Advanced discussions on $20M impact investment fund for clean cooking technology companies. Due diligence in progress. Term sheet expected December 2024.',
        nextFollowUpDate: new Date('2024-12-20').toISOString(),
        confidenceLevel: 'High',
        importanceScore: 9,
        createdAt: new Date('2024-03-05').toISOString(),
        updatedAt: new Date('2024-11-21').toISOString()
      },
      {
        id: '7',
        funder: 'German KfW Development Bank',
        sector: 'Agriculture',
        engagementType: 'Proposal Stage',
        priorityProject: 'Climate Adaptation Initiative',
        internalOwner: 'Ama Boateng',
        stage: 'Engagement ongoing' as BilateralEngagementStage,
        notes: [],
        documents: [],
        latestEmail:
          'KfW reviewing proposal for climate-smart agriculture extension program. Requested additional information on smallholder targeting strategy and monitoring framework.',
        nextFollowUpDate: new Date('2025-01-15').toISOString(),
        confidenceLevel: 'Medium',
        importanceScore: 7,
        createdAt: new Date('2024-07-01').toISOString(),
        updatedAt: new Date('2024-11-16').toISOString()
      },
      {
        id: '8',
        funder: 'USAID - Power Africa',
        sector: 'Energy',
        engagementType: 'Proposal Stage',
        priorityProject: 'Energy Access Initiative',
        internalOwner: 'Samuel Agyeman',
        stage: 'Paused' as BilateralEngagementStage,
        notes: [],
        documents: [],
        latestEmail:
          'USAID proposal temporarily paused pending their internal budget review. Project remains priority. Expected restart February 2025.',
        nextFollowUpDate: new Date('2025-02-01').toISOString(),
        confidenceLevel: 'Medium',
        importanceScore: 6,
        createdAt: new Date('2024-08-15').toISOString(),
        updatedAt: new Date('2024-11-10').toISOString()
      },
      {
        id: '9',
        funder: 'Asian Development Bank (ADB)',
        sector: 'Water',
        engagementType: 'Early Discussion',
        priorityProject: 'Water Security Project',
        internalOwner: 'Abena Osei',
        stage: 'Closed' as BilateralEngagementStage,
        notes: [],
        documents: [],
        latestEmail:
          'Engagement concluded. ADB determined project was outside their geographic priority. Recommended alternative funders. Relationship remains positive.',
        nextFollowUpDate: new Date('2025-06-01').toISOString(),
        confidenceLevel: 'Low',
        importanceScore: 2,
        createdAt: new Date('2024-02-10').toISOString(),
        updatedAt: new Date('2024-10-30').toISOString()
      },
      {
        id: '10',
        funder: 'Shell Foundation',
        sector: 'Clean Cooking',
        engagementType: 'Negotiation',
        priorityProject: 'Clean Cooking for All',
        internalOwner: 'Francis Mensah',
        stage: 'Engagement ongoing' as BilateralEngagementStage,
        notes: [],
        documents: [],
        latestEmail:
          'Shell Foundation expressing strong interest in $15M clean cooking innovation fund. Initial governance framework under discussion. Meeting scheduled November 28th.',
        nextFollowUpDate: new Date('2024-11-28').toISOString(),
        confidenceLevel: 'High',
        importanceScore: 8,
        createdAt: new Date('2024-09-01').toISOString(),
        updatedAt: new Date('2024-11-22').toISOString()
      }
    ];

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

export const fakeTeamMembers = {
  records: [] as TeamMember[],

  initialize() {
    const sampleTeamMembers: TeamMember[] = [
      {
        id: '1',
        name: 'Sarah Okafor',
        email: 'sarah.okafor@example.com',
        phoneNumber: '+233 50 123 4567',
        speciality: 'Renewable Energy',
        position: 'Senior Program Manager',
        profilePhoto: 'https://api.slingacademy.com/public/sample-users/1.png',
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date('2024-11-01').toISOString()
      },
      {
        id: '2',
        name: 'Emmanuel Mensah',
        email: 'emmanuel.mensah@example.com',
        phoneNumber: '+233 50 987 6543',
        speciality: 'Agriculture',
        position: 'Technical Advisor',
        profilePhoto: 'https://api.slingacademy.com/public/sample-users/2.png',
        createdAt: new Date('2024-02-20').toISOString(),
        updatedAt: new Date('2024-11-10').toISOString()
      },
      {
        id: '3',
        name: 'Fatima Hassan',
        email: 'fatima.hassan@example.com',
        phoneNumber: '+234 80 112 2334',
        speciality: 'Clean Cooking',
        position: 'Project Lead',
        profilePhoto: 'https://api.slingacademy.com/public/sample-users/3.png',
        createdAt: new Date('2024-03-10').toISOString(),
        updatedAt: new Date('2024-11-15').toISOString()
      }
    ];
    this.records = sampleTeamMembers;
  },

  async getAll({ search }: { search?: string }) {
    let data = [...this.records];
    if (search) {
      data = matchSorter(data, search, {
        keys: ['name', 'email', 'position', 'speciality']
      });
    }
    return data;
  },

  async getById(id: string) {
    await delay(500);
    return this.records.find((item) => item.id === id);
  },

  async add(item: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) {
    await delay(500);
    const newItem: TeamMember = {
      ...item,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.records.unshift(newItem);
    return newItem;
  },

  async update(id: string, updates: Partial<TeamMember>) {
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

fakeTeamMembers.initialize();
