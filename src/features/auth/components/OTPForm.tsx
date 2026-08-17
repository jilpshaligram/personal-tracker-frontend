import React, { useEffect, useRef, useState } from 'react';
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
import {
  authEyebrowClass,
  authFormInnerClass,
  authFormPaneClass,
  authMobileBrandClass,
  authMobileMarkClass,
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
  const [seconds, setSeconds] = useState(29);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const mm = String(Math.floor(Math.max(seconds, 0) / 60)).padStart(2, '0');
  const ss = String(Math.max(seconds, 0) % 60).padStart(2, '0');

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

      setSeconds(29);
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
    <div className={authFormPaneClass}>
      <div className={authFormInnerClass}>
        {/* Mobile-only brand badge */}
        <div className={authMobileBrandClass}>
          <div className={authMobileMarkClass}>V</div>
          VaultSaaS
        </div>

        <div className={authEyebrowClass}>{currentEyebrow}</div>
        <h1 className={authTitleClass}>{currentTitle}</h1>
        <p className={authSubtitleClass}>
          We sent a 6-digit code to{' '}
          <strong className="font-semibold text-[#16274F] break-all">{displayEmail}</strong>. Enter
          it below to continue.
        </p>

        {error && (
          <div className="mb-5 rounded-[10px] border border-[#F6C9C9] bg-[#FDECEC] px-3 py-2.5 text-center text-[13px] font-medium text-[#9A2E2E]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            className="mb-2 flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2.5 max-w-full"
            onPaste={handlePaste}
          >
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
                  "h-12 w-10 sm:h-[52px] sm:w-[46px] flex-1 sm:flex-initial max-w-[48px] rounded-[10px] border text-center font-['JetBrains_Mono',monospace] text-lg sm:text-xl font-semibold text-[#16274F] outline-none transition-[border-color,box-shadow,background-color]",
                  d
                    ? 'border-[#2F5FE0] bg-white shadow-[0_0_0_3px_rgba(47,95,224,0.12)]'
                    : 'border-[#E5E9F2] bg-[#FBFCFE]',
                ].join(' ')}
              />
            ))}
          </div>

          <div className="mb-6 mt-[18px] text-[13px] text-[#6B7280]">
            {seconds > 0 ? (
              <>
                Didn't get a code? <span className="text-[#6B7280]/50">Resend</span> in{' '}
                <span className="font-['JetBrains_Mono',monospace] font-semibold text-[#16274F]">
                  {mm}:{ss}
                </span>
              </>
            ) : (
              <>
                Didn't get a code?{' '}
                <span
                  onClick={resend}
                  className={`cursor-pointer font-semibold ${isResending ? 'text-[#6B7280]/50' : 'text-[#2F5FE0]'}`}
                  style={{ pointerEvents: isResending ? 'none' : 'auto' }}
                >
                  {isResending ? 'Sending...' : 'Resend'}
                </span>
              </>
            )}
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
