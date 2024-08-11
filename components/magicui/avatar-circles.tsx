'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import Image from 'next/image';

interface AvatarCirclesProps {
  className?: string;
  numPeople?: number;
  avatarUrls: string[];
}

const AvatarCircles = ({ className, avatarUrls }: AvatarCirclesProps) => {
  return (
    <div className={cn('z-10 flex -space-x-4 rtl:space-x-reverse', className)}>
      {avatarUrls.map((url, index) => (
        <Image
          key={index}
          className='h-10 w-10 rounded-full border-2 border-white dark:border-gray-800'
          src={url}
          width={40}
          height={40}
          alt={`Avatar ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default AvatarCircles;
