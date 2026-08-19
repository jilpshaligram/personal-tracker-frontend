import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  // Palette,
  Grid3X3,
  CheckCircle2,
  Mail,
  Phone,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context';
import { apiClient } from '../api/client';

// type ThemeType = 'light' | 'dark' | 'system';

export default function SettingsPage() {
  const { user, verifyAuth } = useAuth();
  const [requirePin, setRequirePin] = useState(user?.isPinCreated || false);
  // const [theme, setTheme] = useState<ThemeType>('system');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isPinUpdating, setIsPinUpdating] = useState(false);
  const [pinSuccessMessage, setPinSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      Promise.resolve().then(() => {
        setRequirePin(user.isPinCreated || false);
      });
    }
  }, [user]);

  useEffect(() => {
    if (!requirePin) {
      Promise.resolve().then(() => {
        setNewPin('');
        setConfirmPin('');
      });
    }
  }, [requirePin]);

  const handlePinUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4 || confirmPin.length !== 4) {
      alert('PIN must be exactly 4 digits');
      return;
    }
    if (newPin !== confirmPin) {
      alert('PIN and Confirm PIN must match');
      return;
    }
    setIsPinUpdating(true);
    setPinSuccessMessage(null);
    try {
      await apiClient.post('/auth/reset-pin', {
        email: user?.email,
        newPin,
        confirmPin,
      });
      setPinSuccessMessage('Security PIN successfully updated!');
      setNewPin('');
      setConfirmPin('');
      await verifyAuth();
      setTimeout(() => setPinSuccessMessage(null), 3000);
    } catch (err: unknown) {
      console.error('Failed to reset PIN:', err);
      let errMsg = 'Failed to reset PIN. Please try again.';
      if (err && typeof err === 'object' && 'response' in err) {
        const res = (err as { response?: { data?: { message?: string } } }).response;
        if (res?.data?.message) {
          errMsg = res.data.message;
        }
      }
      alert(errMsg);
    } finally {
      setIsPinUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 sm:p-8 w-full">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          Security Settings
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 max-w-2xl leading-relaxed">
          Manage your account security, authentication methods, and review active sessions to ensure
          your VaultSaaS data remains protected.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-2">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div className="flex items-start gap-4">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100 text-slate-600 shrink-0">
                <Grid3X3 className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-800">Security PIN</h2>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Manage your 4-digit PIN for high-security actions.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-4 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-slate-800">Require PIN for transfers</p>
                <p className="text-xs text-slate-500 leading-normal">
                  Ask for PIN when moving money outside your accounts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRequirePin(!requirePin)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  requirePin ? 'bg-blue-600' : 'bg-slate-200'
                }`}
                aria-label="Toggle require pin"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    requirePin ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="h-px bg-slate-100" />

            <form onSubmit={handlePinUpdate} noValidate className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Change PIN</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                    New PIN
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    pattern="[0-9]*"
                    placeholder="••••"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                    disabled={!requirePin}
                    className={`w-full text-sm px-3.5 py-2.5 rounded-xl border transition-all font-mono tracking-widest ${
                      requirePin
                        ? 'border-slate-200 bg-white focus:outline-hidden focus:border-blue-900 focus:ring-1 focus:ring-blue-900 text-slate-700'
                        : 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed select-none'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                    Confirm PIN
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    pattern="[0-9]*"
                    placeholder="••••"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                    disabled={!requirePin}
                    className={`w-full text-sm px-3.5 py-2.5 rounded-xl border transition-all font-mono tracking-widest ${
                      requirePin
                        ? 'border-slate-200 bg-white focus:outline-hidden focus:border-blue-900 focus:ring-1 focus:ring-blue-900 text-slate-700'
                        : 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed select-none'
                    }`}
                  />
                </div>
              </div>

              {pinSuccessMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-xs font-semibold text-emerald-600">
                  {pinSuccessMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  isPinUpdating || !requirePin || newPin.length !== 4 || confirmPin.length !== 4
                }
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-55 disabled:text-slate-400 disabled:cursor-not-allowed border border-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all cursor-pointer"
              >
                {isPinUpdating ? 'Updating PIN...' : 'Update PIN'}
              </button>
            </form>
          </div>

          {/* <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div className="flex items-start gap-4">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100 text-slate-600 shrink-0">
                <Palette className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-800">Theme Preferences</h2>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Choose how VaultSaaS looks on your device.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex flex-col gap-2 p-2.5 rounded-xl border transition-all text-left ${
                  theme === 'light'
                    ? 'border-blue-600 bg-blue-50/20 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-full aspect-video rounded-lg bg-slate-50 border border-slate-100 p-2 flex flex-col gap-1.5">
                  <div className="h-2 w-12 bg-slate-200 rounded-sm" />
                  <div className="flex gap-1.5 flex-1">
                    <div className="w-8 bg-slate-200 rounded-xs" />
                    <div className="flex-1 bg-white rounded-xs border border-slate-100" />
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-700 text-center w-full block">
                  Light
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex flex-col gap-2 p-2.5 rounded-xl border transition-all text-left ${
                  theme === 'dark'
                    ? 'border-blue-600 bg-blue-50/20 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-full aspect-video rounded-lg bg-slate-900 border border-slate-800 p-2 flex flex-col gap-1.5">
                  <div className="h-2 w-12 bg-slate-750 rounded-sm" />
                  <div className="flex gap-1.5 flex-1">
                    <div className="w-8 bg-slate-850" />
                    <div className="flex-1 bg-slate-900 rounded-xs border border-slate-800" />
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-700 text-center w-full block">
                  Dark
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`flex flex-col gap-2 p-2.5 rounded-xl border transition-all text-left ${
                  theme === 'system'
                    ? 'border-blue-600 bg-blue-50/20 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-full aspect-video rounded-lg bg-gradient-to-br from-slate-50 to-slate-900 border border-slate-200 p-2 flex flex-col gap-1.5 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <span className="text-[10px] font-bold">A</span>
                  </div>
                  <div className="h-2 w-12 bg-slate-300 rounded-sm" />
                  <div className="flex gap-1.5 flex-1">
                    <div className="w-8 bg-slate-300 rounded-xs" />
                    <div className="flex-1 bg-slate-100 rounded-xs" />
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-700 text-center w-full block">
                  System
                </span>
              </button>
            </div>
          </div> */}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">Email Verification</h2>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Your email address verification status.
              </p>
            </div>

            {user?.isEmailVerified ? (
              <div className="flex items-center gap-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl p-4 text-emerald-800">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 leading-none">
                    STATUS: VERIFIED
                  </p>
                  <p className="text-[11px] text-emerald-600/95 mt-1 font-medium">
                    Email address verified successfully.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3.5 bg-amber-50/70 border border-amber-100 rounded-xl p-4 text-amber-800">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-100 text-amber-600 shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-700 leading-none">
                    STATUS: UNVERIFIED
                  </p>
                  <p className="text-[11px] text-amber-600/95 mt-1 font-medium">
                    Please verify your email address.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-start gap-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-50 text-slate-600 shrink-0">
                <Lock className="w-4.5 h-4.5" />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-800">Account Recovery</h2>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Options to regain access if you are locked out.
                </p>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-700">Recovery Email</p>
                      {user?.isEmailVerified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{user?.email || 'Not set up'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Recovery Email editing functionality')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-250 text-slate-600 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                >
                  Edit
                </button>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-700">Recovery Phone</p>
                    <p className="text-xs text-slate-500 mt-0.5">{user?.phone || 'Not set up'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Recovery Phone setup functionality')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-250 text-slate-600 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                >
                  {user?.phone ? 'Edit' : 'Setup'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
