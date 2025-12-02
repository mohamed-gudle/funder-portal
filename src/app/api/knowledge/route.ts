import { NextResponse } from 'next/server';
import { fileService } from '@/server/services/file.service';
import { knowledgeDocumentService } from '@/server/services/knowledge-document.service';

export const runtime = 'nodejs';

function parseList(value: FormDataEntryValue | null): string[] {
  if (!value) return [];
  const str = value.toString();
  if (!str) return [];
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item).trim()).filter(Boolean);
    }
  } catch {
    // Fall back to comma-separated parsing
  }
  return str
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'doc'
  );
}

export async function GET() {
  try {
    const documents = await knowledgeDocumentService.findAll();
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching knowledge documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch knowledge documents' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const title = formData.get('title')?.toString() || file.name;
    const docType = formData.get('docType')?.toString() || 'general';
    const slug = slugify(title);
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const fileKey = `${slug}-${timestamp}-${file.name}`;
    const upload = await fileService.uploadSingleFile(
      {
        originalname: fileKey,
        buffer,
        mimetype: file.type || 'application/octet-stream'
      },
      `knowledge-base/${docType}`,
      'private'
    );

    const payload = {
      title,
      docType,
      sectors: parseList(formData.get('sectors')),
      specialties: parseList(formData.get('specialties')),
      engagementStages: parseList(formData.get('engagementStages')),
      applicationTypes: parseList(formData.get('applicationTypes')),
      organizations: parseList(formData.get('organizations')),
      region: formData.get('region')?.toString() || undefined,
      year: formData.get('year') ? Number(formData.get('year')) : undefined,
      tags: parseList(formData.get('tags')),
      sensitivity: formData.get('sensitivity')?.toString() || 'internal',
      sourceUrl: formData.get('sourceUrl')?.toString() || undefined,
      s3Key: upload.key,
      s3Url: upload.url,
      mimeType: file.type,
      size: file.size
    };

    const document = await knowledgeDocumentService.create(payload);
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Error uploading knowledge document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}
