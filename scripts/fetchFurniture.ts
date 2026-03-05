import fs from "fs";
import { load } from "cheerio";
import { fileURLToPath } from "url";
import type PageData from "../src/types/external/wikiPageData";
import type { Furniture } from "../src/types/data/furniture";
import path from "path";

// strategy: find parent of element with id, then next sibling should be a table
const categories = ["Teleports_2", "Pool", "Spellbook altar"];

const url =
  "https://oldschool.runescape.wiki/api.php?action=parse&page=Construction&format=json";

export default async function fetchFurniture() {
  const response = (await (await fetch(url)).json()) as PageData;
  if (!response)
    throw new Error("Failure to fetch Furniture : no response body");

  const $ = load(response.parse.text["*"]);
  const furniture: Record<string, Furniture> = {};

  categories.forEach((c) => {
    $(`#${c}`)
      .parent()
      .next()
      .find("tr:not(:first-child)")
      .each((_, r) => {
        const item: Partial<Furniture> = {};
        $(r)
          .find("td")
          .each((c, td) => {
            const $td = $(td);
            switch (c) {
              case 0: // icon
                item.imgUrl = `https://oldschool.runescape.wiki${$td.find("img").attr("src")!.split("?")[0]}`;
                break;
              case 1:
                const $a = $td.find("a");
                item.name = $a.attr("title");
                item.url = `https://oldschool.runescape.wiki${$a.attr("href")!}`;
                break;
              case 2: // room, skip
                break;
              case 3:
                item.levelRequirement = Number($td.text().trim().split("(")[0]);
                break;
              default: // exp, mats, GE cost, etc
                break;
            }
          });
        if (item.name) furniture[item.name] = item as Furniture;
      });
  });

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const outDir = path.join(__dirname, "..", "src/data");
  const furniturePath = path.join(outDir, "furniture.json");
  fs.writeFileSync(furniturePath, JSON.stringify(furniture, null, 2));
  console.log(
    `furniture: wrote ${Object.keys(furniture).length} constructibles to ${furniturePath}`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fetchFurniture();
}
