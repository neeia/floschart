import {
  ItemSearchResponse,
} from "@/types/external/itemSearchResult";

export default async function searchWikiForItem(query: string) {
  const remote = `https://oldschool.runescape.wiki/api.php?action=query&list=search&format=json&srsearch=${query}+incategory:Items`;
  const response = await fetch(remote);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = (await response.json()) as ItemSearchResponse;
  return data.query.search;
}
