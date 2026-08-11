import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/authService';
import type { SignupPayload } from '../types/auth';
import { scorePassword, strengthMeta } from '../utils/passwordStrength';
import {
  authEyebrowClass,
  authFormInnerClass,
  authFormPaneClass,
  authInputClass,
  authLabelClass,
  authLinkClass,
  authPrimaryButtonClass,
  authSubtitleClass,
  authTitleClass,
  strengthBarClass,
  strengthTextClass,
} from './authTailwind';

type RegisterFormFields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  password: string;
};

type RegisterFormErrors = Partial<Record<keyof RegisterFormFields, string>>;

const requiredFields: Array<keyof RegisterFormFields> = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'dob',
  'gender',
  'password',
];

const fieldLabels: Record<keyof RegisterFormFields, string> = {
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email address',
  phone: 'Phone number',
  dob: 'Date of birth',
  gender: 'Gender',
  password: 'Password',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterFormFields>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    password: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [dobFocused, setDobFocused] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update =
    (key: keyof RegisterFormFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setErrors((current) => {
        if (!current[key]) return current;
        const next = { ...current };
        delete next[key];
        return next;
      });
      setApiError('');
    };

  const score = scorePassword(form.password);
  const meta = strengthMeta(form.password, score);

  const validate = () => {
    const nextErrors: RegisterFormErrors = {};

    requiredFields.forEach((field) => {
      if (!form[field].trim()) {
        nextErrors[field] = `${fieldLabels[field]} is required.`;
      }
    });

    if (form.email.trim() && !emailPattern.test(form.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (form.password.trim() && form.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    const payload: SignupPayload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      dateOfBirth: form.dob,
      gender: form.gender,
      password: form.password,
    };

    try {
      setIsSubmitting(true);
      await signup(payload);
      navigate('/verify-otp', { state: { flow: 'register', email: payload.email } });
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : 'Unable to create your account. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={authFormPaneClass}>
      <div className={authFormInnerClass}>
        <div className={authEyebrowClass}>Get started</div>
        <h1 className={authTitleClass}>Create your account</h1>
        <p className={authSubtitleClass}>
          Set up your vault in under a minute with budgets, bills, and savings in one place.
        </p>

        {apiError && (
          <div className="mb-5 rounded-[10px] border border-[#F6C9C9] bg-[#FDECEC] px-3 py-2.5 text-center text-[13px] font-medium text-[#9A2E2E]">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label className={authLabelClass}>First name</label>
              <input
                className={authInputClass(focused === 'firstName')}
                type="text"
                placeholder="John"
                value={form.firstName}
                onChange={update('firstName')}
                onFocus={() => setFocused('firstName')}
                onBlur={() => setFocused(null)}
                aria-invalid={Boolean(errors.firstName)}
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-[#E5484D]">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className={authLabelClass}>Last name</label>
              <input
                className={authInputClass(focused === 'lastName')}
                type="text"
                placeholder="Doe"
                value={form.lastName}
                onChange={update('lastName')}
                onFocus={() => setFocused('lastName')}
                onBlur={() => setFocused(null)}
                aria-invalid={Boolean(errors.lastName)}
              />
              {errors.lastName && <p className="mt-1 text-xs text-[#E5484D]">{errors.lastName}</p>}
            </div>
          </div>

          <div className="mb-4">
            <label className={authLabelClass}>Email address</label>
            <input
              className={authInputClass(focused === 'email')}
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={update('email')}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <p className="mt-1 text-xs text-[#E5484D]">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label className={authLabelClass}>Phone number</label>
            <input
              className={authInputClass(focused === 'phone')}
              type="tel"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={update('phone')}
              onFocus={() => setFocused('phone')}
              onBlur={() => setFocused(null)}
              aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone && <p className="mt-1 text-xs text-[#E5484D]">{errors.phone}</p>}
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label className={authLabelClass}>Date of birth</label>
              <input
                className={authInputClass(focused === 'dob')}
                type={dobFocused || form.dob ? 'date' : 'text'}
                placeholder="DD / MM / YYYY"
                value={form.dob}
                onChange={update('dob')}
                onFocus={() => {
                  setDobFocused(true);
                  setFocused('dob');
                }}
                onBlur={() => {
                  setDobFocused(false);
                  setFocused(null);
                }}
                aria-invalid={Boolean(errors.dob)}
              />
              {errors.dob && <p className="mt-1 text-xs text-[#E5484D]">{errors.dob}</p>}
            </div>
            <div>
              <label className={authLabelClass}>Gender</label>
              <select
                className={authInputClass(focused === 'gender', 'cursor-pointer appearance-none')}
                value={form.gender}
                onChange={update('gender')}
                onFocus={() => setFocused('gender')}
                onBlur={() => setFocused(null)}
                aria-invalid={Boolean(errors.gender)}
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="FEMALE">Female</option>
                <option value="MALE">Male</option>
                <option value="NON_BINARY">Non-binary</option>
                <option value="UNDISCLOSED">Prefer not to say</option>
              </select>
              {errors.gender && <p className="mt-1 text-xs text-[#E5484D]">{errors.gender}</p>}
            </div>
          </div>

          <div className="mb-5">
            <label className={authLabelClass}>Password</label>
            <div className="relative">
              <input
                className={authInputClass(focused === 'password', 'pr-10')}
                type={showPw ? 'text' : 'password'}
                placeholder="Create a password"
                value={form.password}
                onChange={update('password')}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                aria-invalid={Boolean(errors.password)}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center text-[#6B7280]"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="mt-2 flex gap-[5px]">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={strengthBarClass(i < score, score)} />
              ))}
            </div>
            {errors.password && <p className="mt-1 text-xs text-[#E5484D]">{errors.password}</p>}
            <div className={strengthTextClass(score, form.password.length > 0)}>{meta.label}</div>
          </div>

          <label className="mb-5 flex cursor-pointer items-start gap-2 text-[#6B7280]">
            <input type="checkbox" className="mt-0.5 h-[15px] w-[15px] accent-[#2F5FE0]" />
            <span className="text-[12.5px]">
              I agree to the <span className={authLinkClass}>Terms</span> and{' '}
              <span className={authLinkClass}>Privacy Policy</span>
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className={authPrimaryButtonClass(isSubmitting)}
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-[13.5px] text-[#6B7280]">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} className={authLinkClass}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};
