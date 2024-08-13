import { createClient_server } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Root_Page() {
  const supabase = await createClient_server();

  const { data, error } = await supabase.auth.getUser();

  if (data) {
    return redirect('/dashboard');
  } else {
    return redirect('/auth');
  }
}
