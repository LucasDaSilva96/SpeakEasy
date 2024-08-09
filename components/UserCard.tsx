'use client';

import Image from 'next/image';
import React from 'react';

interface UserCardProps {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  conversationsIds: string[];
  nativeLanguage: string;
  status: string;
  flex_row?: boolean;
}

export default function UserCard({
  _id,
  conversationsIds,
  email,
  firstName,
  image,
  lastName,
  nativeLanguage,
  status,
  flex_row,
}: UserCardProps) {
  return (
    <div className='min-w-20'>
      <div className={!flex_row ? 'flex-center-col' : 'flex-center'}>
        <div className='border-[1.5px] border-spacing-1 border-blue rounded-3xl'>
          <Image
            src={image}
            alt={firstName + 'profile'}
            width={50}
            height={50}
          />
        </div>
        <div className='flex items-center gap-1'>
          {status === 'online' ? (
            <div className='w-2 h-2 rounded-full bg-green-600 animate-pulse' />
          ) : (
            <div className='w-2 h-2 rounded-full bg-gray-300' />
          )}

          <p className='font-extralight text-xs text-gray-500'>{firstName}</p>
        </div>
      </div>
    </div>
  );
}
