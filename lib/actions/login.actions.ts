'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient_server } from '../supabase/server';
import { UserType } from '@/types/user.types';

// Login
export async function login(formData: FormData) {
  const supabase = await createClient_server();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error, data: userData } = await supabase.auth.signInWithPassword(
    data
  );

  await supabase.from('users').update({ status: true }).eq('email', data.email);

  if (error) throw new Error(error.message!);

  revalidatePath('/', 'layout');
  return redirect('/dashboard');
}

// Signup
export async function signup(formData: FormData) {
  const supabase = await createClient_server();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    passwordConfirm: formData.get('passwordConfirm') as string,
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    nativeLanguage: formData.get('nativeLanguage') as string,
  };
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          native_language: data.nativeLanguage,
        },
      ]);

    if (userError && userError.code === '23505')
      throw new Error('Email already exists');
    if (userError) throw new Error(userError.message);

    const { data: res, error } = await supabase.auth.signUp(data);
    if (error) throw new Error(error.message);

    revalidatePath('/', 'layout');
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
  return redirect('/auth');
}

export async function logout() {
  try {
    const supabase = await createClient_server();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase
      .from('users')
      .update({ status: false })
      .eq('email', user?.email);
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
  } catch (e) {
    console.error(e);
    throw new Error('Error logging out');
  }
  return redirect('/auth');
}

// Generate reset password link
export const generateResetPasswordLinkToEmail = async (email: string) => {
  try {
    if (!email) throw new Error('Email is required');
    const supabase = await createClient_server();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_HOST_URL}/reset-password`,
    });
    if (error) throw new Error(error.message);
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
};

// Reset password
export const resetPassword = async (password: string, code: string) => {
  try {
    if (!password) throw new Error('Password is required');
    // 1. Connect to Supabase
    const supabase = await createClient_server();
    // 2. Exchange the code in the URL for a session
    const { data: DATA, error: ERROR } =
      await supabase.auth.exchangeCodeForSession(code);
    // 3. Update the user's password
    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    if (error) throw new Error(error.message);
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
  return redirect('/auth');
};

export const getLoggedInUser = async () => {
  try {
    const supabase = await createClient_server();
    const { data, error } = await supabase.auth.getUser();
    if (error) throw new Error(error.message);
    let { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', data?.user?.email)
      .single();
    if (userError) throw new Error(userError.message);
    if (!userData) throw new Error('User not found');
    const { data: native_language, error: native_error } = await supabase
      .from('languages')
      .select('*')
      .eq('id', userData.native_language)
      .single();

    if (native_error) throw new Error(native_error.message);
    userData.native_language = native_language;
    return userData as UserType;
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
};
