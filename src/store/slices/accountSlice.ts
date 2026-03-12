import { StateCreator } from "zustand";
import { AllSlice, AccountSlice } from "../types";
import Skill from "@/types/data/skill";
import syncNodeToAccountData from "@/util/api/syncNodeToAccountData";
import Node from "@/types/node";
import mapRuneliteQuestToWiki from "@/util/api/mapRuneliteQuestToWiki";
import { getQuestPoints } from "@/util/getQuestPoints";
import { getCombatLevel } from "@/util/getCombatLevel";

export const createAccountSlice: StateCreator<
  AllSlice,
  [],
  [],
  AccountSlice
> = (set, get) => ({
  accountData: null,
  setAccountData: (accountData) => {
    const modifiedNodes: Record<string, boolean> = {};
    const quests = Object.fromEntries(
      Object.entries(accountData.quests).map(([name, value]) => [
        mapRuneliteQuestToWiki(name),
        value,
      ]),
    );
    accountData.quests = quests;
    const nodes = get().nodes.map((n) => {
      const newNode = syncNodeToAccountData(n, accountData);
      const completed = newNode.data.current >= newNode.data.target;
      if (completed !== n.data.current >= n.data.target)
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
    set({ accountData: { ...accountData, quests }, nodes: networkedNodes });
  },
  getSkillLevel: (skill: Skill) => {
    const accountData = get().accountData;
    let skillLevel = 1;
    switch (skill) {
      case Skill.Quest_Points:
        if (!accountData) return 0;
        skillLevel = getQuestPoints(
          Object.entries(accountData.quests)
            .filter(([_, n]) => n === 2)
            .map(([s]) => s),
        );
        break;
      case Skill.Combat_Level:
        if (!accountData) return 3;
        skillLevel = getCombatLevel(accountData.levels);
        break;
      case Skill.Overall:
        if (!accountData) return 24;
        skillLevel = Object.values(accountData.levels).reduce(
          (acc, cur) => acc + cur,
          0,
        );
        break;
      default:
        if (!accountData) return 1;
        skillLevel = accountData.levels[skill];
    }
    return skillLevel;
  },
});
