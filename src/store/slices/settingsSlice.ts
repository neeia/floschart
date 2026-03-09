import { StateCreator } from "zustand";
import { AllSlice, SettingsSlice } from "../types";

export const createSettingsSlice: StateCreator<
  AllSlice,
  [],
  [],
  SettingsSlice
> = (set) => ({
  snapToGrid: true,
  theme: "Paper",
  changeTheme: (t) => {
    if (t)
      set({
        theme: t,
      });
  },
  toggleSnap: () => {
    set((state) => ({ snapToGrid: !state.snapToGrid }));
  },
});
