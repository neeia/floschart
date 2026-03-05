import { UserData } from "@/types/external/runelite";

export default async function fetchRuneliteUser(query: string) {
  const remote = `https://sync.runescape.wiki/runelite/player/${query}/STANDARD`;
  const response = await fetch(remote);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data as UserData;
}
