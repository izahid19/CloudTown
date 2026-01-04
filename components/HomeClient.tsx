'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export default function HomeClient() {
  const router = useRouter();
  const [playerCount, setPlayerCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchPlayerCount = async () => {
      try {
        const res = await fetch(`${SOCKET_SERVER_URL}/health`);
        if (res.ok) {
          const data = await res.json();
          setPlayerCount(data.players || 0);
        }
      } catch (err) {
        console.error('Failed to fetch player count:', err);
        setPlayerCount(0);
      }
    };

    fetchPlayerCount();
    const interval = setInterval(fetchPlayerCount, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-screen">
      <div className="clouds-bg">
        <div className="cloud" style={{ top: '15%', animationDuration: '25s', animationDelay: '-5s' }} />
        <div className="cloud" style={{ top: '35%', animationDuration: '35s', animationDelay: '-15s', transform: 'scale(0.8)' }} />
        <div className="cloud" style={{ top: '55%', animationDuration: '20s', animationDelay: '-2s' }} />
        <div className="cloud" style={{ top: '75%', animationDuration: '30s', animationDelay: '-25s', transform: 'scale(1.2)' }} />
        <div className="cloud" style={{ top: '10%', animationDuration: '40s', animationDelay: '-35s', transform: 'scale(0.6)' }} />
      </div>

      <div className="home-content">
        <h1 className="home-title">☁️ Cloud Town ☁️</h1>
        
        <div className="server-status-card">
          <span className="status-dot"></span>
          <span className="status-text">
            {playerCount !== null ? playerCount : '...'} Players Online
          </span>
        </div>

        <p className="home-subtitle">A multiplayer virtual world to explore together</p>

        <div className="auth-section">
          <button 
            onClick={() => router.push('/login')} 
            className="auth-btn start"
          >
            🚀 Let's Start
          </button>
        </div>
      </div>
    </div>
  );
}
