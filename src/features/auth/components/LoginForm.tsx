import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { GoogleIcon } from './GoogleIcon';
import {
  authEyebrowClass,
  authFormInnerClass,
  authFormPaneClass,
  authInputClass,
  authLabelClass,
  authLinkClass,
  authMobileBrandClass,
  authMobileMarkClass,
  authPrimaryButtonClass,
  authSubtitleClass,
  authTitleClass,
} from './authTailwind';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await login({ email, password });
      sessionStorage.setItem('verifyPinAccess', 'true');
      navigate('/verify-pin', { state: { email, flow: 'login' } });
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'Unable to sign in. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={authFormPaneClass}>
      <div className={authFormInnerClass}>
        {/* Mobile-only brand badge */}
        <div className={authMobileBrandClass}>
          <div className={authMobileMarkClass}>V</div>
          VaultSaaS
        </div>

        <div className={authEyebrowClass}>Personal finance</div>
        <h1 className={authTitleClass}>Sign in to VaultSaaS</h1>
        <p className={authSubtitleClass}>
          Pick up where you left off with your budgets and spending trends.
        </p>

        {error && (
          <div className="mb-5 rounded-[10px] border border-[#F6C9C9] bg-[#FDECEC] px-3 py-2.5 text-center text-[13px] font-medium text-[#9A2E2E]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={authLabelClass}>Email address</label>
            <input
              className={authInputClass(focused === 'email')}
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
            />
          </div>

          <div className="mb-4">
            <label className={authLabelClass}>Password</label>
            <div className="relative">
              <input
                className={authInputClass(focused === 'password', 'pr-10')}
                type={showPw ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center text-[#6B7280]"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="mb-5 flex justify-end text-[13px]">
            <span onClick={() => navigate('/forgot-password')} className={authLinkClass}>
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={authPrimaryButtonClass(isSubmitting)}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="my-[22px] flex items-center gap-3 text-xs text-[#6B7280]">
          <div className="h-px flex-1 bg-[#E5E9F2]" />
          or continue with
          <div className="h-px flex-1 bg-[#E5E9F2]" />
        </div>

        <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-[#E5E9F2] bg-white px-3 py-[11px] text-sm font-semibold text-[#16274F]">
          <GoogleIcon />
          Sign in with Google
        </button>

        <p className="mt-6 text-center text-[13.5px] text-[#6B7280]">
          New to VaultSaaS?{' '}
          <span onClick={() => navigate('/register')} className={authLinkClass}>
            Create an account
          </span>
        </p>
      </div>
    </div>
  );
};
