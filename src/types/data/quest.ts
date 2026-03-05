import { Requirements } from "./requirements";

export type QuestDifficulty =
  | "Novice"
  | "Intermediate"
  | "Experienced"
  | "Master"
  | "Grandmaster"
  | "Special";
export type QuestLength =
  | "Very Short"
  | "Short"
  | "Medium"
  | "Long"
  | "Very Long";

type QuestBase = {
  isMiniquest: boolean;
  id?: number; // release order
  subId?: number;
  name: string;
  title: string;
  difficulty: QuestDifficulty;
  length: QuestLength;
  qp?: number;
  // series: { name: string; index: number };
  members: boolean;
  url: string;
  // releaseDate: {
  //   day: number;
  //   month: number;
  //   year: number;
  // };
  requirements: Requirements;
};

export type Quest = QuestBase & {
  isMiniquest: false;
  id: number;
  qp: number;
};

export type Miniquest = QuestBase & {
  isMiniquest: true;
  id?: never;
  qp?: never;
};
