export type OpenCallStatus =
  | 'In Review'
  | 'Go/No-Go'
  | 'Proposal Writing'
  | 'Internal Review'
  | 'Submission Stage'
  | 'Submitted'
  | 'Accepted'
  | 'Rejected';

export type CallLifecycle = 'Open' | 'Closed';

export type StagePermission<TStage extends string> = {
  stage: TStage;
  assignees: string[];
};

export type Note = {
  id: string;
  content: string;
  author: string;
  createdAt: string;
};

export type Document = {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
};

export type OpenCall = {
  id: string;
  title: string;
  funder?: string;
  sector?: string | string[];
  grantType?: string;
  budget?: string;
  deadline: string;
  url?: string;
  description: string;
  priorityProject?: string;
  thematicAlignment?: string;
  internalOwner: string;
  callStatus: CallLifecycle;
  priority: 'High' | 'Medium' | 'Low';
  fundingType: 'Core Funding' | 'Programmatic Funding';
  relatedProgram?: string;
  stagePermissions?: StagePermission<OpenCallStatus>[];
  status: OpenCallStatus;
  notes: Note[];
  documents: Document[];
  createdAt: string;
  updatedAt: string;
};

export type BilateralEngagementStage =
  | 'Cold Email'
  | 'First Engagement'
  | 'Proposal Stage'
  | 'Contracting'
  | 'Partner'
  | 'Funder'
  | 'No Relationship';

export type BilateralEngagement = {
  id: string;
  organizationName: string;
  contactPerson?: string;
  contactRole?: string;
  email?: string;
  internalOwner: string;
  status: BilateralEngagementStage;
  likelihoodToFund: number;
  estimatedValue: number;
  currency: 'USD' | 'KES' | 'EUR' | 'GBP';
  tags?: string[];
  stagePermissions?: StagePermission<BilateralEngagementStage>[];
  temperatureLabel?: 'Hot' | 'Warm' | 'Cold';
  notes: Note[];
  documents: Document[];
  createdAt: string;
  updatedAt: string;
};

export type EngagementContact = {
  id: string;
  engagement: string;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  isPrimaryPointOfContact: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ActivityType =
  | 'Call Log'
  | 'Email'
  | 'Meeting Note'
  | 'Internal Comment'
  | 'Status Change';

export type Activity = {
  id: string;
  author: string;
  type: ActivityType;
  content: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  parent: string;
  parentModel: 'OpenCall' | 'CompetitiveCall' | 'BilateralEngagement';
  createdAt: string;
  updatedAt: string;
};

export type Opportunity = {
  id?: string;
  title: string;
  organization: string;
  description: string;
  amount: string;
  deadline: string;
  url: string;
  energy_sector: string;
  eligibility: string;
  relevance_score: number;
  query?: string;
  maxIterations?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  speciality: string;
  position: string;
  profilePhoto?: string; // Added by API from Clerk
  createdAt: string;
  updatedAt: string;
};
