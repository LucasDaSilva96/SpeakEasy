import type { Metadata } from 'next';
import { Arimo } from 'next/font/google';
import '../globals.css';

const arimo = Arimo({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SpeakEasy',
  description: 'A chat app for everyone and from everywhere.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={arimo.className}>{children}</body>
    </html>
  );
}
