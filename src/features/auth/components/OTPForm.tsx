import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getOnboardingToken,
  resendEmailOtp,
  resendPasswordOtp,
  resendPinOtp,
  verifyEmail,
  verifyPasswordOtp,
  verifyPinOtp,
} from '../services/authService';
import { AuthLoadingOverlay } from './AuthLoadingOverlay';
import {
  authEyebrowClass,
  authFormInnerClass,
  authFormPaneClass,
  authMutedLinkClass,
  authPrimaryButtonClass,
  authSubtitleClass,
  authTitleClass,
} from './authTailwind';

interface OTPFormProps {
  eyebrow?: string;
  title?: string;
  email?: string;
  onVerify?: (otp: string) => void;
  nextRoute?: string;
}

export const OTPForm: React.FC<OTPFormProps> = ({
  eyebrow,
  title,
  email = 'a...@company.com',
  onVerify,
  nextRoute,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as { flow?: string; email?: string } | null) || {};

  const flow = locationState.flow || 'register';
  const displayEmail = locationState.email || email;

  const currentEyebrow =
    eyebrow ||
    (flow === 'forgot-password'
      ? 'Password Recovery'
      : flow === 'forgot-pin'
        ? 'PIN Recovery'
        : 'Step 3 of 4');

  const currentTitle =
    title ||
    (flow === 'forgot-password'
      ? 'Verify reset code'
      : flow === 'forgot-pin'
        ? 'Verify PIN reset code'
        : 'Verify your identity');

  const targetNextRoute =
    nextRoute ||
    (flow === 'forgot-password'
      ? '/reset-password'
      : flow === 'forgot-pin'
        ? '/pin-setup'
        : '/pin-setup');

  const backRoute =
    flow === 'forgot-password'
      ? '/forgot-password'
      : flow === 'forgot-pin'
        ? '/pin-setup'
        : flow === 'register'
          ? '/register'
          : '/login';

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, val: string) => {
    const v = val.replace(/[^0-9]/g, '').slice(-1);
    setError('');
    setDigits((d) => {
      const next = [...d];
      next[i] = v;
      return next;
    });
    if (v && i < 5) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData
      .getData('text')
      .replace(/[^0-9]/g, '')
      .slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = text.split('');
    while (next.length < 6) next.push('');
    setDigits(next);
    const lastIndex = Math.min(text.length, 6) - 1;
    if (lastIndex >= 0) inputsRef.current[lastIndex]?.focus();
  };

  const resend = async () => {
    try {
      setIsResending(true);
      setError('');

      if (flow === 'forgot-password') {
        await resendPasswordOtp(displayEmail);
      } else if (flow === 'forgot-pin') {
        await resendPinOtp(displayEmail);
      } else {
        await resendEmailOtp(displayEmail);
      }

      setDigits(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
    } catch (resendError) {
      setError(
        resendError instanceof Error
          ? resendError.message
          : 'Unable to resend code. Please try again.'
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length === 6) {
      if (onVerify) {
        onVerify(otp);
      } else {
        try {
          setIsSubmitting(true);
          setError('');

          if (flow === 'forgot-password') {
            await verifyPasswordOtp({ email: displayEmail, otp });
            sessionStorage.setItem('verifyPinAccess', 'true');

            navigate(targetNextRoute, {
              state: {
                email: displayEmail,
                flow,
              },
            });
          } else if (flow === 'forgot-pin') {
            await verifyPinOtp({ email: displayEmail, otp });
            sessionStorage.setItem('verifyPinAccess', 'true');

            navigate(targetNextRoute, {
              state: {
                email: displayEmail,
                flow,
              },
            });
          } else {
            const verification = await verifyEmail({ email: displayEmail, otp });
            sessionStorage.setItem('verifyPinAccess', 'true');
            navigate(targetNextRoute, {
              state: {
                email: displayEmail,
                flow,
                onboardingToken: getOnboardingToken(verification),
              },
            });
          }
        } catch (submitError) {
          setError(
            submitError instanceof Error
              ? submitError.message
              : 'Unable to verify your code. Please try again.'
          );
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  const isFormIncomplete = digits.some((d) => !d) || isSubmitting;

  return (
    <div className={`${authFormPaneClass} relative min-h-[380px]`}>
      {(isSubmitting || isResending) && (
        <AuthLoadingOverlay
          title={isResending ? 'Resending code...' : 'Verifying code...'}
          message={
            isResending
              ? 'Sending a new 6-digit verification code'
              : 'Validating your verification code'
          }
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

        <div className={authEyebrowClass}>{currentEyebrow}</div>
        <h1 className={authTitleClass}>{currentTitle}</h1>
        <p className={authSubtitleClass}>
          We sent a 6-digit code to{' '}
          <strong className="font-semibold text-[#16274F]">{displayEmail}</strong>. Enter it below
          to continue.
        </p>

        {error && (
          <div className="mb-5 rounded-[10px] border border-[#F6C9C9] bg-[#FDECEC] px-3 py-2.5 text-center text-[13px] font-medium text-[#9A2E2E]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-2 flex justify-center gap-1.5 sm:gap-2.5" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                maxLength={1}
                inputMode="numeric"
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={[
                  "h-[44px] w-[38px] sm:h-[52px] sm:w-[46px] rounded-[10px] border text-center font-['JetBrains_Mono',monospace] text-lg sm:text-xl font-semibold text-[#16274F] outline-none transition-[border-color,box-shadow,background-color]",
                  d
                    ? 'border-[#2F5FE0] bg-white shadow-[0_0_0_3px_rgba(47,95,224,0.12)]'
                    : 'border-[#E5E9F2] bg-[#FBFCFE]',
                ].join(' ')}
              />
            ))}
          </div>

          <div className="mb-6 mt-[18px] text-[13px] text-[#6B7280]">
            Didn't get a code?{' '}
            <span
              onClick={resend}
              className={`cursor-pointer font-semibold ${isResending ? 'text-[#6B7280]/50' : 'text-[#2F5FE0] hover:underline'}`}
              style={{ pointerEvents: isResending ? 'none' : 'auto' }}
            >
              {isResending ? 'Sending...' : 'Resend'}
            </span>
          </div>

          <button
            type="submit"
            disabled={isFormIncomplete}
            className={authPrimaryButtonClass(isFormIncomplete)}
          >
            {isSubmitting ? 'Verifying...' : 'Verify code'}
          </button>
        </form>

        <p onClick={() => navigate(backRoute)} className={authMutedLinkClass}>
          Back to sign in
        </p>
      </div>
    </div>
  );
};
