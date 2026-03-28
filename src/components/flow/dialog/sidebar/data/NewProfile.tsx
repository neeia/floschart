import { Button } from "@/components/ui/button";
import { AppState } from "@/store/types";
import useStore from "@/store/store";
import { useShallow } from "zustand/shallow";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

const selector = (state: AppState) => ({
  profiles: state.profiles,
  switchProfile: state.switchProfile,
});

interface Props {
  children: React.ReactNode;
}
export default function NewProfile(props: Props) {
  const { children } = props;
  const { profiles, switchProfile } = useStore(useShallow(selector));

  const [profileName, setProfileName] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>New Profile</DialogTitle>
        </DialogHeader>
        <Input
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
        />
        {profileName in profiles && (
          <div className="text-sm text-destructive">
            Profile name must be unique.
          </div>
        )}
        <Button
          disabled={profileName in profiles || profileName.length === 0}
          onClick={() => {
            switchProfile(profileName);
            setOpen(false);
          }}
        >
          Create
        </Button>
      </DialogContent>
    </Dialog>
  );
}
