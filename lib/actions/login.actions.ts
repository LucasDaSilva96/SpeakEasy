'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient_server } from '../supabase/server';

// Login
export async function login(formData: FormData) {
  const supabase = await createClient_server();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

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
    await supabase.auth.signUp(data);
    revalidatePath('/', 'layout');
  } catch (error) {
    console.log(error);
    throw new Error('Error signing up');
  }
  return redirect('/auth');
}

export async function logout() {
  try {
    const supabase = await createClient_server();
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
