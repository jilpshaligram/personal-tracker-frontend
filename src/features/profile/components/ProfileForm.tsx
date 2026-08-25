import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { UserProfile, UpdateUserProfilePayload, GenderType } from '../types/profile';

interface ProfileFormProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: UpdateUserProfilePayload) => Promise<unknown>;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile, isOpen, onClose, onSave }) => {
  const [firstName, setFirstName] = useState(profile.firstName || '');
  const [lastName, setLastName] = useState(profile.lastName || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [gender, setGender] = useState<GenderType>(profile.gender === 'FEMALE' ? 'FEMALE' : 'MALE');

  const initialBirthDate = profile.dateOfBirth
    ? new Date(profile.dateOfBirth).toISOString().split('T')[0]
    : '';
  const [dateOfBirth, setDateOfBirth] = useState(initialBirthDate);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await onSave({
        firstName,
        lastName,
        phone,
        gender,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Edit Profile Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-xs font-semibold text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              Email Address
            </label>
            <input
              type="email"
              disabled
              value={profile.email}
              className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed select-none"
              title="Email address cannot be changed"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Email address cannot be changed.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="9876543210"
              className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as GenderType)}
                className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-all"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
