import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { VerifyOTP } from '../pages/auth/VerifyOTP';
import { PINSetup } from '../pages/auth/PINSetup';
import { VerifyPIN } from '../pages/auth/VerifyPIN';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';
import { VerifyPinGuard } from '../components/guards/AuthGuard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
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
    path: '/verify-email',
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
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
