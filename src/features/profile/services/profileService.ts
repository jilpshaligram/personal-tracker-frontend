import { apiClient } from '../../../api/client';
import type { UserProfile, UpdateUserProfilePayload } from '../types/profile';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const profileService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>('/users/me');
    return response.data.data;
  },

  updateProfile: async (payload: UpdateUserProfilePayload): Promise<UserProfile> => {
    const response = await apiClient.patch<ApiResponse<UserProfile>>('/users/me', payload);
    return response.data.data;
  },

  uploadProfileImage: async (file: File): Promise<UserProfile> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<ApiResponse<UserProfile>>(
      '/users/me/profile-image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  deleteProfileImage: async (): Promise<UserProfile> => {
    const response = await apiClient.delete<ApiResponse<UserProfile>>('/users/me/profile-image');
    return response.data.data;
  },
};
