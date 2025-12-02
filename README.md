# Funders Portal

> A comprehensive platform for organizations to manage funding applications, bilateral engagements, and discover new opportunities.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)

## 🎯 Overview

**Funders Portal** is a modern, feature-rich platform designed to streamline the entire funding lifecycle for organizations. Whether you're managing grant applications, tracking bilateral partnerships, or discovering new funding opportunities, Funders Portal provides the tools you need to succeed.

Built with cutting-edge technologies including Next.js 16, React 19, and Tailwind CSS 4, the platform offers a seamless, responsive experience optimized for modern workflows.

### Key Capabilities

- **📋 Funding Application Management** - Track open calls, manage submissions, and monitor application status
- **🤝 Bilateral Engagement Tracking** - Maintain relationships with funders and track partnership conversations
- **🔍 Opportunity Discovery** - Search and discover new funding programs tailored to your organization
- **👥 Team Collaboration** - Coordinate team efforts with role-based access control
- **📊 Analytics Dashboard** - Visualize your funding pipeline and engagement metrics
- **🔐 Secure Authentication** - Enterprise-grade authentication powered by Clerk

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (recommended: use the version specified in `.nvmrc`)
- npm, yarn, pnpm, or bun package manager
- A Clerk account for authentication ([Sign up here](https://clerk.com))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/funders-portal.git
   cd funders-portal
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example.txt .env.local
   ```

   Then edit `.env.local` with your configuration:

   ```env
   # Application
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Sentry Error Tracking (Optional)
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
   NEXT_PUBLIC_SENTRY_ORG=your_org
   NEXT_PUBLIC_SENTRY_PROJECT=your_project
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- **[Architecture Overview](./docs/ARCHITECTURE.md)** - System design and technical architecture
- **[Features Guide](./docs/FEATURES.md)** - Detailed feature descriptions and usage
- **[API Documentation](./docs/API_DOCUMENTATION.md)** - External API integrations
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment instructions
- **[Contributing](./docs/CONTRIBUTING.md)** - Development guidelines and workflows

## 🏗️ Tech Stack

### Core Framework
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript 5.7](https://www.typescriptlang.org/)** - Type safety

### Styling & UI
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Shadcn UI](https://ui.shadcn.com/)** - Re-usable component library
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible components
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[Motion](https://motion.dev/)** - Animation library

### State & Data Management
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[React Hook Form](https://react-hook-form.com/)** - Form handling
- **[Zod](https://zod.dev/)** - Schema validation
- **[Nuqs](https://nuqs.47ng.com/)** - Type-safe URL search params
- **[TanStack Table](https://tanstack.com/table/)** - Powerful table component

### Authentication & Monitoring
- **[Clerk](https://clerk.com/)** - Authentication and user management
- **[Sentry](https://sentry.io/)** - Error tracking and monitoring

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[lint-staged](https://github.com/okonet/lint-staged)** - Pre-commit linting

## 📁 Project Structure

```
funders-portal/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Authentication routes
│   │   ├── dashboard/           # Dashboard routes
│   │   │   ├── open-calls/      # Open funding calls
│   │   │   ├── bilateral-engagements/  # Partnership tracking
│   │   │   ├── opportunities/   # Funding discovery
│   │   │   ├── team/            # Team management
│   │   │   └── overview/        # Analytics dashboard
│   │   ├── layout.tsx           # Root layout
│   │   └── sitemap.ts           # Dynamic sitemap
│   │
│   ├── components/              # Shared components
│   │   ├── ui/                  # UI primitives (Shadcn)
│   │   ├── layout/              # Layout components
│   │   └── forms/               # Form components
│   │
│   ├── features/                # Feature modules
│   │   ├── open-calls/          # Open calls feature
│   │   ├── bilateral-engagements/  # Bilateral feature
│   │   ├── opportunities/       # Opportunities feature
│   │   └── team/                # Team feature
│   │
│   ├── lib/                     # Core utilities
│   │   ├── metadata.ts          # SEO metadata utilities
│   │   ├── utils.ts             # Helper functions
│   │   └── searchparams.ts      # Search params cache
│   │
│   ├── hooks/                   # Custom React hooks
│   ├── stores/                  # Zustand stores
│   ├── types/                   # TypeScript types
│   └── constants/               # App constants
│
├── public/                      # Static assets
├── docs/                        # Documentation
└── .github/                     # GitHub configuration

```

## 🎨 Key Features

### Funding Application Management
Manage the complete lifecycle of funding applications from discovery to award. Track open calls, submit applications, monitor review status, and manage required documentation.

### Bilateral Engagement Tracking
Build and maintain relationships with funding partners. Track conversations, schedule follow-ups, and monitor engagement progression through customizable pipelines.

### Opportunity Discovery
Discover funding opportunities using our integrated Program Finder. Search across multiple funding sources, filter by criteria, and receive personalized recommendations.

### Team Collaboration
Invite team members, assign roles, and collaborate on applications. Track team activity and ensure everyone stays aligned on funding priorities.

### Analytics & Insights
Visualize your funding pipeline with beautiful dashboards. Track metrics including application success rates, funding received, and partnership health.

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Building
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint  
npm run lint:fix     # Fix linting issues
npm run lint:strict  # Strict linting with warnings as errors
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Git Hooks
npm run prepare      # Set up Husky git hooks
```

## 🌍 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Required
NEXT_PUBLIC_APP_URL=                    # Your application URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=      # Clerk publishable key
CLERK_SECRET_KEY=                       # Clerk secret key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up

# Optional - Error Tracking
NEXT_PUBLIC_SENTRY_DSN=                 # Sentry DSN
NEXT_PUBLIC_SENTRY_ORG=                 # Sentry organization
NEXT_PUBLIC_SENTRY_PROJECT=             # Sentry project
# Set to "true" to disable Sentry
NEXT_PUBLIC_SENTRY_DISABLED=false
```

See `env.example.txt` for a complete list of environment variables.

## 🚢 Deployment

We recommend deploying to [Vercel](https://vercel.com) for the best Next.js experience:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/funders-portal)

For detailed deployment instructions, see [DEPLOYMENT.md](./docs/DEPLOYMENT.md).

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run tests and linting: `npm run lint`
4. Commit with conventional commits: `git commit -m "feat: add new feature"`
5. Push and create a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [next-shadcn-dashboard-starter](https://github.com/Kiranism/next-shadcn-dashboard-starter) template
- UI components from [Shadcn UI](https://ui.shadcn.com/)
- Authentication by [Clerk](https://clerk.com/)

## 📞 Support

- 📧 Email: support@fundersportal.com
- 💬 Discussions: [GitHub Discussions](https://github.com/your-org/funders-portal/discussions)
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/funders-portal/issues)

---

<p align="center">Made with ❤️ by the Funders Portal Team</p>
