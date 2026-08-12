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

const SIGNUP_URL = 'http://192.168.4.58:3005/api/v1/auth/signup';
const VERIFY_EMAIL_URL = 'http://192.168.4.58:3005/api/v1/auth/verify-email';
const CREATE_PIN_URL = 'http://192.168.4.58:3005/api/v1/auth/create-pin';
const RESEND_EMAIL_OTP_URL = 'http://192.168.4.58:3005/api/v1/auth/resend-email-otp';
const LOGIN_URL = 'http://192.168.4.58:3005/api/v1/auth/login';
const VERIFY_PIN_URL = 'http://192.168.4.58:3005/api/v1/auth/verify-pin';
const FORGOT_PASSWORD_URL = 'http://192.168.4.58:3005/api/v1/auth/forgot-password';
const VERIFY_PASSWORD_OTP_URL = 'http://192.168.4.58:3005/api/v1/auth/verify-password-otp';
const RESET_PASSWORD_URL = 'http://192.168.4.58:3005/api/v1/auth/reset-password';
const RESEND_PASSWORD_OTP_URL = 'http://192.168.4.58:3005/api/v1/auth/forgot-password';
const FORGOT_PIN_URL = 'http://192.168.4.58:3005/api/v1/auth/forgot-pin';
const VERIFY_PIN_OTP_URL = 'http://192.168.4.58:3005/api/v1/auth/verify-pin-otp';
const RESET_PIN_URL = 'http://192.168.4.58:3005/api/v1/auth/reset-pin';
const RESEND_PIN_OTP_URL = 'http://192.168.4.58:3005/api/v1/auth/forgot-pin';

export function signupApi(payload: SignupPayload): Promise<Response> {
  return fetch(SIGNUP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function verifyEmailApi(payload: VerifyEmailPayload): Promise<Response> {
  return fetch(VERIFY_EMAIL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function createPinApi(payload: CreatePinPayload): Promise<Response> {
  return fetch(CREATE_PIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function resendEmailOtpApi(payload: { email: string }): Promise<Response> {
  return fetch(RESEND_EMAIL_OTP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function resendPasswordOtpApi(payload: { email: string }): Promise<Response> {
  return fetch(RESEND_PASSWORD_OTP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function loginApi(payload: LoginPayload): Promise<Response> {
  return fetch(LOGIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function verifyPinApi(payload: VerifyPinPayload): Promise<Response> {
  return fetch(VERIFY_PIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    credentials: 'include', // Important: This allows cookies to be set
  });
}

export function forgotPasswordApi(payload: ForgotPasswordPayload): Promise<Response> {
  return fetch(FORGOT_PASSWORD_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function verifyPasswordOtpApi(payload: VerifyPasswordOtpPayload): Promise<Response> {
  return fetch(VERIFY_PASSWORD_OTP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function resetPasswordApi(payload: ResetPasswordPayload): Promise<Response> {
  return fetch(RESET_PASSWORD_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function forgotPinApi(payload: ForgotPinPayload): Promise<Response> {
  return fetch(FORGOT_PIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function verifyPinOtpApi(payload: VerifyPinOtpPayload): Promise<Response> {
  return fetch(VERIFY_PIN_OTP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function resendPinOtpApi(payload: { email: string }): Promise<Response> {
  return fetch(RESEND_PIN_OTP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function resetPinApi(payload: ResetPinPayload): Promise<Response> {
  return fetch(RESET_PIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}
