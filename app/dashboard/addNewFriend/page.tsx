'use client';

import SearchPersonCard from '@/components/SearchPersonCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { searchUsers } from '@/lib/actions/user.actions';
import { UserType } from '@/types/user.types';
import { LoaderCircle } from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';

export default function Add_New_Friend_Page() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [users, setUsers] = React.useState<UserType[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (!inputRef.current) return;
      const search = inputRef.current.value;
      if (!search || search.trim() === '') return;
      const users = await searchUsers(search);
      if (!users || !users.length) {
        toast.error('No users found');
        return;
      }
      setUsers(users);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className='flex flex-col gap-4 w-full py-6 px-2 text-black'>
      <div className='flex items-center gap-2'>
        <Input
          ref={inputRef}
          type='text'
          minLength={0}
          placeholder='Search for users'
          className='bg-white rounded-md py-1 px-1'
        />
        <Button
          disabled={loading}
          className='bg-brown flex-center gap-1'
          onClick={handleSearch}
        >
          {loading ? 'Searching' : 'Search'}
          {loading && (
            <span className=''>
              <LoaderCircle size={20} className='animate-spin' />
            </span>
          )}
        </Button>
      </div>
      <div className='w-full max-h-[64dvh] overflow-y-auto flex flex-col gap-2 py-1'>
        {users.length > 0 &&
          users.map((user) => (
            <SearchPersonCard setUser={setUsers} key={user.id} person={user} />
          ))}
      </div>
    </section>
  );
}
