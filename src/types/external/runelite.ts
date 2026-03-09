import Skill from "../data/skill";

export type Diaries =
  | "Ardougne"
  | "Desert"
  | "Falador"
  | "Fremennik Province"
  | "Kandarin"
  | "Karamja"
  | "Kourend & Kebos"
  | "Lumbridge & Draynor"
  | "Morytania"
  | "Varrock"
  | "Western Provinces"
  | "Wilderness";
export type DiaryDifficulty = "Easy" | "Medium" | "Hard" | "Elite";

export type UserData = {
  username: string;
  timestamp: string;
  quests: Record<string, 0 | 1 | 2>; // unstarted, in progress, completed
  achievement_diaries: {
    [key in Diaries]: {
      [key in DiaryDifficulty]: { complete: boolean; tasks: boolean[] };
    };
  };
  levels: {
    [key in Exclude<
      Skill,
      "Combat_Level" | "Quest_Points"
    >]: number;
  };
  music_tracks: { string: boolean };
  combat_achievements: number[];
  league_tasks: unknown[];
  bingo_tasks: unknown[];
  collection_log: number[];
  collectionLogItemCount: null | number;
  sea_charting: unknown[];
};
