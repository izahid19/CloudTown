import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import GameClient from '@/components/GameClient';

interface GamePageProps {
  params: Promise<{ roomId: string }>;
}

export default async function GamePage({ params }: GamePageProps) {
  const session = await auth();
  const { roomId } = await params;

  // Since we unified auth providers (Discord & Email) via NextAuth,
  // we just need to check for a valid session here.
  if (!session?.user) {
    redirect('/');
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <GameClient
        roomId={roomId}
        userId={session.user.id}
        userName={session.user.name || 'Anonymous'}
        userImage={session.user.image || undefined}
      />
    </div>
  );
}
