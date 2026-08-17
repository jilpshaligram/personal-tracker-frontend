import { useState, useEffect, useCallback } from 'react';
import type { UserProfile, UpdateUserProfilePayload } from '../types/profile';
import { profileService } from '../services/profileService';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to retrieve profile details.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (payload: UpdateUserProfilePayload) => {
    setIsUpdating(true);
    setError(null);
    try {
      const updated = await profileService.updateProfile(payload);
      setProfile(updated);
      return updated;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile details.';
      setError(msg);
      throw new Error(msg, { cause: err });
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const uploadImage = useCallback(async (file: File) => {
    setIsUpdating(true);
    setError(null);
    try {
      const updated = await profileService.uploadProfileImage(file);
      setProfile(updated);
      return updated;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to upload profile image.';
      setError(msg);
      throw new Error(msg, { cause: err });
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const deleteImage = useCallback(async () => {
    setIsUpdating(true);
    setError(null);
    try {
      const updated = await profileService.deleteProfileImage();
      setProfile(updated);
      return updated;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete profile image.';
      setError(msg);
      throw new Error(msg, { cause: err });
    } finally {
      setIsUpdating(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchProfile();
    });
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    isUpdating,
    error,
    updateProfile,
    uploadImage,
    deleteImage,
    refetch: fetchProfile,
  };
}
