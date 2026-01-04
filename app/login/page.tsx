import { auth, signIn } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LoginClient from '@/components/LoginClient';

export default async function LoginPage() {
  const session = await auth();

  // If logged in, redirect to game
  if (session?.user) {
    redirect('/game/cloudtown');
  }

  return (
    <LoginClient 
      onDiscordSignIn={async () => {
        'use server';
        await signIn('discord');
      }}
    />
  );
}
