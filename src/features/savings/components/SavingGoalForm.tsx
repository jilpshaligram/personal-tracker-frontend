import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import type { SavingGoal } from '../types/savingGoal';

interface SavingGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goalData: {
    title: string;
    description?: string;
    targetAmount: number;
    targetDate?: string;
  }) => void;
  goal?: SavingGoal | null;
}

export default function SavingGoalForm({ isOpen, onClose, onSubmit, goal }: SavingGoalFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (goal) {
      setTitle(goal.title);
      setDescription(goal.description || '');
      setTargetAmount(String(goal.targetAmount));

      if (goal.targetDate) {
        const dateObj = new Date(goal.targetDate);
        if (!isNaN(dateObj.getTime())) {
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getDate()).padStart(2, '0');
          setTargetDate(`${year}-${month}-${day}`);
        } else {
          setTargetDate('');
        }
      } else {
        setTargetDate('');
      }
      setTitle('');
      setDescription('');
      setTargetAmount('');
      setTargetDate('');
      setErrors({});
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [goal, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const amountNum = parseFloat(targetAmount);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      newErrors.title = 'Goal name is required';
    } else if (trimmedTitle.length < 3) {
      newErrors.title = 'Goal name must be at least 3 characters long';
    } else if (trimmedTitle.length > 20) {
      newErrors.title = 'Goal name cannot exceed 20 characters';
    } else if (/(.)\1{4,}/.test(trimmedTitle)) {
      newErrors.title = 'Goal name cannot contain excessive repeating characters';
    } else if (/\s{3,}/.test(trimmedTitle)) {
      newErrors.title = 'Goal name cannot contain excessive spaces';
    }

    if (isNaN(amountNum) || amountNum <= 0) {
      newErrors.targetAmount = 'Valid positive amount is required';
    } else if (amountNum > 1000000000) {
      newErrors.targetAmount = 'Amount exceeds maximum limit 1,000,000,000';
    }

    if (targetDate) {
      const selected = new Date(targetDate);
      const todayDate = new Date();
      selected.setHours(0, 0, 0, 0);
      todayDate.setHours(0, 0, 0, 0);
      if (selected < todayDate) {
        newErrors.targetDate = 'Target date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title,
      description: description || undefined,
      targetAmount: parseFloat(targetAmount),
      targetDate: targetDate || undefined,
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{goal ? 'Edit Savings Goal' : 'Create New Savings Goal'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="goal-title" className="block text-sm font-medium text-slate-700 mb-1">
              Goal Name
            </label>
            <input
              id="goal-title"
              type="text"
              required
              maxLength={20}
              placeholder="e.g. Europe Trip, Emergency Fund"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 ${
                errors.title
                  ? 'border-rose-400 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="goal-desc" className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <input
              id="goal-desc"
              type="text"
              placeholder="e.g. Travel Fund, Safety Net"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="goal-target" className="block text-sm font-medium text-slate-700 mb-1">
              Target Amount (₹)
            </label>
            <input
              id="goal-target"
              type="number"
              required
              min="1"
              max="1000000000"
              placeholder="e.g. 5000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 ${
                errors.targetAmount
                  ? 'border-rose-400 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
              }`}
            />
            {errors.targetAmount && (
              <p className="text-xs text-rose-500 mt-1">{errors.targetAmount}</p>
            )}
          </div>

          <div>
            <label htmlFor="goal-date" className="block text-sm font-medium text-slate-700 mb-1">
              Target Date (Optional)
            </label>
            <input
              id="goal-date"
              type="date"
              min={today}
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 ${
                errors.targetDate
                  ? 'border-rose-400 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
              }`}
            />
            {errors.targetDate && <p className="text-xs text-rose-500 mt-1">{errors.targetDate}</p>}
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{goal ? 'Save Changes' : 'Create Goal'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
