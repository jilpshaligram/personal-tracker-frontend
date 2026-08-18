import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { AdminCard, AdminCardTitle } from '../common/AdminCard';
import type { GrowthDataPoint } from '../../types/superAdmin';

interface AdminGrowthChartProps {
  data: GrowthDataPoint[];
  currentCount?: number;
}

export const AdminGrowthChart: React.FC<AdminGrowthChartProps> = ({ data, currentCount = 947 }) => {
  return (
    <AdminCard>
      <AdminCardTitle>User growth</AdminCardTitle>
      <div className="text-xs text-[#6B7280] mb-1">Signed-in users</div>
      <div className="text-2xl font-bold text-[#151A26] mb-3">{currentCount}</div>
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2F63EB" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#2F63EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#E7E9F0" vertical={false} />
            <XAxis dataKey="d" stroke="#9AA2B1" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#9AA2B1" fontSize={11} tickLine={false} axisLine={false} width={36} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E7E9F0',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              }}
              labelStyle={{ color: '#6B7280' }}
            />
            <Area
              type="monotone"
              dataKey="users"
              stroke="#2F63EB"
              strokeWidth={2.2}
              fill="url(#growthGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </AdminCard>
  );
};
