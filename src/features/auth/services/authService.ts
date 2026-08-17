import {
  createPinApi,
  forgotPasswordApi,
  forgotPinApi,
  loginApi,
  resendEmailOtpApi,
  resendPasswordOtpApi,
  resendPinOtpApi,
  resetPasswordApi,
  resetPinApi,
  signupApi,
  verifyEmailApi,
  verifyPasswordOtpApi,
  verifyPinApi,
  verifyPinOtpApi,
  verifyTokenApi,
} from '../../../api';
import { setAccessToken, setRefreshToken } from '../../../api/client';
import type {
  CreatePinPayload,
  CreatePinResponse,
  ForgotPasswordResponse,
  ForgotPinResponse,
  LoginPayload,
  LoginResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  ResetPinPayload,
  ResetPinResponse,
  SignupPayload,
  SignupResponse,
  VerifyEmailPayload,
  VerifyEmailResponse,
  VerifyPasswordOtpPayload,
  VerifyPasswordOtpResponse,
  VerifyPinOtpPayload,
  VerifyPinOtpResponse,
  VerifyPinPayload,
  VerifyPinResponse,
} from '../types/auth';

export async function signup(payload: SignupPayload): Promise<SignupResponse> {
  const response = await signupApi(payload);
  const data = (await response.json().catch(() => ({}))) as SignupResponse;

  if (!response.ok) {
    const message =
      typeof data.message === 'string' && data.message.trim()
        ? data.message
        : 'Unable to create your account. Please try again.';

    throw new Error(message);
  }

  return data;
}

export async function verifyEmail(payload: VerifyEmailPayload): Promise<VerifyEmailResponse> {
  const response = await verifyEmailApi(payload);
  const data = (await response.json().catch(() => ({}))) as VerifyEmailResponse;

  if (!response.ok) {
    const message =
      typeof data.message === 'string' && data.message.trim()
        ? data.message
        : 'Unable to verify your email. Please check the code and try again.';

    throw new Error(message);
  }

  return data;
}

export function getOnboardingToken(data: VerifyEmailResponse): string {
  const token =
    data.onboardingToken || data.token || data.data?.onboardingToken || data.data?.token;
  return typeof token === 'string' ? token : '';
}

export async function createPin(payload: CreatePinPayload): Promise<CreatePinResponse> {
  const response = await createPinApi(payload);
  const data = (await response.json().catch(() => ({}))) as CreatePinResponse;

  if (!response.ok) {
    const message =
      typeof data.message === 'string' && data.message.trim()
        ? data.message
        : 'Unable to create your PIN. Please try again.';

    throw new Error(message);
  }

  return data;
}

export async function resendEmailOtp(email: string): Promise<void> {
  const response = await resendEmailOtpApi({ email });
  const data = (await response.json().catch(() => ({}))) as { message?: string };

  if (!response.ok) {
    const message =
      typeof data.message === 'string' && data.message.trim()
        ? data.message
        : 'Unable to resend verification code. Please try again.';

    throw new Error(message);
  }
}

export async function resendPasswordOtp(email: string): Promise<void> {
  const response = await resendPasswordOtpApi({ email });
  const data = (await response.json().catch(() => ({}))) as { message?: string };

  if (!response.ok) {
    const message =
      typeof data.message === 'string' && data.message.trim()
        ? data.message
        : 'Unable to resend reset code. Please try again.';

    throw new Error(message);
  }
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await loginApi(payload);
  const data = (await response.json().catch(() => ({}))) as LoginResponse;

  if (!response.ok) {
    const message =
      typeof data.message === 'string' && data.message.trim()
        ? data.message
        : 'Unable to sign in. Please check your credentials and try again.';

    throw new Error(message);
  }

  const accessToken = data.accessToken || data.token || data.data?.accessToken || data.data?.token;
  if (typeof accessToken === 'string' && accessToken) {
    setAccessToken(accessToken);
  }

  const refreshToken = data.refreshToken || (data.data as { refreshToken?: string })?.refreshToken;
  if (typeof refreshToken === 'string' && refreshToken) {
    setRefreshToken(refreshToken);
  }

  return data;
}

export function getAccessToken(data: LoginResponse): string {
  const token = data.accessToken || data.token || data.data?.accessToken || data.data?.token;
  return typeof token === 'string' ? token : '';
}

