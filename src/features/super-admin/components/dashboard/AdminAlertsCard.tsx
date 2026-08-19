import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { AdminCard, AdminCardTitle } from '../common/AdminCard';
import { EmptyBox } from '../common/EmptyBox';
import type { AlertItem } from '../../types/superAdmin';

interface AdminAlertsCardProps {
  alerts: AlertItem[];
}

export const AdminAlertsCard: React.FC<AdminAlertsCardProps> = ({ alerts }) => {
  return (
    <AdminCard>
      <AdminCardTitle>Alerts</AdminCardTitle>
      <div className="flex flex-col gap-3">
        {alerts.map((alert, idx) => (
          <div key={idx} className="flex gap-2.5 items-start">
            <AlertTriangle className="w-4 h-4 text-[#E14C58] mt-0.5 shrink-0" />
            <div>
              <div className="text-[12.5px] font-medium text-[#151A26]">{alert.title}</div>
              <div className="text-[11px] text-[#9AA2B1] mt-0.5">{alert.subtitle}</div>
            </div>
          </div>
        ))}
        <div className="border-t border-[#E7E9F0] pt-3">
          <EmptyBox>No other active alerts.</EmptyBox>
        </div>
      </div>
    </AdminCard>
  );
};
