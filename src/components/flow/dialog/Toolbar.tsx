import useStore from "@/store/store";
import { AppState } from "@/store/types";
import { Edge, NodeToolbar, Position, useReactFlow } from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "../../ui/button";
import {
  BookSearch,
  CheckCheck,
  ExternalLink,
  Pencil,
  Trash,
  Undo2,
} from "lucide-react";
import { useRef, useState } from "react";
import { Separator } from "../../ui/separator";
import Node from "@/types/node";
import clsx from "clsx";
import Edit from "./Edit";
import clamp from "@/util/clamp";

const selector = (state: AppState) => ({
  nodes: state.nodes,
  toggleNodeCompleted: state.toggleNodeCompleted,
  editNode: state.editNode,
  removeNode: state.removeNode,
});

export default function Toolbar() {
  const { nodes, toggleNodeCompleted, editNode, removeNode } = useStore(
    useShallow(selector),
  );

  const reactFlow = useReactFlow<Node, Edge>();

  const [editing, setEditing] = useState(false);

  const activeNodes = nodes.filter((node) => node.selected);

  const lastActive = useRef<Node | undefined>(undefined);
  if (
    activeNodes.length === 1 &&
    lastActive.current?.id !== activeNodes[0].id
  ) {
    // active node has changed
    lastActive.current = activeNodes[0];
    setEditing(false);
  }

  const current =
    activeNodes.length === 1 ? activeNodes[0] : lastActive.current;

  const active = editing || activeNodes.length === 1;

  const goalIsComplete = current?.data.current === current?.data.target;

  return (
    <>
      <Edit
        key={current?.id}
        sourceNode={current}
        open={editing}
        setOpen={setEditing}
        onSubmit={editNode}
      />
      <NodeToolbar
        nodeId={current?.id}
        isVisible={true}
        position={Position.Top}
        align="start"
        className="nopan"
        inert={!active}
      >
        <div
          className={clsx(
            "transition-all drop-shadow-sm",
            active
              ? "scale-100 opacity-100"
              : "-translate-x-1/2 translate-y-2/3 opacity-0 scale-0",
          )}
        >
          <div className="flex gap-1 h-fit bg-card/25 p-1 -m-1 rounded-full items-center backdrop-blur-xs backdrop-grayscale-50">
            <Button
              title={
                goalIsComplete
                  ? "Mark Goal as Incomplete"
                  : "Mark Goal as Complete"
              }
              variant={goalIsComplete ? "destructive" : "confirm"}
              size="icon-sm"
              className="rounded-full"
              onClick={() => current != null && toggleNodeCompleted(current)}
            >
              {goalIsComplete ? <Undo2 /> : <CheckCheck />}
            </Button>
            <Button
              title="Edit Goal"
              variant="secondary"
              className={clsx(
                "rounded-full h-8 px-2!",
                editing ? "w-fit" : "w-8",
              )}
              onClick={() => {
                if (!current) return;
                setEditing(!editing);
                const currentViewport = reactFlow.getViewport();
                if (!editing)
                  reactFlow.setViewport(
                    {
                      x: clamp(
                        -current.position.x + 50,
                        currentViewport.x,
                        -current.position.x + 400,
                      ),
                      y: clamp(
                        -current.position.y + 100,
                        currentViewport.y,
                        -current.position.y + 200,
                      ),
                      zoom: 1,
                    },
                    { duration: 150 },
                  );
              }}
            >
              <Pencil /> {editing && "Editing"}
            </Button>
            <Separator
              orientation="vertical"
              decorative
              className="bg-neutral-400 h-6! mx-1"
            />
            <Button
              title="Delete Goal"
              variant="destructive"
              size="icon-sm"
              className="rounded-full"
              onClick={() => current && removeNode(current.id)}
            >
              <Trash />
            </Button>
            <Separator
              orientation="vertical"
              decorative
              className="bg-neutral-400 h-6! mx-1"
            />
            {current?.data.url ? (
              <Button
                variant="ghost"
                size="icon-xs"
                className="rounded-full"
                asChild
              >
                <a
                  href={current.data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Visit linked URL"
                  className="flex p-1"
                >
                  <ExternalLink size={16} />
                </a>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon-xs"
                className="rounded-full"
                asChild
              >
                <a
                  href={`https://oldschool.runescape.wiki/?search=${current?.data.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Search the Wiki"
                  className="flex p-1"
                >
                  <BookSearch size={16} />
                </a>
              </Button>
            )}
          </div>
        </div>
      </NodeToolbar>
    </>
  );
}
