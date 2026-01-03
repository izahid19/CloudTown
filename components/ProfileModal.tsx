'use client';

import { useState } from 'react';

interface ProfileData {
  username: string;
  about: string;
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
  github?: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  onSave: (profile: ProfileData) => void;
  isEditable: boolean;
}

export default function ProfileModal({ isOpen, onClose, profile, onSave, isEditable }: ProfileModalProps) {
  const [formData, setFormData] = useState<ProfileData>(profile);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="profile-close" onClick={onClose}>×</button>
        
        <div className="profile-header">
          <div className="profile-avatar">
            {profile.username.charAt(0).toUpperCase()}
          </div>
          <h2 className="profile-name">{profile.username}</h2>
        </div>

        {isEditable ? (
          <div className="profile-form">
            <div className="form-group">
              <label>Display Name</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Your display name"
              />
            </div>
            
            <div className="form-group">
              <label>About</label>
              <textarea
                value={formData.about}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>🔗 LinkedIn</label>
              <input
                type="url"
                value={formData.linkedin || ''}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div className="form-group">
              <label>🐦 Twitter</label>
              <input
                type="url"
                value={formData.twitter || ''}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                placeholder="https://twitter.com/username"
              />
            </div>

            <div className="form-group">
              <label>💼 Portfolio</label>
              <input
                type="url"
                value={formData.portfolio || ''}
                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                placeholder="https://yourportfolio.com"
              />
            </div>

            <div className="form-group">
              <label>🐙 GitHub</label>
              <input
                type="url"
                value={formData.github || ''}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                placeholder="https://github.com/username"
              />
            </div>

            <button className="profile-save-btn" onClick={handleSave}>
              Save Profile
            </button>
          </div>
        ) : (
          <div className="profile-view">
            {profile.about && (
              <div className="profile-about">
                <p>{profile.about}</p>
              </div>
            )}
            
            <div className="profile-socials">
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              )}
              {profile.twitter && (
                <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="social-link twitter">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Twitter
                </a>
              )}
              {profile.portfolio && (
                <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="social-link portfolio">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                  Portfolio
                </a>
              )}
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="social-link github">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              )}
            </div>
            
            {!profile.about && !profile.linkedin && !profile.twitter && !profile.portfolio && !profile.github && (
              <p className="profile-empty">No profile details yet</p>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .profile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          backdrop-filter: blur(4px);
        }

        .profile-modal {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 16px;
          padding: 24px;
          width: 90%;
          max-width: 400px;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .profile-close {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          font-size: 24px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s;
        }

        .profile-close:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .profile-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: bold;
          color: white;
          margin: 0 auto 12px;
          border: 3px solid rgba(255, 255, 255, 0.2);
        }

        .profile-name {
          color: white;
          font-size: 24px;
          margin: 0;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          color: rgba(255, 255, 255, 0.7);
          font-size: 12px;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 14px;
          transition: all 0.2s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          background: rgba(255, 255, 255, 0.15);
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .profile-save-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 8px;
        }

        .profile-save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .profile-about {
          background: rgba(255, 255, 255, 0.05);
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .profile-about p {
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          line-height: 1.5;
        }

        .profile-socials {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .social-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: white;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.2s;
        }

        .social-link:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateX(4px);
        }

        .social-link.linkedin:hover { background: rgba(0, 119, 181, 0.3); }
        .social-link.twitter:hover { background: rgba(29, 161, 242, 0.3); }
        .social-link.github:hover { background: rgba(255, 255, 255, 0.2); }
        .social-link.portfolio:hover { background: rgba(102, 126, 234, 0.3); }

        .profile-empty {
          color: rgba(255, 255, 255, 0.5);
          text-align: center;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
