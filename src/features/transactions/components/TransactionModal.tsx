import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import type { Transaction, TransactionCategory, TransactionType } from '../types/transaction.types';
import { PAYMENT_METHODS } from '../types/transaction.types';

interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Transaction>) => Promise<boolean>;
  initialData?: Transaction | null;
  categories: TransactionCategory[];
  onCreateCategory: (data: Partial<TransactionCategory>) => Promise<TransactionCategory>;
}

function getInitialDate(initialData?: Transaction | null): string {
  if (initialData) {
    const dateObj = new Date(initialData.transactionDate);
    if (!isNaN(dateObj.getTime())) return dateObj.toISOString().slice(0, 16);
  }
  return new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

function getInitialCategoryId(initialData?: Transaction | null): string {
  if (!initialData) return '';
  return typeof initialData.categoryId === 'string'
    ? initialData.categoryId
    : ((initialData.categoryId.id || initialData.categoryId._id) as string);
}

export function TransactionModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  categories,
  onCreateCategory,
}: TransactionModalProps) {
  const [type, setType] = useState<TransactionType>(initialData?.type ?? 'EXPENSE');
  const [amount, setAmount] = useState<string>(initialData ? initialData.amount.toString() : '');
  const [categoryId, setCategoryId] = useState<string>(() => getInitialCategoryId(initialData));
  const [paymentMethod, setPaymentMethod] = useState<string>(initialData?.paymentMethod ?? '');
  const [transactionDate, setTransactionDate] = useState<string>(() => getInitialDate(initialData));
  const [description, setDescription] = useState<string>(initialData?.description ?? '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [customCategoryName, setCustomCategoryName] = useState<string>('');
  const [temporaryCategory, setTemporaryCategory] = useState<TransactionCategory | null>(null);

  const handleTypeChange = (val: string) => {
    setType(val as TransactionType);
    setCategoryId('');
    setCustomCategoryName('');
    setTemporaryCategory(null);
  };

  const handleCustomCategoryConfirm = (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (e && e.key !== 'Enter') return;
    if (e) e.preventDefault();

    const trimmedName = customCategoryName.trim();
    if (!trimmedName) return;

    const existingCategory = categories.find(
      (c) => c.name.toLowerCase() === trimmedName.toLowerCase() && c.type === type
    );

    if (existingCategory) {
      setError(`Category "${existingCategory.name}" already exists.`);
      return;
    }

    setError(null);
    setTemporaryCategory({
      id: 'temp-custom-id',
      name: trimmedName,
      type: type,
    });
    setCategoryId('temp-custom-id');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return setError('Amount must be greater than 0');
    }
    if (!categoryId) return setError('Category is required');
    if (!paymentMethod) return setError('Payment method is required');
    if (!transactionDate) return setError('Transaction date is required');

    setLoading(true);

    let finalCategoryId = categoryId;
    const trimmedCustomName = customCategoryName.trim();

    // Handle Custom Category Creation
    if (categoryId === 'temp-custom-id' || (categoryId === 'other' && trimmedCustomName)) {
      // Prevent duplicates locally first
      const existingCategory = categories.find(
        (c) => c.name.toLowerCase() === trimmedCustomName.toLowerCase() && c.type === type
      );

      if (existingCategory) {
        setLoading(false);
        setError(
          `Category "${existingCategory.name}" already exists. Please select it from the list.`
        );
        setCategoryId('other');
        return;
      }

      try {
        const newCat = await onCreateCategory({
          name: trimmedCustomName,
          type: type,
        });
        finalCategoryId = newCat.id || newCat._id || '';
      } catch (err: unknown) {
        setLoading(false);
        setError((err as Error).message || 'Failed to create custom category');
        setCategoryId('other');
        return;
      }
    }

    const success = await onSubmit({
      type,
      amount: amountNum,
      categoryId: finalCategoryId,
      paymentMethod,
      description,
      transactionDate: new Date(transactionDate).toISOString(),
    });
    setLoading(false);

    if (success) {
      onOpenChange(false);
    }
  };

  const filteredCategories = categories.filter((c) => c.type === type);
  if (temporaryCategory && temporaryCategory.type === type) {
    // Only add if it doesn't already exist somehow
    if (!filteredCategories.find((c) => c.id === temporaryCategory.id)) {
      filteredCategories.push(temporaryCategory);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-4 py-4">
          {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INCOME">Income</SelectItem>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((c) => (
                    <SelectItem key={c.id || c._id} value={(c.id || c._id) as string}>
                      {c.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="other" className="font-semibold text-blue-600">
                    + Other (Add Custom)
                  </SelectItem>
                </SelectContent>
              </Select>
              {categoryId === 'other' && (
                <div className="mt-2 animate-in fade-in zoom-in-95 duration-200">
                  <Input
                    placeholder="Type category and press Enter..."
                    value={customCategoryName}
                    onChange={(e) => setCustomCategoryName(e.target.value)}
                    onKeyDown={handleCustomCategoryConfirm}
                    onBlur={() => handleCustomCategoryConfirm()}
                    autoFocus
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((pm) => (
                    <SelectItem key={pm} value={pm}>
                      {pm.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Date & Time</Label>
            <Input
              type="datetime-local"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Transaction'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
