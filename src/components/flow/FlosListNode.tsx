import { GenericTaskData } from "@/types/node";
import { Checkbox } from "../ui/checkbox";
import useStore from "@/store/store";
import { useShallow } from "zustand/shallow";
import { AppState } from "@/store/types";

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
    <li className="flex gap-x-1.5 mx-1 my-2 items-start">
      <Checkbox
        checked={task.completed}
        className="my-0.5"
        onCheckedChange={() => toggleSubnodeCompleted(id, task.name)}
      />
      <span className="text-2xs">{task.name}</span>
    </li>
  );
}
