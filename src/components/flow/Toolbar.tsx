import useStore from "@/store/store";
import { AppState } from "@/store/types";
import { NodeToolbar, Position } from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "../ui/button";
import { CheckCheck, Pencil, Trash, Undo2 } from "lucide-react";
import { useRef } from "react";
import { Separator } from "../ui/separator";
import Node from "@/types/node";
import clsx from "clsx";

const selector = (state: AppState) => ({
  nodes: state.nodes,
  setNodes: state.setNodes,
  toggleNodeCompleted: state.toggleNodeCompleted,
  removeNode: state.removeNode,
});

export default function Toolbar() {
  const { nodes, setNodes, toggleNodeCompleted, removeNode } = useStore(
    useShallow(selector),
  );

  const activeNodes = nodes.filter((node) => node.selected);

  const lastActive = useRef<Node | undefined>(undefined);
  if (activeNodes.length === 1) lastActive.current = activeNodes[0];

  const goalIsComplete =
    lastActive.current?.data.current === lastActive.current?.data.target;

  return (
    <NodeToolbar
      nodeId={lastActive.current?.id}
      isVisible={true}
      position={Position.Top}
      align="start"
    >
      <div
        className={clsx(
          "transition-all",
          activeNodes.length === 1
            ? "scale-100 opacity-100"
            : "-translate-x-1/2 translate-y-2/3 opacity-0 scale-0",
        )}
      >
        <div className="flex gap-1 h-fit bg-background/25 p-1 -m-1 rounded-full items-center backdrop-blur-xs backdrop-grayscale-50">
          <Button
            title={
              goalIsComplete
                ? "Mark Goal as Incomplete"
                : "Mark Goal as Complete"
            }
            variant={goalIsComplete ? "destructive" : "confirm"}
            size="icon-sm"
            className="rounded-full"
            onClick={() =>
              lastActive.current != null &&
              toggleNodeCompleted(lastActive.current)
            }
          >
            {goalIsComplete ? <Undo2 /> : <CheckCheck />}
          </Button>
          <Button
            title="Edit Goal"
            variant="secondary"
            size="icon-sm"
            className="rounded-full"
          >
            <Pencil />
          </Button>
          <Separator
            orientation="vertical"
            decorative
            className="bg-neutral-400 h-6!"
          />
          <Button
            title="Delete Goal"
            variant="destructive"
            size="icon-sm"
            className="rounded-full"
            onClick={() =>
              lastActive.current && removeNode(lastActive.current.id)
            }
          >
            <Trash />
          </Button>
        </div>
      </div>
    </NodeToolbar>
  );
}
