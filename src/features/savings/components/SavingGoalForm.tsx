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

function getInitialTargetDate(goal?: SavingGoal | null): string {
  if (!goal?.targetDate) return '';
  const dateObj = new Date(goal.targetDate);
  if (isNaN(dateObj.getTime())) return '';
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function SavingGoalForm({ isOpen, onClose, onSubmit, goal }: SavingGoalFormProps) {
  const [title, setTitle] = useState(goal?.title ?? '');
  const [description, setDescription] = useState(goal?.description ?? '');
  const [targetAmount, setTargetAmount] = useState(goal ? String(goal.targetAmount) : '');
  const [targetDate, setTargetDate] = useState(() => getInitialTargetDate(goal));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAmount) return;

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
              placeholder="e.g. Europe Trip, Emergency Fund"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              placeholder="e.g. 5000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="goal-date" className="block text-sm font-medium text-slate-700 mb-1">
              Target Date (Optional)
            </label>
            <input
              id="goal-date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
