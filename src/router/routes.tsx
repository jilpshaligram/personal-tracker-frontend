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
import ProfilePage from '../pages/ProfilePage';

import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { VerifyOTP } from '../pages/auth/VerifyOTP';
import { PINSetup } from '../pages/auth/PINSetup';
import { VerifyPIN } from '../pages/auth/VerifyPIN';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';

import AuthGuard, { VerifyPinGuard } from '../components/guards/AuthGuard';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/verify-otp',
    element: <VerifyOTP />,
  },
  {
    path: '/pin-setup',
    element: <PINSetup />,
  },
  {
    path: '/verify-pin',
    element: (
      <VerifyPinGuard>
        <VerifyPIN />
      </VerifyPinGuard>
    ),
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
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
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

export default router;
