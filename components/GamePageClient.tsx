'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GameClient from './GameClient';

interface GamePageClientProps {
  roomId: string;
}

interface AuthUser {
  id: string;
  username: string;
  email: string;
}

export default function GamePageClient({ roomId }: GamePageClientProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for email auth token in localStorage
    const authToken = localStorage.getItem('authToken');
    const authUser = localStorage.getItem('authUser');

    if (authToken && authUser) {
      try {
        const parsedUser = JSON.parse(authUser) as AuthUser;
        setUser(parsedUser);
      } catch {
        // Invalid user data, redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        router.push('/login');
      }
    } else {
      // No auth, redirect to home
      router.push('/');
    }
    
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#1a1a2e',
        color: 'white',
        fontSize: '1.5rem'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <GameClient
        roomId={roomId}
        userId={user.id}
        userName={user.username}
        userImage={undefined}
      />
    </div>
  );
}
