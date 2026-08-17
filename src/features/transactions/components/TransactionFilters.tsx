import { Search } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

import type {
  TransactionFilterDto,
  TransactionCategory,
  TransactionType,
} from '../types/transaction.types';

interface TransactionFiltersProps {
  filters: TransactionFilterDto;
  categories: TransactionCategory[];
  onFilterChange: (filters: Partial<TransactionFilterDto>) => void;
}

export function TransactionFilters({
  filters,
  categories,
  onFilterChange,
}: TransactionFiltersProps) {
  const handleTypeChange = (val: string) => {
    const type = val === 'all' ? undefined : (val as TransactionType);
    onFilterChange({ type, categoryId: undefined });
  };

  const filteredCategories = filters.type
    ? categories.filter((c) => c.type === filters.type)
    : categories;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search transactions..."
          className="pl-9"
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ search: e.target.value })}
        />
      </div>

      <div className="w-full sm:w-48 shrink-0">
        <Select value={filters.type || 'all'} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-56 shrink-0">
        <Select
          value={filters.categoryId || 'all'}
          onValueChange={(val) => onFilterChange({ categoryId: val === 'all' ? undefined : val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {filteredCategories.map((c) => (
              <SelectItem key={c.id || c._id} value={(c.id || c._id) as string}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
