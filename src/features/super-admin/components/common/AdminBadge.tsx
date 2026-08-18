import React from 'react';

export type AdminBadgeTone = 'teal' | 'amber' | 'red' | 'indigo' | 'neutral';

interface AdminBadgeProps {
  children: React.ReactNode;
  tone?: AdminBadgeTone;
}

const TONES: Record<AdminBadgeTone, { bg: string; fg: string }> = {
  teal: { bg: '#E4F6EE', fg: '#0F6B47' },
  amber: { bg: '#FBF1DE', fg: '#8A5F14' },
  red: { bg: '#FCE9EB', fg: '#A62E3A' },
  indigo: { bg: '#E9EFFE', fg: '#1F4CC7' },
  neutral: { bg: '#EEF0F6', fg: '#6B7280' },
};

export const AdminBadge: React.FC<AdminBadgeProps> = ({ children, tone = 'neutral' }) => {
  const t = TONES[tone] || TONES.neutral;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize tracking-wide whitespace-nowrap"
      style={{ backgroundColor: t.bg, color: t.fg }}
    >
      {children}
    </span>
  );
};
