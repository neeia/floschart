import { Item } from "./item";

export type Prayer = Item & {
  levelRequirement: number;
};
