import Skill from "@/types/data/skill";
import { UserData } from "@/types/external/runelite";
import Node from "@/types/node";
import { getCombatLevel } from "../getCombatLevel";
import { getQuestPoints } from "../getQuestPoints";

export default function syncNodeToAccountData(
  node: Node,
  accountData: UserData,
): Node {
  const completedQuests = Object.entries(accountData.quests)
    .filter(([_, n]) => n === 2)
    .map(([s]) => s);
  switch (node.data.type) {
    case "skill":
      switch (node.data.name) {
        case Skill.Quest_Points:
          return {
            ...node,
            data: {
              ...node.data,
              current: getQuestPoints(completedQuests),
            },
          };
        case Skill.Combat_Level:
          return {
            ...node,
            data: { ...node.data, current: getCombatLevel(accountData.levels) },
          };
        case Skill.Overall:
          return {
            ...node,
            data: {
              ...node.data,
              current: Object.values(accountData.levels).reduce(
                (acc, cur) => acc + cur,
                0,
              ),
            },
          };
        default:
          return {
            ...node,
            data: { ...node.data, current: accountData.levels[node.data.name] },
          };
      }
    case "quest":
      return {
        ...node,
        data: {
          ...node.data,
          current: +completedQuests.includes(node.data.name),
        },
      };
    case "diary":
      const items =
        accountData.achievement_diaries[node.data.name][node.data.tier].tasks;
      return {
        ...node,
        data: {
          ...node.data,
          current: items.filter((n) => n).length,
          items: node.data.items.map((task, i) => ({
            ...task,
            completed: items[i],
          })),
        },
      };
    case "unlock":
    case "item":
    case "generic":
    case "collection":
      return node;
  }
}
