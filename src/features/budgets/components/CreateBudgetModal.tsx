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
import type { CreateBudgetDto } from '../types/budget.types';

interface CreateBudgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateBudgetDto) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function CreateBudgetModal({
  open,
  onOpenChange,
  onSubmit,
  loading,
  error,
}: CreateBudgetModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [period, setPeriod] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setAmount('');
      setPeriod('MONTHLY');
      setErrors({});
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

    const success = await onSubmit({
      amount: amountNum,
      period,
    });

    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Budget</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && (
            <div className="text-rose-500 text-sm font-medium p-3 bg-rose-50 rounded-md border border-rose-200">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">Total Budget Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              max="1000000000"
              placeholder="e.g. 30000"
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
            <Label htmlFor="period">Time Period</Label>
            <Select
              value={period}
              onValueChange={(v: string) =>
                setPeriod(v as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY')
              }
            >
              <SelectTrigger id="period">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">
              Dates are automatically determined based on the current period.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Budget'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
