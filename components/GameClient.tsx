'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { signOut } from 'next-auth/react';
import LoadingScreen from './LoadingScreen';
import ProfileModal from './ProfileModal';

interface ProfileData {
  username: string;
  about: string;
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
  github?: string;
}

interface GameClientProps {
  roomId: string;
  userId: string;
  userName: string;
  userImage?: string;
}

export default function GameClient({
  roomId,
  userId,
  userName,
  userImage,
}: GameClientProps) {
  const gameRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playersOnline, setPlayersOnline] = useState(1);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<ProfileData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  // User's own profile
  const [myProfile, setMyProfile] = useState<ProfileData>({
    username: userName,
    about: '',
    linkedin: '',
    twitter: '',
    portfolio: '',
    github: '',
  });

  // Load profile from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem(`cloudtown-profile-${userId}`);
    if (savedProfile) {
      setMyProfile(JSON.parse(savedProfile));
    }
  }, [userId]);

  // Save profile
  const handleSaveProfile = (profile: ProfileData) => {
    setMyProfile(profile);
    localStorage.setItem(`cloudtown-profile-${userId}`, JSON.stringify(profile));
    
    // Update the game registry with new username
    if (phaserGameRef.current) {
      phaserGameRef.current.registry.set('userName', profile.username);
      phaserGameRef.current.registry.set('userProfile', profile);
      
      // Notify game scene
      const win = window as unknown as { updateGameProfile?: (profile: ProfileData) => void };
      if (win.updateGameProfile) {
        win.updateGameProfile(profile);
      }
    }
  };

  // Open own profile for editing
  const openMyProfile = () => {
    setViewingProfile(myProfile);
    setIsEditMode(true);
    setIsProfileOpen(true);
  };

  // View another player's profile (called from game)
  const viewPlayerProfile = useCallback((profile: ProfileData) => {
    setViewingProfile(profile);
    setIsEditMode(false);
    setIsProfileOpen(true);
  }, []);

  // Update player count
  const updatePlayerCount = useCallback((count: number) => {
    setPlayersOnline(count);
  }, []);
  
  // Handle Sign Out
  const handleSignOut = () => {
    setIsSignOutModalOpen(true);
  };

  const confirmSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  // Sync profile changes to running game
  useEffect(() => {
    if (phaserGameRef.current) {
      phaserGameRef.current.registry.set('userName', myProfile.username);
      phaserGameRef.current.registry.set('userImage', userImage);
      phaserGameRef.current.registry.set('userProfile', myProfile);
      
      // Also notify via window func if needed, though registry usage is preferred
      const win = window as unknown as { updateGameProfile?: (profile: ProfileData) => void };
      if (win.updateGameProfile) {
        win.updateGameProfile(myProfile);
      }
    }
  }, [myProfile, userImage]);

  useEffect(() => {
    // Make functions available globally for the game
    const win = window as unknown as { 
      updatePlayerCount: (count: number) => void;
      viewPlayerProfile: (profile: ProfileData) => void;
      getMyProfile: () => ProfileData;
      updateMyProfileFromGame: (profile: ProfileData) => void;
    };
    win.updatePlayerCount = updatePlayerCount;
    win.viewPlayerProfile = viewPlayerProfile;
    win.getMyProfile = () => myProfile;
    win.updateMyProfileFromGame = (profile: ProfileData) => {
      // We only update if it's different to avoid loops if setMyProfile triggers this effect
      setMyProfile(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(profile)) {
          localStorage.setItem(`cloudtown-profile-${userId}`, JSON.stringify(profile));
          return profile;
        }
        return prev;
      });
    };

    // Dynamically import Phaser
    const initGame = async () => {
      const Phaser = (await import('phaser')).default;
      const { default: BootScene } = await import('@/game/scenes/BootScene');
      const { default: GameScene } = await import('@/game/scenes/GameScene');

      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
      }

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        parent: 'game-container',
        pixelArt: true,
        backgroundColor: '#1a1a2e',
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 0 },
            debug: false,
          },
        },
        scene: [BootScene, GameScene],
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      };

      phaserGameRef.current = new Phaser.Game(config);

      // Pass data to game - Initial State
      phaserGameRef.current.registry.set('roomId', roomId);
      phaserGameRef.current.registry.set('userId', userId);
      phaserGameRef.current.registry.set('userName', myProfile.username);
      phaserGameRef.current.registry.set('userImage', userImage);
      phaserGameRef.current.registry.set('userProfile', myProfile);

      phaserGameRef.current.events.on('ready', () => {
        // Game engine is ready
      });

      // Listen for GameScene start to show UI
      phaserGameRef.current.events.on('game-started', () => {
        setIsLoading(false);
      });
    };

    initGame();

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
      
      const zoomControls = document.getElementById('zoom-controls');
      const minimapBorder = document.getElementById('minimap-border');
      const virtualJoystick = document.getElementById('virtual-joystick');

      if (zoomControls) zoomControls.remove();
      if (minimapBorder) minimapBorder.remove();
      if (virtualJoystick) virtualJoystick.remove();

      delete (window as unknown as { updatePlayerCount?: unknown }).updatePlayerCount;
      delete (window as unknown as { viewPlayerProfile?: unknown }).viewPlayerProfile;
      delete (window as unknown as { getMyProfile?: unknown }).getMyProfile;
      delete (window as unknown as { updateMyProfileFromGame?: unknown }).updateMyProfileFromGame;
    };
    // CRITICAL: Remove myProfile from dependency array to prevent re-init loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, userId]);

  // Toggle Phaser input when profile modal is open OR signout modal is open
  useEffect(() => {
    if (phaserGameRef.current && phaserGameRef.current.input && phaserGameRef.current.input.keyboard) {
      phaserGameRef.current.input.keyboard.enabled = !isProfileOpen && !isSignOutModalOpen;
    }
  }, [isProfileOpen, isSignOutModalOpen]);

  return (
    <>
      {/* Separate Loading Page/Screen */}
      {isLoading && <LoadingScreen />}

      {/* Phaser Container - Always render so game can init */}
      <div id="game-container" ref={gameRef} />

      {/* UI Elements - Only shown when game IS NOT loading */}
      {!isLoading && (
        <>
          {/* Sign Out Button */}
          <button className="signout-btn" onClick={handleSignOut}>
            Sign Out
          </button>

          {/* Player count badge */}
          {playersOnline > 1 && (
            <div className="players-online">
              🟢 {playersOnline} online
            </div>
          )}

          {/* Profile button */}
          <button className="profile-btn" onClick={openMyProfile}>
            <span className="profile-btn-avatar">{myProfile.username.charAt(0).toUpperCase()}</span>
            <span className="profile-btn-text">Profile</span>
          </button>

          {/* Profile Modal */}
          {viewingProfile && (
            <ProfileModal
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
              profile={viewingProfile}
              onSave={handleSaveProfile}
              isEditable={isEditMode}
            />
          )}

          {/* Sign Out Confirmation Modal */}
          {isSignOutModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3 className="modal-title">Confirm Sign Out</h3>
                <p className="modal-body">Are you sure you want to sign out?</p>
                <div className="modal-actions">
                  <button className="confirm-btn" onClick={confirmSignOut}>Sign Out</button>
                  <button className="cancel-btn" onClick={() => setIsSignOutModalOpen(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .signout-btn {
          position: fixed;
          top: 16px;
          left: 16px;
          padding: 8px 16px;
          background: rgba(220, 53, 69, 0.9);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;
          z-index: 1000;
          transition: all 0.2s;
        }

        .signout-btn:hover {
          background: rgba(200, 35, 51, 1);
          transform: translateY(-2px);
        }

        .profile-btn {
          position: fixed;
          top: 16px;
          left: 120px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          z-index: 1000;
          transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .profile-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .profile-btn-avatar {
          width: 24px;
          height: 24px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        /* Sign Out Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
          backdrop-filter: blur(2px);
        }

        .modal-content {
          background: white;
          padding: 24px;
          border-radius: 12px;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.2);
          color: #2d3748;
          text-align: center;
        }

        .modal-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 12px;
          color: #1a202c;
        }

        .modal-body {
          margin-bottom: 24px;
          color: #4a5568;
        }

        .modal-actions {
          display: flex;
          justify-content: center;
          gap: 16px;
        }

        .confirm-btn {
          padding: 8px 16px;
          background: #e53e3e;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .confirm-btn:hover {
          background: #c53030;
        }

        .cancel-btn {
          padding: 8px 16px;
          background: #e2e8f0;
          color: #4a5568;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .cancel-btn:hover {
          background: #cbd5e0;
        }

        @media (max-width: 768px) {
          .profile-btn {
            left: 100px;
            padding: 6px 12px;
          }
          .profile-btn-text {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
