import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Default_Page() {
  const session = await getServerSession();

  if (!session) {
    return redirect('/auth');
  }

  if (session) {
    return redirect('/dashboard');
  }

  return null;
}
