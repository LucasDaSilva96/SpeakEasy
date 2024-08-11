'use server';
import { connectToDB } from '../mongoose';
import Conversation from '../models/conversation';
import User from '../models/user';
import bcrypt from 'bcrypt';
import { UserCreateType } from '@/types/user.types';
import { stringifyResponse } from '../response';
import { tokenGenerator } from '../tokenGenerator';
import Message from '../models/message';

// This function is used to get a user by email.
export const getUser = async (email: string) => {
  console.log('getUser✅✅✅');
  try {
    await connectToDB();
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    return stringifyResponse(user);
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

// This function is used to generate a token, and the expired token.
export const generateToken = async (email: string) => {
  try {
    if (!email || email === '') {
      throw new Error('Email is required');
    }
    await connectToDB();
    const expiredToken = Date.now() + 1000 * 60 * 15;
    const token = tokenGenerator();
    const userInDb = await User.findOne({ email });
    if (!userInDb) {
      throw new Error('User not found');
    }
    userInDb.resetToken = token;
    userInDb.resetTokenExpires = expiredToken;
    userInDb.updatedAt = new Date();
    await userInDb.save();
    const responseUser = {
      email: userInDb.email,
      resetToken: userInDb.resetToken,
      resetTokenExpires: userInDb.resetTokenExpires,
      firstName: userInDb.firstName,
      lastName: userInDb.lastName,
    };

    return stringifyResponse(responseUser);
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
};

// This function is used to reset the password.
export const resetPassword = async (token: string, password: string) => {
  try {
    await connectToDB();
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error('Token is invalid or has expired');
    }

    user.password = await bcrypt.hash(password, 10);
    user.passwordConfirm = '';
    user.resetToken = '';
    user.resetTokenExpires = Date.now();
    user.updatedAt = new Date();
    await user.save();

    return stringifyResponse({ message: 'Password reset successful' });
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
};

// This function is used to get all the conversations of a user.
export const getUserConversations = async (email: string) => {
  try {
    await connectToDB();

    const user = await User.findOne({ email }).populate({
      path: 'conversationsIds',
      model: Conversation,
      populate: [
        {
          path: 'messages',
          model: Message,
        },
        {
          path: 'users',
          model: 'User',
        },
      ],
    });

    if (!user) {
      throw new Error('User not found');
    }

    return stringifyResponse(user.conversationsIds);
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
};
