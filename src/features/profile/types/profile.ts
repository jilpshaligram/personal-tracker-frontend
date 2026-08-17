export type GenderType = 'MALE' | 'FEMALE' | 'OTHER';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  profileImage?: string | null;
  dateOfBirth?: string | null;
  gender?: GenderType | null;
  isEmailVerified: boolean;
  isPinCreated: boolean;
  status: string;
  notificationEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string | null;
  gender?: GenderType | null;
}
