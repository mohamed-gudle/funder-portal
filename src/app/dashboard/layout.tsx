import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return redirect('/auth/sign-in');
  }

  // @ts-ignore
  if (!session.user.emailVerified) {
    // Redirect to a specific "check your email" page or re-use verify-email with a query param
    // But verify-email expects a token. Let's create specific view or simple error page.
    // For now, let's redirect to a simple static page or use verify-email with no token for messaging.
    // We can also just redirect to verify-email but maybe need better UX.
    // Let's create a dedicated unverified page or re-purpose verify-email logic.
    // Actually, verify-email handles "no token" with error.
    // Let's query db directly here to be safer or trust session if populated?
    // better-auth session usually just has id/email/name.
    // We added the field to user, NOT session. If we fetch session, it fetches user data often.
    // BUT we need to be sure.
    // For now assuming session user object has it if we extend type or it's standard.
    // My previous assumption was I need to add it to session hook.
    // But let's check it. If session.user.emailVerified is missing, we might loop.
    // Let's do a DB lookup here since it's a server component layout (run once per nav).
  }

  // Actually, let's do safe DB lookup to be sure until we fix session type config.
  const { MongoClient, ObjectId } = await import('mongodb');
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  const db = client.db();
  const user = await db
    .collection('user')
    .findOne({ _id: new ObjectId(session.user.id) });
  await client.close();

  if (user && !user.emailVerified) {
    // Create a check-email page or use verify-email?
    // Let's redirect to /check-email
    return redirect('/check-email');
  }

  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          {/* page main content */}
          {children}
          {/* page main content ends */}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
