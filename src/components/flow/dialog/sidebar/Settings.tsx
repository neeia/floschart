import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useStore from "@/store/store";
import { AppState, Theme } from "@/store/types";
import clsx from "clsx";
import { useShallow } from "zustand/shallow";
import SettingsData from "./SettingsData";
import { SquaresUnite } from "lucide-react";

interface ThemeProps {
  name: string;
  value: Theme;
  children?: React.ReactNode;
  bg?: string;
  mg?: string;
  fg?: string;
  colors: string[];
}
function ThemeItem(props: ThemeProps) {
  const { name, value, children, bg, mg, fg, colors } = props;
  return (
    <ToggleGroupItem
      value={value}
      aria-label={value}
      className={clsx(
        "flex flex-col items-start justify-start h-fit p-4 relative leading-none",
        "aria-checked:border-4 overflow-hidden",
        mg && "pl-5!",
      )}
      style={{ backgroundColor: bg, color: fg }}
    >
      <label>{name}</label>
      {children && (
        <div className="font-normal opacity-75 h-8 italic w-full text-wrap text-left">
          {children}
        </div>
      )}
      {mg && (
        <div
          className="w-2 h-full absolute left-1 top-0"
          style={{ backgroundColor: mg }}
        />
      )}
      {colors.length > 0 && (
        <div className="flex shadow-sm">
          {colors.map((s) => (
            <div className="w-8 h-4" key={s} style={{ backgroundColor: s }} />
          ))}
        </div>
      )}
    </ToggleGroupItem>
  );
}

const selector = (state: AppState) => ({
  theme: state.theme,
  changeTheme: state.changeTheme,
  snapToGrid: state.snapToGrid,
  toggleSnap: state.toggleSnap,
  deduplicate: state.deduplicate,
});
export default function Settings() {
  const { theme, changeTheme, snapToGrid, toggleSnap, deduplicate } = useStore(
    useShallow(selector),
  );

  return (
    <div>
      <div className="p-2">
        <h2 className="mb-2">Graph</h2>
        <Field orientation="horizontal">
          <FieldContent className="gap-0">
            <FieldLabel htmlFor="switch-settings-snap">Snap to Grid</FieldLabel>
            <FieldDescription>
              Turning on this setting will not relocate any existing nodes.
            </FieldDescription>
          </FieldContent>
          <Switch
            id="switch-settings-snap"
            checked={snapToGrid}
            onCheckedChange={toggleSnap}
            className="**:bg-sidebar"
          />
        </Field>
        <Field orientation="horizontal" className="mt-2">
          <FieldContent className="gap-0">
            <FieldLabel>Merge Duplicate Nodes</FieldLabel>
            <FieldDescription>
              Merges any duplicate quest, skill, and diary requirements.
            </FieldDescription>
          </FieldContent>
          <Button variant="outline" size="icon-sm" onClick={deduplicate}>
            <SquaresUnite className="size-4" />
          </Button>
        </Field>
      </div>
      <Separator />
      <SettingsData />
      <Separator />
      <div className="p-2">
        <h2>Display</h2>
        <Field>
          <FieldLabel>Theme</FieldLabel>
          <ToggleGroup
            type="single"
            value={theme}
            onValueChange={changeTheme}
            variant="outline"
            spacing={2}
            size="lg"
            orientation="vertical"
            className={clsx(
              "flex-col w-full *:w-full *:flex *:justify-start *:rounded-xl",
            )}
          >
            <ThemeItem
              value="Paper"
              name="Papercraft"
              bg="#F9F3EB"
              mg="#e2dbc8"
              fg="#030712"
              colors={["#D9C2A6", "#FCC1A6", "#fafafa"]}
            >
              {theme === "Paper"
                ? "Please do not eat the glue sticks."
                : "Yes, the glue sticks are non-toxic."}
            </ThemeItem>
            <ThemeItem
              value="Daylight"
              name="Cinnamon"
              bg="#f2fcff"
              mg="#FBFBFB"
              fg="#36414F"
              colors={["#BCE3EE", "#FAEE94", "#f7fdff"]}
            >
              {theme === "Daylight"
                ? "Chubby cheeks and blue eyes, so sweet you might just cry"
                : "Beautiful Cinnamon Roll Too Good For This World, Too Pure"}
            </ThemeItem>
            <ThemeItem
              value="Campfire"
              name="Campfire"
              bg="#2b241e"
              mg="#130F0C"
              fg="#F4EAEA"
              colors={["#e9b961", "#8C3900", "#4B1800"]}
            >
              {theme === "Campfire"
                ? "Mmm... Toasty."
                : "Nothing beats s'mores roasted over a campfire cape."}
            </ThemeItem>
            <ThemeItem
              value="Moonlight"
              name="Moonlight"
              bg="#051736"
              mg="#030712"
              fg="#e3ecff"
              colors={["#CBD9F4", "#313E59", "#afb6d6"]}
            >
              {theme === "Moonlight"
                ? "The mooooon haunts you!"
                : "Like the moon, I shine in darkness.... wait, wrong game."}
            </ThemeItem>
            <ThemeItem
              value="Demonic"
              name="Demonic Pact"
              bg="#271616"
              mg="#0c0b0b"
              fg="#DDBBBB"
              colors={["#9F1000", "#f3eed0", "#601711"]}
            >
              {theme === "Demonic"
                ? "Excellent."
                : "Dare you sign a contract with the master of pacts?"}
            </ThemeItem>
          </ToggleGroup>
        </Field>
      </div>
    </div>
  );
}
