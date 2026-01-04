'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/authApi';

type AuthMode = 'login' | 'register' | 'forgot' | 'otp';

interface LoginClientProps {
  onDiscordSignIn: () => Promise<void>;
}

export default function LoginClient({ onDiscordSignIn }: LoginClientProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState(0);
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await authApi.register(username, email, password);
      setSuccess('Verification code sent to your email!');
      setMode('otp');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  /* 
   * Updated to use NextAuth signIn for email credentials 
   * This ensures unified session management with Discord auth
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // We import signIn dynamically or use the prop if passed, 
    // but since this is a client component we use client-side signIn
    const { signIn } = await import('next-auth/react');
    
    try {
      // First check if email is verified
      try {
        // We still need to check verification status before letting NextAuth sign in
        // because NextAuth authorize() error handling is limited
        const result = await authApi.login(email, password);
        // If login API succeeds, it means credentials are valid and email is verified
      } catch (err: unknown) {
        const error = err as { message?: string; needsVerification?: boolean };
        if (error.needsVerification) {
          setMode('otp');
          setSuccess('Please verify your email first');
          setLoading(false);
          return;
        }
        // If it's just invalid credentials, let NextAuth handle it or show error now
        if (error.message) {
          setError(error.message);
          setLoading(false);
          return;
        }
      }

      // Proceed with NextAuth sign in
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        setError(result.error);
      } else {
        // Successful login - NextAuth handles the session
        // Redirect to game
        router.push('/game/cloudtown');
        router.refresh();
      }
    } catch (err: unknown) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await authApi.verifyOtp(email, otpCode);
      
      // Show success and switch to login
      setSuccess('Email verified successfully! Please login.');
      setMode('login');
      setPassword(''); // Clear password for security
      setOtp(['', '', '', '', '', '']);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      setOtp(['', '', '', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    
    setError('');
    setLoading(true);
    
    try {
      await authApi.resendOtp(email);
      setSuccess('New verification code sent!');
      setCooldown(120);
    } catch (err: unknown) {
      const error = err as { cooldown?: number; message?: string };
      if (error.cooldown) {
        setCooldown(error.cooldown);
      }
      setError(error.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await authApi.forgotPassword(email);
      setSuccess('If the email exists, a reset link has been sent');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="clouds-bg">
        <div className="cloud" style={{ top: '15%', animationDuration: '25s', animationDelay: '-5s' }} />
        <div className="cloud" style={{ top: '45%', animationDuration: '35s', animationDelay: '-15s', transform: 'scale(0.8)' }} />
        <div className="cloud" style={{ top: '75%', animationDuration: '20s', animationDelay: '-2s' }} />
      </div>

      <div className="login-container">
        <div className="login-header">
          <h1>☁️ Cloud Town</h1>
          <p>A multiplayer virtual world to explore together</p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        {mode === 'otp' ? (
          <div className="otp-section">
            <h2>Verify Your Email</h2>
            <p>Enter the 6-digit code sent to<br/><strong>{email}</strong></p>
            
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => { otpRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="otp-input"
                  disabled={loading}
                />
              ))}
            </div>

            <button 
              onClick={handleVerifyOtp} 
              className="auth-btn primary"
              disabled={loading || otp.join('').length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>

            <div className="resend-row">
              <span className="resend-text">Didn't receive code?</span>
              {cooldown > 0 ? (
                <span className="resend-timer">{cooldown}s</span>
              ) : (
                <button 
                  onClick={handleResendOtp} 
                  className="resend-link"
                  disabled={loading}
                >
                  Resend
                </button>
              )}
            </div>

            <button onClick={() => setMode('login')} className="auth-link">
              ← Back to Login
            </button>
          </div>
        ) : mode === 'forgot' ? (
          <form onSubmit={handleForgotPassword} className="auth-form">
            <h2>Reset Password</h2>
            <p>Enter your email to receive a reset link</p>
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            <button type="submit" className="auth-btn primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <button type="button" onClick={() => setMode('login')} className="auth-link">
              ← Back to Login
            </button>
          </form>
        ) : (
          <>
            <div className="auth-tabs">
              <button 
                className={`tab ${mode === 'login' ? 'active' : ''}`}
                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              >
                Login
              </button>
              <button 
                className={`tab ${mode === 'register' ? 'active' : ''}`}
                onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
              >
                Register
              </button>
            </div>

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="auth-form">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />

                <button type="submit" className="auth-btn primary" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>

                <button 
                  type="button" 
                  onClick={() => setMode('forgot')} 
                  className="auth-link"
                >
                  Forgot Password?
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="auth-form">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                  required
                  disabled={loading}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
                <input
                  type="password"
                  placeholder="Password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                  disabled={loading}
                />

                <button type="submit" className="auth-btn primary" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            )}

            <div className="auth-divider">
              <span>or</span>
            </div>

            <form action={onDiscordSignIn}>
              <button type="submit" className="auth-btn discord">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Sign in with Discord
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
