import { LanguageType } from '@/types/language.types';
import { createClient_server } from '../supabase/server';

// Get all available languages
export const getAvailableLanguages = async () => {
  try {
    const supabase = createClient_server();
    const { data, error } = await supabase.from('languages').select('*');
    if (error) throw new Error(error.message);

    return data as LanguageType[];
  } catch (err: any) {
    console.error(err);
    throw new Error(err.message);
  }
};
