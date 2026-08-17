import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VaultBrandPanel } from '../../features/auth/components/VaultBrandPanel';
import { LoginForm } from '../../features/auth/components/LoginForm';
import { authPageClass, authShellClass } from '../../features/auth/components/authTailwind';
import { getRefreshToken, isJwtExpired } from '../../api/client';

export const Login: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const refreshToken = getRefreshToken();
    const isRefreshValid = Boolean(refreshToken && !isJwtExpired(refreshToken));
    const isPinVerified = sessionStorage.getItem('pinVerified') === 'true';

    if (isRefreshValid) {
      if (isPinVerified) {
        navigate('/', { replace: true });
      } else {
        navigate('/verify-pin', { replace: true });
      }
    }
  }, [navigate]);

  return (
    <div className={authPageClass}>
      <div className={authShellClass}>
        <VaultBrandPanel />
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
