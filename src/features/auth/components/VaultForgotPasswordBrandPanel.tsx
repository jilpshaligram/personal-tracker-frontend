import React from 'react';
import { VaultDial } from './VaultDial';
import {
  authBrandCenterClass,
  authBrandCopyClass,
  authBrandFootnoteClass,
  authBrandHeadlineClass,
  authBrandLogoClass,
  authBrandMarkClass,
  authBrandPanelClass,
} from './authTailwind';

export const VaultForgotPasswordBrandPanel: React.FC = () => {
  return (
    <div className={authBrandPanelClass}>
      <div className={authBrandLogoClass}>
        <div className={authBrandMarkClass}>V</div>
        VaultSaaS
      </div>

      <div className={authBrandCenterClass}>
        <VaultDial />
        <div>
          <div className={authBrandHeadlineClass}>Reset your vault access</div>
          <div className={authBrandCopyClass}>
            Don't worry. We'll send a secure code to help you regain access in seconds.
          </div>
        </div>
      </div>

      <div className={authBrandFootnoteClass}>Bank-level encryption - SOC 2 Type II certified</div>
    </div>
  );
};
