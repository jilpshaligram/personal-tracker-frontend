import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/authService';
import { AuthLoadingOverlay } from './AuthLoadingOverlay';
import {
  authEyebrowClass,
  authFormInnerClass,
  authFormPaneClass,
  authInputClass,
  authLabelClass,
  authMutedLinkClass,
  authPrimaryButtonClass,
  authSubtitleClass,
  authTitleClass,
} from './authTailwind';

export const ForgotPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [focused, setFocused] = useState(false);
  const [fieldError, setFieldError] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setFieldError('Email address is required.');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setFieldError('Please enter a valid email address.');
      return;
    }
    setFieldError('');

    try {
      setIsSubmitting(true);
      setError('');
      await forgotPassword(email.trim());
      navigate('/verify-otp', { state: { flow: 'forgot-password', email: email.trim() } });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Unable to send reset code. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${authFormPaneClass} relative min-h-[350px]`}>
      {isSubmitting && (
        <AuthLoadingOverlay
          title="Sending reset code..."
          message="Sending a 6-digit password recovery code to your email"
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

        <div className={authEyebrowClass}>Account recovery</div>
        <h1 className={authTitleClass}>Forgot password?</h1>
        <p className={authSubtitleClass}>
          Enter your email address below and we'll send you a 6-digit code to reset your password.
        </p>

        {error && (
          <div className="mb-5 rounded-[10px] border border-[#F6C9C9] bg-[#FDECEC] px-3 py-2.5 text-center text-[13px] font-medium text-[#9A2E2E]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-5">
            <label className={authLabelClass}>Email address</label>
            <input
              className={authInputClass(focused, Boolean(fieldError))}
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldError) setFieldError('');
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              aria-invalid={Boolean(fieldError)}
            />
            {fieldError && <p className="mt-1 text-xs text-[#E5484D]">{fieldError}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={authPrimaryButtonClass(isSubmitting)}
          >
            {isSubmitting ? 'Sending code...' : 'Send reset code'}
          </button>
        </form>

        <p onClick={() => navigate('/login')} className={authMutedLinkClass}>
          Back to sign in
        </p>
      </div>
    </div>
  );
};
