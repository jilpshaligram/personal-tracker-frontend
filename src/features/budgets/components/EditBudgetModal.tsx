import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Button } from '../../../components/ui/button';
import type { Budget, UpdateBudgetDto } from '../types/budget.types';

interface EditBudgetModalProps {
  budget: Budget | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, data: UpdateBudgetDto) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function EditBudgetModal({
  budget,
  onOpenChange,
  onSubmit,
  loading,
  error,
}: EditBudgetModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [period, setPeriod] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [prevBudget, setPrevBudget] = useState<Budget | null>(budget);
  if (budget !== prevBudget) {
    setPrevBudget(budget);
    if (budget) {
      setAmount(budget.amount.toString());
      setPeriod(budget.period);
      setErrors({});
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budget) return;
    setErrors({});

    const newErrors: Record<string, string> = {};
    const amountNum = parseFloat(amount);

    if (isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = 'Valid positive amount is required';
    } else if (amountNum > 1000000000) {
      newErrors.amount = 'Amount exceeds maximum limit (1,000,000,000)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const success = await onSubmit(budget.id, {
      amount: amountNum,
      period,
    });

    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={!!budget} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Budget</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && (
            <div className="text-rose-500 text-sm font-medium p-3 bg-rose-50 rounded-md border border-rose-200">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="edit-amount">Total Budget Amount (₹)</Label>
            <Input
              id="edit-amount"
              type="number"
              step="0.01"
              max="1000000000"
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value;
                if (val && parseFloat(val) > 1000000000) return;
                setAmount(val);
                if (errors.amount) setErrors((p) => ({ ...p, amount: '' }));
              }}
              className={`w-full ${
                errors.amount
                  ? 'border-rose-400 focus-visible:ring-rose-500/20'
                  : 'border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-500/20'
              }`}
            />
            {errors.amount && <p className="text-xs text-rose-500 mt-1">{errors.amount}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-period">Time Period</Label>
            <Select
              value={period}
              onValueChange={(v: string) =>
                setPeriod(v as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY')
              }
            >
              <SelectTrigger id="edit-period">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
