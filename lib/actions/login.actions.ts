'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient_server } from '../supabase/server';


export async function login(formData: FormData) {
  const supabase = createClient_server();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const supabase = createClient_server();

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
}

export async function logout() {
  try {
    const supabase = createClient_server();
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
  } catch (e) {
    console.error(e);
    throw new Error('Error logging out');
  }
}
