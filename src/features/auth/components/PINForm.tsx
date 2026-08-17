import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { forgotPin } from '../services/authService';
import {
  authAlertClass,
  authEyebrowClass,
  authFormInnerClass,
  authFormPaneClass,
  authLinkClass,
  authMobileBrandClass,
  authMobileMarkClass,
  authPrimaryButtonClass,
  authSubtitleClass,
  authTitleClass,
} from './authTailwind';

interface PINFormProps {
  title?: string;
  subtitle?: string;
  error?: string;
  showForgotPin?: boolean;
  isSubmitting?: boolean;
  onForgotPin?: () => void;
  onComplete?: (pin: string) => void;
}

export const PINForm: React.FC<PINFormProps> = ({
  title = 'Set your security PIN',
  subtitle = 'Choose a 4-digit PIN that unlocks VaultSaaS quickly on this device.',
  error = '',
  showForgotPin = false,
  isSubmitting = false,
  onForgotPin,
  onComplete,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as { email?: string } | null) || {};

  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [forgotPinError, setForgotPinError] = useState('');
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (i: number, val: string) => {
    const v = val.replace(/[^0-9]/g, '').slice(-1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);

    if (v && i < 3) {
      inputsRef.current[i + 1]?.focus();
    }
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
      .slice(0, 4);
    if (!text) return;
    e.preventDefault();
    const next = text.split('');
    while (next.length < 4) next.push('');
    setDigits(next);
    const lastIndex = Math.min(text.length, 4) - 1;
    if (lastIndex >= 0) inputsRef.current[lastIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pinStr = digits.join('');
    if (!isSubmitting && pinStr.length === 4) {
      onComplete?.(pinStr);
    }
  };

  const handleForgotPinClick = async () => {
    if (onForgotPin) {
      onForgotPin();
    } else {
      const email = locationState.email;

      if (!email) {
        setForgotPinError('Email not found. Please login again.');
        return;
      }

      try {
        setForgotPinError('');
        await forgotPin(email);
        navigate('/verify-otp', { state: { flow: 'forgot-pin', email } });
      } catch (err) {
        setForgotPinError(
          err instanceof Error ? err.message : 'Unable to send reset code. Please try again.'
        );
      }
    }
  };

  const isFormIncomplete = digits.some((d) => !d) || isSubmitting;

  const displayError = error || forgotPinError;

  return (
    <div className={authFormPaneClass}>
      <div className={authFormInnerClass}>
        {/* Mobile-only brand badge */}
        <div className={authMobileBrandClass}>
          <div className={authMobileMarkClass}>V</div>
          VaultSaaS
        </div>

        <div className={authEyebrowClass}>Security verification</div>
        <h1 className={authTitleClass}>{title}</h1>
        <p className={authSubtitleClass}>{subtitle}</p>

        {displayError && <div className={`${authAlertClass} mb-6`}>{displayError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex justify-center gap-2.5 sm:gap-3.5" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                maxLength={1}
                inputMode="numeric"
                type="password"
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={[
                  "h-14 w-12 sm:h-[58px] sm:w-[52px] rounded-xl border-[1.5px] text-center font-['JetBrains_Mono',monospace] text-xl sm:text-[22px] font-semibold text-[#16274F] outline-none transition-[border-color,box-shadow,background-color]",
                  d
                    ? 'border-[#2F5FE0] bg-white shadow-[0_0_0_3px_rgba(47,95,224,0.12)]'
                    : 'border-[#E5E9F2] bg-[#FBFCFE]',
                ].join(' ')}
              />
            ))}
          </div>

          {showForgotPin && (
            <div className="mb-5 flex justify-end text-[13px]">
              <span onClick={handleForgotPinClick} className={authLinkClass}>
                Forgot PIN?
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={isFormIncomplete}
            className={authPrimaryButtonClass(isFormIncomplete)}
          >
            {isSubmitting ? 'Creating PIN...' : 'Continue'}
          </button>
        </form>

        <div className="mt-6 flex items-start gap-2 rounded-[10px] border border-[#F6C9C9] bg-[#FDECEC] px-3 py-2.5 text-[12.5px] leading-normal text-[#9A2E2E]">
          <span>!</span>
          <span>
            Choose a PIN you don't use elsewhere. You'll need it every time you open VaultSaaS on
            this device.
          </span>
        </div>
      </div>
    </div>
  );
};
