import type { ReactNode } from 'react';

export const Dialog = ({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => onOpenChange?.(false)}
      />
      {children}
    </div>
  );
};

export const DialogContent = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={`relative bg-white rounded-lg p-6 w-full z-10 mx-4 shadow-lg ${className}`}>
    {children}
  </div>
);

export const DialogHeader = ({ children }: { children: ReactNode }) => (
  <div className="mb-4">{children}</div>
);

export const DialogTitle = ({ children }: { children: ReactNode }) => (
  <h2 className="text-lg font-semibold">{children}</h2>
);
