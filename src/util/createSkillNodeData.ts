import { SkillNodeData } from "@/types/node";
import Skill from "@/types/data/skill";
import { getMaxSkilllevel } from "./getMaxSkillLevel";

export function createSkillNodeData(
  name: Skill,
  current: number = 1,
): SkillNodeData {
  return {
    type: "skill",
    name,
    current,
    target: getMaxSkilllevel(name),
    url: `https://oldschool.runescape.wiki/w/${name.replace(" ", "_")}`,
    incoming: {},
    outgoing: new Set(),
  };
}
