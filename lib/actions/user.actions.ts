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

export const getUserFriends = async () => {
  try {
    const user = await getLoggedInUser();
    const supabase = await createClient_server();
    const { data: friends, error } = await supabase
      .from('friendships')
      .select('*')
      .or(`user_id.eq.${user.id},or(friend_id.eq.${user.id})`)
      .eq('status', 'accepted');

    if (error) throw new Error(error.message);

    if (!friends || !friends.length) return [];

    const friendsIds = friends.map((friend) => {
      if (friend.user_id === user.id) return friend.friend_id;
      return friend.user_id;
    });
    const { data: users, error: userError } = (await supabase
      .from('users')
      .select('*')
      .in('id', friendsIds)) as { data: UserType[]; error: any };

    if (userError) throw new Error(userError.message);

    return users;
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
      .or(
        `user_id.eq.${user.id},friend_id.eq.${friendId}),or(user_id.eq.${friendId},friend_id.eq.${user.id})`
      )
      .eq('status', 'accepted');

    if (checkError) {
      console.error('Error checking existing friendship:', checkError);
      return null;
    }

    if (existingFriendship && existingFriendship.length > 0) {
      console.log('Friendship already exists.');
      return null;
    }

    const { data, error } = await supabase.from('friendships').insert([
      {
        user_id: user.id,
        friend_id: friendId,
        status: 'pending',
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
      .or(`user_id.eq.${user.id},or(friend_id.eq.${user.id})`)
      .eq('status', 'accepted');

    if (friendsError) throw new Error(friendsError?.message);

    // Combine friend IDs from both directions
    const friendIds = friendsData.map((f) => {
      if (f.user_id === user.id) return f.friend_id;
      return f.user_id;
    });

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`first_name.ilike.%${name}%,last_name.ilike.%${name}%`)
      .not('id', 'in', `(${friendIds.join(',')})`); // Exclude friends;

    if (error) throw new Error(error.message);
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
      .or(`user_id.eq.${user.id},or(friend_id.eq.${user.id})`)
      .eq('status', 'pending');

    if (error) throw new Error(error.message);
    if (!data || !data.length) return [];

    const friendIds = data.map((f) => {
      if (f.user_id === user.id) return f.friend_id;
      return f.user_id;
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
        .or(
          `user_id.eq.${user.id},friend_id.eq.${friendId},or(user_id.eq.${friendId},friend_id.eq.${user.id})`
        )
        .eq('status', 'pending');

      if (error) throw new Error(error.message);

      revalidatePath('/dashboard', 'layout');

      return data;
    }

    const { data, error } = await supabase
      .from('friendships')
      .update({ status: status })
      .or(
        `user_id.eq.${user.id},friend_id.eq.${friendId},or(user_id.eq.${friendId},friend_id.eq.${user.id})`
      );

    if (error) throw new Error(error.message);

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
      .or(
        `user_id.eq.${user.id},friend_id.eq.${friendId},or(user_id.eq.${friendId},friend_id.eq.${user.id})`
      )
      .eq('status', 'accepted');

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard', 'layout');
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
  return redirect('/dashboard');
};
