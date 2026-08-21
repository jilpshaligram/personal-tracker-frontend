import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { AuthLoadingOverlay } from './AuthLoadingOverlay';
import {
  authEyebrowClass,
  authFormInnerClass,
  authFormPaneClass,
  authInputClass,
  authLabelClass,
  authLinkClass,
  authPrimaryButtonClass,
  authSubtitleClass,
  authTitleClass,
} from './authTailwind';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as { email?: string; message?: string } | null) || {};

  const [email, setEmail] = useState(locationState.email || '');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(locationState.message || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      setIsSubmitting(true);
      setError('');
      setSuccessMessage('');
      const response = await login({ email: email.trim(), password });
      sessionStorage.setItem('verifyPinAccess', 'true');

      const nextStep = response.data?.nextStep || response.nextStep;
      const emailVerified = response.data?.emailVerified ?? response.emailVerified;

      if (nextStep === 'EMAIL_VERIFICATION' || emailVerified === false) {
        navigate('/verify-email', {
          state: {
            email: email.trim(),
            flow: 'verify-email',
          },
        });
      } else {
        navigate('/verify-pin', {
          state: {
            email: email.trim(),
            flow: 'login',
          },
        });
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'Unable to sign in. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${authFormPaneClass} relative min-h-[400px]`}>
      {isSubmitting && (
        <AuthLoadingOverlay
          title="Signing in..."
          message="Authenticating credentials & establishing secure session"
        />
      )}
      <div className={authFormInnerClass}>
        <div className="mb-6 flex items-center justify-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-[#2F5FE0] to-[#5B8CF5] text-sm font-bold text-white shadow-sm">
            V
          </div>
          <span className="font-['Sora',sans-serif] text-lg font-bold text-[#16274F]">
            VaultSaaS
          </span>
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

        {successMessage && !error && (
          <div className="mb-5 rounded-[10px] border border-[#BDE4CE] bg-[#EDF8F2] px-3 py-2.5 text-center text-[13px] font-medium text-[#1A7F48]">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className={authLabelClass}>Email address</label>
            <input
              className={authInputClass(focused === 'email', Boolean(errors.email))}
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <p className="mt-1 text-xs text-[#E5484D]">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label className={authLabelClass}>Password</label>
            <div className="relative">
              <input
                className={authInputClass(
                  focused === 'password',
                  Boolean(errors.password),
                  'pr-10'
                )}
                type={showPw ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                aria-invalid={Boolean(errors.password)}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center text-[#6B7280]"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-[#E5484D]">{errors.password}</p>}
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
