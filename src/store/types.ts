import Node, { NodeData, NodeType } from "@/types/node";
import { UserData } from "@/types/external/runelite";
import {
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  OnEdgesDelete,
  OnNodesDelete,
} from "@xyflow/react";
import Skill from "@/types/data/skill";

export type AccountSlice = {
  accountData: UserData | null;
  setAccountData: (data: UserData) => void;
  getSkillLevel: (skill: Skill) => number;
};

type NodeProfile = {
  nodes: Node[];
  edges: Edge[];
  id: number;
  accountData: UserData | null;
};
export type FlowSlice = {
  id: number;
  getId: () => number;
  nodes: Node[];
  edges: Edge[];
  currentProfile: string;
  profiles: Record<string, NodeProfile>;
  switchProfile: (profile: string) => void;
  renameProfile: (newName: string) => void;
  deleteProfile: (name: string) => void;
  onNodesChange: OnNodesChange<Node>;
  onNodesDelete: OnNodesDelete<Node>;
  onEdgesChange: OnEdgesChange;
  onEdgesDelete: OnEdgesDelete;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  toggleNodeCompleted: (node: Node) => void;
  toggleSubnodeCompleted: (nodeId: string, subnodeName: string) => void;
  toggleNodeExpanded: (nodeId: string) => void;
  editNode: (nodeId: string, nodeData: NodeData) => void;
  addNode: (node: Node) => void;
  addEdge: (edge: Edge) => void;
  removeNode: (nodeId: string) => void;
  deduplicate: () => void;
};

export type Theme =
  | "Paper" // warm light, default
  | "Daylight" // cool light
  | "Campfire" // warm dark
  | "Moonlight" // cool dark
  | "Demonic"; // red and black

export type SettingsSlice = {
  theme: Theme;
  snapToGrid: boolean;
  changeTheme: (theme: Theme) => void;
  toggleSnap: () => void;
};

type SidebarTabs = "about" | "filter" | "runelite" | "data" | "settings";

export type SidebarSlice = {
  open: boolean;
  currentTab?: SidebarTabs;
  openTab: (tab: SidebarTabs) => void;
  closeTab: () => void;
};

type Filter = {
  search: string;
  types: NodeType[];
  completion: number[];
  prereqCompletion: number[];
};
export type FilterSlice = {
  filter: Filter;
  setSearch: (search: string) => void;
  setTypes: (type: NodeType[]) => void;
  // 0: unstarted, 1: partial, 2: completed
  setCompletion: (n: number[]) => void;
  setPrereqCompletion: (n: number[]) => void;
  filterNode: (n: Node) => boolean;
};

export type AllSlice = FlowSlice &
  SidebarSlice &
  SettingsSlice &
  AccountSlice &
  FilterSlice;

export type AppState = AllSlice;
