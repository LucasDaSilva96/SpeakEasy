import NextAuthProvider from '@/components/NextAuthProvider';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session) {
    return redirect('/auth');
  }
  return (
    <section>
      <NextAuthProvider session={session}>{children}</NextAuthProvider>
    </section>
  );
}
