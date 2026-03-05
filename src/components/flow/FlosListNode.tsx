import { GenericTaskData } from "@/types/node";
import { Checkbox } from "../ui/checkbox";
import useStore from "@/store/store";
import { useShallow } from "zustand/shallow";
import { AppState } from "@/store/types";
import clsx from "clsx";
import { MouseEventHandler } from "react";

const preventDefault: MouseEventHandler = (e) => {
  e.stopPropagation();
};

const selector = (state: AppState) => ({
  toggleSubnodeCompleted: state.toggleSubnodeCompleted,
});

interface Props {
  id: string;
  task: GenericTaskData;
}
export default function FlosListNode(props: Props) {
  const { id, task } = props;

  const { toggleSubnodeCompleted } = useStore(useShallow(selector));

  return (
    <li
      className="flex gap-x-1.5 mx-1 py-1 items-start not-last:border-b border-dashed"
      onClick={preventDefault}
    >
      <Checkbox
        checked={task.completed}
        className="my-0.5 nodrag"
        onCheckedChange={() => toggleSubnodeCompleted(id, task.name)}
      />
      <span
        className={clsx(
          "text-2xs wrap-break-word",
          task.completed && "opacity-50",
        )}
      >
        <div
          className={clsx(
            "strikethrough",
            task.completed ? "anim-strikethrough" : "delay-150!",
          )}
        >
          {task.name}
        </div>
        <hr className="h-1 opacity-0" />
        {task.notes && (
          <div className="italic show-if-selected text-muted-foreground">
            <div
              className={clsx(
                "strikethrough",
                task.completed && "anim-strikethrough delay-150!",
              )}
            >
              {task.notes}
            </div>
          </div>
        )}
      </span>
    </li>
  );
}
