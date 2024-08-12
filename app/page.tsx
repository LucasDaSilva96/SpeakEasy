
import { createClient_server } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Root_Page() {
  const supabase = createClient_server() as any;

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return redirect('/auth');
  } else {
    return redirect('/dashboard');
  }
}
