import { create } from 'zustand';

interface HelpState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useHelpStore = create<HelpState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));
