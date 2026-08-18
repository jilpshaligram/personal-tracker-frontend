import React from 'react';
import { AdminCard } from './AdminCard';

interface AdminStatCardProps {
  label: string;
  value: string | number;
  icon?: React.ElementType;
  iconTone?: string;
  sub?: string;
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  label,
  value,
  icon: Icon,
  iconTone = '#9AA2B1',
  sub,
}) => {
  return (
    <AdminCard className="flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <span className="text-[13px] font-semibold text-[#151A26]">{label}</span>
        {Icon && <Icon className="w-4 h-4" style={{ color: iconTone }} />}
      </div>
      <div className="mt-2.5 text-2xl font-bold tracking-tight text-[#151A26]">{value}</div>
      {sub && <div className="mt-1 text-xs text-[#9AA2B1] font-medium">{sub}</div>}
    </AdminCard>
  );
};
