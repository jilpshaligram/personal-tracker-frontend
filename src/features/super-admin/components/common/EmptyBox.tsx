import React from 'react';

interface EmptyBoxProps {
  children: React.ReactNode;
  className?: string;
}

export const EmptyBox: React.FC<EmptyBoxProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`rounded-lg border border-dashed border-[#E7E9F0] bg-[#F1F3F8] p-6 text-center text-xs font-medium text-[#9AA2B1] ${className}`}
    >
      {children}
    </div>
  );
};
