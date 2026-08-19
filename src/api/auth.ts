import type {
  CreatePinPayload,
  ForgotPasswordPayload,
  ForgotPinPayload,
  LoginPayload,
  ResetPasswordPayload,
  ResetPinPayload,
  SignupPayload,
  VerifyEmailPayload,
  VerifyPasswordOtpPayload,
  VerifyPinOtpPayload,
  VerifyPinPayload,
} from '../features/auth/types/auth';

const BASE_URL = '/api/v1/auth';
const SIGNUP_URL = `${BASE_URL}/signup`;
const VERIFY_EMAIL_URL = `${BASE_URL}/verify-email`;
const CREATE_PIN_URL = `${BASE_URL}/create-pin`;
const RESEND_EMAIL_OTP_URL = `${BASE_URL}/resend-email-otp`;
const LOGIN_URL = `${BASE_URL}/login`;
const VERIFY_PIN_URL = `${BASE_URL}/verify-pin`;
const FORGOT_PASSWORD_URL = `${BASE_URL}/forgot-password`;
const VERIFY_PASSWORD_OTP_URL = `${BASE_URL}/verify-password-otp`;
const RESET_PASSWORD_URL = `${BASE_URL}/reset-password`;
const RESEND_PASSWORD_OTP_URL = `${BASE_URL}/forgot-password`;
const FORGOT_PIN_URL = `${BASE_URL}/forgot-pin`;
const VERIFY_PIN_OTP_URL = `${BASE_URL}/verify-pin-otp`;
const RESET_PIN_URL = `${BASE_URL}/reset-pin`;
const RESEND_PIN_OTP_URL = `${BASE_URL}/forgot-pin`;
const VERIFY_TOKEN_URL = `${BASE_URL}/verify-token`;

export function verifyTokenApi(token?: string | null): Promise<Response> {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return fetch(VERIFY_TOKEN_URL, {
    method: 'GET',
    headers,
    credentials: 'include',
  });
}

export function signupApi(payload: SignupPayload): Promise<Response> {
  return fetch(SIGNUP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
}

export function verifyEmailApi(payload: VerifyEmailPayload): Promise<Response> {
  return fetch(VERIFY_EMAIL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
}

export function createPinApi(payload: CreatePinPayload): Promise<Response> {
  return fetch(CREATE_PIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
}

export function resendEmailOtpApi(payload: { email: string }): Promise<Response> {
  return fetch(RESEND_EMAIL_OTP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
}

export function resendPasswordOtpApi(payload: { email: string }): Promise<Response> {
  return fetch(RESEND_PASSWORD_OTP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
}

export function loginApi(payload: LoginPayload): Promise<Response> {
  return fetch(LOGIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
}

export function verifyPinApi(payload: VerifyPinPayload): Promise<Response> {
  return fetch(VERIFY_PIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
}

export function forgotPasswordApi(payload: ForgotPasswordPayload): Promise<Response> {
  return fetch(FORGOT_PASSWORD_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
}

export function verifyPasswordOtpApi(payload: VerifyPasswordOtpPayload): Promise<Response> {
  return fetch(VERIFY_PASSWORD_OTP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
}

export function resetPasswordApi(payload: ResetPasswordPayload): Promise<Response> {
  return fetch(RESET_PASSWORD_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
}

export function forgotPinApi(payload: ForgotPinPayload): Promise<Response> {
  return fetch(FORGOT_PIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
}

export function verifyPinOtpApi(payload: VerifyPinOtpPayload): Promise<Response> {
  return fetch(VERIFY_PIN_OTP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
}

export function resendPinOtpApi(payload: { email: string }): Promise<Response> {
  return fetch(RESEND_PIN_OTP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
}

export function resetPinApi(payload: ResetPinPayload): Promise<Response> {
  return fetch(RESET_PIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
}
