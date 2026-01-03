import { auth, signIn } from '@/lib/auth';
import { redirect } from 'next/navigation';
import HomeClient from '@/components/HomeClient';

export default async function HomePage() {
  const session = await auth();

  // If logged in, redirect directly to the game
  if (session?.user) {
    redirect('/game/cloudtown');
  }

  // Show login page for unauthenticated users
  return (
    <HomeClient 
      onSignIn={async () => {
        'use server';
        await signIn('discord');
      }}
    />
  );
}
