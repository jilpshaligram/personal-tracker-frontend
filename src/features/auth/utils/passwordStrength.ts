import { tokens } from '../../../constants/theme';

export function scorePassword(val: string): number {
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  return score;
}

export interface StrengthMeta {
  label: string;
  color: string;
}

export function strengthMeta(val: string, score: number): StrengthMeta {
  if (val.length === 0)
    return { label: 'Use 8+ characters, a number, and a symbol.', color: tokens.muted };
  if (score <= 1) return { label: 'Weak — try adding a number and a symbol.', color: tokens.red };
  if (score <= 2)
    return { label: 'Fair — a symbol or capital letter will help.', color: tokens.amber };
  if (score === 3)
    return { label: 'Good — add a symbol to make it stronger.', color: tokens.amber };
  return { label: 'Strong password.', color: tokens.green };
}
