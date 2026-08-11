import React from 'react';
import { VaultBrandPanel } from '../../features/auth/components/VaultBrandPanel';
import { LoginForm } from '../../features/auth/components/LoginForm';
import { authPageClass, authShellClass } from '../../features/auth/components/authTailwind';

export const Login: React.FC = () => {
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
