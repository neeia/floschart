import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import useStore from "@/store/store";
import { AppState } from "@/store/types";
import clsx from "clsx";
import { useShallow } from "zustand/shallow";
import ImportExport from "./data/ImportExport";
import {
  CheckLine,
  Plus,
  Settings2,
  SquaresUnite,
  Trash,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import NewProfile from "./data/NewProfile";
import { DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import DownloadFlow from "../../DownloadFlow";

const selector = (state: AppState) => ({
  deduplicate: state.deduplicate,
  profiles: state.profiles,
  switchProfile: state.switchProfile,
  currentProfile: state.currentProfile,
  renameProfile: state.renameProfile,
  deleteProfile: state.deleteProfile,
});
export default function Data() {
  const {
    deduplicate,
    profiles,
    switchProfile,
    currentProfile,
    renameProfile,
    deleteProfile,
  } = useStore(useShallow(selector));

  const [rename, setRename] = useState("");
  const [del, setDel] = useState("");

  return (
    <div>
      <div className="p-2">
        <h2 className="mb-2">Graph</h2>
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
      <DownloadFlow />
      </div>
      <Separator />
      <div className="flex flex-col p-2">
        <div className="mb-2">
          <h2>Profiles</h2>
          <div className="text-sm text-muted-foreground">
            Each profile contains one chart. Recommended for those with multiple
            accounts, or for temporary game modes.
          </div>
        </div>
        <Field>
          <Collapsible>
            <div className="flex w-full gap-1">
              <Select
                name="select-profile"
                value={currentProfile}
                onValueChange={switchProfile}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <NewProfile>
                  <SelectContent position="popper">
                    <SelectGroup>
                      {Object.keys(profiles).map((s) => (
                        <SelectItem value={s} key={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectSeparator />
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start">
                        <Plus />
                        Add New Profile
                      </Button>
                    </DialogTrigger>
                  </SelectContent>
                </NewProfile>
              </Select>
              <CollapsibleTrigger
                asChild
                className="data-[state=open]:bg-accent"
              >
                <Button variant="outline" size="icon" title="modify profile">
                  <Settings2 />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent
              className={clsx(
                "my-2 p-4 rounded-sm shadow-sm bg-muted",
                "overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
              )}
            >
              {currentProfile === "Default" ? (
                <div className="text-xs text-destructive mb-2">
                  Default cannot be renamed or deleted.
                </div>
              ) : (
                <>
                  <Field>
                    <FieldLabel>Rename</FieldLabel>
                    <div className="flex gap-1">
                      <Input
                        value={rename}
                        onChange={(e) => setRename(e.target.value)}
                      />
                      <Button
                        variant="confirm"
                        size="icon"
                        title="rename"
                        onClick={() => renameProfile(rename)}
                        disabled={rename in profiles || !rename}
                      >
                        <CheckLine />
                      </Button>
                    </div>
                    <div>
                      <FieldLabel>Delete</FieldLabel>
                      <FieldDescription>
                        Type <code className="bg-card">{currentProfile}</code>{" "}
                        to delete.
                      </FieldDescription>
                    </div>
                    <div className="flex gap-1">
                      <Input
                        value={del}
                        onChange={(e) => setDel(e.target.value)}
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        title="delete"
                        onClick={() => {
                          deleteProfile(currentProfile);
                          setDel("");
                        }}
                        disabled={del !== currentProfile}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </Field>
                </>
              )}
            </CollapsibleContent>
          </Collapsible>
        </Field>
      </div>
      <Separator />
      <ImportExport />
    </div>
  );
}
