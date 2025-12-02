import {
  DeleteObjectCommand,
  GetObjectCommand,
  GetObjectCommandOutput,
  HeadObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
  S3ServiceException
} from '@aws-sdk/client-s3';

import { createCustomId } from '@/lib/utils';

type UploadedFile = {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
};

type UploadedFilesMap = Record<string, UploadedFile[]>;

type UploadMetadata = {
  bucket: string;
  key: string;
  url: string;
  name: string;
};

type FolderStatus = 'created' | 'exists';

type FolderMetadata = {
  bucket: string;
  key: string;
  status: FolderStatus;
};

/**
 * Service for handling file and folder operations in S3-compatible storage.
 * Provides utilities for uploading, downloading, deleting, and checking existence of files/folders.
 */
export class FileService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly bucketEndpoint: string;

  constructor(
    options: {
      client?: S3Client;
      bucketName?: string;
      bucketEndpoint?: string;
      region?: string;
    } = {}
  ) {
    this.bucketName = options.bucketName ?? process.env.BUCKET_NAME ?? '';
    this.bucketEndpoint =
      options.bucketEndpoint ?? process.env.BUCKET_ENDPOINT ?? '';
    this.s3Client =
      options.client ??
      new S3Client({
        region: options.region ?? process.env.AWS_REGION ?? 'us-east-1'
      });
  }

  /**
   * Checks if a folder exists in the S3 bucket.
   * @param key Folder key (path)
   * @returns True if folder exists, false otherwise
   */
  async existsFolder(key: string): Promise<boolean> {
    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.getBucketName(),
          Key: this.asFolderKey(key)
        })
      );
      return true;
    } catch (error) {
      if (error instanceof S3ServiceException && error.name === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  /**
   * Creates a folder in the S3 bucket if it does not already exist.
   * @param key Folder key (path)
   * @returns Metadata about the folder creation status
   */
  async createFolder(key: string): Promise<FolderMetadata> {
    if (await this.existsFolder(key)) {
      return { bucket: this.getBucketName(), key, status: 'exists' };
    }

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.getBucketName(),
        Key: this.asFolderKey(key),
        Body: ''
      })
    );

    return { bucket: this.getBucketName(), key, status: 'created' };
  }

  /**
   * Deletes a folder (object with trailing slash) from the S3 bucket.
   * @param key Folder key (path)
   */
  async deleteFolder(key: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.getBucketName(),
        Key: this.asFolderKey(key)
      })
    );
  }

  /**
   * Uploads a single file to the S3 bucket.
   * @param file File object
   * @param acl Access control list (default: 'private')
   */
  async uploadFile(
    file: UploadedFile | undefined | null,
    acl: ObjectCannedACL = 'private'
  ): Promise<void> {
    if (!file) return;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.getBucketName(),
        Key: file.originalname,
        Body: file.buffer,
        ACL: acl,
        ContentType: file.mimetype
      })
    );
  }

  /**
   * Uploads multiple files to the S3 bucket.
   * @param files Object mapping field names to arrays of file objects
   * @param acl Access control list (default: 'private')
   * @returns Metadata for each uploaded file
   */
  async uploadFiles(
    files: UploadedFilesMap,
    acl: ObjectCannedACL = 'private'
  ): Promise<Record<string, UploadMetadata[]>> {
    const metadata: Record<string, UploadMetadata[]> = {};
    const uploads: Array<Promise<unknown>> = [];

    for (const [field, fileList] of Object.entries(files)) {
      metadata[field] = [];
      for (const file of fileList) {
        const key = `${field}-${createCustomId('file')}-${file.originalname}`;
        uploads.push(
          this.s3Client.send(
            new PutObjectCommand({
              Bucket: this.getBucketName(),
              Key: key,
              Body: file.buffer,
              ACL: acl,
              ContentType: file.mimetype
            })
          )
        );
        metadata[field].push({
          bucket: this.getBucketName(),
          key,
          url: this.getPublicUrl(
            this.bucketEndpoint,
            this.getBucketName(),
            key
          ),
          name: file.originalname
        });
      }
    }

    await Promise.all(uploads);
    return metadata;
  }

  /**
   * Deletes a file from the S3 bucket.
   * @param key File key (path)
   * @returns True if file was deleted, false if not found
   */
  async deleteFile(key: string): Promise<boolean> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({ Bucket: this.getBucketName(), Key: key })
      );
      return true;
    } catch (error) {
      if (error instanceof S3ServiceException && error.name === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  /**
   * Downloads a file from the S3 bucket.
   * @param key File key (path)
   * @returns S3 GetObjectCommandOutput (stream and metadata)
   */
  async downloadFile(key: string): Promise<GetObjectCommandOutput> {
    return await this.s3Client.send(
      new GetObjectCommand({ Bucket: this.getBucketName(), Key: key })
    );
  }

  /**
   * Uploads a single file to the S3 bucket with a custom key.
   * @param file File object
   * @param customKey Custom key prefix (e.g., 'projectId/ai-assistant')
   * @param acl Access control list (default: 'public-read')
   * @returns Metadata about the uploaded file
   */
  async uploadSingleFile(
    file: UploadedFile,
    customKey: string,
    acl: ObjectCannedACL = 'public-read'
  ): Promise<UploadMetadata> {
    if (!file) {
      throw new Error('No file provided');
    }

    const key = `${customKey}/${file.originalname}`;
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.getBucketName(),
        Key: key,
        Body: file.buffer,
        ACL: acl,
        ContentType: file.mimetype
      })
    );

    return {
      bucket: this.getBucketName(),
      key,
      url: this.getPublicUrl(this.bucketEndpoint, this.getBucketName(), key),
      name: file.originalname
    };
  }

  /**
   * Deletes a file from the S3 bucket by key.
   * @param key File key (path, e.g., 'projectId/ai-assistant/filename.ext')
   * @returns Object indicating success and deleted key
   */
  async deleteFileByKey(
    key: string
  ): Promise<{ success: boolean; key: string }> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({ Bucket: this.getBucketName(), Key: key })
      );
      return { success: true, key };
    } catch (error) {
      if (error instanceof S3ServiceException && error.name === 'NotFound') {
        return { success: false, key };
      }
      throw error;
    }
  }

  /**
   * Constructs a public URL for a file in the S3 bucket.
   * @param bucketEndpoint S3 endpoint
   * @param bucketName Bucket name
   * @param key File key (path)
   * @returns Public URL string
   */
  private getPublicUrl(
    bucketEndpoint: string,
    bucketName: string,
    key: string
  ): string {
    const cleanBucket = bucketName.replace(/^\//, '').replace(/\/$/, '');
    const cleanKey = key.replace(/^\//, '');

    if (bucketEndpoint) {
      const cleanEndpoint = bucketEndpoint.replace(/\/$/, '');
      return `${cleanEndpoint}/${cleanBucket}/${cleanKey}`;
    }

    return `https://${cleanBucket}.s3.amazonaws.com/${cleanKey}`;
  }

  private getBucketName(): string {
    if (!this.bucketName) {
      throw new Error(
        'S3 bucket name is not configured. Please set BUCKET_NAME.'
      );
    }
    return this.bucketName;
  }

  private asFolderKey(key: string): string {
    return key.endsWith('/') ? key : `${key}/`;
  }
}

export const fileService = new FileService();
