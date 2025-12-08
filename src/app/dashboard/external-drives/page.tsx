'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

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

type DriveStatus = 'connected' | 'disconnected' | 'error';

export default function ExternalDrivesPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [status, setStatus] = useState<DriveStatus>('disconnected');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDriveFiles();
  }, []);

  async function fetchDriveFiles() {
    try {
      setLoading(true);
      const res = await fetch('/api/knowledge/drive/files', {
        cache: 'no-store'
      });
      if (res.status === 401) {
        setStatus('disconnected');
        setFiles([]);
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to load Drive files');
      }
      const data = await res.json();
      setFiles(data);
      setStatus('connected');
    } catch (error) {
      console.error(error);
      setStatus('error');
      toast.error('Could not load Google Drive files');
    } finally {
      setLoading(false);
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
          <h1 className='text-3xl font-semibold'>External Drives</h1>
          <p className='text-muted-foreground max-w-2xl'>
            Connect Google Drive folders to sync supporting documents into the
            knowledge base ingestion pipeline.
          </p>
        </div>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            onClick={fetchDriveFiles}
            disabled={loading}
          >
            {loading ? 'Refreshing…' : 'Refresh'}
          </Button>
          <Button onClick={handleConnectDrive} disabled={loading}>
            Add Google Drive
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connected drives</CardTitle>
          <CardDescription>
            Google Drive folders available for ingestion.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='text-muted-foreground flex items-center justify-between text-sm'>
            <div>
              Status:{' '}
              <span className='text-foreground font-medium'>
                {status === 'connected'
                  ? 'Connected'
                  : status === 'error'
                    ? 'Error'
                    : 'Disconnected'}
              </span>
            </div>
          </div>

          {status !== 'connected' ? (
            <p className='text-muted-foreground text-sm'>
              Click &quot;Add Google Drive&quot; to open the consent screen,
              then you&apos;ll return here to browse your folders/files.
            </p>
          ) : files.length === 0 ? (
            <p className='text-muted-foreground text-sm'>
              No files found in Drive (or insufficient permissions).
            </p>
          ) : (
            <div className='space-y-4'>
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
                  {files.map((file) => (
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
                          <Badge variant='outline'>No link</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Separator />
              <p className='text-muted-foreground text-xs'>
                OAuth and background sync jobs are handled via the Google Drive
                connection. Listing is metadata-only; ingestion can pull files
                by ID.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
