'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { KnowledgeDocument } from '@/types/knowledge-document';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { formatBytes } from '@/lib/utils';
import { KnowledgeUploadDrawer } from '@/features/knowledge/components/knowledge-upload-drawer';

export default function KnowledgePage() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [driveStatus, setDriveStatus] = useState<
    'connected' | 'disconnected' | 'error'
  >('disconnected');
  const [loadingDrive, setLoadingDrive] = useState(false);

  useEffect(() => {
    fetchDocuments();
    fetchDriveFiles();
  }, []);

  async function fetchDocuments() {
    try {
      setLoadingDocs(true);
      const res = await fetch('/api/knowledge', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch documents');
      const data = await res.json();
      setDocuments(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load knowledge documents');
    } finally {
      setLoadingDocs(false);
    }
  }

  async function fetchDriveFiles() {
    try {
      setLoadingDrive(true);
      const res = await fetch('/api/knowledge/drive/files', {
        cache: 'no-store'
      });
      if (res.status === 401) {
        setDriveStatus('disconnected');
        setDriveFiles([]);
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to load Drive files');
      }
      const data = await res.json();
      setDriveFiles(data);
      setDriveStatus('connected');
    } catch (error) {
      console.error(error);
      setDriveStatus('error');
      toast.error('Could not load Google Drive files');
    } finally {
      setLoadingDrive(false);
    }
  }

  async function handleConnectDrive() {
    try {
      const res = await fetch('/api/knowledge/drive/auth');
      if (!res.ok) throw new Error('Failed to start Drive auth');
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No auth url returned');
      }
    } catch (error) {
      console.error(error);
      toast.error('Could not start Google Drive connection');
    }
  }

  return (
    <div className='space-y-6 p-6'>
      <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
        <div className='space-y-1'>
          <h1 className='text-3xl font-semibold'>Knowledge Base</h1>
          <p className='text-muted-foreground max-w-2xl'>
            Library of guides and reference documents with metadata so AI
            pre-population can retrieve them by sector, specialty, engagement,
            application, or organization.
          </p>
        </div>
        <Button onClick={() => setShowUploader(true)}>Add document</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Google Drive</CardTitle>
          <CardDescription>
            Connect your Drive to browse folders/files for ingestion.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between gap-4'>
            <div className='text-muted-foreground text-sm'>
              Status:{' '}
              <span className='text-foreground font-medium'>
                {driveStatus === 'connected'
                  ? 'Connected'
                  : driveStatus === 'error'
                    ? 'Error'
                    : 'Disconnected'}
              </span>
            </div>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                onClick={fetchDriveFiles}
                disabled={loadingDrive}
              >
                {loadingDrive ? 'Refreshing…' : 'Refresh'}
              </Button>
              <Button onClick={handleConnectDrive} disabled={loadingDrive}>
                Connect Google Drive
              </Button>
            </div>
          </div>

          {driveStatus !== 'connected' ? (
            <p className='text-muted-foreground text-sm'>
              Connect to view your Drive files. After consenting, you&apos;ll be
              redirected back here automatically.
            </p>
          ) : driveFiles.length === 0 ? (
            <p className='text-muted-foreground text-sm'>
              No files found in Drive (or insufficient permissions).
            </p>
          ) : (
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Modified</TableHead>
                    <TableHead>Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {driveFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className='font-medium'>{file.name}</TableCell>
                      <TableCell className='text-muted-foreground text-sm'>
                        {file.mimeType}
                      </TableCell>
                      <TableCell className='text-muted-foreground text-sm'>
                        {file.modifiedTime
                          ? new Date(file.modifiedTime).toLocaleString()
                          : '--'}
                      </TableCell>
                      <TableCell className='text-right'>
                        {file.webViewLink ? (
                          <Button asChild size='sm' variant='outline'>
                            <a
                              href={file.webViewLink}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              Open
                            </a>
                          </Button>
                        ) : (
                          <span className='text-muted-foreground text-xs'>
                            —
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Library</CardTitle>
          <CardDescription>
            Recently uploaded knowledge documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingDocs ? (
            <div className='text-muted-foreground text-sm'>
              Loading documents...
            </div>
          ) : documents.length === 0 ? (
            <div className='text-muted-foreground text-sm'>
              No documents uploaded yet.
            </div>
          ) : (
            <div className='space-y-4'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className='font-medium'>
                        <div className='flex flex-col gap-1'>
                          <span>{doc.title}</span>
                          <span className='text-muted-foreground text-xs'>
                            {doc.s3Key}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant='secondary' className='capitalize'>
                          {doc.docType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className='text-muted-foreground flex flex-wrap gap-1 text-xs'>
                          {doc.sectors?.length > 0 && (
                            <Badge variant='outline'>
                              {doc.sectors.join(', ')}
                            </Badge>
                          )}
                          {doc.specialties?.length > 0 && (
                            <Badge variant='outline'>
                              {doc.specialties.join(', ')}
                            </Badge>
                          )}
                          {doc.organizations?.length > 0 && (
                            <Badge variant='outline'>
                              {doc.organizations.join(', ')}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className='text-muted-foreground text-sm'>
                        {typeof doc.size === 'number'
                          ? formatBytes(doc.size, { decimals: 1 })
                          : '--'}
                      </TableCell>
                      <TableCell className='text-muted-foreground text-sm'>
                        {new Date(doc.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className='text-right'>
                        <Button variant='outline' size='sm' asChild>
                          <a
                            href={`/api/knowledge/download?key=${encodeURIComponent(doc.s3Key)}&filename=${encodeURIComponent(doc.title)}`}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            Download
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Separator />
              <p className='text-muted-foreground text-xs'>
                Metadata is persisted in MongoDB and files are stored privately
                in S3 with keys under the `knowledge-base/` prefix.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <KnowledgeUploadDrawer
        open={showUploader}
        onOpenChange={setShowUploader}
        onUploaded={fetchDocuments}
      />
    </div>
  );
}
