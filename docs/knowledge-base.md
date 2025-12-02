# Knowledge Base Service (S3)

Backend service for storing and retrieving knowledge-base documents in S3. It wraps the AWS SDK and enforces a consistent metadata schema so we can extend to ingestion/RAG later.

## Storage layout
- Bucket: `KNOWLEDGE_BASE_BUCKET` (falls back to `BUCKET_NAME`)
- Prefix: `KNOWLEDGE_BASE_PREFIX` (default `knowledge-base`)
- Key pattern: `{prefix}/{docType}/{slug}-{id}.json`
- Payload: JSON with metadata + content (matches `src/types/knowledge-base.ts`)

Example stored object:
```json
{
  "id": "kb-123",
  "title": "Health: Primary Care Playbook",
  "docType": "sector",
  "sectors": ["health"],
  "specialties": ["primary-care"],
  "engagementStages": ["discovery"],
  "applicationTypes": ["concept-note"],
  "organizations": ["who"],
  "region": "SSA",
  "year": 2024,
  "tags": ["tone:formal", "audience:donor"],
  "sensitivity": "internal",
  "sourceUrl": "https://example.org/playbook",
  "content": "# Primary Care\n\nGuidance...",
  "slug": "health-primary-care-playbook",
  "key": "knowledge-base/sector/health-primary-care-playbook-kb-123.json",
  "storageUri": "s3://<bucket>/knowledge-base/sector/health-primary-care-playbook-kb-123.json",
  "createdAt": "2024-12-01T12:00:00.000Z",
  "updatedAt": "2024-12-01T12:00:00.000Z"
}
```

## API surface
Path: `src/server/services/knowledge-base.service.ts`  
Types: `src/types/knowledge-base.ts`

- `upsertDocument(doc: KnowledgeBaseDocumentInput)` → writes JSON to S3, returns normalized metadata (ids, slug, key, storageUri).
- `getDocument(key: string)` → fetches and parses one document.
- `listDocuments({ docType?, continuationToken?, pageSize? })` → lists documents under the KB prefix (filters by `docType` by prefix).
- `deleteDocument(key: string)` → deletes a stored document; returns `true` if found.

## Usage examples
```ts
import { knowledgeBaseService } from '@/server/services/knowledge-base.service';

await knowledgeBaseService.upsertDocument({
  title: 'Education: STEM Outreach',
  docType: 'sector',
  sectors: ['education'],
  engagementStages: ['proposal'],
  content: '# STEM Outreach\n\nProgram guidance...',
  tags: ['audience:donor']
});

const list = await knowledgeBaseService.listDocuments({ docType: 'sector', pageSize: 20 });
const doc = list.items[0] ? await knowledgeBaseService.getDocument(list.items[0].key) : null;
```

## Config
- `KNOWLEDGE_BASE_BUCKET` (optional) → dedicated bucket for KB; defaults to `BUCKET_NAME`
- `KNOWLEDGE_BASE_PREFIX` (optional) → default `knowledge-base`
- `AWS_REGION` → region for the S3 client

## Notes / next steps
- S3 objects are the source of truth; repo copies can be synced via a background job or CI.
- Metadata is stored alongside content so the ingestion pipeline can filter by sector/specialty/engagement/application/organization tags before embedding.
- When we add Google Drive, pipe converted artifacts into the same bucket/prefix with `origin` tags stored in the JSON.

## Frontend / API entry point
- Upload UI: `src/app/dashboard/knowledge/page.tsx` (uploads file + metadata)
- API: `POST /api/knowledge` stores metadata in MongoDB and uploads the file to S3 under the `knowledge-base/{docType}` prefix; `GET /api/knowledge` lists stored docs; `GET /api/knowledge/download?key=...&filename=...` streams a stored document from S3 for download (UI uses `s3Key` directly to avoid lookup failures).
- Download: `GET /api/knowledge/:id` streams the stored file with Content-Disposition attachment.
