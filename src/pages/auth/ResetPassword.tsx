import React from 'react';
import { VaultForgotPasswordBrandPanel } from '../../features/auth/components/VaultForgotPasswordBrandPanel';
import { ResetPasswordForm } from '../../features/auth/components/ResetPasswordForm';
import { authPageClass, authShellClass } from '../../features/auth/components/authTailwind';

export const ResetPassword: React.FC = () => {
  return (
    <div className={authPageClass}>
      <div className={authShellClass}>
        <VaultForgotPasswordBrandPanel />
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPassword;
