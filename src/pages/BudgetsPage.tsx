import { useState } from 'react';
import { Plus, WalletCards } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useBudgets } from '../features/budgets/hooks/useBudgets';
import { BudgetSummary } from '../features/budgets/components/BudgetSummary';
import { BudgetCategoryChart } from '../features/budgets/components/BudgetCategoryChart';
import { BudgetHistory } from '../features/budgets/components/BudgetHistory';
import { CreateBudgetModal } from '../features/budgets/components/CreateBudgetModal';
import { EditBudgetModal } from '../features/budgets/components/EditBudgetModal';
import type { Budget } from '../features/budgets/types/budget.types';

export default function BudgetsPage() {
  const {
    currentBudget,
    budgets,
    categoryBreakdown,
    loadingCurrent,
    loadingHistory,
    loadingBreakdown,
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <WalletCards className="h-8 w-8 text-blue-600" />
            Budgets
          </h1>
          <p className="text-slate-500 mt-1">
            Manage your single total budget and view category analytics.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="shadow-sm hover:shadow-md transition-all"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Budget
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Summary and Chart */}
        <div className="lg:col-span-12 space-y-6">
          <BudgetSummary budget={currentBudget} loading={loadingCurrent} />

          {(currentBudget || loadingBreakdown) && (
            <BudgetCategoryChart data={categoryBreakdown} loading={loadingBreakdown} />
          )}
        </div>
      </div>

      <div className="pt-4">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 mb-4">Budget History</h2>
        <BudgetHistory
          budgets={budgets}
          loading={loadingHistory}
          onEdit={handleEdit}
          onDelete={deleteBudget}
        />
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
