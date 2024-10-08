'use client';

import React from 'react';
import { Bell, Loader2 } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from './ui/button';
import { UserType } from '@/types/user.types';
import {
  acceptFriendRequest,
  getFriendRequests,
} from '@/lib/actions/user.actions';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function NotificationHeader() {
  const url = usePathname();
  const [friendRequests, setFriendRequests] = React.useState<UserType[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleAccept = async (id: string, status: string) => {
    try {
      setLoading(true);
      await acceptFriendRequest(id, status);
      setFriendRequests((prev) => prev.filter((fr) => fr.id !== id));
      setLoading(false);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    (async () => {
      try {
        const res = await getFriendRequests();
        setFriendRequests(res);
      } catch (e: any) {
        console.error(e);
        toast.error(e.message);
      }
    })();
  }, [url]);

  if (friendRequests.length === 0) return null;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant='ghost' className='hover:bg-transparent'>
          <div className='flex items-center animate-bounce'>
            <Bell size={24} className='text-white' />
            <span className='relative flex h-3 w-3 self-start -mt-1 -ml-1'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue opacity-75'></span>
              <span className='relative inline-flex rounded-full h-3 w-3 bg-blue'></span>
            </span>
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className='mx-auto w-full text-center'>
          <div className='w-full flex-center'>
            <DrawerHeader className='text-center'>
              <DrawerTitle>Friends Request</DrawerTitle>
              <DrawerDescription>
                You have {friendRequests.length} friend{' '}
                {friendRequests.length > 1 ? 'requests' : 'request'}
              </DrawerDescription>
            </DrawerHeader>
          </div>
          <div className='p-4 max-h-[50dvh] overflow-y-auto flex flex-col gap-2'>
            {friendRequests.map((fr) => (
              <div
                key={fr.id}
                className='flex items-center justify-between border rounded-lg p-2'
              >
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 relative rounded-full overflow-clip'>
                    <Image
                      src={fr.image || '/default-avatar.png'}
                      alt={fr.first_name + 'profile'}
                      fill
                      sizes='(max-width: 200px) 100vw, (max-width: 300px) 50vw, 33vw'
                      priority
                      style={{
                        objectFit: 'cover',
                      }}
                    />
                  </div>

                  <div>
                    <h1 className='font-semibold'>
                      {fr.first_name + ' ' + fr.last_name}
                    </h1>
                    <p className='text-sm font-extralight text-gray-500'>
                      {fr.email}
                    </p>
                  </div>
                </div>
                <div className='space-x-2'>
                  <Button
                    disabled={loading}
                    variant='default'
                    className='flex-center gap-1'
                    onClick={async () => await handleAccept(fr.id, 'accepted')}
                  >
                    {loading ? (
                      <>
                        <span>Loading...</span>
                        <Loader2 size={20} className='animate-spin' />
                      </>
                    ) : (
                      'Accept'
                    )}
                  </Button>
                  <Button
                    disabled={loading}
                    variant='secondary'
                    onClick={async () => await handleAccept(fr.id, 'rejected')}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant='outline'>Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
