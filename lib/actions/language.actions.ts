'use server';
import { connectToDB } from '../mongoose';
import Language from '../models/language';
import { LanguageType } from '@/types/language.types';
import { stringifyResponse } from '../stringifyResponse';

export async function getAllLanguages() {
  try {
    await connectToDB();
    const languages = await Language.find();
    const res = stringifyResponse(languages);
    return res as LanguageType[];
  } catch (err) {
    console.log(err);
    throw new Error('Could not fetch languages');
  }
}
