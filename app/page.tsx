import { createClient_browser } from '@/lib/supabase/client';
import { redirect } from 'next/navigation';
import toast from 'react-hot-toast';

export default async function Root_Page() {
  const supabase = createClient_browser();

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    toast.error(error.message);
    return redirect('/auth');
  }

  if (data.session) {
    return redirect('/dashboard');
  } else {
    return redirect('/auth');
  }
}
