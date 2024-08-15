'use server';

import { UserFriendType } from '@/types/user.types';
import { createClient_server } from '../supabase/server';
import { getLoggedInUser } from './login.actions';

export const getUserFriends = async () => {
  try {
    const user = await getLoggedInUser();
    const supabase = await createClient_server();
    const { data, error } = await supabase
      .from('users')
      .select('friends')
      .eq('id', user?.id)
      .single();

    if (error) throw new Error(error.message);

    return (data.friends as UserFriendType[]) || [];
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
};
