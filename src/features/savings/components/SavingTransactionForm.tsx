import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import type { SavingGoal } from '../types/savingGoal';

interface SavingTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  goal: SavingGoal | null;
}

export default function SavingTransactionForm({
  isOpen,
  onClose,
  onSubmit,
  goal,
}: SavingTransactionFormProps) {
  const [amount, setAmount] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (isOpen) {
      setAmount('');
      setErrorMsg('');
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal || !amount) return;

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      setErrorMsg('Please enter a valid amount greater than 0.');
      return;
    }

    const remaining = goal.targetAmount - goal.savedAmount;
    if (depositAmount > remaining) {
      setErrorMsg(
        `You only need ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(remaining)} more to complete this goal.`
      );
      return;
    }

    onSubmit(depositAmount);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add Funds to {goal?.title || 'Goal'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {goal && (
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex justify-between items-center text-xs font-medium text-blue-800">
              <div>
                <p className="text-blue-500 font-semibold uppercase tracking-wider text-[10px]">
                  Current Progress
                </p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {Math.round((goal.savedAmount / goal.targetAmount) * 100)}% Complete
                </p>
              </div>
              <div className="text-right">
                <p className="text-blue-500 font-semibold uppercase tracking-wider text-[10px]">
                  Remaining Target
                </p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0,
                  }).format(goal.targetAmount - goal.savedAmount)}{' '}
                  of{' '}
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0,
                  }).format(goal.targetAmount)}
                </p>
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="deposit-amount"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Deposit Amount (₹)
            </label>
            <input
              id="deposit-amount"
              type="number"
              required
              min="1"
              placeholder="e.g. 500"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrorMsg('');
              }}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {errorMsg && (
            <p className="text-xs font-semibold text-red-500 leading-normal bg-red-50 p-2.5 rounded-lg">
              {errorMsg}
            </p>
          )}

          <div className="flex justify-end gap-2.5 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Confirm Deposit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
