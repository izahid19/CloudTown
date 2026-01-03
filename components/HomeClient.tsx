'use client';
import { useState, useEffect } from 'react';

// Define Props Interface
interface HomeClientProps {
  onSignIn: () => Promise<void>;
}

const SOCKET_SERVER_URL = process.env.BACKEND_SOCKET_URL || 'http://localhost:5000';

export default function HomeClient({ onSignIn }: HomeClientProps) {
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
        setPlayerCount(0); // Default to 0 on error
      }
    };

    fetchPlayerCount();
    const interval = setInterval(fetchPlayerCount, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-screen">
      <div className="clouds-bg">
        {/* Floating clouds generated via CSS - carefully positioned for nice loop */}
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
          <form action={onSignIn}>
            <button type="submit" className="auth-btn discord">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Sign in with Discord
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        /* Styles moved to global.css to prevent FOUC */
      `}</style>
    </div>
  );
}
