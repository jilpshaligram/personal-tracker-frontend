export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  password: string;
}

export interface SignupResponse {
  message?: string;
  [key: string]: unknown;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface VerifyEmailResponse {
  message?: string;
  onboardingToken?: string;
  token?: string;
  data?: {
    onboardingToken?: string;
    token?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface CreatePinPayload {
  pin: string;
  confirmPin: string;
  onboardingToken: string;
}

export interface CreatePinResponse {
  message?: string;
  [key: string]: unknown;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message?: string;
  accessToken?: string;
  token?: string;
  data?: {
    accessToken?: string;
    token?: string;
    user?: {
      id?: string;
      email?: string;
      firstName?: string;
      lastName?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface VerifyPinPayload {
  email: string;
  pin: string;
}

export interface VerifyPinResponse {
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    token?: string;
    user?: {
      id?: string;
      email?: string;
      firstName?: string;
      lastName?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message?: string;
  [key: string]: unknown;
}

export interface VerifyPasswordOtpPayload {
  email: string;
  otp: string;
}

export interface VerifyPasswordOtpResponse {
  message?: string;
  [key: string]: unknown;
}

export interface ResetPasswordPayload {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  message?: string;
  [key: string]: unknown;
}

export interface ForgotPinPayload {
  email: string;
}

export interface ForgotPinResponse {
  message?: string;
  [key: string]: unknown;
}

export interface VerifyPinOtpPayload {
  email: string;
  otp: string;
}

export interface VerifyPinOtpResponse {
  message?: string;
  [key: string]: unknown;
}

export interface ResetPinPayload {
  email: string;
  newPin: string;
  confirmPin: string;
}

export interface ResetPinResponse {
  message?: string;
  [key: string]: unknown;
}
