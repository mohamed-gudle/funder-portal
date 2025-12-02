# Features Guide

> Comprehensive guide to all features in Funders Portal

## Table of Contents

- [Overview](#overview)
- [Funding Application Management](#funding-application-management)
- [Bilateral Engagements](#bilateral-engagements)
- [Opportunity Discovery](#opportunity-discovery)
- [Team Management](#team-management)
- [Analytics Dashboard](#analytics-dashboard)
- [User Profile & Settings](#user-profile--settings)

## Overview

Funders Portal provides a complete suite of tools for managing the entire funding lifecycle—from discovering opportunities to securing partnerships and tracking outcomes.

## Funding Application Management

### Overview

The Open Calls module helps organizations track available funding opportunities, manage application submissions, and monitor progress through the application lifecycle.

### Key Capabilities

#### 1. Open Calls Listing

**Purpose**: View and manage all active funding calls in one place.

**Features**:
- **Search & Filter** - Find calls by keyword, category, or status
- **Sorting** - Order by deadline, amount, or relevance
- **Pagination** - Efficiently browse large datasets
- **Quick Actions** - View, edit, or delete calls directly from the list

**Navigation**: Dashboard → Open Calls

#### 2. Call Details

**Purpose**: View comprehensive information about a funding opportunity.

**Information Displayed**:
- Funding organization details
- Grant amount and type
- Eligibility requirements
- Application deadlines
- Required documents
- Contact information
- Application guidelines

#### 3. Application Submission

**Purpose**: Submit applications for funding calls.

**Workflow**:
1. Select an open call
2. Fill out application form
3. Upload required documents
4. Review submission
5. Submit application
6. Track application status

**Form Validation**:
- Required field checking
- File type and size validation
- Data format verification
- Real-time error feedback

#### 4. Status Tracking

**Application Statuses**:
- `Draft` - Application in progress
- `Submitted` - Application sent for review
- `Under Review` - Being evaluated
- `Approved` - Application approved
- `Rejected` - Application declined
- `Awarded` - Grant awarded

**Status Updates**:
- Automatic notifications on status changes
- Timeline view of application progress
- Notes and feedback from reviewers

### Use Cases

1. **Grant Manager**: Track all available funding opportunities
2. **Researcher**: Submit research funding applications
3. **Nonprofit**: Apply for program funding
4. **Team Leader**: Monitor team's application portfolio

---

## Bilateral Engagements

### Overview

The Bilateral Engagements module enables organizations to build and maintain relationships with funding partners through structured engagement tracking.

### Key Capabilities

#### 1. Engagement Listing

**Purpose**: Manage all partnership relationships in one dashboard.

**Features**:
- **Relationship Timeline** - View engagement history
- **Status Tracking** - Monitor relationship stages
- **Contact Management** - Store partner contact information
- **Activity Log** - Record all interactions
- **Reminder System** - Schedule follow-ups

**Navigation**: Dashboard → Bilateral Engagements

#### 2. Engagement Types

**Supported Engagement Types**:
- Initial contact and introduction
- Exploratory discussions
- Proposal submission
- Negotiation phase
- Active partnership
- Renewal discussions

#### 3. Communication Tracking

**Purpose**: Keep a complete record of all partnership communications.

**Tracked Information**:
- Meeting notes
- Email correspondence
- Phone call summaries
- Document exchanges
- Decision points
- Action items

#### 4. Pipeline Management

**Purpose**: Visualize and manage engagement progression.

**Pipeline Stages**:
1. **Identified** - Potential partner identified
2. **Contacted** - Initial outreach made
3. **Engaged** - Active discussions
4. **Negotiating** - Terms being discussed
5. **Partnership** - Active partnership
6. **Renewed** - Partnership renewed

**Kanban Board**: Drag-and-drop interface for moving engagements through stages.

#### 5. Relationship Scoring

**Purpose**: Prioritize partnerships based on strategic fit and likelihood.

**Scoring Criteria**:
- Alignment with mission
- Funding amount potential
- Partnership stage
- Historical success rate
- Engagement frequency

### Use Cases

1. **Partnership Manager**: Cultivate funder relationships
2. **Executive Director**: Oversee strategic partnerships
3. **Development Officer**: Track donor engagement
4. **Program Manager**: Coordinate bilateral projects

---

## Opportunity Discovery

### Overview

The Opportunities module integrates with external funding databases to help organizations discover new funding programs that match their needs.

### Key Capabilities

#### 1. Program Finder Integration

**Purpose**: Search comprehensive databases of funding opportunities.

**API Integration**:
```
Endpoint: https://data-visualizer-agent-production.up.railway.app/program_finder/find_programs
Method: POST
```

**Search Capabilities**:
- Keyword search across programs
- Category and sector filters
- Geographic scope filtering
- Funding amount ranges
- Eligibility criteria matching
- Deadline filtering

#### 2. Smart Filtering

**Filter Categories**:
- **Funding Type**: Grants, loans, equity, prizes
- **Sector**: Education, health, environment, technology
- **Geography**: Local, national, international
- **Amount**: Minimum and maximum funding
- **Deadline**: Date ranges
- **Eligibility**: Organization type, size, location

#### 3. Results Display

**Information Shown**:
- Program name and description
- Funding organization
- Award amount and type
- Application deadline
- Eligibility summary
- Application link
- Match score (based on criteria)

#### 4. Saved Searches

**Purpose**: Save and reuse search criteria.

**Features**:
- Name and save searches
- Schedule automatic searches
- Receive notifications of new matches
- Share searches with team members

#### 5. Opportunity Tracking

**Purpose**: Monitor and manage discovered opportunities.

**Actions**:
- Add to watchlist
- Share with team
- Create reminders
- Export to calendar
- Mark as applied/not interested

### Use Cases

1. **Grant Writer**: Find matching funding opportunities
2. **Research Office**: Discover research funding
3. **Nonprofit Director**: Identify program support
4. **Innovation Manager**: Find startup funding

---

## Team Management

### Overview

The Team module provides tools for managing team members, assigning roles, and coordinating collaboration on funding activities.

### Key Capabilities

#### 1. Team Member Management

**Purpose**: Manage who has access to the organization's funding portal.

**Features**:
- **Invite Members** - Send email invitations
- **Role Assignment** - Define permissions
- **Profile Management** - Update member details
- **Deactivation** - Remove team access

**Navigation**: Dashboard → Team

#### 2. Role-Based Access Control

**Roles** (Powered by Clerk):

| Role | Permissions |
|------|------------|
| **Owner** | Full access, billing, team management |
| **Admin** | Manage all features, invite users |
| **Member** | Create/edit applications, view engagements |
| **Viewer** | Read-only access to all data |

#### 3. Activity Tracking

**Purpose**: Monitor team member activities and contributions.

**Tracked Activities**:
- Applications created/submitted
- Engagements added/updated
- Documents uploaded
- Comments and notes
- Last login time
- Active projects

#### 4. Collaboration Tools

**Features**:
- **Comments** - Discuss applications and engagements
- **Mentions** - Notify specific team members (@username)
- **Assignments** - Assign tasks to team members
- **Notifications** - Stay updated on team activities

#### 5. Team Analytics

**Metrics**:
- Total applications by member
- Success rate per member
- Workload distribution
- Response time metrics
- Collaboration frequency

### Use Cases

1. **Project Manager**: Coordinate team efforts
2. **Department Head**: Monitor team performance
3. **Administrator**: Manage user access
4. **Collaborator**: Work with teammates

---

## Analytics Dashboard

### Overview

The Overview module provides visual insights into funding activities, success rates, and organizational performance.

### Key Capabilities

#### 1. Key Metrics

**Primary KPIs**:
- Total applications submitted
- Success rate (%)
- Total funding secured
- Active partnerships
- Pipeline value
- Average application time

#### 2. Visualizations

**Chart Types**:

##### Area Chart - Application Trends
- Applications over time
- Success vs rejection rates
- Monthly/quarterly trends

##### Bar Chart - Funding by Category
- Funding amount by sector
- Applications by type
- Success rate by category

##### Pie Chart - Portfolio Distribution
- Applications by status
- Funding by source
- Engagements by stage

##### Recent Activity
- Latest applications
- Recent engagements
- Upcoming deadlines
- Team activities

#### 3. Parallel Routes Architecture

The dashboard uses Next.js parallel routes for optimal performance:
```
overview/
├── layout.tsx          # Coordinates parallel loading
├── @area_stats/        # Area chart (loads independently)
├── @bar_stats/         # Bar chart (loads independently)
├── @pie_stats/         # Pie chart (loads independently)
└── @sales/             # Recent activity (loads independently)
```

**Benefits**:
- Simultaneous data loading
- Independent error handling
- Streaming UI updates
- Improved perceived performance

#### 4. Custom Date Ranges

**Purpose**: Analyze data for specific time periods.

**Options**:
- Last 7 days
- Last 30 days
- Last quarter
- Last year
- Custom date range

#### 5. Export & Reporting

**Purpose**: Generate reports for stakeholders.

**Export Formats**:
- PDF reports
- Excel spreadsheets
- CSV data exports
- Presentation slides

**Report Types**:
- Executive summary
- Detailed activity report
- Financial summary
- Team performance report

### Use Cases

1. **Executive**: Monitor organizational performance
2. **Board Member**: Review funding success
3. **Grant Manager**: Analyze application trends
4. **Finance Officer**: Track funding sources

---

## User Profile & Settings

### Overview

Powered by Clerk, the profile module provides comprehensive user account management.

### Key Capabilities

#### 1. Profile Management

**Editable Fields**:
- Name and photo
- Email address
- Phone number
- Job title
- Organization
- Timezone

#### 2. Security Settings

**Features**:
- Password management
- Two-factor authentication (2FA)
- Passwordless authentication
- Social login connections
- Active sessions management
- Login history

#### 3. Notification Preferences

**Notification Types**:
- Email notifications
- In-app notifications
- Browser push notifications
- SMS alerts (if enabled)

**Notification Categories**:
- Application status updates
- Engagement reminders
- Team mentions
- Deadline alerts
- System announcements

#### 4. Account Settings

**Options**:
- Language preference
- Theme selection (light/dark/system)
- Date format
- Data export request
- Account deletion

### Use Cases

1. **Individual User**: Manage personal settings
2. **Security Officer**: Configure security options
3. **Admin**: Oversee organization accounts

---

## Keyboard Shortcuts (Cmd+K)

The application includes a command palette for quick navigation:

**Access**: Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux)

**Common Commands**:
- `d d` - Go to Dashboard
- `o c` - Go to Open Calls
- `b e` - Go to Bilateral Engagements
- `o p` - Go to Opportunities
- `t m` - Go to Team

---

## Mobile Experience

All features are fully responsive and optimized for mobile devices:
- Touch-friendly interfaces
- Mobile-optimized tables
- Responsive navigation
- Offline support (upcoming)
- Progressive Web App (PWA) capabilities

---

**Last Updated**: December 2024  
**Version**: 1.0.0
