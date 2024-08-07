import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { connectToDB } from '@/lib/mongoose';
import { getUser } from '@/lib/actions/user.actions';
import { UserType } from '@/types/user.types';
import { parseResponse } from '@/lib/response';

const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        console.log('credentials', credentials);
        await connectToDB();
        const user = await getUser(credentials!.email);
        console.log('user', user);
        return user;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
