import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, verifyAuth } = useAuth();
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    const check = async () => {
      const isPinVerified = sessionStorage.getItem('pinVerified') === 'true';
      if (!isPinVerified) {
        if (active) setChecking(false);
        return;
      }

      if (!isAuthenticated) {
        await verifyAuth();
      }

      if (active) setChecking(false);
    };

    check();

    return () => {
      active = false;
    };
  }, [isAuthenticated, verifyAuth]);

  const isPinVerified = sessionStorage.getItem('pinVerified') === 'true';

  if (isLoading || checking) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2F5FE0] border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-slate-500">Checking authorization...</p>
        </div>
      </div>
    );
  }

  // 1. If PIN is unverified for this session: redirect to PIN verification
  if (!isPinVerified) {
    return <Navigate to="/verify-pin" replace state={{ from: location }} />;
  }

  // 2. If token verification failed: redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 3. Authenticated and PIN verified -> render dashboard
  return <>{children}</>;
};

export const VerifyPinGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default AuthGuard;
