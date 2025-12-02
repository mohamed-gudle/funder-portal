# API Documentation

> External API integrations and usage for Funders Portal

## Table of Contents

- [Overview](#overview)
- [Program Finder API](#program-finder-api)
- [Clerk Authentication API](#clerk-authentication-api)
- [Future API Integrations](#future-api-integrations)

## Overview

Funders Portal integrates with several external APIs to provide comprehensive funding management capabilities. This document details the integration points, request/response formats, and usage patterns.

## Program Finder API

### Overview

The Program Finder API provides access to a comprehensive database of funding opportunities. This integration powers the Opportunities Discovery feature.

### Base Configuration

```typescript
const PROGRAM_FINDER_CONFIG = {
  baseUrl: 'https://data-visualizer-agent-production.up.railway.app',
  endpoint: '/program_finder/find_programs',
  method: 'POST',
  contentType: 'application/json'
};
```

### Authentication

Currently, the Program Finder API does not require authentication. Future versions may implement API key authentication.

### Find Programs Endpoint

#### Endpoint

```
POST /program_finder/find_programs
```

#### Request Format

```typescript
interface ProgramSearchRequest {
  // Search criteria
  query?: string;                    // Keyword search
  categories?: string[];              // Funding categories
  sectors?: string[];                 // Industry sectors
  
  // Filtering
  minAmount?: number;                 // Minimum funding amount
  maxAmount?: number;                 // Maximum funding amount
  geography?: string[];               // Geographic scope
  eligibility?: {
    organizationType?: string[];      // Nonprofit, For-profit, etc.
    organizationSize?: string;        // Small, Medium, Large
    location?: string[];              // Allowed locations
  };
  
  // Date filtering
  deadlineFrom?: string;              // ISO 8601 date
  deadlineTo?: string;                // ISO 8601 date
  
  // Pagination
  page?: number;                      // Page number (default: 1)
  limit?: number;                     // Results per page (default: 10)
  
  // Sorting
  sortBy?: 'relevance' | 'deadline' | 'amount' | 'name';
  sortOrder?: 'asc' | 'desc';
}
```

#### Example Request

```typescript
const searchCriteria: ProgramSearchRequest = {
  query: 'environmental conservation',
  categories: ['Grants', 'Research Funding'],
  sectors: ['Environment', 'Climate'],
  minAmount: 10000,
  maxAmount: 500000,
  geography: ['United States', 'Canada'],
  eligibility: {
    organizationType: ['Nonprofit', 'Research Institution'],
    organizationSize: 'Small'
  },
  deadlineFrom: '2024-12-01T00:00:00Z',
  deadlineTo: '2025-06-30T23:59:59Z',
  page: 1,
  limit: 20,
  sortBy: 'deadline',
  sortOrder: 'asc'
};

const response = await fetch(
  'https://data-visualizer-agent-production.up.railway.app/program_finder/find_programs',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(searchCriteria)
  }
);

const data = await response.json();
```

#### Response Format

```typescript
interface ProgramSearchResponse {
  success: boolean;
  data: {
    programs: Program[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalResults: number;
      resultsPerPage: number;
    };
  };
  meta?: {
    searchId: string;
    executionTime: number;  // milliseconds
  };
}

interface Program {
  id: string;
  name: string;
  description: string;
  fundingOrganization: {
    name: string;
    website?: string;
    logo?: string;
  };
  fundingType: 'Grant' | 'Loan' | 'Prize' | 'Investment' | 'Other';
  amount: {
    min?: number;
    max?: number;
    currency: string;
    type: 'Fixed' | 'Range' | 'Variable';
  };
  deadline: {
    date: string;              // ISO 8601
    type: 'Fixed' | 'Rolling';
    notes?: string;
  };
  eligibility: {
    organizationType: string[];
    geography: string[];
    sector: string[];
    requirements: string[];
  };
  applicationProcess: {
    steps: string[];
    documents: string[];
    estimatedTime: string;
  };
  contact: {
    email?: string;
    phone?: string;
    website: string;
  };
  matchScore?: number;         // 0-100, if search includes criteria
  tags: string[];
}
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "programs": [
      {
        "id": "pgm_123456",
        "name": "Environmental Conservation Grant 2025",
        "description": "Supporting grassroots conservation efforts across North America",
        "fundingOrganization": {
          "name": "Green Earth Foundation",
          "website": "https://greenearthfoundation.org",
          "logo": "https://cdn.example.com/logos/gef.png"
        },
        "fundingType": "Grant",
        "amount": {
          "min": 25000,
          "max": 100000,
          "currency": "USD",
          "type": "Range"
        },
        "deadline": {
          "date": "2025-03-15T23:59:59Z",
          "type": "Fixed",
          "notes": "Applications must be submitted by 11:59 PM EST"
        },
        "eligibility": {
          "organizationType": ["Nonprofit", "Community Group"],
          "geography": ["United States", "Canada"],
          "sector": ["Environment", "Conservation"],
          "requirements": [
            "501(c)(3) status or equivalent",
            "Minimum 2 years of operation",
            "Focus on local environmental projects"
          ]
        },
        "applicationProcess": {
          "steps": [
            "Submit letter of inquiry",
            "Full proposal if invited",
            "Site visit (selected applicants)",
            "Final decision notification"
          ],
          "documents": [
            "Organizational budget",
            "Project proposal",
            "Letters of support",
            "Tax documentation"
          ],
          "estimatedTime": "3-4 months"
        },
        "contact": {
          "email": "grants@greenearthfoundation.org",
          "website": "https://greenearthfoundation.org/apply"
        },
        "matchScore": 87,
        "tags": ["environment", "conservation", "grassroots", "community"]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalResults": 87,
      "resultsPerPage": 20
    }
  },
  "meta": {
    "searchId": "search_abc123xyz",
    "executionTime": 342
  }
}
```

#### Error Responses

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

**Common Error Codes**:

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_REQUEST` | 400 | Invalid request parameters |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | API temporarily unavailable |

#### Rate Limiting

- **Current Limit**: Not enforced (as of Dec 2024)
- **Planned Limit**: 100 requests per minute per IP
- **Headers**: Future implementation will include rate limit headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

#### Best Practices

1. **Caching**: Cache search results for repeated queries
2. **Pagination**: Request only needed results
3. **Error Handling**: Implement retry logic with exponential backoff
4. **Timeout**: Set reasonable timeout (e.g., 10 seconds)
5. **Validation**: Validate request data before sending

#### Usage Example in Application

```typescript
// src/features/opportunities/utils/program-finder.ts

export async function searchPrograms(
  criteria: ProgramSearchRequest
): Promise<ProgramSearchResponse> {
  try {
    const response = await fetch(
      'https://data-visualizer-agent-production.up.railway.app/program_finder/find_programs',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(criteria),
        next: {
          revalidate: 3600 // Cache for 1 hour
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Program search failed:', error);
    throw error;
  }
}
```

---

## Clerk Authentication API

### Overview

Clerk provides authentication and user management for Funders Portal. While Clerk handles most operations automatically, understanding the API is useful for advanced integrations.

### SDK Usage

Funders Portal uses Clerk's Next.js SDK:

```typescript
import { auth, currentUser } from '@clerk/nextjs/server';
import { useUser, useAuth } from '@clerk/nextjs';
```

### Server-Side Authentication

#### Getting Current User

```typescript
// In Server Component or Server Action
import { auth, currentUser } from '@clerk/nextjs/server';

export default async function ProfilePage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/auth/sign-in');
  }
  
  const user = await currentUser();
  
  return (
    <div>
      <h1>Welcome, {user?.firstName}</h1>
      <p>{user?.primaryEmailAddress?.emailAddress}</p>
    </div>
  );
}
```

#### Protecting API Routes

```typescript
// src/app/api/applications/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Fetch user's applications
  const applications = await fetchApplications(userId);
  
  return NextResponse.json(applications);
}
```

### Client-Side Authentication

#### Using Auth Context

```typescript
'use client';

import { useUser, useAuth } from '@clerk/nextjs';

export function ProfileButton() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useAuth();
  
  if (!isLoaded || !isSignedIn) {
    return null;
  }
  
  return (
    <div>
      <p>{user.fullName}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

### Webhooks

Clerk can send webhooks for user events:

**Supported Events**:
- `user.created`
- `user.updated`
- `user.deleted`
- `session.created`
- `session.ended`

**Webhook Handler Example**:

```typescript
// src/app/api/webhooks/clerk/route.ts
import { headers } from 'next/headers';
import { Webhook } from 'svix';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!WEBHOOK_SECRET) {
    throw new Error('Missing webhook secret');
  }
  
  const headersList = await headers();
  const svix_id = headersList.get('svix-id');
  const svix_timestamp = headersList.get('svix-timestamp');
  const svix_signature = headersList.get('svix-signature');
  
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing headers', { status: 400 });
  }
  
  const payload = await req.json();
  const body = JSON.stringify(payload);
  
  const wh = new Webhook(WEBHOOK_SECRET);
  
  let evt;
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature
    });
  } catch (err) {
    return new Response('Invalid signature', { status: 400 });
  }
  
  const eventType = evt.type;
  
  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    
    // Create user in your database
    await createUserInDatabase({
      clerkId: id,
      email: email_addresses[0].email_address,
      firstName: first_name,
      lastName: last_name
    });
  }
  
  return new Response('OK', { status: 200 });
}
```

### User Metadata

Store custom data on user objects:

```typescript
import { clerkClient } from '@clerk/nextjs/server';

async function updateUserMetadata(userId: string) {
  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      organizationId: 'org_123',
      role: 'grant_manager'
    }
  });
}
```

---

## Future API Integrations

### Planned Integrations

1. **Database API** (Internal)
   - RESTful API for all CRUD operations
   - GraphQL endpoint for complex queries
   - WebSocket for real-time updates

2. **Document Storage** (S3/CloudFlare R2)
   - File upload endpoints
   - Signed URLs for secure access
   - CDN integration

3. **Email Service** (SendGrid/Resend)
   - Transactional emails
   - Notification digests
   - Template management

4. **Calendar Integration** (Google Calendar/Outlook)
   - Deadline synchronization
   - Meeting scheduling
   - Reminder creation

5. **AI/ML Services** (OpenAI/Anthropic)
   - Grant matching recommendations
   - Application assistance
   - Document analysis

### API Versioning Strategy

All internal APIs will follow semantic versioning:

```
/api/v1/applications
/api/v2/applications
```

---

## Development Resources

### Testing APIs

Use the provided `.http` files for testing (VS Code REST Client extension):

```http
### Search Programs
POST https://data-visualizer-agent-production.up.railway.app/program_finder/find_programs
Content-Type: application/json

{
  "query": "environmental conservation",
  "limit": 10
}
```

### API Documentation Tools

- **Postman Collection**: Available in `/docs/api/postman/`
- **OpenAPI Spec**: Coming soon
- **GraphQL Playground**: Coming soon

---

**Last Updated**: December 2024  
**Version**: 1.0.0
