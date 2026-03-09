import { NodeToolbar, Position } from "@xyflow/react";
import { ArrowLeftToLine, RotateCcw } from "lucide-react";
import Node, { NodeData } from "@/types/node";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { useEffect, useRef, useState } from "react";
import rottenTomato from "@/util/templates/rottenTomato";
import EditNodeData from "./edit/EditNodeData";

interface Props {
  sourceNode?: Node;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (id: string, nodeData: NodeData) => void;
}

export default function Edit(props: Props) {
  const { sourceNode, open, setOpen, onSubmit } = props;

  const [draftNode, setDraftNode] = useState<Node["data"]>(
    sourceNode?.data ?? rottenTomato,
  );

  useEffect(() => {
    if (open && sourceNode) setDraftNode(sourceNode.data);
  }, [open]);

  const lastActive = useRef<Node | undefined>(undefined);
  if (sourceNode && lastActive.current?.id !== sourceNode.id) {
    // active node has changed
    lastActive.current = sourceNode;
  }

  const current = sourceNode || lastActive.current;

  return (
    <NodeToolbar
      nodeId={current?.id}
      isVisible={true}
      position={Position.Right}
      align="start"
      className="nopan"
      inert={!open}
    >
      <div
        className={clsx(
          "transition-all",
          open ? "-translate-x-5" : "-translate-1/2 opacity-0 scale-0",
        )}
      >
        <EditNodeData id="edit" draftNode={draftNode} onChange={setDraftNode}>
          <FieldGroup>
            <Field orientation="horizontal" className="items-start">
              <Button
                variant="accent"
                className="rounded-none"
                type="submit"
                disabled={!draftNode.name.trim()}
                onClick={(e) => {
                  e.preventDefault();
                  if (sourceNode) {
                    onSubmit(sourceNode.id, draftNode);
                    setOpen(false);
                  }
                }}
              >
                <ArrowLeftToLine /> Apply Changes
              </Button>
              <Button
                variant="ghost"
                className="rounded-none ml-auto"
                size="icon-sm"
                type="reset"
                title="Undo all changes"
                onClick={(e) => {
                  e.preventDefault();
                  if (sourceNode) setDraftNode(sourceNode.data);
                }}
              >
                <RotateCcw />
              </Button>
            </Field>
          </FieldGroup>
        </EditNodeData>
      </div>
    </NodeToolbar>
  );
}
