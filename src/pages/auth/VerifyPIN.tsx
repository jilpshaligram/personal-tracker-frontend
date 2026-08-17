import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyPin } from '../../features/auth/services/authService';
import { VaultPINBrandPanel } from '../../features/auth/components/VaultPINBrandPanel';
import { PINForm } from '../../features/auth/components/PINForm';
import { authPageClass, authShellClass } from '../../features/auth/components/authTailwind';
import { useAuth } from '../../context/AuthContext';
import type { User } from '../../context/AuthContext';

export const VerifyPIN: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, verifyAuth } = useAuth();
  const locationState = (location.state as { email?: string } | null) || {};

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePinEntered = async (pin: string) => {
    const email = locationState.email;

    if (!email) {
      setError('Email not found. Please login again.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const response = await verifyPin({ email, pin });

      const userData = response.data?.user || (response as { user?: unknown }).user;

      if (userData && typeof userData === 'object') {
        login(userData as User);
        await verifyAuth();
      } else {
        const authenticated = await verifyAuth();
        if (!authenticated) {
          throw new Error('Session could not be established. Please try again.');
        }
      }

      navigate('/');
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Unable to verify PIN. Please try again.'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className={authPageClass}>
      <div className={authShellClass}>
        <VaultPINBrandPanel />
        <PINForm
          title="Enter your security PIN"
          subtitle="Enter your 4-digit PIN to unlock VaultSaaS."
          error={error}
          showForgotPin={true}
          isSubmitting={isSubmitting}
          onComplete={handlePinEntered}
        />
      </div>
    </div>
  );
};

export default VerifyPIN;
