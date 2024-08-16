'use server';

import { UserFriendType, UserType } from '@/types/user.types';
import { createClient_server } from '../supabase/server';
import { getLoggedInUser } from './login.actions';

export const getUserFriends = async () => {
  try {
    const user = await getLoggedInUser();
    const supabase = await createClient_server();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .in('id', user.friends);

    if (error) throw new Error(error.message);

    console.log(data);

    return (data as UserFriendType[]) || [];
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
};

export const addNewFriend = async (id: number) => {
  try {
    const user = await getLoggedInUser();
    const supabase = await createClient_server();
    const { data: friend, error: friendError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (friendError) throw new Error(friendError.message);
    user.friends.push(friend.id);

    const { data, error } = await supabase
      .from('users')
      .update({ friends: user.friends })
      .eq('id', user.id);

    if (error) throw new Error(error.message);

    return data;
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
};

export const getUser = async (id: string) => {
  try {
    const supabase = await createClient_server();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);

    const resObj: UserFriendType = {
      id: data.id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      native_language: data.native_language,
      image: data.image,
      status: data.status,
    };

    return resObj;
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
};
