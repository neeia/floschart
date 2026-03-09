import { Item } from "./item";

export type Spell = Item & {
  levelRequirement: number;
};
