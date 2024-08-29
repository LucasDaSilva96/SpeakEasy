'use server';
import * as deepl from 'deepl-node';

const authKey = process.env.DeepL_API_Key!;
const translator = new deepl.Translator(authKey);

export const translate = async (
  text: string,
  targetLang: deepl.TargetLanguageCode
) => {
  try {
    const result = await translator.translateText(text, null, targetLang);

    return result.text;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.message);
  }
};
