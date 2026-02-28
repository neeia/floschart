import Node, { NodeData } from "@/types/node";
import { UserData } from "@/types/runelite";
import {
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  OnEdgesDelete,
} from "@xyflow/react";

export type AppState = {
  accountData?: UserData;
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
