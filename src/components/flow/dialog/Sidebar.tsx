import {
  Sidebar as Shadbar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

export default function Sidebar() {
  return (
    <Shadbar side="right" collapsible="offcanvas">
      <SidebarHeader>header</SidebarHeader>
      <SidebarContent>content</SidebarContent>
    </Shadbar>
  );
}
