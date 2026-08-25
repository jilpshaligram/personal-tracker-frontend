import React, { useState } from 'react';
import { X, Calendar, DollarSign, Tag, Clock, Paperclip, AlertCircle } from 'lucide-react';
import { billService } from '../services/billService';
import type { RecurringType, BillFormProps, CreateBillPayload } from '../types';

export const BillForm: React.FC<BillFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories,
  isSubmitting,
}) => {
  const expenseCategories = categories.filter((c) => !c.type || c.type === 'EXPENSE');

  const [title, setTitle] = useState(initialData?.title || '');
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId ||
      expenseCategories[0]?.id ||
      expenseCategories[0]?._id ||
      categories[0]?.id ||
      categories[0]?._id ||
      ''
  );
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [amount, setAmount] = useState<number | ''>(
    initialData?.amount !== undefined ? initialData.amount : ''
  );
  const [currency, setCurrency] = useState(initialData?.currency || 'INR');
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate
      ? initialData.dueDate.split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [isRecurring, setIsRecurring] = useState(
    initialData?.isRecurring === true || (initialData?.isRecurring as unknown) === 'true'
  );
  const [recurringType, setRecurringType] = useState<RecurringType>(
    initialData?.recurringType || 'MONTHLY'
  );
  const [reminderDaysBefore, setReminderDaysBefore] = useState<number | ''>(
    initialData?.reminderDaysBefore !== undefined ? initialData.reminderDaysBefore : 3
  );
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    } else if (title.trim().length > 20) {
      newErrors.title = 'Title cannot exceed 20 characters';
    } else if (/(.)\1{4,}/.test(title.trim())) {
      newErrors.title = 'Title cannot contain excessive repeating characters';
    } else if (/\s{3,}/.test(title.trim())) {
      newErrors.title = 'Title cannot contain excessive spaces';
    }
    if (!categoryId) {
      newErrors.categoryId = 'Category is required';
    } else if (categoryId === 'OTHER_CUSTOM') {
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
    if (amount === '' || Number(amount) <= 0) {
      newErrors.amount = 'Valid positive amount is required';
    } else if (Number(amount) > 1000000000) {
      newErrors.amount = 'Amount exceeds maximum limit (1,000,000,000)';
    }
    if (reminderDaysBefore !== '' && Number(reminderDaysBefore) < 0) {
      newErrors.reminderDaysBefore = 'Reminder days cannot be negative';
    }
    if (!dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const selected = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selected.setHours(0, 0, 0, 0);
      if (selected < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    let finalCategoryId = categoryId;
    if (categoryId === 'OTHER_CUSTOM') {
      let trimmedName = customCategoryName.trim();
      trimmedName = trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1).toLowerCase();

      const existingCategory = expenseCategories.find(
        (c) => c.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (existingCategory) {
        finalCategoryId = existingCategory.id || existingCategory._id || '';
      } else {
        try {
          const newCat = await billService.createCategory({
            name: trimmedName,
            type: 'EXPENSE',
          });
          finalCategoryId = newCat.id || newCat._id || '';
        } catch (err: unknown) {
          const errorObj = err as { message?: string; response?: { data?: { message?: string } } };
          setSubmitError(
            errorObj?.response?.data?.message ||
              errorObj?.message ||
              'Failed to create custom category'
          );
          return;
        }
      }
    }

    const payload: CreateBillPayload = {
      title: title.trim(),
      categoryId: finalCategoryId,
      amount: Number(amount),
      currency: currency || 'INR',
      dueDate: new Date(dueDate).toISOString(),
      isRecurring: Boolean(isRecurring),
      recurringType: isRecurring ? recurringType : undefined,
      reminderDaysBefore: reminderDaysBefore !== '' ? Number(reminderDaysBefore) : 0,
      notes: notes.trim() || undefined,
      attachment: attachment || undefined,
    };

    try {
      await onSubmit(payload);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setSubmitError(e?.message || 'Failed to save bill. Please verify fields.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-800">
            {initialData ? 'Edit Bill' : 'Create New Bill'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitError && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>{submitError}</div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bill Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Electricity Bill, Netflix Subscription"
              className={`w-full px-3.5 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 ${
                errors.title
                  ? 'border-rose-400 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  if (e.target.value !== 'OTHER_CUSTOM') {
                    setCustomCategoryName('');
                  }
                  if (errors.categoryId) {
                    setErrors((prev) => ({ ...prev, categoryId: '' }));
                  }
                }}
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 ${
                  errors.categoryId
                    ? 'border-rose-400 focus:ring-rose-500/20'
                    : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
              >
                <option value="" disabled>
                  Select category
                </option>
                {expenseCategories.map((cat) => {
                  const id = cat.id || cat._id || '';
                  return (
                    <option key={id} value={id}>
                      {cat.name}
                    </option>
                  );
                })}
                <option value="OTHER_CUSTOM">Other (Custom category)</option>
              </select>
            </div>
            {errors.categoryId && <p className="text-xs text-rose-500 mt-1">{errors.categoryId}</p>}

            {categoryId === 'OTHER_CUSTOM' && (
              <div className="mt-2.5">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Custom Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={customCategoryName}
                  onChange={(e) => {
                    setCustomCategoryName(e.target.value);
                    if (errors.customCategoryName) {
                      setErrors((prev) => ({ ...prev, customCategoryName: '' }));
                    }
                  }}
                  placeholder="e.g. Subscriptions, Maintenance"
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 ${
                    errors.customCategoryName
                      ? 'border-rose-400 focus:ring-rose-500/20'
                      : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                />
                {errors.customCategoryName && (
                  <p className="text-xs text-rose-500 mt-1">{errors.customCategoryName}</p>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Amount <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="1000000000"
                  value={amount}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && parseFloat(val) > 1000000000) return;
                    setAmount(val === '' ? '' : Number(val));
                    if (errors.amount) {
                      setErrors((prev) => ({ ...prev, amount: '' }));
                    }
                  }}
                  placeholder="0.00"
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 ${
                    errors.amount
                      ? 'border-rose-400 focus:ring-rose-500/20'
                      : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.amount && <p className="text-xs text-rose-500 mt-1">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Currency <span className="text-rose-500">*</span>
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Due Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 ${
                    errors.dueDate
                      ? 'border-rose-400 focus:ring-rose-500/20'
                      : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.dueDate && <p className="text-xs text-rose-500 mt-1">{errors.dueDate}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reminder (Days before)
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={reminderDaysBefore}
                  onChange={(e) =>
                    setReminderDaysBefore(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  placeholder="0"
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 ${
                    errors.reminderDaysBefore
                      ? 'border-rose-400 focus:ring-rose-500/20'
                      : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.reminderDaysBefore && (
                <p className="text-xs text-rose-500 mt-1">{errors.reminderDaysBefore}</p>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800">Recurring Bill</span>
                <p className="text-[11px] text-slate-400">Whether the bill repeats recursively</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {isRecurring && (
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recurring Frequency (DAILY, WEEKLY, MONTHLY, YEARLY)
                </label>
                <select
                  value={recurringType}
                  onChange={(e) => setRecurringType(e.target.value as RecurringType)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="DAILY">DAILY</option>
                  <option value="WEEKLY">WEEKLY</option>
                  <option value="MONTHLY">MONTHLY</option>
                  <option value="YEARLY">YEARLY</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Attachment (Optional Bill / Invoice PDF or Image)
            </label>
            <div className="relative flex items-center gap-2">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {attachment && <Paperclip className="w-4 h-4 text-emerald-600 shrink-0" />}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Personal Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Personal notes regarding the bill..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Update Bill' : 'Create Bill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
