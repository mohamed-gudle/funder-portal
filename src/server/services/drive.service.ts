import { google } from 'googleapis';

const REQUIRED_ENV_VARS = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_REDIRECT_URI'
] as const;

function assertEnv() {
  for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key]) {
      throw new Error(`Missing env var: ${key}`);
    }
  }
}

function getOAuthClient(refreshToken?: string) {
  assertEnv();

  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  if (refreshToken) {
    client.setCredentials({ refresh_token: refreshToken });
  }

  return client;
}

class DriveService {
  getAuthUrl() {
    const client = getOAuthClient();
    return client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['https://www.googleapis.com/auth/drive.metadata.readonly']
    });
  }

  async exchangeCodeForTokens(code: string) {
    const client = getOAuthClient();
    const { tokens } = await client.getToken(code);
    return tokens;
  }

  async listFiles(refreshToken: string) {
    const client = getOAuthClient(refreshToken);
    const drive = google.drive({ version: 'v3', auth: client });

    try {
      const res = await drive.files.list({
        pageSize: 50,
        fields:
          'files(id, name, mimeType, modifiedTime, parents, iconLink, webViewLink)'
      });
      return res.data.files ?? [];
    } catch (error: any) {
      // Bubble status code so caller can handle 401/403 reconnect flows.
      if (error?.code === 403 || error?.code === 401) {
        const reason =
          error?.errors?.[0]?.message ||
          error?.message ||
          'Drive authentication/permission error';
        throw Object.assign(new Error(reason), { code: 401, reason });
      }
      throw error;
    }
  }
}

export const driveService = new DriveService();
