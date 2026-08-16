import ReactECharts from 'echarts-for-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import type { CategoryBreakdownResponse } from '../types/budget.types';

interface BudgetCategoryChartProps {
  data: CategoryBreakdownResponse | null;
  loading: boolean;
}

export function BudgetCategoryChart({ data, loading }: BudgetCategoryChartProps) {
  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="h-16 bg-slate-100" />
        <CardContent className="h-64 bg-slate-50" />
      </Card>
    );
  }

  if (!data || data.categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center text-slate-500 h-64">
          <p>No expense data available for this period.</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.categories.map((c) => ({
    name: c.categoryName,
    value: c.amount,
  }));

  const options = {
    tooltip: {
      trigger: 'item',
      formatter: (params: { name: string; value: number }) => {
        const cat = data.categories.find((c) => c.categoryName === params.name);
        const percentage =
          data.spentAmount > 0 && cat ? ((cat.amount / data.spentAmount) * 100).toFixed(1) : '0.0';
        return `${params.name}<br/>₹${params.value.toFixed(2)} (${percentage}%)`;
      },
    },
    legend: {
      show: false, // Custom legend built below
    },
    series: [
      {
        name: 'Spending',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: chartData,
      },
    ],
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ReactECharts option={options} style={{ height: '100%', width: '100%' }} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {data.categories.map((cat) => {
              const percentage = data.spentAmount > 0 ? (cat.amount / data.spentAmount) * 100 : 0;
              return (
                <div key={cat.categoryId} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-slate-700">{cat.categoryName}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-semibold text-slate-900">₹{cat.amount.toFixed(2)}</span>
                    <span className="text-slate-500 w-12 text-right">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
