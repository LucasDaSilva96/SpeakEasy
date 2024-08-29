import FriendsBoxes from '@/components/FriendsBoxes';
import { Button } from '@/components/ui/button';
import { getUserFriends } from '@/lib/actions/user.actions';
import { UserRoundPlusIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default async function New_Chat_Page() {
  const friends = await getUserFriends();

  if (friends.length === 0)
    return (
      <div className='w-full h-[80dvh] flex-center'>
        <div className='flex-center-col gap-6'>
          <h1 className='text-center text-xl'>No friends added yet</h1>
          <Link href='/dashboard/addNewFriend'>
            <Button className='bg-blue flex-center gap-0.5'>
              <span>
                <UserRoundPlusIcon size={18} />
              </span>
              <span>Add friends now</span>
            </Button>
          </Link>
        </div>
      </div>
    );

  return (
    <section className='px-2 py-4 w-full relative'>
      <FriendsBoxes friends={friends} />
    </section>
  );
}
