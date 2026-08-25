import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { PAYMENT_METHODS } from '../../../features/transactions/types/transaction.types';
import { transactionService } from '../../../features/transactions/services/transaction.service';

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddMoneyModal({ isOpen, onClose, onSuccess }: AddMoneyModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [transactionDate, setTransactionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [description, setDescription] = useState<string>('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    val = val.replace(/\s{2,}/g, ' ');
    val = val.replace(/\b\w/g, (char) => char.toUpperCase());
    setDescription(val);
    if (errors.description) {
      setErrors((p) => ({ ...p, description: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else {
      const num = parseFloat(amount);
      if (isNaN(num) || num <= 0) {
        newErrors.amount = 'Valid positive amount is required';
      } else if (num > 1000000000) {
        newErrors.amount = 'Amount exceeds maximum limit (1,000,000,000)';
      }
    }

    if (!paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    }

    if (!transactionDate) {
      newErrors.transactionDate = 'Transaction date is required';
    } else {
      const selected = new Date(transactionDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (selected > today) {
        newErrors.transactionDate = 'Date cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await transactionService.createTransaction({
        type: 'OPENING_BALANCE',
        amount: parseFloat(amount),
        paymentMethod,
        transactionDate: new Date(transactionDate).toISOString(),
        description: description.trim() || 'Wallet Balance Added',
      });

      setAmount('');
      setPaymentMethod('');
      setTransactionDate(new Date().toISOString().split('T')[0]);
      setDescription('');

      onSuccess();
      onClose();
    } catch (err: unknown) {
      setGlobalError(
        (err as { response?: { data?: { message?: string } }; message?: string }).response?.data
          ?.message ||
          (err as { message?: string }).message ||
          'Failed to add money'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={() => !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Money to Wallet</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4" noValidate>
          {globalError && (
            <div className="text-rose-500 text-sm font-medium p-3 bg-rose-50 rounded-md border border-rose-200">
              {globalError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="add-amount">
              Amount (₹) <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="add-amount"
              type="number"
              step="0.01"
              max="1000000000"
              placeholder="e.g. 5000"
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Payment Method <span className="text-rose-500">*</span>
              </Label>
              <Select
                value={paymentMethod}
                onValueChange={(v) => {
                  setPaymentMethod(v);
                  if (errors.paymentMethod) setErrors((p) => ({ ...p, paymentMethod: '' }));
                }}
              >
                <SelectTrigger
                  className={
                    errors.paymentMethod
                      ? 'border-rose-400 focus:ring-rose-500/20'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
                  }
                >
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.paymentMethod && (
                <p className="text-xs text-rose-500 mt-1">{errors.paymentMethod}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-date">
                Date <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="add-date"
                type="date"
                max={todayStr}
                value={transactionDate}
                onChange={(e) => {
                  setTransactionDate(e.target.value);
                  if (errors.transactionDate) setErrors((p) => ({ ...p, transactionDate: '' }));
                }}
                className={`w-full ${
                  errors.transactionDate
                    ? 'border-rose-400 focus-visible:ring-rose-500/20'
                    : 'border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-500/20'
                }`}
              />
              {errors.transactionDate && (
                <p className="text-xs text-rose-500 mt-1">{errors.transactionDate}</p>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Label htmlFor="add-desc">Description (Optional)</Label>
            <Input
              id="add-desc"
              type="text"
              placeholder="e.g. Added Wallet Balance"
              value={description}
              onChange={handleDescriptionChange}
              maxLength={100}
              className="border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Money'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
