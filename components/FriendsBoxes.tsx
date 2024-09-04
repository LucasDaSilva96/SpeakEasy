'use client';
import { UserFriendType, UserType } from '@/types/user.types';
import AvatarCircles from './magicui/avatar-circles';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Input } from './ui/input';
import { useState } from 'react';
import { removeFriend } from '@/lib/actions/user.actions';
import toast from 'react-hot-toast';
import { revalidate } from '@/lib/revalidation';
import { TooltipComponent } from './ToolTipComponent';
import { Button } from './ui/button';
import { UserMinus } from 'lucide-react';
import BigLoaderScreen from './BigLoaderScreen';

type UserCardProps = {
  friends: UserFriendType[] | UserType[];
  isOnAccountPage?: boolean;
};
export default function FriendsBoxes({
  friends,
  isOnAccountPage = false,
}: UserCardProps) {
  const [search, setSearch] = useState('');
  const [friendsList, setFriendsList] = useState(friends);
  const [loading, setLoading] = useState(false);
  if (friends.length === 0) return null;

  const filterFriends = (search: string) => {
    setSearch(search);
    if (search === '') return setFriendsList(friends);
    const filteredFriends = friends.filter((friend) => {
      return (
        friend.first_name.toLowerCase().includes(search.toLowerCase()) ||
        friend.last_name.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFriendsList(filteredFriends as UserFriendType[]);
  };

  async function deleteFriend(id: string) {
    try {
      setLoading(true);
      await removeFriend(id);
      setLoading(false);
      toast.success('Friend removed successfully');
      return revalidate('/dashboard/profile/friends', 'page');
    } catch (e: any) {
      setLoading(false);
      console.error(e);
      toast.error(e.message);
    }
  }

  return (
    <div className='w-full h-full'>
      <Input
        type='text'
        minLength={1}
        value={search}
        onChange={(e) => filterFriends(e.target.value)}
        placeholder='Search for friends'
        className='bg-slate-300 rounded-md py-1 px-1'
      />
      <motion.ul className='w-full flex flex-wrap gap-6 mt-2 max-h-[70dvh]  overflow-y-auto'>
        {friendsList.length > 0 ? (
          friendsList.map((friend, i) => (
            <div key={i} className='flex flex-col items-center gap-1'>
              <Link href={`/dashboard/chat/${friend.id}`}>
                <motion.li
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    type: 'spring',
                  }}
                  className={'flex-center relative flex-1 max-w-[200px]'}
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className='text-center cursor-pointer'
                  >
                    <AvatarCircles
                      avatarUrls={[friend?.image || '/default-avatar.png']}
                      className={`bg-slate-200/50 rounded-full border-2 ${
                        friend.status
                          ? 'border-green-600/70'
                          : 'border-gray-300/50'
                      }`}
                    />

                    <p className='font-extralight text-xs text-gray-500'>
                      {friend.first_name}
                    </p>
                  </motion.div>
                </motion.li>
              </Link>
              {isOnAccountPage && (
                <TooltipComponent hoverText={`Remove ${friend.first_name}`}>
                  <Button
                    disabled={loading}
                    onClick={async () => await deleteFriend(friend.id)}
                    variant={'default'}
                    className='w-8 p-0 h-8'
                  >
                    <UserMinus size={20} />
                  </Button>
                </TooltipComponent>
              )}
            </div>
          ))
        ) : (
          <div className='w-full'>
            <h3 className='text-center text-xl'>No user found</h3>
          </div>
        )}
      </motion.ul>
      {loading && <BigLoaderScreen />}
    </div>
  );
}
