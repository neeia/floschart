import { StateCreator } from "zustand";
import { AllSlice, AccountSlice } from "../types";
import Skill from "@/types/data/skill";
import syncNodeToAccountData from "@/util/api/syncNodeToAccountData";
import Node from "@/types/node";
import mapRuneliteQuestToWiki from "@/util/api/mapRuneliteQuestToWiki";

export const createAccountSlice: StateCreator<
  AllSlice,
  [],
  [],
  AccountSlice
> = (set, get) => ({
  accountData: null,
  setAccountData: (accountData) => {
    const modifiedNodes: Record<string, boolean> = {};
    const nodes = get().nodes.map((n) => {
      const newNode = syncNodeToAccountData(n, accountData);
      const completed = newNode.data.current >= newNode.data.target;
      if (completed !== (n.data.current >= n.data.target))
        modifiedNodes[n.id] = completed;
      return newNode;
    });
    const networkedNodes = nodes.map((node) => {
      const incoming = { ...node.data.incoming };
      Object.keys(incoming).forEach((id) => {
        if (id in modifiedNodes) incoming[id] = modifiedNodes[id];
      });
      return {
        ...node,
        data: { ...node.data, incoming },
      } as Node;
    });
    const quests = Object.fromEntries(
      Object.entries(accountData.quests).map(([name, value]) => [
        mapRuneliteQuestToWiki(name),
        value,
      ]),
    );
    set({ accountData: { ...accountData, quests }, nodes: networkedNodes });
  },
  getSkillLevel: (skill: Skill) => {
    return get().accountData?.levels[skill] ?? 1;
  },
});
