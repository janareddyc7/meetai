import React from 'react';
import HomeView from '@/modules/home/ui/view/home-view';
import { auth } from '@/lib/auth'; // Adjust this import if necessary
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // no need to await headers()
  });

  if(!session) {
    redirect('/sign-in')
  }

  return (
    <div>
      <HomeView />
    </div>
  );
};

export default Page;
