import { NextResponse } from 'next/server';
import { fileService } from '@/server/services/file.service';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const folder = formData.get('folder')?.toString() || 'uploads';
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    // Sanitize filename
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileKey = `${timestamp}-${safeName}`;

    const upload = await fileService.uploadSingleFile(
      {
        originalname: fileKey,
        buffer,
        mimetype: file.type || 'application/octet-stream'
      },
      folder,
      'public-read'
    );

    return NextResponse.json(
      {
        url: upload.url,
        name: file.name,
        key: upload.key,
        size: file.size,
        type: file.type
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
