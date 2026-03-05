import { questJson } from "@/data";
import Skill from "@/types/data/skill";

export function getMaxSkilllevel(skill: Skill): number {
  switch (skill) {
    case Skill.Quest_Points:
      return Object.values(questJson).reduce((acc, cur) => acc + cur.qp, 0);
    case Skill.Combat_Level:
      return 126;
    case Skill.Overall:
      return Object.keys(Skill).length * 99;
    default:
      return 99;
  }
}
