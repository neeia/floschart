import {
  ReactFlow,
  type FitViewOptions,
  type OnNodeDrag,
  type DefaultEdgeOptions,
  Background,
  BackgroundVariant,
  Controls,
} from "@xyflow/react";
import FlosNode from "./FlosNode";
import { AppState } from "@/store/types";
import { useShallow } from "zustand/shallow";
import useStore from "@/store/store";
import Toolbar from "./Toolbar";

const nodeTypes = {
  node: FlosNode,
};

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

const onNodeDrag: OnNodeDrag = (_, node) => {
  console.log("drag event", node.data);
};

const selector = (state: AppState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onEdgesDelete: state.onEdgesDelete,
  onConnect: state.onConnect,
});

export default function Flow() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onEdgesDelete,
    onConnect,
  } = useStore(useShallow(selector));

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onEdgesDelete={onEdgesDelete}
      onConnect={onConnect}
      onNodeDrag={onNodeDrag}
      fitView
      fitViewOptions={fitViewOptions}
      defaultEdgeOptions={defaultEdgeOptions}
      className="leading-none"
      minZoom={0.25}
      maxZoom={4}
    >
      <Background variant={BackgroundVariant.Dots} />
      <Controls />
      <Toolbar />
    </ReactFlow>
  );
}
