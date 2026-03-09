import useStore from "@/store/store";
import { AppState, Theme } from "@/store/types";
import clsx from "clsx";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

const selector = (state: AppState) => ({
  theme: state.theme,
});

const darkThemes: Theme[] = ["Campfire", "Moonlight", "Demonic"];

interface Props {
  children?: React.ReactNode;
}
export default function ThemeProvider(props: Props) {
  const { children } = props;
  const { theme } = useStore(useShallow(selector));

  useEffect(() => {
    const root = window.document.documentElement;
    root.className = clsx(
      theme.toLowerCase(),
      darkThemes.includes(theme) && "dark",
    );
  }, [theme]);

  return <>{children}</>;
}
