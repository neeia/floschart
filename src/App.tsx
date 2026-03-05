import Sidebar from "./components/flow/dialog/Sidebar";
import Flow from "./components/flow/Flow";
import { SidebarProvider } from "./components/ui/sidebar";
import { TooltipProvider } from "./components/ui/tooltip";

function App() {
  return (
    <div className="w-screen h-screen">
      <SidebarProvider className="h-full">
        <TooltipProvider>
          <Flow />
          <Sidebar />
        </TooltipProvider>
      </SidebarProvider>
    </div>
  );
}

export default App;
