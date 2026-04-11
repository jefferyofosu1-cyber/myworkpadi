import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { KeyRound, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../utils/api';
import './AuthFlow.css';

export default function AuthFlow() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isTasker = searchParams.get('type') === 'tasker';

  const [step, setStep] = useState('IDENTIFIER_INPUT'); // IDENTIFIER_INPUT | OTP_INPUT
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleIdentifierSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    
    setIsLoading(true);
    try {
      await api.post('/auth/trigger-otp', { identifier });
      setStep('OTP_INPUT');
    } catch (err) {
      alert(`OTP Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length < 4) return;

    setIsLoading(true);
    try {
      const result = await api.post('/auth/verify-otp', { identifier, token: otp });
      localStorage.setItem('taskgh_token', result.token);
      localStorage.setItem('taskgh_user_id', result.user.id);
      
      if (isTasker) {
        navigate('/tasker');
      } else {
        navigate('/');
      }
    } catch (err) {
      alert(`Verification Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    // Simulate OAuth redirect mapping
    setTimeout(() => {
      setIsLoading(false);
      if (isTasker) navigate('/tasker');
      else navigate('/');
    }, 1500);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            {step === 'OTP_INPUT' && (
              <button 
                type="button" 
                className="back-btn" 
                onClick={() => setStep('IDENTIFIER_INPUT')}
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2>{step === 'IDENTIFIER_INPUT' ? (isTasker ? "Become a Tasker" : "Welcome to TaskGH") : "Enter verification code"}</h2>
            <p>
              {step === 'IDENTIFIER_INPUT' 
                ? "Sign up or log in to continue."
                : `We've sent a code to ${identifier}.`
              }
            </p>
          </div>

          {step === 'IDENTIFIER_INPUT' ? (
            <div className="auth-body">
              <form onSubmit={handleIdentifierSubmit}>
                <div className="form-group">
                  <label>Email or Phone Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 0244123456 or user@gmail.com" 
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary btn-full auth-submit"
                  disabled={isLoading || !identifier}
                >
                  {isLoading ? <Loader2 className="spinner" size={20} /> : "Continue"}
                </button>
              </form>

              <div className="auth-divider">
                <span>OR</span>
              </div>

              <button 
                type="button" 
                className="btn btn-outline btn-full google-btn"
                onClick={handleGoogleAuth}
                disabled={isLoading}
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                Continue with Google
              </button>
            </div>
          ) : (
            <div className="auth-body">
              <form onSubmit={handleOtpSubmit}>
                <div className="form-group pin-group">
                  <label>Verification Code</label>
                  <input 
                    type="text" 
                    placeholder="Enter 6-digit code" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    className="pin-input"
                    autoFocus
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary btn-full auth-submit"
                  disabled={isLoading || otp.length < 4}
                >
                  {isLoading ? <Loader2 className="spinner" size={20} /> : "Verify & Log in"}
                </button>
              </form>
              
              <p className="resend-text">
                Didn't receive the code? <button type="button" className="text-btn">Resend</button>
              </p>
            </div>
          )}

          <div className="auth-footer">
            By continuing, you agree to TaskGH's <Link to="#">Terms of Service</Link> and <Link to="#">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    </div>
  );
}
