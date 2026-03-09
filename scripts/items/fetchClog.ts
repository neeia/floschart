import { load } from "cheerio";
import type PageData from "../../src/types/external/wikiPageData";
import type { Item } from "../../src/types/data/item";
import { ItemMap } from "../fetchItems";

const url =
  "https://oldschool.runescape.wiki/api.php?action=parse&page=Collection_log&format=json";

export default async function () {
  console.log("fetching clog");
  const response = (await (await fetch(url)).json()) as PageData;
  if (!response)
    throw new Error("Failure to fetch clog items : no response body");

  const $ = load(response.parse.text["*"]);
  const clog: ItemMap = {};

  $("table.wikitable.lighttable.individual").each((_, _source) => {
    const category = $(_source)
      .prevAll(".mw-heading2")
      .first()
      .find("h2")
      .text();
    const source = $(_source).prevAll(".mw-heading3").first().find("h3").text();
    $(_source)
      .find("td:not(.table-na)")
      .each((_, td) => {
        const item: Partial<Item> = {};
        const $td = $(td);
        item.imgUrl = `https://oldschool.runescape.wiki${$td.find("img").first().attr("src")!.split("?")[0]}`;
        item.name = $td.text().trim();
        item.url = `https://oldschool.runescape.wiki${$td.find("a").first().attr("href")!}`;
        if (item.name) {
          clog[`Collection / ${category} / ${source}`] ??= {};
          clog[`Collection / ${category} / ${source}`][item.name] = {
            category: ["Collection Log", category, source],
            item: item as Item,
          };
        }
      });
  });

  console.log(`clog: returned ${Object.values(clog).length} items`);
  return clog;
}
