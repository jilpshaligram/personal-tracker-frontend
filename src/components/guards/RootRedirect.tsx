import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context';

export const RootRedirect: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2F5FE0] border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-slate-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

export default RootRedirect;
