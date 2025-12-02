import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  S3ServiceException
} from '@aws-sdk/client-s3';
import { Readable } from 'node:stream';

import { createCustomId } from '@/lib/utils';
import {
  KnowledgeBaseDocument,
  KnowledgeBaseDocumentInput,
  KnowledgeBaseListOptions,
  KnowledgeBaseListResponse
} from '@/types/knowledge-base';

export class KnowledgeBaseService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly prefix: string;

  constructor(
    options: {
      client?: S3Client;
      bucketName?: string;
      prefix?: string;
      region?: string;
    } = {}
  ) {
    this.bucketName =
      options.bucketName ??
      process.env.KNOWLEDGE_BASE_BUCKET ??
      process.env.BUCKET_NAME ??
      '';
    this.prefix = this.normalizePrefix(
      options.prefix ?? process.env.KNOWLEDGE_BASE_PREFIX ?? 'knowledge-base'
    );
    this.s3Client =
      options.client ??
      new S3Client({
        region: options.region ?? process.env.AWS_REGION ?? 'us-east-1'
      });
  }

  async upsertDocument(
    doc: KnowledgeBaseDocumentInput
  ): Promise<KnowledgeBaseDocument> {
    const now = new Date().toISOString();
    const id = doc.id ?? createCustomId('kb');
    const slug = this.slugify(doc.slug ?? doc.title ?? id);
    const key =
      doc.key ?? this.buildKey(doc.docType, slug, id, doc.storagePrefix);
    const createdAt = doc.createdAt ?? now;

    const payload: KnowledgeBaseDocument = {
      ...doc,
      id,
      slug,
      key,
      storageUri: `s3://${this.ensureBucketName()}/${key}`,
      createdAt,
      updatedAt: now
    };

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.ensureBucketName(),
        Key: key,
        Body: JSON.stringify(payload),
        ContentType: 'application/json'
      })
    );

    return payload;
  }

  async getDocument(key: string): Promise<KnowledgeBaseDocument | null> {
    try {
      const response = await this.s3Client.send(
        new GetObjectCommand({ Bucket: this.ensureBucketName(), Key: key })
      );
      const body = await this.bodyToString(response.Body);
      return JSON.parse(body) as KnowledgeBaseDocument;
    } catch (error) {
      if (
        error instanceof S3ServiceException &&
        (error.name === 'NoSuchKey' || error.name === 'NotFound')
      ) {
        return null;
      }
      throw error;
    }
  }

  async listDocuments(
    options: KnowledgeBaseListOptions = {}
  ): Promise<KnowledgeBaseListResponse> {
    const response = await this.s3Client.send(
      new ListObjectsV2Command({
        Bucket: this.ensureBucketName(),
        Prefix: this.buildListPrefix(options.docType),
        ContinuationToken: options.continuationToken,
        MaxKeys: options.pageSize ?? 50
      })
    );

    const keys =
      response.Contents?.map((item) => item.Key).filter((key): key is string =>
        Boolean(key)
      ) ?? [];

    const items = (
      await Promise.all(
        keys.map(async (key) => {
          const doc = await this.getDocument(key);
          return doc;
        })
      )
    ).filter((doc): doc is KnowledgeBaseDocument => Boolean(doc));

    return {
      items,
      nextContinuationToken: response.NextContinuationToken
    };
  }

  async deleteDocument(key: string): Promise<boolean> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({ Bucket: this.ensureBucketName(), Key: key })
      );
      return true;
    } catch (error) {
      if (
        error instanceof S3ServiceException &&
        (error.name === 'NoSuchKey' || error.name === 'NotFound')
      ) {
        return false;
      }
      throw error;
    }
  }

  private buildKey(
    docType: string,
    slug: string,
    id: string,
    storagePrefix?: string
  ): string {
    const prefix = this.normalizePrefix(storagePrefix ?? this.prefix);
    return [prefix, docType, `${slug}-${id}.json`].filter(Boolean).join('/');
  }

  private buildListPrefix(docType?: string): string {
    if (docType) {
      return [this.prefix, docType, ''].join('/');
    }
    return `${this.prefix}/`;
  }

  private normalizePrefix(prefix: string): string {
    return prefix.replace(/^\/+/, '').replace(/\/+$/, '');
  }

  private slugify(value: string): string {
    return (
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'doc'
    );
  }

  private ensureBucketName(): string {
    if (!this.bucketName) {
      throw new Error(
        'Knowledge base bucket is not configured. Set KNOWLEDGE_BASE_BUCKET or BUCKET_NAME.'
      );
    }
    return this.bucketName;
  }

  // Normalizes S3 response body shapes (Node streams, web streams, Blob) into a UTF-8 string.
  private async bodyToString(body: unknown): Promise<string> {
    if (!body) return '';
    if (typeof body === 'string') return body;
    if (body instanceof Readable) {
      const chunks: Buffer[] = [];
      for await (const chunk of body) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      return Buffer.concat(chunks).toString('utf-8');
    }

    // Browser stream from AWS SDK in edge runtimes.
    if (typeof (body as any)?.getReader === 'function') {
      const reader = (body as ReadableStream).getReader();
      const chunks: Uint8Array[] = [];
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) chunks.push(value);
      }
      return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk))).toString(
        'utf-8'
      );
    }

    // Fallback for Blob-like responses.
    if (typeof (body as any)?.text === 'function') {
      return (body as Blob).text();
    }

    return '';
  }
}

export const knowledgeBaseService = new KnowledgeBaseService();