export async function verifyPin(payload: VerifyPinPayload): Promise<VerifyPinResponse> {
  const response = await verifyPinApi(payload);
  const data = (await response.json().catch(() => ({}))) as VerifyPinResponse;

  if (!response.ok) {
    const message =
      typeof data.message === 'string' && data.message.trim()
        ? data.message
        : 'Unable to verify PIN. Please check your PIN and try again.';

    throw new Error(message);
  }

  const accessToken = data.accessToken || data.token || data.data?.accessToken || data.data?.token;
  if (typeof accessToken === 'string' && accessToken) {
    setAccessToken(accessToken);
  }

  const refreshToken = data.refreshToken || data.data?.refreshToken;
  if (typeof refreshToken === 'string' && refreshToken) {
    setRefreshToken(refreshToken);
  }

  return data;
}

export async function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
  const response = await forgotPasswordApi({ email });
  const data = (await response.json().catch(() => ({}))) as ForgotPasswordResponse;

  if (!response.ok) {
    const message =
      typeof data.message === 'string' && data.message.trim()
        ? data.message
        : 'Unable to send reset code. Please check your email and try again.';

    throw new Error(message);
  }

  return data;
}

export async function verifyPasswordOtp(
  payload: VerifyPasswordOtpPayload
): Promise<VerifyPasswordOtpResponse> {
  const response = await verifyPasswordOtpApi(payload);
  const data = (await response.json().catch(() => ({}))) as VerifyPasswordOtpResponse;

  if (!response.ok) {
    const message =
      typeof data.message === 'string' && data.message.trim()
        ? data.message
        : 'Unable to verify code. Please check the code and try again.';

    throw new Error(message);
  }

  return data;
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<ResetPasswordResponse> {
  const response = await resetPasswordApi(payload);
  const data = (await response.json().catch(() => ({}))) as ResetPasswordResponse;

  if (!response.ok) {
    const message =
      typeof data.message === 'string' && data.message.trim()
        ? data.message
        : 'Unable to reset password. Please try again.';

    throw new Error(message);
  }

  return data;
}

export async function forgotPin(email: string): Promise<ForgotPinResponse> {
  const response = await forgotPinApi({ email });
  const data = (await response.json().catch(() => ({}))) as ForgotPinResponse;

  if (!response.ok) {
    const message =
      typeof data.message === 'string' && data.message.trim()
        ? data.message
        : 'Unable to send PIN reset code. Please check your email and try again.';

    throw new Error(message);
  }

  return data;
}

export async function verifyPinOtp(payload: VerifyPinOtpPayload): Promise<VerifyPinOtpResponse> {
  const response = await verifyPinOtpApi(payload);
  const data = (await response.json().catch(() => ({}))) as VerifyPinOtpResponse;

  if (!response.ok) {
    const message =
      typeof data.message === 'string' && data.message.trim()
        ? data.message
        : 'Unable to verify code. Please check the code and try again.';

    throw new Error(message);
  }

  return data;
}

export async function resendPinOtp(email: string): Promise<void> {
  const response = await resendPinOtpApi({ email });
  const data = (await response.json().catch(() => ({}))) as { message?: string };

  if (!response.ok) {
    const message =
      typeof data.message === 'string' && data.message.trim()
        ? data.message
        : 'Unable to resend PIN reset code. Please try again.';

    throw new Error(message);
  }
}

export async function resetPin(payload: ResetPinPayload): Promise<ResetPinResponse> {
  const response = await resetPinApi(payload);
  const data = (await response.json().catch(() => ({}))) as ResetPinResponse;

  if (!response.ok) {
    const message =
      typeof data.message === 'string' && data.message.trim()
        ? data.message
        : 'Unable to reset PIN. Please try again.';

    throw new Error(message);
  }

  return data;
}

export async function verifyToken(token?: string | null): Promise<{
  success: boolean;
  message?: string;
  data?: {
    user: {
      id: string;
      sub: string;
      role: string;
      sessionId: string;
    };
  };
}> {
  const response = await verifyTokenApi(token);
  const data = (await response.json().catch(() => ({}))) as {
    success: boolean;
    message?: string;
    data?: {
      user: {
        id: string;
        sub: string;
        role: string;
        sessionId: string;
      };
    };
  };

  if (!response.ok) {
    const message = typeof data.message === 'string' ? data.message : 'Token verification failed';
    throw new Error(message);
  }

  return data;
}
