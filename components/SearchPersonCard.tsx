'use client';

import { UserType } from '@/types/user.types';
import Image from 'next/image';
import React from 'react';
import { Button } from './ui/button';
import { Loader2, Plus } from 'lucide-react';
import { addFriend } from '@/lib/actions/user.actions';
import toast from 'react-hot-toast';

interface SearchPersonCardProps {
  person: UserType;
}

export default function SearchPersonCard({ person }: SearchPersonCardProps) {
  const [loading, setLoading] = React.useState(false);
  const handleAddFriend = async () => {
    try {
      setLoading(true);
      await addFriend(person.id);
      toast.success('Friend request sent');
      setLoading(false);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message);
      setLoading(false);
    }
  };
  return (
    <div className='flex items-center justify-evenly bg-slate-50 py-4 px-1'>
      <div className=''>
        <Image
          src={person.image || '/default-avatar.png'}
          alt={person.first_name + 'profile'}
          width={48}
          height={48}
          className='rounded-full border p-1 border-blue'
        />
      </div>
      <div className='text-center'>
        <h1>{person.first_name + ' ' + person.last_name}</h1>
        <p className='text-sm'>{person.email}</p>
      </div>
      <div>
        <Button onClick={handleAddFriend} size={'sm'} disabled={loading}>
          {!loading ? (
            <Plus size={20} />
          ) : (
            <Loader2 size={20} className='animate-spin' />
          )}
        </Button>
      </div>
    </div>
  );
}
