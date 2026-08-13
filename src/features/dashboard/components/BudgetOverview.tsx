import ReactECharts from 'echarts-for-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import type { BudgetOverview as BudgetOverviewType } from '../types';

interface BudgetOverviewProps {
  data: BudgetOverviewType | null;
  loading: boolean;
}

export function BudgetOverview({ data, loading }: BudgetOverviewProps) {
  if (loading || !data) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center min-h-[250px]">
          <div className="text-slate-400">Loading budget data...</div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  const option = {
    tooltip: {
      formatter: '{b}: {c}',
    },
    grid: {
      left: '0%',
      right: '0%',
      bottom: '0%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      show: false,
      max: data.totalBudget,
    },
    yAxis: {
      type: 'category',
      show: false,
      data: ['Budget'],
    },
    series: [
      {
        name: 'Consumed',
        type: 'bar',
        stack: 'total',
        barWidth: 24,
        itemStyle: {
          color: data.percentageConsumed > 90 ? '#ef4444' : '#3b82f6', // Red if >90%, else blue
          borderRadius: 0,
        },
        data: [data.totalSpent],
      },
      {
        name: 'Remaining',
        type: 'bar',
        stack: 'total',
        barWidth: 32,
        itemStyle: {
          color: '#e2e8f0', // slate-200
          borderRadius: 0,
        },
        data: [data.remainingAmount > 0 ? data.remainingAmount : 0],
      },
    ],
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-500 mb-1">Spending vs. Allocation</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {formatCurrency(data.totalSpent)}
            </span>
            <span className="text-lg text-slate-500">/ {formatCurrency(data.totalBudget)}</span>
          </div>
          <p
            className={`text-sm font-semibold mt-1 ${data.percentageConsumed > 90 ? 'text-red-500' : 'text-blue-600'}`}
          >
            {data.percentageConsumed}% CONSUMED
          </p>
        </div>

        <div className="w-full h-12">
          <ReactECharts
            option={option}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
