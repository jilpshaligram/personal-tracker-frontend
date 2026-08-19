import { useState } from 'react';
import { Plus, WalletCards } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useBudgets } from '../features/budgets/hooks/useBudgets';
import { GlobalBudgetSummary } from '../features/budgets/components/GlobalBudgetSummary';
import { BudgetCard } from '../features/budgets/components/BudgetCard';
import { CreateBudgetModal } from '../features/budgets/components/CreateBudgetModal';
import { EditBudgetModal } from '../features/budgets/components/EditBudgetModal';
import type { Budget } from '../features/budgets/types/budget.types';

export default function BudgetsPage() {
  const {
    budgets,
    loadingHistory,
    actionLoading,
    error,
    createBudget,
    updateBudget,
    deleteBudget,
  } = useBudgets();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-6 sm:p-8 mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <WalletCards className="h-8 w-8 text-blue-600" />
            Budgets
          </h1>
          <p className="text-slate-500 mt-1">
            Set and monitor your budgets to keep your overall spending on track.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="shadow-sm hover:shadow-md transition-all"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Budget
        </Button>
      </div>

      <div className="space-y-6">
        <GlobalBudgetSummary budgets={budgets} loading={loadingHistory} />

        <div className="pt-8">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 mb-6">All Budgets</h2>

          {loadingHistory ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="h-64 bg-slate-100 animate-pulse rounded-xl" />
              <div className="h-64 bg-slate-100 animate-pulse rounded-xl hidden md:block" />
              <div className="h-64 bg-slate-100 animate-pulse rounded-xl hidden lg:block" />
            </div>
          ) : budgets.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-50">
                <WalletCards className="w-7 h-7 text-blue-500" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">No active budgets found</p>
                <p className="mt-1 mb-6 text-xs text-slate-400">
                  You haven't set up any budgets yet. Create one to start tracking your spending!
                </p>
                <Button onClick={() => setIsCreateOpen(true)} className="shadow-sm">
                  Create your first budget
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map((budget) => (
                <BudgetCard
                  key={budget.id}
                  budget={budget}
                  onEdit={handleEdit}
                  onDelete={deleteBudget}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateBudgetModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={createBudget}
        loading={actionLoading}
        error={error}
      />

      <EditBudgetModal
        budget={editingBudget}
        onOpenChange={(open) => !open && setEditingBudget(null)}
        onSubmit={updateBudget}
        loading={actionLoading}
        error={error}
      />
    </div>
  );
}
