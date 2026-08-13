import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const OTP_FLAG = 'otp_allowed';

export const OtpGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAllowed = sessionStorage.getItem(OTP_FLAG) === '1';

  useEffect(() => {
    if (isAllowed) {
      sessionStorage.removeItem(OTP_FLAG);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isAllowed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

// eslint-disable-next-line react-refresh/only-export-components
export function grantOtpAccess(): void {
  sessionStorage.setItem(OTP_FLAG, '1');
}
