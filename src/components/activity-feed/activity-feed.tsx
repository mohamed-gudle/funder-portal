'use client';

import { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Mail,
  Phone,
  MessageSquare,
  FileText,
  Activity as ActivityIcon,
  Send,
  Loader2,
  Paperclip,
  X,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ActivityDocument {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
}

interface Activity {
  _id: string;
  type:
    | 'Call Log'
    | 'Email'
    | 'Meeting Note'
    | 'Internal Comment'
    | 'Status Change';
  content: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  author: {
    name: string;
    image?: string;
  };
  documents?: ActivityDocument[];
  createdAt: string;
}

interface ActivityFeedProps {
  parentId: string;
  parentModel: 'OpenCall' | 'CompetitiveCall' | 'BilateralEngagement';
}

const icons = {
  'Call Log': Phone,
  Email: Mail,
  'Meeting Note': FileText,
  'Internal Comment': MessageSquare,
  'Status Change': ActivityIcon
};

export function ActivityFeed({ parentId, parentModel }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newActivityContent, setNewActivityContent] = useState('');
  const [newActivityType, setNewActivityType] =
    useState<string>('Internal Comment');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchActivities = async () => {
    try {
      const res = await fetch(`/api/activities?parentId=${parentId}`);
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch (err) {
      console.error('Failed to fetch activities', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [parentId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setAttachedFiles((prev) => [...prev, ...Array.from(files)]);
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityContent.trim()) return;

    setSubmitting(true);
    try {
      // Upload files first if any
      const processedDocuments: ActivityDocument[] = [];
      if (attachedFiles.length > 0) {
        for (const file of attachedFiles) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('folder', 'activities');

          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });

          if (!uploadRes.ok) {
            throw new Error(`Failed to upload file: ${file.name}`);
          }

          const uploadData = await uploadRes.json();
          processedDocuments.push({
            id: uploadData.key,
            name: uploadData.name,
            url: uploadData.url,
            uploadedAt: new Date().toISOString()
          });
        }
      }

      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newActivityType,
          content: newActivityContent,
          parent: parentId,
          parentModel,
          documents: processedDocuments
        })
      });

      if (res.ok) {
        setNewActivityContent('');
        setAttachedFiles([]);
        fetchActivities(); // Refresh feed
        toast.success('Activity posted successfully');
      }
    } catch (err) {
      console.error('Failed to post activity', err);
      toast.error('Failed to post activity');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className='p-4 text-center'>Loading activities...</div>;

  return (
    <div className='flex h-full flex-col space-y-6'>
      {/* Input Area */}
      <div className='bg-card rounded-lg border p-4 shadow-sm'>
        <h3 className='text-muted-foreground mb-3 text-sm font-semibold'>
          New Activity
        </h3>
        <form onSubmit={handleSubmit} className='space-y-3'>
          <div className='flex gap-2'>
            <Select value={newActivityType} onValueChange={setNewActivityType}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Internal Comment'>Comment</SelectItem>
                <SelectItem value='Call Log'>Call Log</SelectItem>
                <SelectItem value='Email'>Email</SelectItem>
                <SelectItem value='Meeting Note'>Meeting Note</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea
            placeholder='Type your notes here...'
            value={newActivityContent}
            onChange={(e) => setNewActivityContent(e.target.value)}
            className='min-h-[100px]'
          />

          {/* Attached Files Preview */}
          {attachedFiles.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {attachedFiles.map((file, index) => (
                <div
                  key={index}
                  className='bg-muted flex items-center gap-2 rounded-md px-3 py-1.5 text-sm'
                >
                  <FileText className='h-4 w-4' />
                  <span className='max-w-[150px] truncate'>{file.name}</span>
                  <button
                    type='button'
                    onClick={() => removeFile(index)}
                    className='text-muted-foreground hover:text-foreground'
                  >
                    <X className='h-4 w-4' />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className='flex items-center justify-between'>
            <div>
              <input
                ref={fileInputRef}
                type='file'
                multiple
                onChange={handleFileSelect}
                className='hidden'
                accept='.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg'
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className='mr-2 h-4 w-4' />
                Attach Files
              </Button>
            </div>
            <Button type='submit' disabled={submitting} size='sm'>
              {submitting ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <Send className='mr-2 h-4 w-4' />
              )}
              Post Activity
            </Button>
          </div>
        </form>
      </div>

      {/* Feed List */}
      <div className='space-y-6'>
        {activities.map((activity, idx) => {
          const Icon = icons[activity.type] || MessageSquare;
          return (
            <div key={activity._id} className='relative flex gap-x-4'>
              {/* Connector Line */}
              {idx !== activities.length - 1 && (
                <div className='absolute top-0 -bottom-6 left-0 flex w-8 justify-center'>
                  <div className='w-px bg-gray-200' />
                </div>
              )}

              {/* Icon */}
              <div className='relative flex h-8 w-8 flex-none items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-200'>
                <Icon className='h-4 w-4 text-gray-500' />
              </div>

              {/* Content */}
              <div className='flex-auto rounded-md p-3 ring-1 ring-gray-200 ring-inset'>
                <div className='flex justify-between gap-x-4'>
                  <div className='py-0.5 text-xs leading-5 text-gray-500'>
                    <span className='font-medium text-gray-900'>
                      {activity.author?.name || 'Unknown User'}
                    </span>{' '}
                    posted a{' '}
                    <span className='font-medium text-gray-900'>
                      {activity.type}
                    </span>
                  </div>
                  <time
                    dateTime={activity.createdAt}
                    className='flex-none py-0.5 text-xs leading-5 text-gray-500'
                  >
                    {formatDistanceToNow(new Date(activity.createdAt), {
                      addSuffix: true
                    })}
                  </time>
                </div>
                <p className='mt-1 text-sm leading-6 text-gray-700'>
                  {activity.content}
                </p>

                {/* Document Attachments */}
                {activity.documents && activity.documents.length > 0 && (
                  <div className='mt-3 flex flex-wrap gap-2'>
                    {activity.documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='bg-muted hover:bg-muted/80 flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors'
                      >
                        <Download className='h-4 w-4' />
                        <span className='max-w-[150px] truncate'>
                          {doc.name}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {activities.length === 0 && (
          <p className='text-muted-foreground py-8 text-center text-sm'>
            No activities yet.
          </p>
        )}
      </div>
    </div>
  );
}
