import {
  Sidebar as Shadbar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import useStore from "@/store/store";
import { AppState } from "@/store/types";
import { useShallow } from "zustand/shallow";
import About from "./sidebar/About";
import Filter from "./sidebar/Filter";
import capitalizeFirstLetter from "@/util/capitalizeFirstLetter";
import Runelite from "./sidebar/Runelite";
import Settings from "./sidebar/Settings";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const selector = (state: AppState) => ({
  currentTab: state.currentTab,
  closeTab: state.closeTab,
});

export default function Sidebar() {
  const { currentTab, closeTab } = useStore(useShallow(selector));

  return (
    <Shadbar
      side="right"
      collapsible="offcanvas"
      className="shadow-lg max-h-dvh"
    >
      <SidebarHeader className="flex flex-row">
        <h2 className="font-bold text-2xl">
          {currentTab && capitalizeFirstLetter(currentTab)}
        </h2>
        <Button
          variant="shine"
          size="icon-sm"
          className="ml-auto"
          onClick={() => closeTab()}
        >
          <X />
        </Button>
      </SidebarHeader>
      <SidebarContent className="pb-4">
        {(currentTab === "about" && <About />) ||
          (currentTab === "filter" && <Filter />) ||
          (currentTab === "runelite" && <Runelite />) ||
          (currentTab === "settings" && <Settings />)}
      </SidebarContent>
    </Shadbar>
  );
}
