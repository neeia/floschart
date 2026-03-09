import { load } from "cheerio";
import type PageData from "../../src/types/external/wikiPageData";
import type { Item } from "../../src/types/data/item";
import { ItemMap } from "../fetchItems";

// strategy: find parent of element with id, then next sibling should be a table
const categories = [
  "Enchanted jewellery",
  "Quest-related items",
  "Other items",
];

const url =
  "https://oldschool.runescape.wiki/api.php?action=parse&page=Transportation&format=json";

export default async function fetchTele() {
  console.log("fetching teleport items");
  const response = (await (await fetch(url)).json()) as PageData;
  if (!response)
    throw new Error("Failure to fetch teleports : no response body");

  const $ = load(response.parse.text["*"]);
  const teleports: ItemMap = {};

  categories.forEach((c) => {
    $(`#${c.replaceAll(" ", "_")}`)
      .parent()
      .nextAll("table")
      .first()
      .find("tr:not(:first-child)")
      .each((_, r) => {
        const item: Partial<Item> = {};
        const $a = $(r).find("a").first();
        item.name = $a.attr("title");
        item.url = `https://oldschool.runescape.wiki${$a.attr("href")!}`;
        item.imgUrl = `https://oldschool.runescape.wiki${$a.find("img").attr("src")!.split("?")[0]}`;
        if (item.name) {
          teleports[`Teleports / ${c}`] ??= {};
          teleports[`Teleports / ${c}`][item.name] = {
            category: ["Teleports", c],
            item: item as Item,
          };
        }
      });
  });

  console.log(`tele: returned ${Object.values(teleports).length} items`);
  return teleports;
}
