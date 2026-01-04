import { auth, signIn } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ResetPasswordClient from '@/components/ResetPasswordClient';

export default async function ResetPasswordPage() {
  const session = await auth();

  // If logged in, redirect to game
  if (session?.user) {
    redirect('/game/cloudtown');
  }

  return <ResetPasswordClient />;
}
