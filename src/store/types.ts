import Node, { NodeData } from "@/types/node";
import { UserData } from "@/types/external/runelite";
import {
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  OnEdgesDelete,
} from "@xyflow/react";
import Skill from "@/types/data/skill";

export type AccountSlice = {
  accountData: UserData | null;
  setAccountData: (data: UserData) => void;
  getSkillLevel: (skill: Skill) => number;
};

export type FlowSlice = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange;
  onEdgesDelete: OnEdgesDelete;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  toggleNodeCompleted: (node: Node) => void;
  toggleSubnodeCompleted: (nodeId: string, subnodeName: string) => void;
  toggleNodeExpanded: (nodeId: string) => void;
  editNode: (nodeId: string, nodeData: NodeData) => void;
  removeNode: (nodeId: string) => void;
};

type Theme =
  | "System" // default
  | "Paper" // osrs wiki, default light
  | "Daylight" // rs3 wiki
  | "Candlelit" // warm dark, default dark
  | "Moonlight" // cool dark (wiki)
  | "Demonic Pact"; // red and black, default while demonic pact league is up

export type SettingsSlice = {
  theme: Theme;
  snapToGrid: boolean;
  changeTheme: (theme: Theme) => void;
  toggleSnap: () => void;
};

type SidebarTabs = "about" | "search" | "filter" | "runelite" | "settings";

export type SidebarSlice = {
  open: boolean;
  currentTab?: SidebarTabs;
  openTab: (tab: SidebarTabs) => void;
  closeTab: () => void;
};

export type AllSlice = FlowSlice & SidebarSlice & SettingsSlice & AccountSlice;

export type AppState = AllSlice;
