export type KnowledgeBaseDocType =
  | 'general'
  | 'sector'
  | 'specialty'
  | 'engagement'
  | 'application'
  | 'organization'
  | 'other';

export type KnowledgeBaseSensitivity = 'public' | 'internal' | 'confidential';

export interface KnowledgeBaseDocumentMetadata {
  id?: string;
  title: string;
  docType: KnowledgeBaseDocType;
  sectors?: string[];
  specialties?: string[];
  engagementStages?: string[];
  applicationTypes?: string[];
  organizations?: string[];
  region?: string;
  year?: number;
  tags?: string[];
  sensitivity?: KnowledgeBaseSensitivity;
  sourceUrl?: string;
  storagePrefix?: string;
  slug?: string;
}

export interface KnowledgeBaseDocument extends KnowledgeBaseDocumentMetadata {
  id: string;
  slug: string;
  key: string;
  storageUri: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeBaseDocumentInput
  extends KnowledgeBaseDocumentMetadata {
  content: string;
  key?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface KnowledgeBaseListOptions {
  docType?: KnowledgeBaseDocType;
  continuationToken?: string;
  pageSize?: number;
}

export interface KnowledgeBaseListResponse {
  items: KnowledgeBaseDocument[];
  nextContinuationToken?: string;
}
