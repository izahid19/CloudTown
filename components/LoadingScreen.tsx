'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress for now (or hook into Phaser events if passed props)
    // We'll update this to accept props later for real progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      <div className="clouds-bg">
        {/* Floating clouds generated via CSS - carefully positioned to loop nicely */}
        <div className="cloud" style={{ top: '15%', animationDuration: '25s', animationDelay: '-5s' }} />
        <div className="cloud" style={{ top: '35%', animationDuration: '35s', animationDelay: '-15s', transform: 'scale(0.8)' }} />
        <div className="cloud" style={{ top: '55%', animationDuration: '20s', animationDelay: '-2s' }} />
        <div className="cloud" style={{ top: '75%', animationDuration: '30s', animationDelay: '-25s', transform: 'scale(1.2)' }} />
        <div className="cloud" style={{ top: '10%', animationDuration: '40s', animationDelay: '-35s', transform: 'scale(0.6)' }} />
      </div>

      <div className="content">
        <h1 className="title">☁️ Cloud Town ☁️</h1>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-text">{progress}%</div>
        </div>
      </div>

      <style jsx>{`
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: #87CEEB;
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }

        .title {
          font-family: Arial, sans-serif;
          font-size: 48px;
          color: white;
          text-shadow: 3px 3px 0px #2c5aa0;
          margin-bottom: 40px;
          font-weight: bold;
          animation: pulse 2s infinite ease-in-out;
        }

        .progress-container {
          width: 300px;
          text-align: center;
        }

        .progress-bar {
          width: 100%;
          height: 30px;
          background: rgba(255, 255, 255, 0.9);
          border: 3px solid #2c5aa0;
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(to right, #5cb8e8, #2c5aa0);
          border-radius: 17px;
          transition: width 0.2s ease-out;
        }

        .progress-text {
          color: #2c5aa0;
          font-weight: bold;
          font-size: 18px;
        }

        .cloud {
          position: absolute;
          width: 120px;
          height: 40px;
          background: #fff;
          border-radius: 100px;
          left: -150px;
          opacity: 0.8;
          animation: float linear infinite;
        }
        
        .cloud::after, .cloud::before {
          content: '';
          position: absolute;
          background: inherit;
          border-radius: 50%;
        }
        
        .cloud::after { width: 40px; height: 40px; top: -20px; left: 15px; }
        .cloud::before { width: 60px; height: 60px; top: -35px; left: 40px; }

        @keyframes float {
          from { transform: translateX(-150px); }
          to { transform: translateX(calc(100vw + 300px)); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .content {
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </div>
  );
}
