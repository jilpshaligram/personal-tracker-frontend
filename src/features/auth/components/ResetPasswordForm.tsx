import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/authService';
import { scorePassword, strengthMeta } from '../utils/passwordStrength';
import { AuthLoadingOverlay } from './AuthLoadingOverlay';
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
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const score = scorePassword(password);
  const meta = strengthMeta(password, score);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      newErrors.password = 'New password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    } else if (score < 2) {
      newErrors.password = 'Password is too weak. Please choose a stronger password.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password.';
    } else if (password && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

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
    <div className={`${authFormPaneClass} relative min-h-[380px]`}>
      {isSubmitting && (
        <AuthLoadingOverlay
          title="Resetting password..."
          message="Updating your credentials & securing your account"
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

        <div className={authEyebrowClass}>Security</div>
        <h1 className={authTitleClass}>Set new password</h1>
        <p className={`${authSubtitleClass} mb-6`}>
          Your new password must be different from previously used passwords.
        </p>

        {error && <div className={`${authAlertClass} mb-5`}>{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-5">
            <label className={authLabelClass}>New password</label>
            <div className="relative">
              <input
                className={authInputClass(
                  focused === 'password',
                  Boolean(errors.password),
                  'pr-10'
                )}
                type={showPw ? 'text' : 'password'}
                placeholder="Create a new password"
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
            <div className="mt-2 flex gap-[5px]">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={strengthBarClass(i < score, score)} />
              ))}
            </div>
            {errors.password && <p className="mt-1 text-xs text-[#E5484D]">{errors.password}</p>}
            <div className={strengthTextClass(score, password.length > 0)}>{meta.label}</div>
          </div>

          <div className="mb-6">
            <label className={authLabelClass}>Confirm new password</label>
            <div className="relative">
              <input
                className={authInputClass(
                  focused === 'confirmPassword',
                  Boolean(errors.confirmPassword),
                  'pr-10'
                )}
                type={showConfirmPw ? 'text' : 'password'}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                onFocus={() => setFocused('confirmPassword')}
                onBlur={() => setFocused(null)}
                aria-invalid={Boolean(errors.confirmPassword)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw((s) => !s)}
                className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center text-[#6B7280]"
              >
                {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-[#E5484D]">{errors.confirmPassword}</p>
            )}
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
