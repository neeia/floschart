import fs from "fs";
import { load } from "cheerio";
import { fileURLToPath } from "url";
import type PageData from "../src/types/external/wikiPageData";
import type { Spell } from "../src/types/data/spell";
import path from "path";

const spellbooks = [
  "Standard Spellbook",
  "Ancient Magicks",
  "Lunar Spellbook",
  "Arceuus Spellbook",
] as const;

const url =
  "https://oldschool.runescape.wiki/api.php?action=parse&page=List_of_spells&format=json";

export default async function fetchSpells() {
  const response = (await (await fetch(url)).json()) as PageData;
  if (!response) throw new Error("Failure to fetch Spells : no response body");

  const $ = load(response.parse.text["*"]);
  const spells: Record<(typeof spellbooks)[number], Record<string, Spell>> = {
    "Standard Spellbook": {},
    "Ancient Magicks": {},
    "Lunar Spellbook": {},
    "Arceuus Spellbook": {},
  };

  // four spellbooks
  $("table.wikitable.sortable > tbody").each((b, tb) => {
    const currentBook = spellbooks[b];
    $(tb)
      .find("tr")
      .each((_, r) => {
        const spell: Partial<Spell> = {};
        $(r)
          .find("td")
          .each((c, td) => {
            const $td = $(td);
            switch (c) {
              case 0: // small icon - dont need
                break;
              case 1: // mobile icon
                spell.imgUrl = `https://oldschool.runescape.wiki${$td.find("img").first().attr("src")!.split("?")[0]}`;
                break;
              case 2: // name
                spell.name = $td.text().trim();
                spell.url = `https://oldschool.runescape.wiki${$td.find("a").first().attr("href")!}`;
                break;
              case 3: // level req
                spell.levelRequirement = Number($td.text().trim());
                break;
              default:
              // we don't care about any of the other cells
            }
            if (spell.name) spells[currentBook][spell.name] = spell as Spell;
          });
      });
  });

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const outDir = path.join(__dirname, "..", "src/data");
  const spellPath = path.join(outDir, "spells.json");
  fs.writeFileSync(spellPath, JSON.stringify(spells, null, 2));
  console.log(
    `spells: wrote ${Object.keys(spells).length} spellbooks containing ${Object.values(spells).flatMap((e) => Object.values(e)).length} spells to ${spellPath}`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fetchSpells();
}
