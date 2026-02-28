import { Diaries, DiaryDifficulty } from "./runelite";
import type Skill from "./skill";
import type { Node as XyNode } from "@xyflow/react";

export type NodeData = {
  // dev stuff
  type: string;
  incoming: Record<string, boolean>;
  outgoing: Set<string>;

  // user stuff
  name: string;
  notes?: string;
  url?: string;
  imgUrl?: string;
  target: number;
  current: number;

  // utilities
  expanded?: boolean; // define iff node is a collection node
};

type SkillNodeData = NodeData & {
  type: "skill";
  name: Skill;
  target: number;
  imgUrl?: never;
  expanded?: never;
};

type QuestNodeData = NodeData & {
  type: "quest";
  expanded?: never;
};

type DiaryTaskData = GenericTaskData & {};
type DiaryNodeData = NodeData & {
  type: "diary";
  name: Diaries;
  tier: DiaryDifficulty;
  items: DiaryTaskData[];
  expanded: boolean;
};

type ItemNodeData = NodeData & {
  type: "item";
  expanded?: never;
};

type GenericNodeData = NodeData & {
  type: "generic";
  expanded?: never;
};

export type GenericTaskData = {
  name: string;
  notes?: string;
  completed: boolean;
};
type CollectionNodeData = NodeData & {
  type: "collection";
  items: GenericTaskData[];
  expanded: boolean;
};

type Node =
  | XyNode<SkillNodeData>
  | XyNode<QuestNodeData>
  | XyNode<DiaryNodeData>
  | XyNode<ItemNodeData>
  | XyNode<GenericNodeData>
  | XyNode<CollectionNodeData>;
export default Node;
