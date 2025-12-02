export type OpenCallStatus =
  | 'Intake'
  | 'Reviewing'
  | 'Go/No-Go'
  | 'Application preparation'
  | 'Application submitted'
  | 'Outcome';

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
  funder: string;
  sector: string;
  grantType: string;
  budget: string;
  deadline: string;
  url?: string;
  description: string;
  priorityProject?: string;
  thematicAlignment?: string;
  internalOwner: string;
  status: OpenCallStatus;
  notes: Note[];
  documents: Document[];
  createdAt: string;
  updatedAt: string;
};

export type BilateralEngagementStage =
  | 'Identification'
  | 'Engagement ongoing'
  | 'Proposal under development'
  | 'Decision pending'
  | 'Paused'
  | 'Closed';

export type BilateralEngagement = {
  id: string;
  funder: string;
  sector: string;
  engagementType: string;
  priorityProject?: string;
  internalOwner: string;
  stage: BilateralEngagementStage;
  notes: Note[];
  documents: Document[];
  latestEmail?: string; // Text or URL
  nextFollowUpDate?: string;
  confidenceLevel?: 'Low' | 'Medium' | 'High';
  importanceScore?: number;
  createdAt: string;
  updatedAt: string;
};

export type Opportunity = {
  title: string;
  organization: string;
  description: string;
  amount: string;
  deadline: string;
  url: string;
  energy_sector: string;
  eligibility: string;
  relevance_score: number;
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
