import { Toaster } from "sonner";
import Sidebar from "./components/flow/dialog/Sidebar";
import Flow from "./components/flow/Flow";
import SidebarProvider from "./components/SidebarProvider";
import { TooltipProvider } from "./components/ui/tooltip";
import ThemeProvider from "./components/ThemeProvider";
import { ReactFlowProvider } from "@xyflow/react";

function App() {
  return (
    <div className="w-screen h-screen">
      <ThemeProvider>
        <SidebarProvider className="h-full">
          <TooltipProvider>
            <ReactFlowProvider>
              <Flow />
              <Sidebar />
            </ReactFlowProvider>
            <Toaster position="bottom-center" />
          </TooltipProvider>
        </SidebarProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
