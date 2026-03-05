import { Diaries, DiaryDifficulty } from "./external/runelite";
import type Skill from "./data/skill";
import type { Node as XyNode } from "@xyflow/react";

export type NodeType =
  | "skill"
  | "quest"
  | "diary"
  | "item"
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
};

export type SkillNodeData = NodeData<"skill"> & {
  name: Skill;
  target: number;
  imgUrl?: never;
  expanded?: never;
};

export type QuestNodeData = NodeData<"quest"> & {
  expanded?: never;
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
};

export type GenericNodeData = NodeData<"generic"> & {
  expanded?: never;
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
  "generic",
  "collection",
];

type Node =
  | XyNode<SkillNodeData>
  | XyNode<QuestNodeData>
  | XyNode<DiaryNodeData>
  | XyNode<ItemNodeData>
  | XyNode<GenericNodeData>
  | XyNode<CollectionNodeData>;
export default Node;
