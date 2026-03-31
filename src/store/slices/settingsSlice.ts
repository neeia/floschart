import { StateCreator } from "zustand";
import { AllSlice, SettingsSlice } from "../types";

export const createSettingsSlice: StateCreator<
  AllSlice,
  [],
  [],
  SettingsSlice
> = (set) => ({
  theme: "Paper",
  changeTheme: (t) => {
    if (t)
      set({
        theme: t,
      });
  },
  snapToGrid: true,
  toggleSnap: (snapToGrid: boolean) => {
    set(() => ({ snapToGrid }));
  },
  showCurrent: false,
  toggleShowCurrent: (showCurrent: boolean) => {
    set(() => ({ showCurrent }));
  },
  skillProgress: false,
  toggleSkillProgress: (skillProgress: boolean) => {
    set(() => ({ skillProgress }));
  },
  lineAnimation: true,
  toggleLineAnimation: (lineAnimation: boolean) => {
    set(() => ({ lineAnimation }));
  },
});
