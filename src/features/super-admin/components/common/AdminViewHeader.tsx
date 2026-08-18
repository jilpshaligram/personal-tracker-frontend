import React from 'react';

interface AdminViewHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export const AdminViewHeader: React.FC<AdminViewHeaderProps> = ({ title, subtitle, right }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#151A26]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-[#6B7280]">{subtitle}</p>}
      </div>
      {right && <div className="flex items-center gap-2.5">{right}</div>}
    </div>
  );
};
