import React from 'react';
import { Link } from 'react-router-dom';
import { AdminCard, AdminCardTitle } from '../common/AdminCard';
import { AdminStatusDot } from '../common/AdminStatusDot';
import type { AuditLogItem } from '../../types/superAdmin';

interface AdminRecentActivityCardProps {
  logs: AuditLogItem[];
}

export const AdminRecentActivityCard: React.FC<AdminRecentActivityCardProps> = ({ logs }) => {
  return (
    <AdminCard>
      <AdminCardTitle
        right={
          <Link
            to="/admin/audit-logs"
            className="text-xs font-semibold text-[#2F63EB] hover:underline"
          >
            View all
          </Link>
        }
      >
        Recent activity
      </AdminCardTitle>
      <div className="flex flex-col gap-3.5">
        {logs.slice(0, 4).map((log, index) => (
          <div key={index} className="flex gap-2.5 items-start">
            <div className="mt-1.5">
              <AdminStatusDot status={log.severity} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-medium text-[#151A26] truncate">{log.action}</div>
              <div className="text-[11px] text-[#9AA2B1] mt-0.5 truncate">
                {log.actor} · {log.ts.split(' ')[1] || log.ts}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminCard>
  );
};
