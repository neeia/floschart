import { load } from "cheerio";
import type PageData from "../../src/types/external/wikiPageData";
import type { Item } from "../../src/types/data/item";

const url =
  "https://oldschool.runescape.wiki/api.php?action=parse&page=Skilling_equipment&format=json";

export default async function () {
  console.log("fetching skilling outfits");
  const response = (await (await fetch(url)).json()) as PageData;
  if (!response)
    throw new Error("Failure to fetch Skilling equipment : no response body");

  const $ = load(response.parse.text["*"]);
  const outfits: Record<string, Item> = {};

  $("table.wikitable.lighttable > tbody > tr").each((_, r) => {
    const item: Partial<Item> = {};
    $(r)
      .find("td")
      .each((c, td) => {
        const $td = $(td);
        switch (c) {
          case 0: // icon
            item.imgUrl = `https://oldschool.runescape.wiki/images${$td.find("img").first().attr("src")!.split("?")[0]}`;
            break;
          case 1: // name
            item.name = $td.text().trim();
            item.url = `https://oldschool.runescape.wiki${$td.find("a").first().attr("href")!}`;
            break;
          default:
          // we don't care about any of the other cells
        }
        if (item.name) outfits[item.name] = item as Item;
      });
  });

  console.log(`skilling: returned ${Object.values(outfits).length} items`);
  return outfits;
}
