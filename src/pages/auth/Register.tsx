import React from 'react';
import { VaultSignupBrandPanel } from '../../features/auth/components/VaultSignupBrandPanel';
import { RegisterForm } from '../../features/auth/components/RegisterForm';
import { authPageClass, authShellClass } from '../../features/auth/components/authTailwind';

export const Register: React.FC = () => {
  return (
    <div className={authPageClass}>
      <div className={authShellClass}>
        <VaultSignupBrandPanel />
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
