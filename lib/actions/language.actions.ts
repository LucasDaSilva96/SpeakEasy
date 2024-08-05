'use server';
import languages from '@/data/languages.json';
import { connectToDB } from '../mongoose';
import Language from '../models/language';

export const uploadLanguage = async () => {
  try {
    await connectToDB();

    const langs = await Language.find();

    if (langs.length) {
      return console.log('Languages already uploaded');
    }

    languages.forEach(async (lang) => {
      const language = new Language(lang);

      await language.save();
    });
  } catch (err) {
    console.error(err);
    throw new Error('Error uploading language');
  }
};
