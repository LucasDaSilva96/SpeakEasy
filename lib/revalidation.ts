'use server';

import { revalidatePath } from 'next/cache';

export const revalidate = async (path: string, page?: 'layout' | 'page') => {
  return revalidatePath(path, page || 'layout');
};
