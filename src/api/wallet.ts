import { apiClient } from './client';

export interface WalletResponseDto {
  id: string;
  userId: string;
  currentBalance: number;
  blockedAmount: number;
  availableBalance: number;
  currency: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getWallet = async (): Promise<WalletResponseDto> => {
  const { data } = await apiClient.get<ApiResponse<WalletResponseDto>>('/wallets');
  return data.data;
};
