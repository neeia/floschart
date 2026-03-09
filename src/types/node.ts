import { Diaries, DiaryDifficulty } from "./external/runelite";
import type Skill from "./data/skill";
import type { Node as XyNode } from "@xyflow/react";

export type NodeType =
  | "skill"
  | "quest"
  | "diary"
  | "item"
  | "unlock"
  | "generic"
  | "collection";

export type NodeData<T extends NodeType = NodeType> = {
  // dev stuff
  type: T;
  incoming: Record<string, boolean>;
  outgoing: Set<string>;

  // user stuff
  name: string;
  target: number;
  current: number;
  url?: string;
  imgUrl?: string;
  notes?: string;

  // utilities
  expanded?: boolean; // define iff node is a collection node
  items?: GenericTaskData[];
};

export type SkillNodeData = NodeData<"skill"> & {
  name: Skill;
  target: number;
  imgUrl?: never;
  expanded?: never;
  items?: never;
};

export type QuestNodeData = NodeData<"quest"> & {
  target: 1;
  expanded?: never;
  items?: never;
};

export type DiaryTaskData = GenericTaskData & {};
export type DiaryNodeData = NodeData<"diary"> & {
  name: Diaries;
  tier: DiaryDifficulty;
  items: DiaryTaskData[];
  expanded: boolean;
};

export type ItemNodeData = NodeData<"item"> & {
  expanded?: never;
  items?: never;
};

export type UnlockNodeData = NodeData<"unlock"> & {
  expanded?: never;
  items?: never;
  target: 1;
};

export type GenericNodeData = NodeData<"generic"> & {
  expanded?: never;
  items?: never;
};

export type GenericTaskData = {
  name: string;
  notes?: string;
  completed: boolean;
};
export type CollectionNodeData = NodeData<"collection"> & {
  items: GenericTaskData[];
  expanded: boolean;
};

export const nodeTypes = [
  "skill",
  "quest",
  "diary",
  "item",
  "unlock",
  "generic",
  "collection",
];

type Node =
  | XyNode<SkillNodeData>
  | XyNode<QuestNodeData>
  | XyNode<DiaryNodeData>
  | XyNode<ItemNodeData>
  | XyNode<UnlockNodeData>
  | XyNode<GenericNodeData>
  | XyNode<CollectionNodeData>;
export default Node;
