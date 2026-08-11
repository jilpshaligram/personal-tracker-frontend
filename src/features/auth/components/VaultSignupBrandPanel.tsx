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

export const VaultSignupBrandPanel: React.FC = () => {
  return (
    <div className={authBrandPanelClass}>
      <div className={authBrandLogoClass}>
        <div className={authBrandMarkClass}>V</div>
        VaultSaaS
      </div>

      <div className={authBrandCenterClass}>
        <VaultDial />
        <div>
          <div className={authBrandHeadlineClass}>A new vault, built around you</div>
          <div className={authBrandCopyClass}>
            Set the combination once. We'll handle the rest, every time you return.
          </div>
        </div>
      </div>

      <div className={authBrandFootnoteClass}>Bank-level encryption - SOC 2 Type II certified</div>
    </div>
  );
};
