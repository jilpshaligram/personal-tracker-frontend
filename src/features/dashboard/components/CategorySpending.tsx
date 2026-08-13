import ReactECharts from 'echarts-for-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import type { CategoryBreakdown, Period } from '../types';
import { getCategoryColor } from '../utils/colors';

interface CategorySpendingProps {
  data: CategoryBreakdown | null;
  period: Period;
  loading: boolean;
}

export function CategorySpending({ data, period, loading }: CategorySpendingProps) {
  if (loading || !data) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="capitalize">Categories ({period})</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center min-h-[300px]">
          <div className="text-slate-400">Loading categories...</div>
        </CardContent>
      </Card>
    );
  }

  if (data.categories.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="capitalize">Categories ({period})</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center min-h-[300px]">
          <div className="text-slate-400">No category spending data available.</div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  // Prepare chart data using deterministic colors
  const chartData = data.categories.map((cat) => ({
    name: cat.categoryName,
    value: cat.amount,
    percentage: cat.percentage,
    itemStyle: {
      color: getCategoryColor(cat.categoryName),
    },
  }));

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function (params: { name: string; data: { percentage: number }; value: number }) {
        return `
          <div class="font-sans">
            <div class="font-medium mb-1">${params.name}</div>
            <div class="text-slate-700">${params.data.percentage}%</div>
            <div class="font-semibold text-slate-900">${formatCurrency(params.value)}</div>
          </div>
        `;
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#0f172a',
      },
      extraCssText:
        'box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); border-radius: 0.5rem; padding: 8px 12px;',
    },
    series: [
      {
        name: 'Spending by Category',
        type: 'pie',
        radius: ['50%', '80%'],
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
            fontSize: 16,
            fontWeight: 'bold',
            formatter: '{b}\n{d}%',
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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="capitalize">Categories ({period})</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-1/2 h-[250px]">
          <ReactECharts
            option={option}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
        </div>

        {/* Custom Legend */}
        <div className="w-full md:w-1/2 flex flex-col gap-3">
          {data.categories.map((cat) => (
            <div key={cat.categoryId} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getCategoryColor(cat.categoryName) }}
                />
                <span className="text-sm font-medium text-slate-700">{cat.categoryName}</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">{cat.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
