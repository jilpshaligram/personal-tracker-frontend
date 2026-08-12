import React from 'react';
import { VaultForgotPasswordBrandPanel } from '../../features/auth/components/VaultForgotPasswordBrandPanel';
import { ForgotPasswordForm } from '../../features/auth/components/ForgotPasswordForm';
import { authPageClass, authShellClass } from '../../features/auth/components/authTailwind';

export const ForgotPassword: React.FC = () => {
  return (
    <div className={authPageClass}>
      <div className={authShellClass}>
        <VaultForgotPasswordBrandPanel />
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPassword;
