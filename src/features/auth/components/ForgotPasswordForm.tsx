import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/authService';
import {
  authEyebrowClass,
  authFormInnerClass,
  authFormPaneClass,
  authInputClass,
  authLabelClass,
  authMobileBrandClass,
  authMobileMarkClass,
  authMutedLinkClass,
  authPrimaryButtonClass,
  authSubtitleClass,
  authTitleClass,
} from './authTailwind';

export const ForgotPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await forgotPassword(email);
      navigate('/verify-otp', { state: { flow: 'forgot-password', email } });
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
    <div className={authFormPaneClass}>
      <div className={authFormInnerClass}>
        {/* Mobile-only brand badge */}
        <div className={authMobileBrandClass}>
          <div className={authMobileMarkClass}>V</div>
          VaultSaaS
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

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className={authLabelClass}>Email address</label>
            <input
              className={authInputClass(focused)}
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              required
            />
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
