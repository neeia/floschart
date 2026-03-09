import { SquareMousePointer } from "lucide-react";
import Node from "@/types/node";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { useRef, useState } from "react";
import rottenTomato from "@/util/templates/rottenTomato";
import EditNodeData from "./edit/EditNodeData";
import { AppState } from "@/store/types";
import useStore from "@/store/store";
import { useShallow } from "zustand/shallow";
import { useReactFlow } from "@xyflow/react";

const selector = (state: AppState) => ({
  getId: state.getId,
  addNode: state.addNode,
});

interface Props {
  onClose: () => void;
}
export default function CreateNode(props: Props) {
  const { onClose } = props;
  const { getId, addNode } = useStore(useShallow(selector));

  const { screenToFlowPosition } = useReactFlow();

  const [draftNode, setDraftNode] = useState<Node["data"]>(rottenTomato);

  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <EditNodeData id="edit" draftNode={draftNode} onChange={setDraftNode}>
      <FieldGroup>
        <Field orientation="horizontal" className="items-start">
          <Button
            ref={buttonRef}
            variant="accent"
            className="rounded-none"
            type="submit"
            disabled={!draftNode.name.trim()}
            onClick={(e) => {
              e.preventDefault();
              if (!buttonRef.current) return;
              const rect = buttonRef.current.getBoundingClientRect();
              const node = {
                id: getId().toString(),
                type: "node",
                data: draftNode,
                position: screenToFlowPosition({ x: rect.x, y: rect.y }),
              } as Node;
              addNode(node);
              onClose();
            }}
          >
            <SquareMousePointer /> Create Node
          </Button>
        </Field>
      </FieldGroup>
    </EditNodeData>
  );
}
