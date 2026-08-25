import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import type { SavingGoal } from '../types/savingGoal';

interface SavingTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  goal: SavingGoal | null;
  mode?: 'deposit' | 'withdraw';
}

export default function SavingTransactionForm({
  isOpen,
  onClose,
  onSubmit,
  goal,
  mode = 'deposit',
}: SavingTransactionFormProps) {
  const [amount, setAmount] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal || !amount) return;

    const transactionAmount = parseFloat(amount);
    if (isNaN(transactionAmount) || transactionAmount <= 0) {
      setErrorMsg('Please enter a valid amount greater than 0.');
      return;
    }

    if (mode === 'deposit') {
      const remaining = goal.targetAmount - goal.savedAmount;
      if (transactionAmount > remaining) {
        setErrorMsg(
          `You only need ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(remaining)} more to complete this goal.`
        );
        return;
      }
    } else {
      if (transactionAmount > goal.savedAmount) {
        setErrorMsg(
          `You only have ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(goal.savedAmount)} available to withdraw.`
        );
        return;
      }
    }

    onSubmit(transactionAmount);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'deposit' ? 'Add Funds to ' : 'Withdraw Funds from '}
            {goal?.title || 'Goal'}
          </DialogTitle>
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
                    maximumFractionDigits: 2,
                  }).format(goal.targetAmount - goal.savedAmount)}{' '}
                  of{' '}
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 2,
                  }).format(goal.targetAmount)}
                </p>
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="transaction-amount"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              {mode === 'deposit' ? 'Deposit Amount (₹)' : 'Withdrawal Amount (₹)'}
            </label>
            <input
              id="transaction-amount"
              type="number"
              required
              step="0.01"
              min="0.01"
              max="1000000000"
              placeholder="e.g. 500"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrorMsg('');
              }}
              className={`w-full px-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 ${
                errorMsg
                  ? 'border-rose-400 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
              }`}
            />
            {errorMsg && <p className="text-xs text-rose-500 mt-1">{errorMsg}</p>}
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'deposit' ? 'Confirm Deposit' : 'Confirm Withdrawal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
