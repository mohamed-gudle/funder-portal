import { NextResponse } from 'next/server';
import { Readable } from 'node:stream';
import { fileService } from '@/server/services/file.service';
import { knowledgeDocumentService } from '@/server/services/knowledge-document.service';

export const runtime = 'nodejs';

function readableToWeb(body: Readable) {
  return new ReadableStream({
    start(controller) {
      body.on('data', (chunk) => controller.enqueue(chunk));
      body.on('end', () => controller.close());
      body.on('error', (err) => controller.error(err));
    }
  });
}

function bufferToWeb(buffer: Buffer | Uint8Array) {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(buffer);
      controller.close();
    }
  });
}

function toWebStream(body: unknown) {
  if (!body) return null;
  if (body instanceof Readable) return readableToWeb(body);
  if (
    body instanceof Uint8Array ||
    (typeof Buffer !== 'undefined' && Buffer.isBuffer(body))
  ) {
    return bufferToWeb(body as Buffer | Uint8Array);
  }
  if (typeof (body as any)?.getReader === 'function') {
    return body as ReadableStream;
  }
  return null;
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

    const s3Object = await fileService.downloadFile(doc.s3Key);
    const stream = toWebStream(s3Object.Body);

    if (!stream) {
      return NextResponse.json(
        { error: 'File stream unavailable' },
        { status: 500 }
      );
    }

    const ext = doc.s3Key.split('.').pop();
    const safeName = doc.title?.replace(/[^a-z0-9-_]/gi, '_') || 'document';
    const filename = ext ? `${safeName}.${ext}` : safeName;

    const headers = new Headers();
    headers.set('Content-Type', doc.mimeType || 'application/octet-stream');
    headers.set(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(filename)}"`
    );
    if (doc.size) {
      headers.set('Content-Length', String(doc.size));
    }

    return new NextResponse(stream, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error downloading knowledge document:', error);
    return NextResponse.json(
      { error: 'Failed to download document' },
      { status: 500 }
    );
  }
}
