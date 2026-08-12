import React from 'react';

export const VaultDial: React.FC = () => {
  const ticks = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * 2 * Math.PI;
    const x1 = 75 + 56 * Math.cos(angle);
    const y1 = 75 + 56 * Math.sin(angle);
    const x2 = 75 + 61 * Math.cos(angle);
    const y2 = 75 + 61 * Math.sin(angle);
    return (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.5"
      />
    );
  });

  return (
    <svg width="220" height="220" viewBox="0 0 150 150">
      <circle cx="75" cy="75" r="64" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
      <circle
        cx="75"
        cy="75"
        r="64"
        fill="none"
        stroke="#2F5FE0"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="402"
        strokeDashoffset="302"
        transform="rotate(-90 75 75)"
      />
      {ticks}
      <circle
        cx="75"
        cy="75"
        r="40"
        fill="rgba(255,255,255,0.04)"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1"
      />
      <path
        d="M75 58 a12 12 0 0 1 12 12 v6 h2 a3 3 0 0 1 3 3 v18 a3 3 0 0 1 -3 3 h-28 a3 3 0 0 1 -3 -3 v-18 a3 3 0 0 1 3 -3 h2 v-6 a12 12 0 0 1 12 -12 z
           M75 63 a7 7 0 0 0 -7 7 v6 h14 v-6 a7 7 0 0 0 -7 -7 z"
        fill="#fff"
        opacity="0.92"
      />
      <circle cx="75" cy="90" r="3" fill="#0E1B38" />
    </svg>
  );
};
