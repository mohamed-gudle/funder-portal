import { NextResponse } from 'next/server';
import { Readable } from 'node:stream';

import { fileService } from '@/server/services/file.service';

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const filename = searchParams.get('filename') || 'document';

    if (!key) {
      return NextResponse.json({ error: 'Missing key' }, { status: 400 });
    }

    const object = await fileService.downloadFile(key);
    const bodyStream = object.Body as Readable;
    const buffer = await streamToBuffer(bodyStream);

    const safeName = filename.replace(/[^\w.-]+/g, '_');

    const headers: Record<string, string> = {
      'Content-Type': object.ContentType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(safeName)}"`
    };

    if (object.ContentLength) {
      headers['Content-Length'] = object.ContentLength.toString();
    }

    return new NextResponse(buffer, { headers });
  } catch (error) {
    console.error('Error downloading knowledge document by key:', error);
    return NextResponse.json(
      { error: 'Failed to download document' },
      { status: 500 }
    );
  }
}
