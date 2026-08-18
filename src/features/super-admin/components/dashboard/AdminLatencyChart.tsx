import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { AdminCard, AdminCardTitle } from '../common/AdminCard';
import type { LatencyDataPoint } from '../../types/superAdmin';

interface AdminLatencyChartProps {
  data: LatencyDataPoint[];
}

export const AdminLatencyChart: React.FC<AdminLatencyChartProps> = ({ data }) => {
  return (
    <AdminCard className="mb-4">
      <AdminCardTitle>Requests & latency (7 days)</AdminCardTitle>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#E7E9F0" vertical={false} />
            <XAxis dataKey="t" stroke="#9AA2B1" fontSize={11} tickLine={false} axisLine={false} />
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
            <Line type="monotone" dataKey="ms" stroke="#D8930F" strokeWidth={2.2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </AdminCard>
  );
};
