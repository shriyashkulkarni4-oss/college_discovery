import { create } from 'zustand';
import type { CollegeCard } from '../types';

interface CompareState {
  colleges: CollegeCard[];
  addCollege: (college: CollegeCard) => boolean; // returns false if already at max (3)
  removeCollege: (id: string) => void;
  clearAll: () => void;
  isInCompare: (id: string) => boolean;
}

export const useCompareStore = create<CompareState>()((set, get) => ({
  colleges: [],

  addCollege: (college) => {
    const { colleges } = get();
    if (colleges.length >= 3) return false;
    if (colleges.find((c) => c.id === college.id)) return false;
    set({ colleges: [...colleges, college] });
    return true;
  },

  removeCollege: (id) =>
    set((state) => ({ colleges: state.colleges.filter((c) => c.id !== id) })),

  clearAll: () => set({ colleges: [] }),

  isInCompare: (id) => get().colleges.some((c) => c.id === id),
}));
