import { StateCreator } from "zustand";
import { AllSlice, AccountSlice } from "../types";
import Skill from "@/types/data/skill";

export const createAccountSlice: StateCreator<
  AllSlice,
  [],
  [],
  AccountSlice
> = (set, get) => ({
  accountData: null,
  setAccountData: (accountData) => {
    set({ accountData });
  },
  getSkillLevel: (skill: Skill) => {
    return get().accountData?.levels[skill] ?? 1;
  },
});
