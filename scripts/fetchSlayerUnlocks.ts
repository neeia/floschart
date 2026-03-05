import fs from "fs";
import { load } from "cheerio";
import { fileURLToPath } from "url";
import type PageData from "../src/types/external/wikiPageData";
import type { Unlock } from "../src/types/data/unlock";
import path from "path";

const categories = ["Unlock", "Extend"] as const;

const url =
  "https://oldschool.runescape.wiki/api.php?action=parse&page=Slayer_Rewards&format=json";

export default async function fetchSlayerUnlocks() {
  const response = (await (await fetch(url)).json()) as PageData;
  if (!response) throw new Error("Failure to fetch Spells : no response body");

  const $ = load(response.parse.text["*"]);
  const slayerUnlocks: Record<
    (typeof categories)[number],
    Record<string, Unlock>
  > = {
    Unlock: {},
    Extend: {},
  };

  // four spellbooks
  $("table.wikitable.lighttable > tbody").each((b, tb) => {
    const category = categories[b];
    slayerUnlocks[category] = {};
    $(tb)
      .find("tr")
      .each((_, r) => {
        const unlock: Partial<Unlock> = {};
        $(r)
          .find("td")
          .each((c, td) => {
            const $td = $(td);
            switch (c) {
              case 0: // icon
                unlock.imgUrl = `https://oldschool.runescape.wiki${$td.find("img").first().attr("src")!.split("?")[0]}`;
                break;
              case 1: // name
                unlock.name = $td.text().trim();
                break;
              default:
              // we don't care about any of the other cells
            }
            if (unlock.name)
              slayerUnlocks[category][unlock.name] = unlock as Unlock;
          });
      });
  });

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const outDir = path.join(__dirname, "..", "src/data");
  const slayerPath = path.join(outDir, "slayer.json");
  fs.writeFileSync(slayerPath, JSON.stringify(slayerUnlocks, null, 2));
  console.log(
    `slayer unlocks: wrote ${Object.values(slayerUnlocks).flatMap((e) => Object.values(e)).length} unlocks ${slayerPath}`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fetchSlayerUnlocks();
}
