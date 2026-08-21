import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import type { SavingGoal } from '../types/savingGoal';

interface SavingGoalCardProps {
  goal: SavingGoal;
  onAddFunds: (goal: SavingGoal) => void;
  onEdit: (goal: SavingGoal) => void;
  onDelete: (id: string) => void;
}

export default function SavingGoalCard({
  goal,
  onAddFunds,
  onEdit,
  onDelete,
}: SavingGoalCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const percentage = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'No target date';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'No target date';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getProgressColor = () => {
    if (percentage >= 100) return 'text-emerald-600 stroke-emerald-600';
    if (percentage >= 90) return 'text-emerald-700 stroke-emerald-700';
    return 'text-blue-700 stroke-blue-700';
  };

  const renderBadge = () => {
    if (percentage >= 100) {
      return (
        <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
          Completed!
        </span>
      );
    }
    if (percentage >= 90) {
      return (
        <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          Almost there!
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
        Due: {formatDate(goal.targetDate)}
      </span>
    );
  };

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col justify-between p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 leading-tight">{goal.title}</h3>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            {goal.description || 'Savings Fund'}
          </p>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
            aria-label="Open Actions Menu"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 z-10 animate-in fade-in slide-in-from-top-1 duration-100">
              <button
                type="button"
                onClick={() => {
                  onEdit(goal);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors text-left"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Edit Goal</span>
              </button>
              <div className="my-1 border-t border-slate-100" />
              <button
                type="button"
                onClick={() => {
                  onDelete(goal.id);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50/50 transition-colors text-left"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Goal</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center my-6">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r={radius}
              className="stroke-slate-100 fill-none"
              strokeWidth="8"
            />
            <circle
              cx="56"
              cy="56"
              r={radius}
              className={`fill-none transition-all duration-500 ease-out ${getProgressColor()}`}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-xl font-bold text-slate-800">{percentage}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-slate-400">Saved</span>
          <span className="text-slate-700">{formatCurrency(goal.savedAmount)}</span>
        </div>
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-slate-400">Target</span>
          <span className="text-slate-700">{formatCurrency(goal.targetAmount)}</span>
        </div>
      </div>

      <div className="h-px bg-slate-100 my-1" />

      <div className="flex justify-between items-center mt-3 pt-1">
        {renderBadge()}

        {percentage < 100 && (
          <button
            type="button"
            onClick={() => onAddFunds(goal)}
            className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          >
            <span>Add Funds</span>
          </button>
        )}
      </div>
    </div>
  );
}
