export interface KnowledgeDocument {
  id: string;
  title: string;
  docType: string;
  sectors: string[];
  specialties: string[];
  engagementStages: string[];
  applicationTypes: string[];
  organizations: string[];
  region?: string;
  year?: number;
  tags: string[];
  sensitivity?: string;
  sourceUrl?: string;
  s3Key: string;
  s3Url: string;
  mimeType?: string;
  size?: number;
  createdAt: string;
  updatedAt: string;
}
