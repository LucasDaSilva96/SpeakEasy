'use client';

import { Loader2Icon } from 'lucide-react';

export default function BigLoaderScreen() {
  return (
    <div className='fixed inset-0 flex-center bg-black/30 z-[100]'>
      <Loader2Icon size={50} className='animate-spin text-blue' />
    </div>
  );
}
