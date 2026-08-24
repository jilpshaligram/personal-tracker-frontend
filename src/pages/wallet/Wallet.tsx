import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { getWallet, type WalletResponseDto } from '../../api/wallet';
import { Wallet as WalletIcon, Lock, CheckCircle2, Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { AddMoneyModal } from './components/AddMoneyModal';

export default function Wallet() {
  const [wallet, setWallet] = useState<WalletResponseDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);

  const fetchWallet = async () => {
    await Promise.resolve();
    try {
      setLoading(true);
      setError(null);
      const data = await getWallet();
      setWallet(data);
    } catch (err: unknown) {
      setError((err as { message?: string }).message || 'Failed to fetch wallet');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchWallet();
  }, []);

  const formatCurrency = (val: number, currency: string = 'INR') =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(val);

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-8 pt-6 min-w-0 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Wallet</h2>
          <p className="text-slate-500">Manage your wallet and balance</p>
        </div>
        <Button onClick={() => setIsAddMoneyOpen(true)} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Add Money
        </Button>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {/* 1. Current Balance */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              <span className="text-blue-500">
                <WalletIcon className="w-4 h-4" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate">
                {loading || !wallet
                  ? '---'
                  : formatCurrency(wallet.currentBalance, wallet.currency)}
              </div>
              <p className="text-xs text-slate-500 mt-1">Total account balance</p>
            </CardContent>
          </Card>

          {/* 2. Available Balance */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <span className="text-emerald-500">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate">
                {loading || !wallet
                  ? '---'
                  : formatCurrency(wallet.availableBalance, wallet.currency)}
              </div>
              <p className="text-xs text-slate-500 mt-1">Ready for use</p>
            </CardContent>
          </Card>

          {/* 3. Blocked Amount */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blocked Amount</CardTitle>
              <span className="text-amber-500">
                <Lock className="w-4 h-4" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate">
                {loading || !wallet ? '---' : formatCurrency(wallet.blockedAmount, wallet.currency)}
              </div>
              <p className="text-xs text-slate-500 mt-1">Pending transactions</p>
            </CardContent>
          </Card>
        </div>
      )}

      <AddMoneyModal
        isOpen={isAddMoneyOpen}
        onClose={() => setIsAddMoneyOpen(false)}
        onSuccess={fetchWallet}
      />
    </div>
  );
}
