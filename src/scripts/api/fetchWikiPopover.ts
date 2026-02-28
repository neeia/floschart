import { WikiPopover } from "@/types/wikiPopover";

export default async function fetchWikiPopover(query: string) {
  const remote = `https://oldschool.runescape.wiki/api.php?action=query&format=json&prop=info%7Cextracts%7Cpageimages%7Crevisions%7Cinfo&formatversion=2&redirects=true&exintro=true&exchars=525&explaintext=true&exsectionformat=plain&piprop=thumbnail&pithumbsize=480&pilicense=any&rvprop=timestamp&inprop=url&titles=${query}&smaxage=300&maxage=300&uselang=content`;
  const response = await fetch(remote);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data as WikiPopover;
}
