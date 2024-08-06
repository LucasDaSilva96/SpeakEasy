'use server';

import { UserType } from '@/types/user.types';
import User from '../models/user';

export const getUser = async (email: string) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    return user as UserType;
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
};
