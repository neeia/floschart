import { AppState } from "@/store/types";
import { SidebarProvider as ShadbarProvider } from "./ui/sidebar";
import useStore from "@/store/store";
import { useShallow } from "zustand/shallow";

const selector = (state: AppState) => ({
  currentTab: state.currentTab,
});

interface Props extends React.ComponentProps<"div"> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export default function SidebarProvider(props: Props) {
  const { open, onOpenChange, ...rest } = props;
  const { currentTab } = useStore(useShallow(selector));
  return (
    <ShadbarProvider
      className="h-full"
      open={currentTab != null}
      {...rest}
    />
  );
}
