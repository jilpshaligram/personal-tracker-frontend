import { useState, useRef } from 'react';
import { Camera, Pencil, Trash2 } from 'lucide-react';
import { useProfile } from '../features/profile/hooks/useProfile';
import { ProfileForm } from '../features/profile/components/ProfileForm';

export default function ProfilePage() {
  const { profile, isLoading, error, updateProfile, uploadImage, deleteImage } = useProfile();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadImage(file);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to upload profile image.');
    }
  };

  const handleImageDeleteClick = async () => {
    if (!window.confirm('Are you sure you want to remove your profile image?')) {
      return;
    }
    try {
      await deleteImage();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete profile image.');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 sm:p-10 max-w-5xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-900 border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-slate-500">Loading profile details...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-6 sm:p-10 max-w-5xl mx-auto">
        <div className="p-4 rounded-xl bg-red-50 text-sm font-semibold text-red-600 border border-red-100 max-w-3xl">
          {error || 'Profile could not be loaded.'}
        </div>
      </div>
    );
  }

  // Format Date ISO string to readable string
  const formattedDob = profile.dateOfBirth
    ? new Date(profile.dateOfBirth).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Not Specified';

  // Capitalize Gender
  const formattedGender = profile.gender
    ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1).toLowerCase()
    : 'Not Specified';

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs max-w-3xl">
        {/* Banner with Profile Image & Info */}
        <div className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gradient-to-b from-blue-50/20 to-transparent">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <img
                src={
                  profile.profileImage ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200'
                }
                alt={`${profile.firstName} ${profile.lastName}`}
                className="w-24 h-24 rounded-2xl object-cover border border-slate-100 shadow-xs"
              />
              <div className="absolute -bottom-1 -right-1 flex gap-1">
                {profile.profileImage && (
                  <button
                    type="button"
                    onClick={handleImageDeleteClick}
                    className="bg-red-600 text-white p-1.5 rounded-full border-2 border-white shadow-xs hover:bg-red-700 transition-colors cursor-pointer"
                    aria-label="Delete profile picture"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleImageUploadClick}
                  className="bg-blue-900 text-white p-1.5 rounded-full border-2 border-white shadow-xs hover:bg-blue-800 transition-colors cursor-pointer"
                  aria-label="Upload profile picture"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-sm text-slate-400 mt-1">{profile.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>

        <div className="border-t border-slate-200/80" />

        {/* Display Fields */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                First Name
              </span>
              <span className="block text-sm font-semibold text-slate-700">
                {profile.firstName}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                Email Address
              </span>
              <span className="block text-sm font-semibold text-slate-700">{profile.email}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                Last Name
              </span>
              <span className="block text-sm font-semibold text-slate-700">{profile.lastName}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                Phone Number
              </span>
              <span className="block text-sm font-semibold text-slate-700">
                {profile.phone || 'Not Specified'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                Gender
              </span>
              <span className="block text-sm font-semibold text-slate-700">{formattedGender}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                Date of Birth
              </span>
              <span className="block text-sm font-semibold text-slate-700">{formattedDob}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form Modal */}
      <ProfileForm
        profile={profile}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={updateProfile}
      />
    </div>
  );
}
