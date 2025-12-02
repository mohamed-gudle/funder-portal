# Contributing to Funders Portal

> Development guidelines and workflows for contributors

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style & Standards](#code-style--standards)
- [Component Guidelines](#component-guidelines)
- [Git Workflow](#git-workflow)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js**: 18.x or higher (check `.nvmrc` for exact version)
- **Package Manager**: npm, yarn, pnpm, or bun
- **Git**: Latest version
- **Code Editor**: VS Code recommended (with suggested extensions)

### Initial Setup

1. **Fork the repository**

   Click the "Fork" button on GitHub to create your copy.

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/funders-portal.git
   cd funders-portal
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/ORIGINAL_ORG/funders-portal.git
   ```

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Set up environment**

   ```bash
   cp env.example.txt .env.local
   ```

   Fill in your development environment variables.

6. **Run development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

### Recommended VS Code Extensions

Install these extensions for the best development experience:

- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier** (`esbenp.prettier-vscode`)
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
- **TypeScript Error Translator** (`mattpocock.ts-error-translator`)
- **GitLens** (`eamodio.gitlens`)
- **Auto Rename Tag** (`formulahendry.auto-rename-tag`)

## Development Workflow

### Branch Strategy

We follow a simplified Git Flow:

```
main                 # Production-ready code
  ↓
development          # Integration branch
  ↓
feature/xxx          # New features
fix/xxx              # Bug fixes
docs/xxx             # Documentation updates
```

### Creating a Feature

1. **Update your local repository**

   ```bash
   git checkout development
   git pull upstream development
   ```

2. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**

   Follow our [Code Style Guidelines](#code-style--standards)

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

   See [Commit Messages](#commit-messages) for convention.

5. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**

   Open a PR from your fork to `upstream/development`

## Code Style & Standards

### TypeScript

- **Use TypeScript** for all new files
- **No `any` types** unless absolutely necessary
- **Define interfaces** for all props and data structures
- **Use type inference** where possible

```typescript
// ✅ Good
interface UserProps {
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
}

function UserCard({ name, email, role }: UserProps) {
  return <div>{name}</div>;
}

// ❌ Bad
function UserCard(props: any) {
  return <div>{props.name}</div>;
}
```

### File Naming

- **Components**: PascalCase (`UserProfile.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)
- **Hooks**: camelCase with `use` prefix (`useDebounce.ts`)

### Import Order

Organize imports in this order:

```typescript
// 1. React and Next.js
import { useState } from 'react';
import Link from 'next/link';

// 2. External libraries
import { z } from 'zod';
import { useForm } from 'react-hook-form';

// 3. Internal imports - absolute paths
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/use-debounce';

// 4. Relative imports
import { localHelper } from './utils';

// 5. Types
import type { User } from '@/types';
```

### Formatting

We use **Prettier** for consistent formatting:

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

**Prettier Config** (`.prettierrc`):
```json
{
  "semi": true,
  "trailingComma": "none",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

### Linting

We use **ESLint** for code quality:

```bash
# Run linter
npm run lint

# Auto-fix issues
npm run lint:fix

# Strict mode (no warnings)
npm run lint:strict
```

## Component Guidelines

### Server vs Client Components

**Default to Server Components:**

```tsx
// ✅ Server Component (default)
export default async function UserList() {
  const users = await fetchUsers(); // Server-side fetch
  return <div>{/* ... */}</div>;
}
```

**Use Client Components only when needed:**

```tsx
// ✅ Client Component (interactive)
'use client';

export function ThemeToggle() {
  const [theme, setTheme] = useState('light');
  return <button onClick={() => setTheme('dark')}>Toggle</button>;
}
```

### Component Structure

Follow this pattern for new components:

```tsx
/**
 * Brief description of component purpose
 */

// Imports
import { ComponentProps } from 'react';

// Types
interface MyComponentProps {
  title: string;
  description?: string;
  onAction?: () => void;
}

// Component
export function MyComponent({ 
  title, 
  description, 
  onAction 
}: MyComponentProps) {
  // Hooks
  const [state, setState] = useState();
  
  // Handlers
  const handleClick = () => {
    // logic
  };
  
  // Render
  return (
    <div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

// Default export if needed
export default MyComponent;
```

### Styling Guidelines

Use **Tailwind CSS** for styling:

```tsx
// ✅ Good - Tailwind utilities
<div className="flex items-center gap-4 rounded-lg bg-background p-4">
  <Button variant="default">Submit</Button>
</div>

// ✅ Good - Conditional classes with cn()
import { cn } from '@/lib/utils';

<div className={cn(
  "base-styles",
  isActive && "active-styles",
  variant === "primary" && "primary-styles"
)}>

// ❌ Bad - Inline styles
<div style={{ display: 'flex', padding: '16px' }}>
```

### Accessibility

Ensure components are accessible:

```tsx
// ✅ Good
<button
  aria-label="Close dialog"
  onClick={onClose}
>
  <XIcon />
</button>

<img 
  src="/logo.svg" 
  alt="Funders Portal Logo"
/>

// ❌ Bad
<button onClick={onClose}>
  <XIcon />
</button>

<img src="/logo.svg" />
```

## Git Workflow

### Commit Messages

Follow **Conventional Commits** specification:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Build process or auxiliary tool changes

**Examples:**

```bash
# Feature
git commit -m "feat(open-calls): add filter by deadline"

# Bug fix
git commit -m "fix(auth): resolve redirect loop on sign-in"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Breaking change
git commit -m "feat(api)!: change response format

BREAKING CHANGE: API responses now use camelCase"
```

### Pre-commit Hooks

Husky automatically runs checks before commits:

1. **Lint-staged** - Formats staged files
2. **ESLint** - Lints changed files
3. **TypeScript** - Type checks

If checks fail, fix issues before committing.

### Keeping Your Branch Updated

Regularly sync with upstream:

```bash
# Update development
git checkout development
git pull upstream development

# Rebase your feature branch
git checkout feature/your-feature
git rebase development

# Force push if already pushed
git push origin feature/your-feature --force-with-lease
```

## Pull Request Process

### Before Creating PR

- [ ] Code follows style guidelines
- [ ] All tests pass locally
- [ ] No linting errors
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation updated if needed
- [ ] Commit messages follow convention

### Creating the PR

1. **Title**: Use conventional commit format

   ```
   feat(billing): add subscription management
   ```

2. **Description**: Use the PR template

   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [x] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Testing
   - Tested locally on Chrome, Firefox, Safari
   - All existing tests pass
   - Added new tests for feature
   
   ## Screenshots (if applicable)
   [Add screenshots]
   
   ## Checklist
   - [x] Code follows style guidelines
   - [x] Self-reviewed code
   - [x] Commented complex code
   - [x] Updated documentation
   - [x] No new warnings
   - [x] Tests added/updated
   ```

3. **Assign Reviewers**: Request review from maintainers

4. **Link Issues**: Reference related issues

   ```
   Closes #123
   Related to #456
   ```

### Review Process

- Maintainers will review within 2-3 business days
- Address feedback promptly
- Push changes to the same branch
- Request re-review when ready

### After Approval

- Squash and merge (preferred)
- Delete branch after merge
- Pull latest changes to local

## Testing Guidelines

### Manual Testing

Test your changes thoroughly:

1. **Different screen sizes** - Mobile, tablet, desktop
2. **Different browsers** - Chrome, Firefox, Safari
3. **Edge cases** - Empty states, errors, loading states
4. **Accessibility** - Keyboard navigation, screen readers

### Writing Tests (Future)

When we add automated testing:

```typescript
// Example test structure
describe('UserCard', () => {
  it('renders user name', () => {
    // test implementation
  });
  
  it('handles click event', () => {
    // test implementation
  });
});
```

## Documentation

### Code Documentation

Add JSDoc comments for complex functions:

```typescript
/**
 * Formats a date for display in the UI
 * 
 * @param date - Date to format (Date object or ISO string)
 * @param format - Format string (default: 'MMM dd, yyyy')
 * @returns Formatted date string
 * 
 * @example
 * formatDate(new Date(), 'yyyy-MM-dd')
 * // => "2024-12-02"
 */
export function formatDate(
  date: Date | string, 
  format: string = 'MMM dd, yyyy'
): string {
  // implementation
}
```

### README Updates

Update documentation when:
- Adding new features
- Changing environment variables
- Modifying setup process
- Adding dependencies

### Architecture Documentation

Update `docs/ARCHITECTURE.md` for:
- New architectural patterns
- State management changes
- API integrations
- Data flow modifications

## Getting Help

- **Questions**: Open a [Discussion](https://github.com/your-org/funders-portal/discussions)
- **Bugs**: Create an [Issue](https://github.com/your-org/funders-portal/issues)
- **Security**: Email security@fundersportal.com

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Assume good intentions
- Report inappropriate behavior

---

## Quick Reference

### Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run format           # Format code
npm run format:check     # Check formatting

# Git
git checkout -b feature/name    # Create feature branch
git add .                       # Stage changes
git commit -m "message"         # Commit changes
git push origin branch-name     # Push to remote
```

### File Locations

```
Documentation:     /docs/
Components:        /src/components/
Features:          /src/features/
Utilities:         /src/lib/
Types:             /src/types/
Constants:         /src/constants/
```

---

Thank you for contributing to Funders Portal! 🎉

**Last Updated**: December 2024  
**Version**: 1.0.0
