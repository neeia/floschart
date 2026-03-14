import {
  ReactFlow,
  type FitViewOptions,
  type DefaultEdgeOptions,
  Background,
  BackgroundVariant,
  MiniMap,
  Panel,
} from "@xyflow/react";
import FlosNode from "./FlosNode";
import { AppState } from "@/store/types";
import { useShallow } from "zustand/shallow";
import useStore from "@/store/store";
import Toolbar from "./dialog/Toolbar";
import { Filter, Info, Settings, X } from "lucide-react";
import Node from "@/types/node";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import AddNodeButton from "./AddNodeButton";

const nodeTypes = {
  node: FlosNode,
};

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

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
  setNodes: state.setNodes,
  onNodesChange: state.onNodesChange,
  onNodesDelete: state.onNodesDelete,
  onEdgesChange: state.onEdgesChange,
  onEdgesDelete: state.onEdgesDelete,
  onConnect: state.onConnect,
  currentTab: state.currentTab,
  openTab: state.openTab,
  snapToGrid: state.snapToGrid,
});

const proOptions = { hideAttribution: true };

interface ButtonProps extends React.ClassAttributes<HTMLButtonElement> {
  title: string;
  onClick: () => void;
  children?: React.ReactNode;
}
function ButtonWithTooltip({
  title,
  onClick,
  children,
  ...props
}: ButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild onClick={onClick} {...props}>
        <ToggleGroupItem
          value="title"
          size="sm"
          className="rounded-none! transition-colors hover:bg-accent"
        >
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
    setNodes,
    onNodesChange,
    onNodesDelete,
    onEdgesChange,
    onEdgesDelete,
    onConnect,
    openTab,
    snapToGrid,
  } = useStore(useShallow(selector));

  const numSelected = nodes.filter((node) => node.selected).length;

  function selectAllNodes() {
    setNodes(
      nodes.map((node) => {
        if (node.selected) return { ...node, selected: false };
        return node;
      }),
    );
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onNodesDelete={onNodesDelete}
      onEdgesChange={onEdgesChange}
      onEdgesDelete={onEdgesDelete}
      onConnect={onConnect}
      nodeDragThreshold={4}
      snapToGrid={snapToGrid}
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
          className="static! m-0! hidden md:block"
        />
        <ToggleGroup
          type="multiple"
          className="bg-secondary text-secondary-foreground rounded-none **:rounded-none"
        >
          <ButtonWithTooltip
            title="About floschart"
            onClick={() => openTab("about")}
          >
            <Info />
          </ButtonWithTooltip>
          <ButtonWithTooltip onClick={() => openTab("filter")} title="Filter">
            <Filter />
          </ButtonWithTooltip>
          <ButtonWithTooltip
            onClick={() => openTab("runelite")}
            title="Link with RuneLite"
          >
            <img
              src="https://oldschool.runescape.wiki/images/RuneLite_icon.png"
              width={16}
              height={16}
            />
          </ButtonWithTooltip>
          <ButtonWithTooltip
            onClick={() => openTab("settings")}
            title="Settings"
          >
            <Settings />
          </ButtonWithTooltip>
        </ToggleGroup>
      </Panel>
      <Panel position="bottom-right">
        <AddNodeButton />
      </Panel>
      <Panel position="bottom-center">
        {numSelected > 1 && (
          <span className="bg-muted flex items-center justify-center p-2 pr-3 gap-1 rounded-full leading-none">
            <Button
              className="size-4 p-0 bg-transparent!"
              onClick={selectAllNodes}
            >
              <X />
            </Button>
            {numSelected} nodes selected
          </span>
        )}
      </Panel>
      <Panel position="top-left" className="pointer-events-none">
        <h1>
          <img
            src="flos.png"
            width={64}
            height={64}
            className="opacity-75 select-none dark:invert"
          />
        </h1>
      </Panel>
      <Toolbar />
    </ReactFlow>
  );
}
