'use client';

import React from 'react';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const HomeView = () => {
  const { data: session, isPending } = authClient.useSession(); // Use isPending instead of isLoading
  const router = useRouter();

  if (isPending || !session) {
    return <p>Loading...</p>;
  }

  const handleSignOut = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push('/'),
      },
    });
  };

  return (
    <div className="flex flex-col p-4 gap-y-4">
      <p>Logged in as {session.user?.name || 'Unknown User'}</p>
      <Button onClick={handleSignOut}>Sign Out</Button>
    </div>
  );
};

export default HomeView;
