'use server';
import { UserFriendType, UserType } from '@/types/user.types';
import { createClient_server } from '../supabase/server';
import { getLoggedInUser } from './login.actions';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const getUser = async (id: string) => {
  try {
    const supabase = await createClient_server();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);

    const { data: native_language, error: native_error } = await supabase
      .from('languages')
      .select('*')
      .eq('id', data.native_language)
      .single();

    if (native_error) throw new Error(native_error.message);

    const resObj: UserFriendType = {
      id: data.id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      native_language: native_language.language,
      image: data.image,
      status: data.status,
    };

    return resObj;
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
};

export const getUserFriends = async () => {
  try {
    const user = await getLoggedInUser();

    const supabase = await createClient_server();
    const { data: friends, error } = await supabase
      .from('friendships')
      .select('*')
      .contains('users', [user.id])
      .eq('status', 'accepted');

    if (error) throw new Error(error.message);

    if (!friends || !friends.length) return [];

    const friendIds = friends?.map((row) => {
      if (row.users[0] === user.id) return row.users[1];
      return row.users[0];
    });
    const { data: users, error: userError } = (await supabase
      .from('users')
      .select('*')
      .in('id', friendIds)) as { data: UserType[]; error: any };

    if (userError) throw new Error(userError.message);

    return users as UserType[];
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
};

export const addFriend = async (friendId: string) => {
  try {
    const user = await getLoggedInUser();
    const supabase = await createClient_server();

    const { data: existingFriendship, error: checkError } = await supabase
      .from('friendships')
      .select('*')
      .contains('users', [user.id, friendId])
      .eq('status', 'pending');

    if (checkError) throw new Error(checkError.message);

    if (existingFriendship && existingFriendship.length > 0) {
      throw new Error('You are already friends with this user.');
    }

    const { data, error } = await supabase.from('friendships').insert([
      {
        users: [user.id, friendId],
        status: 'pending',
        sender_id: user.id,
      },
    ]);

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/addNewFriend', 'layout');

    return data;
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
};

export const searchUsers = async (name: string) => {
  try {
    const supabase = await createClient_server();
    const user = await getLoggedInUser();

    // Step 1: Get the user's friends
    const { data: friendsData, error: friendsError } = await supabase
      .from('friendships')
      .select('*')
      .contains('users', [user.id])
      .or(`status.eq.accepted, status.eq.pending`); // Include friends and pending requests

    if (friendsError) throw new Error(friendsError.message);

    const friendIds = friendsData?.map((row) => {
      if (row.users[0] === user.id) return row.users[1];
      return row.users[0];
    });

    let { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`first_name.ilike.%${name}%,last_name.ilike.%${name}%`)
      .neq('id', user.id);

    if (error) throw new Error(error.message);

    if (friendIds && friendIds.length) {
      data = data?.filter((user) => !friendIds.includes(user.id)) as UserType[];
    }

    return (data as UserType[]) || [];
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
};

export const getFriendRequests = async () => {
  try {
    const user = await getLoggedInUser();
    const supabase = await createClient_server();
    const { data, error } = await supabase
      .from('friendships')
      .select('*')
      .contains('users', [user.id])
      .eq('status', 'pending')
      .neq('sender_id', user.id);

    if (error) throw new Error(error.message);
    if (!data || !data.length) return [];

    const friendIds = data.map((row) => {
      if (row.users[0] === user.id) return row.users[1];
      return row.users[0];
    });
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*')
      .in('id', friendIds);

    if (userError) throw new Error(userError.message);

    return users as UserType[];
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
};

export const acceptFriendRequest = async (friendId: string, status: string) => {
  try {
    const user = await getLoggedInUser();
    const supabase = await createClient_server();

    if (status === 'rejected') {
      const { data, error } = await supabase
        .from('friendships')
        .delete()
        .contains('users', [user.id, friendId])
        .eq('status', 'pending')
        .select();

      if (error) throw new Error(error.message);

      revalidatePath('/dashboard', 'layout');

      return data;
    }

    const { data, error } = await supabase
      .from('friendships')
      .update({ status: status })
      .contains('users', [user.id, friendId])
      .select();

    if (error) throw new Error(error.message);
    if (!data || !data.length)
      throw new Error('Error accepting friend request.');

    revalidatePath('/dashboard', 'layout');

    return data;
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
};

export const removeFriend = async (friendId: string) => {
  try {
    const user = await getLoggedInUser();
    const supabase = await createClient_server();

    const { data, error } = await supabase
      .from('friendships')
      .delete()
      .contains('users', [user.id, friendId])
      .eq('status', 'accepted');

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard', 'layout');
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
  return redirect('/dashboard');
};
