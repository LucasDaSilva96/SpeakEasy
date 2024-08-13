import Link from 'next/link';

export default function NotFound() {
  return (
    <section className='w-full min-h-screen flex-center bg-gradient-pattern'>
      <div className='text-center flex flex-col gap-4 glass p-4 rounded-md shadow-md text-white'>
        <h2 className='text-3xl font-semibold'>Not Found - 404</h2>
        <p>Could not find requested resource</p>
        <Link href='/' className='py-2 rounded-md mt-8 bg-black/75'>
          Return Home
        </Link>
      </div>
    </section>
  );
}
