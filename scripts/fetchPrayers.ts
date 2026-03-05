import fs from "fs";
import { load } from "cheerio";
import { fileURLToPath } from "url";
import type PageData from "../src/types/external/wikiPageData";
import type { Prayer } from "../src/types/data/prayer";
import path from "path";

const url =
  "https://oldschool.runescape.wiki/api.php?action=parse&page=Prayer&format=json";

export default async function fetchPrayers() {
  const response = (await (await fetch(url)).json()) as PageData;
  if (!response) throw new Error("Failure to fetch Prayers : no response body");

  const $ = load(response.parse.text["*"]);
  const prayers: Record<string, Prayer> = {};

  // jump to list of prayers - ignore everything else on the page
  $("table.wikitable.sortable > tbody")
    .first()
    .find("tr")
    .each((_, r) => {
      const prayer: Partial<Prayer> = {};
      $(r)
        .find("td")
        .each((c, td) => {
          const $td = $(td);
          switch (c) {
            case 0: // level req
              prayer.levelRequirement = Number($td.text().trim());
              break;
            case 1: // icon
              prayer.imgUrl = `https://oldschool.runescape.wiki${$td.find("img").first().attr("src")!.split("?")[0]}`;
              break;
            case 2: // name
              prayer.name = $td.text().trim();
              prayer.url = `https://oldschool.runescape.wiki${$td.find("a").first().attr("href")!}`;
              break;
            default:
            // we don't care about any of the other cells
          }
          if (prayer.name) prayers[prayer.name] = prayer as Prayer;
        });
    });

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const outDir = path.join(__dirname, "..", "src/data");
  const prayerPath = path.join(outDir, "prayers.json");
  fs.writeFileSync(prayerPath, JSON.stringify(prayers, null, 2));
  console.log(
    `prayers: wrote ${Object.keys(prayers).length} prayers to ${prayerPath}`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fetchPrayers();
}
