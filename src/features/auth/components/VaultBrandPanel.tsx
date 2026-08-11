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

export const VaultBrandPanel: React.FC = () => {
  return (
    <div className={authBrandPanelClass}>
      <div className={authBrandLogoClass}>
        <div className={authBrandMarkClass}>V</div>
        VaultSaaS
      </div>

      <div className={authBrandCenterClass}>
        <VaultDial />
        <div>
          <div className={authBrandHeadlineClass}>Welcome back to your vault</div>
          <div className={authBrandCopyClass}>
            Every step here adds another layer to how your money stays yours.
          </div>
        </div>
      </div>

      <div className={authBrandFootnoteClass}>Bank-level encryption - SOC 2 Type II certified</div>
    </div>
  );
};
