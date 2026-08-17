import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { VaultPINBrandPanel } from '../../features/auth/components/VaultPINBrandPanel';
import { PINForm } from '../../features/auth/components/PINForm';
import { authPageClass, authShellClass } from '../../features/auth/components/authTailwind';
import { createPin, resetPin } from '../../features/auth/services/authService';

export const PINSetup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState =
    (location.state as { onboardingToken?: string; email?: string; flow?: string } | null) || {};
  const [step, setStep] = useState<'setup' | 'confirm'>('setup');
  const [initialPin, setInitialPin] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [resetKey, setResetKey] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isForgotPinFlow = locationState.flow === 'forgot-pin';

  const handleFirstPinEntered = (pin: string) => {
    setError('');
    setInitialPin(pin);
    setStep('confirm');
    setResetKey((prev) => prev + 1);
  };

  const handleConfirmPinEntered = async (confirmPin: string) => {
    if (confirmPin === initialPin) {
      try {
        setIsSubmitting(true);
        setError('');

        if (isForgotPinFlow) {
          const email = locationState.email;

          if (!email) {
            setError('Email not found. Please start the PIN reset process again.');
            setInitialPin('');
            setStep('setup');
            setResetKey((prev) => prev + 1);
            return;
          }

          await resetPin({
            email,
            newPin: initialPin,
            confirmPin,
          });
          alert('PIN reset successfully!');
          navigate('/login');
        } else {
          const onboardingToken = locationState.onboardingToken;

          if (!onboardingToken) {
            setError('Onboarding token is missing. Please verify your email again.');
            setInitialPin('');
            setStep('setup');
            setResetKey((prev) => prev + 1);
            return;
          }

          await createPin({
            pin: initialPin,
            confirmPin,
            onboardingToken,
          });
          alert('PIN set and confirmed successfully!');
          navigate('/');
        }
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : 'Unable to set your PIN. Please try again.'
        );
        setInitialPin('');
        setStep('setup');
        setResetKey((prev) => prev + 1);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setError('PINs do not match. Please try setting your PIN again.');
      setInitialPin('');
      setStep('setup');
      setResetKey((prev) => prev + 1);
    }
  };

  return (
    <div className={authPageClass}>
      <div className={authShellClass}>
        <VaultPINBrandPanel />
        <PINForm
          key={resetKey}
          title={step === 'setup' ? 'Set your security PIN' : 'Confirm your security PIN'}
          subtitle={
            step === 'setup'
              ? 'Choose a 4-digit PIN that unlocks VaultSaaS quickly on this device.'
              : 'Re-enter your 4-digit PIN to confirm and complete setup.'
          }
          error={error}
          isSubmitting={isSubmitting}
          onComplete={step === 'setup' ? handleFirstPinEntered : handleConfirmPinEntered}
        />
      </div>
    </div>
  );
};

export default PINSetup;
