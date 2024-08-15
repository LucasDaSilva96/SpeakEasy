'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function WritingAnimation({ size = 8 }: { size?: number }) {
  return (
    <div className='w-8 h-8 ml-auto flex-center gap-0.5'>
      <motion.div
        className={`bg-blue/45 rounded-full`}
        style={{ width: size, height: size }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'anticipate',
          repeatDelay: 0.3,
        }}
      />

      <motion.div
        className={`bg-blue/45 rounded-full`}
        style={{ width: size, height: size }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'anticipate',
          delay: 0.4,
        }}
      />

      <motion.div
        className={`bg-blue/45 rounded-full`}
        style={{ width: size, height: size }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'anticipate',
          delay: 0.8,
        }}
      />
    </div>
  );
}
