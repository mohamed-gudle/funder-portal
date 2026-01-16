'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, FolderOpen } from 'lucide-react';
import Script from 'next/script';

// Types for Google API
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

interface GoogleDrivePickerProps {
  onFileSelect: (fileId: string, accessToken: string, name: string) => void;
  isLoading?: boolean;
}

export function GoogleDrivePicker({
  onFileSelect,
  isLoading = false
}: GoogleDrivePickerProps) {
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [gisLoaded, setGisLoaded] = useState(false);
  const [tokenClient, setTokenClient] = useState<any>(null);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  // Load Google Picker API
  const handleGapiLoad = () => {
    window.gapi.load('picker', () => {
      setGapiLoaded(true);
    });
  };

  // Load Google Identity Services
  const handleGisLoad = () => {
    setGisLoaded(true);
  };

  const createPicker = (accessToken: string) => {
    if (!clientId || !apiKey) {
      console.error('Google Drive credentials not configured');
      return;
    }

    const view = new window.google.picker.View(
      window.google.picker.ViewId.DOCS
    );
    view.setMimeTypes(
      'application/vnd.google-apps.document,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );

    const picker = new window.google.picker.PickerBuilder()
      .setDeveloperKey(apiKey)
      .setAppId(clientId)
      .setOAuthToken(accessToken)
      .addView(view)
      .addView(new window.google.picker.DocsUploadView())
      .setCallback((data: any) => {
        if (
          data[window.google.picker.Response.ACTION] ===
          window.google.picker.Action.PICKED
        ) {
          const doc = data[window.google.picker.Response.DOCUMENTS][0];
          const fileId = doc[window.google.picker.Document.ID];
          const name = doc[window.google.picker.Document.NAME];
          onFileSelect(fileId, accessToken, name);
        }
      })
      .build();

    picker.setVisible(true);
  };

  // Click handler
  const handleClick = () => {
    if (!gapiLoaded || !gisLoaded) {
      console.warn('Google scripts not loaded yet');
      return;
    }

    if (!tokenClient) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: (response: any) => {
          if (response.error !== undefined) {
            console.error(response);
            throw response;
          }
          createPicker(response.access_token);
        }
      });
      setTokenClient(client);
      client.requestAccessToken({ prompt: '' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  };

  return (
    <>
      <Script
        src='https://apis.google.com/js/api.js'
        onLoad={handleGapiLoad}
        strategy='lazyOnload'
      />
      <Script
        src='https://accounts.google.com/gsi/client'
        onLoad={handleGisLoad}
        strategy='lazyOnload'
      />

      <Button
        variant='outline'
        className='w-full gap-2'
        onClick={handleClick}
        disabled={!gapiLoaded || !gisLoaded || isLoading || !clientId}
      >
        {isLoading ? (
          <Loader2 className='h-4 w-4 animate-spin' />
        ) : (
          <FolderOpen className='h-4 w-4' />
        )}
        Select from Drive
      </Button>
    </>
  );
}
