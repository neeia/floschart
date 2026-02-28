import Node from "@/types/node";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ReactNode } from "react";
import { AppState } from "@/store/types";
import useStore from "@/store/store";
import { useShallow } from "zustand/shallow";
import clsx from "clsx";
import { cn } from "@/lib/utils";

const toggleNodeExpand = (node: Node): Node => {
  if (node.data.expanded == null) return node;
  return {
    ...node,
    data: { ...node.data, expanded: !node.data.expanded },
  } as Node;
};

const selector = (state: AppState) => ({
  toggleNodeExpanded: state.toggleNodeExpanded,
});

interface Props {
  id: string;
  expanded: boolean;
  children?: ReactNode | ReactNode[];
}
export default function FlosListNodeContainer(props: Props) {
  const { id, expanded, children } = props;

  const { toggleNodeExpanded } = useStore(useShallow(selector));

  return (
    <Collapsible
      className={clsx(
        "flex flex-col w-0 min-w-[calc(100%-12px)] rounded-t-none rounded-b-sm",
        "overflow-hidden",
      )}
      open={expanded}
      onOpenChange={() => toggleNodeExpanded(id)}
    >
      <CollapsibleContent className="text-3xs bg-card">
        <ul>{children}</ul>
      </CollapsibleContent>
      <CollapsibleTrigger className="w-full leading-none text-3xs bg-card border-t border-border hover:underline decoration-1 py-0.5">
        <span>{expanded ? "collapse" : "expand"}</span>
      </CollapsibleTrigger>
    </Collapsible>
  );
}
