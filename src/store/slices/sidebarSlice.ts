import { StateCreator } from "zustand";
import { AllSlice, SidebarSlice } from "../types";

export const createSidebarSlice: StateCreator<
  AllSlice,
  [],
  [],
  SidebarSlice
> = (set, get) => ({
  open: false,
  openTab: (tab) => {
    if (tab === get().currentTab) set({ open: false });
    else set({ currentTab: tab, open: true });
  },
  closeTab: () => {
    set({ open: false });
  },
});
