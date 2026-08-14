import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/authService';
import { scorePassword, strengthMeta } from '../utils/passwordStrength';
import {
  authAlertClass,
  authEyebrowClass,
  authFormInnerClass,
  authFormPaneClass,
  authInputClass,
  authLabelClass,
  authMutedLinkClass,
  authPrimaryButtonClass,
  authSubtitleClass,
  authTitleClass,
  strengthBarClass,
  strengthTextClass,
} from './authTailwind';

export const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as { email?: string } | null) || {};

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const score = scorePassword(password);
  const meta = strengthMeta(password, score);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    if (score < 2) {
      setError('Password is too weak. Please choose a stronger password.');
      return;
    }

    const email = locationState.email;

    if (!email) {
      setError('Email not found. Please start the password reset process again.');
      setTimeout(() => navigate('/forgot-password'), 2000);
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      await resetPassword({
        email,
        newPassword: password,
        confirmPassword,
      });

      alert('Password reset successfully! Please sign in with your new password.');
      navigate('/login');
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Unable to reset password. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={authFormPaneClass}>
      <div className={authFormInnerClass}>
        <div className={authEyebrowClass}>Security</div>
        <h1 className={authTitleClass}>Set new password</h1>
        <p className={`${authSubtitleClass} mb-6`}>
          Your new password must be different from previously used passwords.
        </p>

        {error && <div className={`${authAlertClass} mb-5`}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className={authLabelClass}>New password</label>
            <div className="relative">
              <input
                className={authInputClass(focused === 'password', 'pr-10')}
                type={showPw ? 'text' : 'password'}
                placeholder="Create a new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center text-[#6B7280]"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="mt-2 flex gap-[5px]">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={strengthBarClass(i < score, score)} />
              ))}
            </div>
            <div className={strengthTextClass(score, password.length > 0)}>{meta.label}</div>
          </div>

          <div className="mb-6">
            <label className={authLabelClass}>Confirm new password</label>
            <div className="relative">
              <input
                className={authInputClass(focused === 'confirmPassword', 'pr-10')}
                type={showConfirmPw ? 'text' : 'password'}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setFocused('confirmPassword')}
                onBlur={() => setFocused(null)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw((s) => !s)}
                className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center text-[#6B7280]"
              >
                {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={authPrimaryButtonClass(isSubmitting)}
          >
            {isSubmitting ? 'Resetting password...' : 'Reset password'}
          </button>
        </form>

        <p onClick={() => navigate('/login')} className={authMutedLinkClass}>
          Back to sign in
        </p>
      </div>
    </div>
  );
};
