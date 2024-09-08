import UpdateAccountForm from '@/components/Forms/UpdateAccountForm';
import { getLoggedInUser } from '@/lib/actions/login.actions';
import React from 'react';

export default async function Profile_Page() {
  const user = await getLoggedInUser();
  if (!user)
    return <h1 className='text-center text-xl animate-bounce'>Loading...</h1>;
  return (
    <section className=''>
      <UpdateAccountForm user={user} />
    </section>
  );
}
