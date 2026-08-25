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
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [amount, setAmount] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [transactionDate, setTransactionDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [customCategoryName, setCustomCategoryName] = useState<string>('');

  useEffect(() => {
    if (open) {
      if (initialData) {
        setType(initialData.type);
        setAmount(initialData.amount.toString());
        setCategoryId(
          !initialData.categoryId
            ? ''
            : typeof initialData.categoryId === 'string'
              ? initialData.categoryId
              : ((initialData.categoryId.id || initialData.categoryId._id) as string)
        );
        setPaymentMethod(initialData.paymentMethod);

        const dateObj = new Date(initialData.transactionDate);
        if (!isNaN(dateObj.getTime())) {
          setTransactionDate(dateObj.toISOString().slice(0, 10));
        }
        setDescription(initialData.description || '');
      } else {
        setType('EXPENSE');
        setAmount('');
        setCategoryId('');
        setPaymentMethod('');
        setTransactionDate(
          new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 10)
        );
        setDescription('');
      }
      setErrors({});
      setSubmitError(null);
      setCustomCategoryName('');
    }
  }, [open, initialData]);

  const handleTypeChange = (val: string) => {
    setType(val as TransactionType);
    setCategoryId('');
    setCustomCategoryName('');
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = 'Valid positive amount is required';
    } else if (amountNum > 1000000000) {
      newErrors.amount = 'Amount exceeds maximum limit (1,000,000,000)';
    }

    const isTransfer = type.startsWith('TRANSFER') || type === 'OPENING_BALANCE';
    if (!categoryId && !isTransfer) {
      newErrors.categoryId = 'Category is required';
    } else if (categoryId === 'other' && !isTransfer) {
      const trimmed = customCategoryName.trim();
      if (!trimmed) {
        newErrors.customCategoryName = 'Category name is required';
      } else if (trimmed.length < 3) {
        newErrors.customCategoryName = 'Category name must be at least 3 characters';
      } else if (trimmed.length > 20) {
        newErrors.customCategoryName = 'Category name cannot exceed 20 characters';
      } else if (/(.)\1{4,}/.test(trimmed)) {
        newErrors.customCategoryName =
          'Category name cannot contain excessive repeating characters';
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
      selected.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      if (selected > today) {
        newErrors.transactionDate = 'Transaction date cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setLoading(true);

    let finalCategoryId = categoryId;
    let trimmedCustomName = customCategoryName.trim();

    if (categoryId === 'other') {
      trimmedCustomName =
        trimmedCustomName.charAt(0).toUpperCase() + trimmedCustomName.slice(1).toLowerCase();

      const existingCategory = categories.find(
        (c) => c.name.toLowerCase() === trimmedCustomName.toLowerCase() && c.type === type
      );

      if (existingCategory) {
        finalCategoryId = existingCategory.id || existingCategory._id || '';
      } else {
        try {
          const newCat = await onCreateCategory({
            name: trimmedCustomName,
            type: type,
          });
          finalCategoryId = newCat.id || newCat._id || '';
        } catch (err: any) {
          setLoading(false);
          setSubmitError(err.message || 'Failed to create custom category');
          return;
        }
      }
    }

    const [year, month, day] = transactionDate.split('-').map(Number);
    const now = new Date();
    const finalDate = new Date(
      year,
      month - 1,
      day,
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    );

    const isTransfer = type.startsWith('TRANSFER') || type === 'OPENING_BALANCE';

    const payload: Partial<Transaction> = {
      type,
      amount: parseFloat(amount),
      paymentMethod,
      description,
      transactionDate: finalDate.toISOString(),
    };

    if (!isTransfer) {
      payload.categoryId = finalCategoryId;
    }

    await onSubmit(payload);
    setLoading(false);
    onOpenChange(false);
  };

  const filteredCategories = categories.filter((c) => c.type === type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4 py-4 max-h-[80vh] overflow-y-auto"
        >
          {submitError && (
            <div className="text-rose-500 text-sm font-medium p-2 bg-rose-50 rounded-lg border border-rose-200">
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              {type.startsWith('TRANSFER') || type === 'OPENING_BALANCE' ? (
                <Input
                  value={type.replace(/_/g, ' ')}
                  disabled
                  className="bg-slate-50 text-slate-500 cursor-not-allowed capitalize"
                />
              ) : (
                <Select value={type} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INCOME">Income</SelectItem>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                max="1000000000"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Category <span className="text-rose-500">*</span>
              </Label>
              {type.startsWith('TRANSFER') || type === 'OPENING_BALANCE' ? (
                <Input
                  value="N/A"
                  disabled
                  className="bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              ) : (
                <>
                  <Select
                    value={categoryId}
                    onValueChange={(v) => {
                      setCategoryId(v);
                      if (errors.categoryId) setErrors((p) => ({ ...p, categoryId: '' }));
                    }}
                    className={
                      errors.categoryId
                        ? 'border-rose-400 focus:ring-rose-500/20'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
                    }
                  >
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
                  {errors.categoryId && (
                    <p className="text-xs text-rose-500 mt-1">{errors.categoryId}</p>
                  )}
                  {categoryId === 'other' && (
                    <div className="mt-2 animate-in fade-in zoom-in-95 duration-200">
                      <Input
                        placeholder="Type category and press Enter..."
                        value={customCategoryName}
                        onChange={(e) => {
                          setCustomCategoryName(e.target.value);
                          if (errors.customCategoryName)
                            setErrors((p) => ({ ...p, customCategoryName: '' }));
                        }}
                        className={`w-full ${
                          errors.customCategoryName
                            ? 'border-rose-400 focus-visible:ring-rose-500/20'
                            : 'border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-500/20'
                        }`}
                        autoFocus
                      />
                      {errors.customCategoryName && (
                        <p className="text-xs text-rose-500 mt-1">{errors.customCategoryName}</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Payment Method <span className="text-rose-500">*</span>
              </Label>
              {type.startsWith('TRANSFER') || type === 'OPENING_BALANCE' ? (
                <Input
                  value={paymentMethod ? paymentMethod.replace('_', ' ') : 'N/A'}
                  disabled
                  className="bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              ) : (
                <>
                  <Select
                    value={paymentMethod}
                    onValueChange={(v) => {
                      setPaymentMethod(v);
                      if (errors.paymentMethod) setErrors((p) => ({ ...p, paymentMethod: '' }));
                    }}
                    className={
                      errors.paymentMethod
                        ? 'border-rose-400 focus:ring-rose-500/20'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
                    }
                  >
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
                  {errors.paymentMethod && (
                    <p className="text-xs text-rose-500 mt-1">{errors.paymentMethod}</p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              Date <span className="text-rose-500">*</span>
            </Label>
            <Input
              type="date"
              max={new Date().toISOString().split('T')[0]}
              value={transactionDate.split('T')[0]}
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

          {!(type.startsWith('TRANSFER') || type === 'OPENING_BALANCE') && (
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Optional description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Transaction'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
