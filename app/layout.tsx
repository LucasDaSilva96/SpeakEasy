import type { Metadata } from 'next';
import { Arimo } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const arimo = Arimo({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SpeakEasy',
  description: 'A chat app for everyone and from everywhere.',
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={arimo.className}>
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
                backgroundColor: '#000',
                color: '#ffffff',
              },
            },
            loading: {
              style: {
                backgroundColor: '#000',
                color: '#beb7a4',
              },
            },
            error: {
              style: {
                backgroundColor: '#000',
                color: '#fff',
              },
            },
          }}
        />
        <div>{children}</div>
      </body>
    </html>
  );
}
