import { Diaries, DiaryDifficulty } from "../external/runelite";
import { Item } from "./item";
import { Requirements } from "./requirements";

export type Task = {
  name: string;
  notes?: string;
};
export type Tier = {
  tasks: Task[];
  requirements: Requirements;
};

export type Tiers = Record<DiaryDifficulty, Tier>;

export type DiaryReward = Item & {};

export type Diary = {
  name: Diaries;
  url: string;
  rewards: Record<DiaryDifficulty, DiaryReward>;
  tiers: Tiers;
};
