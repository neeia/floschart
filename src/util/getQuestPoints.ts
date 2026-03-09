import { miniquestJson, questJson } from "@/data";

export function getQuestPoints(completedQuests: string[]) {
  return completedQuests.reduce((acc, cur) => {
    if (cur === "Recipe for Disaster") return acc;
    if (cur in questJson) return acc + questJson[cur].qp;
    else if (cur in miniquestJson) return acc;
    else {
      console.log("quest not found in json: " + cur);
      return acc;
    }
  }, 0);
}
