import React from 'react';
import { VaultVerifyOtpBrandPanel } from '../../features/auth/components/VaultVerifyOtpBrandPanel';
import { OTPForm } from '../../features/auth/components/OTPForm';
import { authPageClass, authShellClass } from '../../features/auth/components/authTailwind';

export const VerifyOTP: React.FC = () => {
  return (
    <div className={authPageClass}>
      <div className={authShellClass}>
        <VaultVerifyOtpBrandPanel />
        <OTPForm />
      </div>
    </div>
  );
};

export default VerifyOTP;
