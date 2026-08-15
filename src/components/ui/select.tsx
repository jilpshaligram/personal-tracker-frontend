import React from 'react';
import type { ReactNode } from 'react';

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: ReactNode;
}

export const Select = ({ value, onValueChange, children }: SelectProps) => {
  let options: ReactNode = null;
  let placeholder: string | null = null;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement<{ children?: ReactNode }>(child)) return;
    if (child.type === SelectContent) {
      options = child.props.children;
    }
    if (child.type === SelectTrigger) {
      React.Children.forEach(child.props.children, (triggerChild) => {
        if (
          React.isValidElement<{ placeholder?: string }>(triggerChild) &&
          triggerChild.type === SelectValue
        ) {
          placeholder = triggerChild.props.placeholder as string;
        }
      });
    }
  });

  return (
    <select
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options}
    </select>
  );
};

export const SelectTrigger = ({ children }: { children?: ReactNode; className?: string }) => (
  <>{children}</>
);
export const SelectValue = ({ placeholder }: { placeholder?: string; className?: string }) => (
  <>{placeholder}</>
);
export const SelectContent = ({ children }: { children?: ReactNode; className?: string }) => (
  <>{children}</>
);
export const SelectItem = ({
  value,
  children,
  className,
}: {
  value: string | number;
  children: ReactNode;
  className?: string;
}) => (
  <option value={value} className={className}>
    {children}
  </option>
);
