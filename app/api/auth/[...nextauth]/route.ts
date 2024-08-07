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
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }
        await connectToDB();
        const res = await getUser(credentials.email);
        const user = parseResponse<UserType>(res, {} as UserType);
        if (!user) {
          return null;
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          return null;
        }
        user.status = 'online';
        await (user as any).save();

        return { email: user.email, id: user._id };
      },
    }),
  ],
});

export { handler as GET, handler as POST };
