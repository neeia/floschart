import Skill from "./skill";

export type Requirements = {
  skills: { name: Skill; target: number }[];
  quests: { name: string }[];
};
