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
  const [validationError, setValidationError] = useState<string | null>(null);

  const [prevBudget, setPrevBudget] = useState<Budget | null>(budget);
  if (budget !== prevBudget) {
    setPrevBudget(budget);
    if (budget) {
      setAmount(budget.amount.toString());
      setPeriod(budget.period);
      setValidationError(null);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budget) return;
    setValidationError(null);

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return setValidationError('Please enter a valid amount greater than 0');
    }

    const success = await onSubmit(budget.id, {
      amount: amountNum,
      period,
    });

    if (success) {
      onOpenChange(false);
    }
  };

  const displayError = validationError || error;

  return (
    <Dialog open={!!budget} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Budget</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {displayError && (
            <div className="text-red-500 text-sm font-medium p-3 bg-red-50 rounded-md">
              {displayError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="edit-amount">Total Budget Amount (₹)</Label>
            <Input
              id="edit-amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
              required
            />
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
