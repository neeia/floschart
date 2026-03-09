import { load } from "cheerio";
import type PageData from "../../src/types/external/wikiPageData";
import type { Item } from "../../src/types/data/item";
import capitalizeFirstLetter from "../../src/util/capitalizeFirstLetter";
import { ItemMap } from "../fetchItems";

type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;

const thresholds: Record<string, number[]> = {
  head: [5, 5, 5, 4, 7, 40, 40, 40, 12, 40, 3, 1, 1, 2],
  body: [5, 5, 5, 20, 30, 90, 90, 90, 40, 90, 1, 1, 1, 2],
  cape: [10, 10, 10, 10, 1, 10, 10, 10, 10, 10, 1, 1, 1, 7],
  neck: [6, 6, 6, 10, 7, 7, 7, 7, 7, 6, 1, 1, 3],
  ammunition: [1, 1, 1, 1, 50, 1, 1, 1, 1, 1, 1, 100, 1, 1],
  shield: [25, 24, 23, 6, 10, 50, 50, 50, 16, 50, 6, 1, 1, 5],
  "one-handed": [45, 45, 45, 10, 35, 10, 10, 10, 15, 10, 40, 30, 1, 6],
  "two-handed": [50, 50, 55, 10, 50, 30, 30, 30, 5, 5, 50, 1, 1, 5],
  hands: [10, 10, 10, 10, 11, 10, 10, 10, 6, 10, 10, 1, 1, 2],
  ring: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 0.1, 2],
};

const exceptions: Record<string, string[]> = {
  head: ["Slayer helmet", "Slayer helmet (i)"],
  body: [],
  cape: [],
  neck: [],
  ammunition: ["Atlatl dart", "Ghommal's lucky penny"],
  shield: [...Array(6).map((_, i) => `Ghommal's hilt ${i + 1}`)],
  "one-handed": [],
  "two-handed": [],
  hands: ["Void knight gloves"],
  ring: [],
};

function isUsefulGear(slot: string, bonuses: Tuple<number, 14>): boolean {
  return bonuses.some((bonus, i) => bonus >= thresholds[slot][i]);
}
// Strategy
// iterate through each of the gear by slot pages
// for each row, call a helper function that checks its bonuses and determines whether it's relevant
// relevancy threshold lower for magic and prayer bonuses
// if item is relevant, add it to the table
// remove item's parentheses (besides (i) and (ei)) and hashes, and check for collisions
// have a list of exceptions created manually
// e.g. teleportation items like dueling, wealth, digsite, skills, etc

export default async function () {
  console.log("fetching gear");
  const gear: ItemMap = {};

  for (let category of Object.keys(thresholds)) {
    const url = `https://oldschool.runescape.wiki/api.php?action=parse&page=${capitalizeFirstLetter(category)}_slot_table&format=json`;

    const response = (await (await fetch(url)).json()) as PageData;
    if (!response)
      throw new Error("Failure to fetch clog items : no response body");

    const $ = load(response.parse.text["*"]);

    $("table.wikitable.lighttable tbody tr").each((_, r) => {
      const item: Partial<Item> = {};
      const bonuses: Tuple<number, 14> = [
        ...Array(14).map((_, i) => i),
      ] as Tuple<number, 14>;
      $(r)
        .find("td")
        .each((c, td) => {
          const $td = $(td);
          switch (c) {
            case 0: // img
              item.imgUrl = `https://oldschool.runescape.wiki${$td.find("img").attr("src")!.split("?")[0]}`;
              break;
            case 1: // item
              item.name = $td
                .find("a")
                .first()
                .attr("title")!
                .replace(/\((?!(i|ei)\))[^)]*\)$/, "") // remove trailing () besides i or ei
                .trim();
              item.url = $td.find("a").attr("href")!;
              break;
            case 2: // members
              break;
            case 17: // weight
              break;
            default: // stat
              bonuses[c - 3] = Number($td.text().replaceAll(/[+%]/g, ""));
          }
        });
      if (
        item.name &&
        (exceptions[category].includes(item.name) ||
          isUsefulGear(category, bonuses))
      ) {
        gear[`Equipment / ${category}`] ??= {};
        gear[`Equipment / ${category}`][item.name] ??= {
          category: ["Equipment", category],
          item: item as Item,
        };
      }
    });
  }
  console.log(`gear: returned ${Object.values(gear).length} items`);

  return gear;
}
