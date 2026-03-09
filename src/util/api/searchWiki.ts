import { SearchResult } from "@/types/external/searchResults";

export default async function searchWiki(query: string) {
  const remote = `https://sync.runescape.wiki/runelite/player/${query}/STANDARD`;
  const response = await fetch(remote);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = (await response.json()) as { pages: SearchResult[] };
  return data as { pages: SearchResult[] };
}
