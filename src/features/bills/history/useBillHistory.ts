import { useState, useEffect, useCallback, useMemo } from 'react';
import { billService } from '../services/billService';
import type { Bill, BillPaymentHistoryItem, UseBillHistoryResult } from '../types';

export const useBillHistory = (bill: Bill | null, enabled = true): UseBillHistoryResult => {
  const [history, setHistory] = useState<BillPaymentHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const billId = bill ? bill.id || bill._id || '' : '';

  const refresh = useCallback(() => {
    setReloadKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!enabled || !billId) {
      return;
    }

    let active = true;

    const fetchHistory = async () => {
      setHistory([]);
      setIsLoading(true);
      setError(null);
      try {
        const items = await billService.getBillPaymentHistory(billId);
        if (active) {
          setHistory(items);
        }
      } catch (err: unknown) {
        if (active) {
          const e = err as { message?: string };
          setError(e?.message || 'Failed to load payment history');
          setHistory([]);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void fetchHistory();

    return () => {
      active = false;
    };
  }, [billId, enabled, reloadKey]);

  const billAmount = bill?.amount || 0;
  const effectiveHistory = useMemo(() => {
    return enabled && billId ? history : [];
  }, [enabled, billId, history]);

  const totalPaid = useMemo(() => {
    return effectiveHistory.reduce((sum, item) => {
      const amt = Number(item.amountPaid);
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);
  }, [effectiveHistory]);

  const remainingAmount = useMemo(() => {
    const rem = billAmount - totalPaid;
    return Math.max(0, Number(rem.toFixed(2)));
  }, [billAmount, totalPaid]);

  const isPartiallyPaid = totalPaid > 0 && remainingAmount > 0;
  const isFullyPaid =
    bill?.status?.toUpperCase() === 'PAID' || (billAmount > 0 && totalPaid >= billAmount);

  const paidPercentage = useMemo(() => {
    if (billAmount <= 0) return isFullyPaid ? 100 : 0;
    return Math.min(100, Math.round((totalPaid / billAmount) * 100));
  }, [totalPaid, billAmount, isFullyPaid]);

  return {
    history: effectiveHistory,
    isLoading: enabled && billId ? isLoading : false,
    error: enabled && billId ? error : null,
    totalPaid,
    remainingAmount,
    isPartiallyPaid,
    isFullyPaid,
    paidPercentage,
    refresh,
  };
};
