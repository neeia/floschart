import { QuestNodeData } from "@/types/node";
import { questJson } from "@/data";

export function createQuestNodeData(
  name: string,
  completed: boolean = false,
): QuestNodeData {
  return {
    type: "quest",
    name,
    current: completed ? 1 : 0,
    target: 1,
    url: questJson[name].url,
    incoming: {},
    outgoing: new Set(),
  };
}
