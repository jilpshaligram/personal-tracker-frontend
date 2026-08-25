import { useState } from 'react';
import { Landmark, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import SavingGoalCard from './SavingGoalCard';
import type { SavingGoal } from '../types/savingGoal';
import SavingGoalForm from './SavingGoalForm';
import SavingTransactionForm from './SavingTransactionForm';
import { Button } from '../../../components/ui/button';
import { useSavings } from '../hooks/useSavings';

export default function SavingGoalList() {
  const {
    goals,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    depositFunds,
    withdrawFunds,
    loadGoals,
  } = useSavings();

  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'COMPLETED'>('ACTIVE');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [transactionMode, setTransactionMode] = useState<'deposit' | 'withdraw'>('deposit');
  const [selectedGoal, setSelectedGoal] = useState<SavingGoal | null>(null);

  const displayedGoals = goals.filter((g) => {
    const isCompleted = g.status === 'COMPLETED' || g.savedAmount >= g.targetAmount;
    return activeTab === 'COMPLETED' ? isCompleted : !isCompleted;
  });
  const activeCount = goals.filter(
    (g) => g.status === 'ACTIVE' && g.savedAmount < g.targetAmount
  ).length;
  const completedCount = goals.filter(
    (g) => g.status === 'COMPLETED' || g.savedAmount >= g.targetAmount
  ).length;

  const totalSavings = goals
    .filter((g) => g.status === 'ACTIVE' && g.savedAmount < g.targetAmount)
    .reduce((sum, g) => sum + g.savedAmount, 0);

  const handleFormSubmit = async (goalData: {
    title: string;
    description?: string;
    targetAmount: number;
    targetDate?: string;
  }) => {
    try {
      if (selectedGoal) {
        await updateGoal(selectedGoal.id, goalData);
      } else {
        await createGoal(goalData);
      }
    } catch {
      alert('Failed to save savings goal. Please try again.');
    }
    setSelectedGoal(null);
  };

  const handleAddFundsSubmit = async (amount: number) => {
    if (!selectedGoal) return;
    try {
      await depositFunds(selectedGoal.id, amount);
    } catch {
      alert('Failed to deposit funds. Please try again.');
    }
    setSelectedGoal(null);
  };

  const handleWithdrawFundsSubmit = async (amount: number) => {
    if (!selectedGoal) return;
    try {
      await withdrawFunds(selectedGoal.id, amount);
    } catch {
      alert('Failed to withdraw funds. Please try again.');
    }
    setSelectedGoal(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this saving goal?')) {
      try {
        await deleteGoal(id);
      } catch {
        alert('Failed to delete saving goal.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Savings Goals
          </h1>
          <p className="text-slate-500 text-sm mt-1">Track and manage your financial milestones.</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => void loadGoals()}
            disabled={loading}
            className="p-2.5 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer disabled:opacity-40"
            aria-label="Refresh goals"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            onClick={() => {
              setSelectedGoal(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-1.5 font-semibold px-4.5 py-2.5 rounded-lg shadow-sm cursor-pointer transition-transform duration-100 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span>Create Goal</span>
          </Button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 shrink-0">
            <Landmark className="w-6 h-6" />
          </span>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Active Goal Savings
            </p>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-800 mt-1">
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 2,
              }).format(totalSavings)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto self-stretch md:self-center justify-start md:justify-end shrink-0">
          <div className="flex-1 md:flex-initial bg-slate-50 border border-slate-100 rounded-xl p-4 min-w-[128px] text-center md:text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Active Goals
            </p>
            <p className="text-xl font-black text-slate-700 mt-0.5">{activeCount}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('ACTIVE')}
            className={`text-sm font-bold pb-2 transition-all cursor-pointer ${
              activeTab === 'ACTIVE'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Active Goals ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('COMPLETED')}
            className={`text-sm font-bold pb-2 transition-all cursor-pointer ${
              activeTab === 'COMPLETED'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-700 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {loading && goals.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : displayedGoals.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl py-16 px-4 text-center">
          <p className="text-slate-400 font-medium text-sm">
            {activeTab === 'COMPLETED'
              ? 'No completed savings goals yet.'
              : 'No active savings goals. Create one to get started!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedGoals.map((goal) => (
            <SavingGoalCard
              key={goal.id}
              goal={goal}
              onAddFunds={(g) => {
                setSelectedGoal(g);
                setTransactionMode('deposit');
                setIsTransactionOpen(true);
              }}
              onWithdraw={(g) => {
                setSelectedGoal(g);
                setTransactionMode('withdraw');
                setIsTransactionOpen(true);
              }}
              onEdit={(g) => {
                setSelectedGoal(g);
                setIsFormOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <SavingGoalForm
        key={selectedGoal?.id ?? 'new'}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedGoal(null);
        }}
        onSubmit={handleFormSubmit}
        goal={selectedGoal}
      />

      <SavingTransactionForm
        key={isTransactionOpen ? 'open' : 'closed'}
        isOpen={isTransactionOpen}
        onClose={() => {
          setIsTransactionOpen(false);
          setSelectedGoal(null);
        }}
        onSubmit={transactionMode === 'deposit' ? handleAddFundsSubmit : handleWithdrawFundsSubmit}
        goal={selectedGoal}
        mode={transactionMode}
      />
    </div>
  );
}
