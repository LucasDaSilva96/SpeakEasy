import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'SpeakEasy - Chat App',
  description:
    'A chat app for everyone and from everywhere. SpeakEasy is a chat app that allows you to chat with anyone from anywhere in the world. It is a simple and easy-to-use chat app that allows you to chat with anyone from anywhere in the world.',
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
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
      <div className='w-full min-h-screen flex flex-col'>
        <Header />
        {children}
        <Footer />
      </div>
    </>
  );
}
