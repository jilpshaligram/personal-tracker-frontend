import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyPin } from '../../features/auth/services/authService';
import { VaultPINBrandPanel } from '../../features/auth/components/VaultPINBrandPanel';
import { PINForm } from '../../features/auth/components/PINForm';
import { authPageClass, authShellClass } from '../../features/auth/components/authTailwind';
import { useAuth } from '../../context/AuthContext';
import type { User } from '../../context/AuthContext';
import {
  clearAuthTokens,
  decodeJwtPayload,
  getAccessToken,
  getRefreshToken,
} from '../../api/client';

export const VerifyPIN: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, verifyAuth } = useAuth();
  const locationState = (location.state as { email?: string; flow?: string } | null) || {};

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resolvedEmail =
    locationState.email ||
    user?.email ||
    decodeJwtPayload(getRefreshToken())?.email ||
    decodeJwtPayload(getAccessToken())?.email ||
    '';

  const handlePinEntered = async (pin: string) => {
    if (!resolvedEmail) {
      setError('Email not found. Please log in again.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      // 1. Verify PIN with backend
      const response = await verifyPin({ email: resolvedEmail, pin });

      // 2. Set pinVerified flag so verifyAuth allows token verification
      sessionStorage.setItem('pinVerified', 'true');

      // 3. Call verify-token (via verifyAuth)
      const isTokenValid = await verifyAuth();

      // 4. If verify-token is successful, move to dashboard; if not, go to login
      if (isTokenValid) {
        const userData = (response.data?.user || (response as { user?: unknown }).user) as
          User | undefined;

        if (userData && typeof userData === 'object') {
          login(userData);
        }

        navigate('/', { replace: true });
      } else {
        clearAuthTokens();
        setError('Token verification failed. Please login again.');
        navigate('/login', { replace: true });
      }
    } catch (submitError) {
      // If PIN fails: do NOT refresh token, do NOT grant access, keep user on PIN screen
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Unable to verify PIN. Please check your PIN and try again.'
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
