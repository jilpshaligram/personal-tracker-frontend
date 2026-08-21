import React from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';

interface AuthLoadingOverlayProps {
  title?: string;
  message?: string;
}

export const AuthLoadingOverlay: React.FC<AuthLoadingOverlayProps> = ({
  title = 'Please wait...',
  message = 'Processing your request',
}) => {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-2xl bg-white/95 backdrop-blur-xs p-6 text-center animate-in fade-in duration-200">
      <div className="relative mb-5 flex items-center justify-center">
        <div className="h-16 w-16 rounded-full bg-[#2F5FE0]/10 animate-ping absolute" />

        <div className="h-16 w-16 rounded-full border-4 border-[#E5E9F2] border-t-[#2F5FE0] animate-spin flex items-center justify-center" />

        <div className="absolute flex h-9 w-9 items-center justify-center rounded-full bg-[#2F5FE0] text-white shadow-md">
          <ShieldCheck className="h-5 w-5 animate-pulse" />
        </div>
      </div>

      <h3 className="font-['Sora',sans-serif] text-lg font-semibold text-[#16274F] mb-1">
        {title}
      </h3>

      <p className="text-sm font-medium text-[#2F5FE0] flex items-center gap-1.5 justify-center">
        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        <span>{message}</span>
      </p>

      <p className="mt-4 text-xs text-[#6B7280]">
        Verifying security & securing your vault connection
      </p>
    </div>
  );
};
