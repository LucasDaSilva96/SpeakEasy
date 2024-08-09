import type { Metadata } from 'next';
import { Arimo } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { getServerSession } from 'next-auth';
import NextAuthProvider from '@/components/NextAuthProvider';

const arimo = Arimo({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SpeakEasy',
  description: 'A chat app for everyone and from everywhere.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang='en'>
      <body className={arimo.className}>
        <NextAuthProvider session={session}>
          <Toaster
            position='top-right'
            reverseOrder={false}
            gutter={8}
            containerClassName=''
            containerStyle={{}}
            toastOptions={{
              duration: 3000,
              style: {
                background: '#000',
                color: '#fff',
              },
              success: {
                style: {
                  backgroundColor: '#2dc653',
                  color: '#ffffff',
                },
              },
              loading: {
                style: {
                  backgroundColor: '#168AFF',
                  color: '#fff',
                },
              },
              error: {
                style: {
                  backgroundColor: '#FF6070',
                  color: '#fff',
                },
              },
            }}
          />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
