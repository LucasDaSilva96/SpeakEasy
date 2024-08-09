import User from '@/lib/models/user';
import { connectToDB } from '@/lib/mongoose';
import { compare } from 'bcrypt';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error('Missing credentials');
        }
        await connectToDB();
        const user = await User.findOne({
          email: credentials.email,
        });
        if (!user) {
          throw new Error('No user found');
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        user.status = 'online';
        await user.save();

        return {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          id: user._id,
          image: user.image,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth',
  },
});

export { handler as POST, handler as GET };
