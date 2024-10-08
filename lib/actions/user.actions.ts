'use server';
import { UserFriendType, UserType } from '@/types/user.types';
import { createClient_server } from '../supabase/server';
import { getLoggedInUser } from './login.actions';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { revalidate } from '../revalidation';
import sharp from 'sharp';
import { cookies } from 'next/headers';

export const getUser = async (id: string) => {
  try {
    const supabase = await createClient_server();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (data === null)
      return {
        id: '',
        email: '',
        first_name: 'User no longer exists',
        last_name: '',
        native_language: '',
        image: null,
        status: false,
      };

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

    await deleteConversation(friendId);

    revalidatePath('/dashboard', 'layout');
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
  return redirect('/dashboard');
};

// TODO: Fix the logic for deleting a conversation? Right now it's deleting all conversations between the two users.
export const deleteConversation = async (
  friendId: string,
  revalidate_path = '/dashboard'
) => {
  let isError = false;
  try {
    const user = await getLoggedInUser();
    const supabase = await createClient_server();
    const { error } = await supabase
      .from('conversations')
      .delete()
      .contains('user_ids', [user.id, friendId]);

    if (error) throw new Error(error.message);
  } catch (e: any) {
    isError = true;
    console.error(e);
    throw new Error(e.message);
  }
  if (!isError) {
    revalidate(revalidate_path, 'layout');
  }
};

export const updateAccount = async (formData: FormData) => {
  try {
    const user = await getLoggedInUser();
    const supabase = await createClient_server();

    let image = (formData.get('image') as File) || null;
    const password = (formData.get('password') as string) || null;
    const email = formData.get('email') as string;
    const native_language = formData.get('nativeLanguage') as string;

    if (!isNaN(Number(native_language))) {
      await supabase
        .from('users')
        .update({
          native_language: Number(native_language),
        })
        .eq('id', user.id);
    }

    // Update the user's password
    if (password) {
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      await supabase.auth.updateUser({ password });
    }

    // Update the user's image
    if (image) {
      if (image.size > 1024 * 1024 * 2) {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const compressedImage = await sharp(buffer).resize(200, 200).toBuffer();
        image = new File([compressedImage], image.name, { type: image.type });
      }

      const { error } = await supabase.storage
        .from('avatars')
        .upload(`images/${user.id}.${image.type.split('/')[1]}`, image, {
          upsert: true,
        });

      if (error) throw new Error(error.message);

      const { data: fileData } = await supabase.storage
        .from('avatars')
        .getPublicUrl(`images/${user.id}.${image.type.split('/')[1]}`);

      if (!fileData) throw new Error('Error uploading image');

      await supabase
        .from('users')
        .update({ image: fileData.publicUrl })
        .eq('id', user.id);
    }

    if (email !== user.email) {
      await supabase.auth.updateUser({ email });
    }

    await supabase
      .from('users')
      .update({
        first_name: formData.get('firstName') as string,
        last_name: formData.get('lastName') as string,
      })
      .eq('id', user.id);

    revalidatePath('/dashboard', 'layout');
  } catch (e: any) {
    console.log(e);
    throw new Error(e.message);
  }
};

export const deleteAccount = async () => {
  const cookieStore = cookies();
  try {
    // Get the cookies
    // Get the auth logged in user
    const supabase = await createClient_server();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not found');
    // Get the user's data
    const { data: LoggedInUser, error: loggedInError } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .limit(1)
      .single();

    // Error handling
    if (loggedInError) throw new Error(loggedInError.message);
    const { error } = await supabase.auth.admin.deleteUser(user.id!);
    if (error) throw new Error(error.message);

    // Delete the user's friendships
    const { error: friendShipError } = await supabase
      .from('friendships')
      .delete()
      .contains('users', [LoggedInUser.id]);

    if (friendShipError) throw new Error(friendShipError.message);

    // Delete the user from DB
    const { error: userError } = await supabase
      .from('users')
      .delete()
      .eq('email', user.email);

    if (userError) throw new Error(userError.message);

    // Delete the user's cookies
    cookieStore.getAll().forEach((cookie) => {
      cookieStore.delete(cookie.name);
    });
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
  return redirect('/');
};
