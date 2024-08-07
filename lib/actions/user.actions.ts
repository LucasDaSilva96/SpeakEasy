'use server';
import bcrypt from 'bcrypt';
import { UserCreateType } from '@/types/user.types';
import User from '../models/user';
import { stringifyResponse } from '../response';
import { connectToDB } from '../mongoose';

// This function is used to get a user by email.
export const getUser = async (email: string) => {
  try {
    await connectToDB();
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    return JSON.stringify(user);
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
};

// This function is used to create a user.
export const createUser = async (user: UserCreateType) => {
  try {
    await connectToDB();
    if (user.password !== user.passwordConfirm) {
      throw new Error('Passwords do not match');
    }
    user.password = await bcrypt.hash(user.password, 10);
    user.passwordConfirm = '';
    const newUser = new User(user);
    await newUser.save();
    return stringifyResponse(newUser);
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
};
