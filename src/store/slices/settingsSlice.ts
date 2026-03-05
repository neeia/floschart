import { StateCreator } from "zustand";
import { AllSlice, SettingsSlice } from "../types";

export const createSettingsSlice: StateCreator<
  AllSlice,
  [],
  [],
  SettingsSlice
> = (set) => ({
  snapToGrid: true,
  theme: "System",
  changeTheme: (t) => {
    set({
      theme: t,
    });
  },
  toggleSnap: () => {
    set((state) => ({ snapToGrid: !state.snapToGrid }));
  },
});
