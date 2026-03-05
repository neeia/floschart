import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field } from "@/components/ui/field";
import Autosize from "./Autosize";
import { GenericTaskData } from "@/types/node";
import clsx from "clsx";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";

interface Props {
  item: GenericTaskData;
  setComplete: (b: boolean) => void;
  setNotes: (s: string) => void;
  onDelete: () => void;
  children?: React.ReactNode;
}
export default function EditListItem(props: Props) {
  const { item, setComplete, setNotes, onDelete, children } = props;

  const [expanded, setExpanded] = useState(item.notes != null);

  return (
    <Field className="flex flex-col gap-0">
      <ButtonGroup className="w-full leading-none py-0.5">
        <Toggle
          pressed={item.completed}
          onPressedChange={(p) => setComplete(p)}
          className={clsx(
            "p-0 text-2xs h-min w-full",
            item.completed &&
              "bg-complete! text-complete-foreground hover:bg-destructive!",
            "group",
          )}
        >
          <div className="group-hover:hidden">
            {item.completed ? "complete" : "incomplete"}
          </div>
          <div className="not-group-hover:hidden">
            mark {item.completed ? "incomplete" : "complete"}
          </div>
        </Toggle>
        <Button
          variant="destructive"
          className="px-1 py-0 text-2xs h-min"
          onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}
        >
          delete
        </Button>
      </ButtonGroup>
      {children}
      <Collapsible
        className={clsx(
          "flex flex-col w-0 min-w-[calc(100%-12px)] rounded-t-none rounded-b-sm",
          "overflow-hidden",
        )}
        open={expanded}
        onOpenChange={() => setExpanded(!expanded)}
      >
        <CollapsibleContent
          className={clsx(
            "text-3xs bg-card",
            "overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
          )}
        >
          <Autosize
            name={item.notes}
            value={item.notes ?? ""}
            placeholder="Notes..."
            onChange={(e) => setNotes(e.target.value)}
            className="not-focus:text-xs! py-1 -mt-0.5"
          />
        </CollapsibleContent>
        <CollapsibleTrigger className="w-full leading-none text-3xs hover:bg-secondary hover:underline decoration-1 py-0.5">
          <span>{expanded ? "hide" : "notes"}</span>
        </CollapsibleTrigger>
      </Collapsible>
    </Field>
  );
}
