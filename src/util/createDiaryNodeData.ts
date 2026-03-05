import { Diaries, DiaryDifficulty } from "@/types/external/runelite";
import { DiaryNodeData } from "@/types/node";
import { diariesJson } from "@/data";

export function createDiaryNodeData(
  name: Diaries,
  tier: DiaryDifficulty,
  taskCompletion?: boolean[],
): DiaryNodeData {
  const items = diariesJson[name].tiers[tier].tasks.map((t) => ({
    ...t,
    completed: false,
  }));
  taskCompletion?.map((completed, i) => {
    items[i].completed = completed;
  });
  return {
    type: "diary",
    name,
    tier,
    items,
    current: items.reduce((acc, cur) => (cur.completed ? acc + 1 : acc), 0),
    target: items.length,
    url: `${diariesJson[name].url}#${tier}`,
    incoming: {},
    outgoing: new Set(),
    expanded: false,
  };
}
