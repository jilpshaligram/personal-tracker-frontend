import React from 'react';

interface AdminCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const AdminCard: React.FC<AdminCardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`rounded-xl border border-[#E7E9F0] bg-white p-4.5 sm:p-5 shadow-xs ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

interface AdminCardTitleProps {
  children: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

export const AdminCardTitle: React.FC<AdminCardTitleProps> = ({
  children,
  right,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between mb-3.5 ${className}`}>
      <h3 className="text-[14.5px] font-bold text-[#151A26] tracking-tight">{children}</h3>
      {right}
    </div>
  );
};
