import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import DashboardPage from '../pages/DashboardPage';
import DocumentVault from '../pages/DocumentVault';
import TransactionsPage from '../pages/TransactionsPage';
import BudgetsPage from '../pages/BudgetsPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import BillsPage from '../pages/BillsPage';
import SavingsPage from '../pages/SavingsPage';
import SettingsPage from '../pages/SettingsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'documents', element: <DocumentVault /> },
      { path: 'transactions', element: <TransactionsPage /> },
      { path: 'budgets', element: <BudgetsPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'bills', element: <BillsPage /> },
      { path: 'savings', element: <SavingsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);

export default router;
