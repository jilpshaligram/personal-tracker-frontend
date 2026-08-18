import React from 'react';

interface SegmentedControlProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({ options, value, onChange }) => {
  return (
    <div className="inline-flex bg-[#F1F3F8] rounded-lg p-0.5 gap-0.5">
      {options.map((option) => {
        const isActive = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
              isActive ? 'bg-white text-[#151A26] shadow-xs' : 'text-[#6B7280] hover:text-[#151A26]'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};
