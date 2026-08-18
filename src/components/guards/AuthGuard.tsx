import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context';

const hasSessionToken = (): boolean => {
  const cookieMatch = document.cookie.match(
    /(?:^|;\s*)(refreshToken|accessToken|sessionId)=([^;]+)/
  );
  return Boolean(cookieMatch);
};

const hasAllowedVerifyPinFlow = (locationState?: Record<string, unknown>): boolean => {
  const flow = locationState?.flow;
  const hasEmail = Boolean(locationState?.email);

  if (typeof flow === 'string') {
    const allowedFlows = new Set([
      'login',
      'register',
      'verify-email',
      'forgot-password',
      'forgot-pin',
    ]);
    if (allowedFlows.has(flow)) {
      return true;
    }
  }

  return hasEmail;
};

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2F5FE0] border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-slate-500">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const isExplicitLogout =
      typeof window !== 'undefined' && sessionStorage.getItem('explicitLogout') === 'true';

    if (isExplicitLogout) {
      sessionStorage.removeItem('explicitLogout');
    } else {
      alert('Access Denied: You are not authorized to access this page. Please login.');
    }

    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export const PublicOnlyGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2F5FE0] border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    const from =
      (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export const VerifyPinGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, verifyAuth } = useAuth();
  const location = useLocation();
  const [isEligible, setIsEligible] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    const checkAccess = async () => {
      const state = (location.state as Record<string, unknown> | null) || {};
      const sessionMarker = sessionStorage.getItem('verifyPinAccess') === 'true';
      const allowedFlow = hasAllowedVerifyPinFlow(state);

      if (isAuthenticated || hasSessionToken() || sessionMarker || allowedFlow) {
        setIsEligible(true);
        return;
      }

      const verified = await verifyAuth();
      if (!active) return;
      setIsEligible(
        Boolean(
          verified || hasSessionToken() || sessionStorage.getItem('verifyPinAccess') === 'true'
        )
      );
    };

    checkAccess();

    return () => {
      active = false;
    };
  }, [isAuthenticated, location.state, verifyAuth]);

  if (isLoading || isEligible === null) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2F5FE0] border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-slate-500">Checking PIN access...</p>
        </div>
      </div>
    );
  }

  if (!isEligible) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default AuthGuard;
