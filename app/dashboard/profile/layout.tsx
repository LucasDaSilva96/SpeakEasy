import SideNavigation from '@/components/SideNavigation';
import React from 'react';
import { Toaster } from 'react-hot-toast';

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
      <div className='w-full flex flex-col relative gap-4 p-2'>
        <div>
          <SideNavigation />
        </div>
        <div className='max-h-[70dvh] overflow-y-auto'>{children}</div>
      </div>
    </>
  );
}
