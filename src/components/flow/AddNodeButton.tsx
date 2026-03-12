import { DiamondPlus } from "lucide-react";
import { Toggle } from "../ui/toggle";
import { useRef, useState } from "react";
import clsx from "clsx";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import CreateNode from "./dialog/CreateNode";

export default function AddNodeButton() {
  const [expanded, setExpanded] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  return (
    <Popover open={expanded} onOpenChange={setExpanded}>
      <PopoverTrigger asChild>
        <Toggle
          ref={toggleRef}
          pressed={expanded}
          onPressedChange={setExpanded}
          variant="default"
          className="bg-accent text-accent-foreground absolute bottom-0 right-0 rounded-full size-16"
        >
          <DiamondPlus
            className={clsx(
              "size-3/4 transition-all",
              expanded && "-rotate-315",
            )}
          />
        </Toggle>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-min p-0 bg-transparent border-none shadow-none"
      >
        <CreateNode onClose={() => setExpanded(false)} />
      </PopoverContent>
    </Popover>
  );
}
