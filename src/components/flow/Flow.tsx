import {
  ReactFlow,
  type FitViewOptions,
  type OnNodeDrag,
  type DefaultEdgeOptions,
  Background,
  BackgroundVariant,
  MiniMap,
  ReactFlowProvider,
  Panel,
} from "@xyflow/react";
import FlosNode from "./FlosNode";
import { AppState } from "@/store/types";
import { useShallow } from "zustand/shallow";
import useStore from "@/store/store";
import Toolbar from "./dialog/Toolbar";
import { DiamondPlus, Filter, Info, Search, Settings } from "lucide-react";
import Node from "@/types/node";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

const nodeTypes = {
  node: FlosNode,
};

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

const onNodeDrag: OnNodeDrag = (_, node) => {};

const getNodeColor = (node: Node) => {
  let saturation;
  switch (node.data.current) {
    case node.data.target:
      saturation = 300;
      break;
    case 0:
      saturation = 50;
      break;
    default:
      saturation = 100;
      break;
  }

  switch (node.data.type) {
    case "diary":
      switch (saturation) {
        case 50:
          return `var(--color-green-50)`;
        case 100:
          return `var(--color-green-100)`;
        case 300:
          return `var(--color-green-300)`;
      }
      break;
    case "skill":
      switch (saturation) {
        case 50:
          return `var(--color-yellow-50)`;
        case 100:
          return `var(--color-yellow-100)`;
        case 300:
          return `var(--color-yellow-300)`;
      }
      break;
    case "quest":
      switch (saturation) {
        case 50:
          return `var(--color-sky-50)`;
        case 100:
          return `var(--color-sky-100)`;
        case 300:
          return `var(--color-sky-300)`;
      }
      break;
    case "item":
      switch (saturation) {
        case 50:
          return `var(--color-red-100)`;
        case 100:
          return `var(--color-red-200)`;
        case 300:
          return `var(--color-red-300)`;
      }
      break;
    case "collection":
      switch (saturation) {
        case 50:
          return `var(--color-purple-50)`;
        case 100:
          return `var(--color-purple-100)`;
        case 300:
          return `var(--color-purple-300)`;
      }
      break;
    case "generic":
      switch (saturation) {
        case 50:
          return `var(--color-neutral-50)`;
        case 100:
          return `var(--color-neutral-100)`;
        case 300:
          return `var(--color-neutral-300)`;
      }
      break;
  }
  return "var(--color-neutral-50)";
};

const selector = (state: AppState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onEdgesDelete: state.onEdgesDelete,
  onConnect: state.onConnect,
});

const proOptions = { hideAttribution: true };

interface ButtonProps extends React.ClassAttributes<HTMLButtonElement> {
  title: string;
  children?: React.ReactNode;
}
function ButtonWithTooltip({ title, children, ...props }: ButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ToggleGroupItem value="title" size="sm" {...props}>
          {children}
        </ToggleGroupItem>
      </TooltipTrigger>
      <TooltipContent side="bottom">{title}</TooltipContent>
    </Tooltip>
  );
}

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
    <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgesDelete={onEdgesDelete}
        onConnect={onConnect}
        onNodeDrag={onNodeDrag}
        nodeDragThreshold={4}
        snapToGrid
        snapGrid={[24, 24]}
        selectNodesOnDrag={false}
        fitView
        fitViewOptions={fitViewOptions}
        defaultEdgeOptions={defaultEdgeOptions}
        proOptions={proOptions}
        className="leading-none"
        minZoom={0.25}
        maxZoom={4}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} offset={24.5} />
        <Panel position="top-right" className="flex flex-col items-end gap-2">
          <MiniMap
            pannable
            aria-label="Overview"
            nodeColor={getNodeColor}
            nodeBorderRadius={0}
            className="static! m-0!"
          />
          <ToggleGroup type="multiple" className="bg-secondary">
            <ButtonWithTooltip title="About floschart">
              <Info />
            </ButtonWithTooltip>
            <ButtonWithTooltip title="Filter">
              <Filter />
            </ButtonWithTooltip>
            <ButtonWithTooltip title="Link with RuneLite">
              <img
                src="https://oldschool.runescape.wiki/images/RuneLite_icon.png"
                width={16}
                height={16}
              />
            </ButtonWithTooltip>
            <ButtonWithTooltip title="Settings">
              <Settings />
            </ButtonWithTooltip>
          </ToggleGroup>
        </Panel>
        <Panel position="bottom-right">
          <Button
            variant="default"
            className="absolute bottom-0 right-0 rounded-full size-16"
          >
            <DiamondPlus className="size-3/4" />
          </Button>
        </Panel>
        <Panel position="top-left" className="pointer-events-none">
          <img
            src="flos.png"
            width={64}
            height={64}
            className="opacity-75 select-none"
          />
        </Panel>
        <Toolbar />
      </ReactFlow>
    </ReactFlowProvider>
  );
}
