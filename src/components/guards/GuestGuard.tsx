import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const GuestGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const hasSession = Boolean(localStorage.getItem('accessToken'));

  if (hasSession) {
    return <Navigate to="/verify-pin" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
