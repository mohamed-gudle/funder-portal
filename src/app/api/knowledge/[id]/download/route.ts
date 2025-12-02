import { NextResponse } from 'next/server';
import { Readable } from 'node:stream';

import { fileService } from '@/server/services/file.service';
import { knowledgeDocumentService } from '@/server/services/knowledge-document.service';

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const doc = await knowledgeDocumentService.findById(params.id);
    if (!doc) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    if (!doc.s3Key) {
      return NextResponse.json(
        { error: 'No storage key for document' },
        { status: 400 }
      );
    }

    const object = await fileService.downloadFile(doc.s3Key);
    const bodyStream = object.Body as Readable;
    const buffer = await streamToBuffer(bodyStream);

    const filename = `${doc.title || 'document'}`.replace(/[^\w.-]+/g, '_');
    const headers: Record<string, string> = {
      'Content-Type':
        object.ContentType || doc.mimeType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`
    };

    if (object.ContentLength) {
      headers['Content-Length'] = object.ContentLength.toString();
    }

    return new NextResponse(buffer, { headers });
  } catch (error) {
    console.error('Error downloading knowledge document:', error);
    return NextResponse.json(
      { error: 'Failed to download document' },
      { status: 500 }
    );
  }
}
