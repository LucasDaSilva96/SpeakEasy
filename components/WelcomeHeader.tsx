'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function WelcomeHeader() {
  return (
    <div className='flex-center-col gap-2 w-full'>
      <motion.div
        className='flex-center gap-2 px-2'
        initial={{ opacity: 0, scale: 0.6, x: '-100%' }}
        animate={{ opacity: 1, scale: 1, x: '0%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className='w-[42px] h-[42px] relative rounded-lg'>
          <Image
            src={'/header_logo.jpg'}
            alt='logo'
            fill
            className='rounded-lg'
            loading='eager'
            sizes='(max-width: 200px) 100vw, (max-width: 300px) 50vw, 33vw'
          />
        </div>
        <h1 className='font-semibold text-white text-3xl '>SpeakEasy</h1>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, scale: 0.6, x: '100%' }}
        animate={{ opacity: 1, scale: 1, x: '0%' }}
        transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.3 }}
        className='text-lg text-center subpixel-antialiased text-white/90 '
      >
        Your Language, Their Language, One Conversation.
      </motion.h2>
    </div>
  );
}
