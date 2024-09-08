import { Loader2Icon } from 'lucide-react';
import React from 'react';

export default function loading() {
  return (
    <div className='absolute z-[200] h-screen w-full bg-black/10 backdrop-blur-md flex-center'>
      <Loader2Icon size={50} className='text-blue animate-spin' />
    </div>
  );
}
