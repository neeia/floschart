import { Item } from "./item";

export type Furniture = Item & {
  levelRequirement: number;
};
