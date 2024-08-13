'use server';
import { createClient_server } from '../supabase/server';

// Get all available languages
export const getAvailableLanguages = async () => {
  try {
    const supabase = await createClient_server();
    const { data, error } = await supabase.from('languages').select('*');
    if (error) throw new Error(error.message);

    const response = JSON.stringify(data) || [];

    return response;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.message);
  }
};
