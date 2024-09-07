import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getLoggedInUser } from '@/lib/actions/login.actions';

export const metadata: Metadata = {
  title: 'SpeakEasy - Chat App',
  description:
    'A chat app for everyone and from everywhere. SpeakEasy is a chat app that allows you to chat with anyone from anywhere in the world. It is a simple and easy-to-use chat app that allows you to chat with anyone from anywhere in the world.',
};
export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getLoggedInUser();
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
      <div className='w-full h-screen flex flex-col relative bg-black text-white'>
        <Header user={user} />
        {children}
        <Footer />
      </div>
    </>
  );
}
