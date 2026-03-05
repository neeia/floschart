import { load } from "cheerio";
import type PageData from "../src/types/external/wikiPageData";
import type { Tier, Tiers } from "../src/types/data/Diary";
import { DiaryDifficulty } from "../src/types/external/runelite";
import { Requirements } from "../src/types/data/requirements";
import Skill from "../src/types/data/skill";

const difficulties: DiaryDifficulty[] = ["Easy", "Medium", "Hard", "Elite"];
const emptyTier: () => Tier = () => ({
  tasks: [],
  requirements: { quests: [], skills: [] },
});

export default async function parseDiary(diaryName: string): Promise<Tiers> {
  const url = `https://oldschool.runescape.wiki/api.php?action=parse&page=${diaryName}&format=json`;
  const response = (await (await fetch(url)).json()) as PageData;
  if (!response) throw new Error("Failure to fetch Diary : no response body");

  const $ = load(response.parse.text["*"]);

  const output: Tiers = {
    Easy: emptyTier(),
    Medium: emptyTier(),
    Hard: emptyTier(),
    Elite: emptyTier(),
  };

  // tabbertab contains one table, with two tables beneath it - skill reqs and quest reqs
  // NOTE: karamja easy diary DOES NOT HAVE a second table because it has no quest reqs
  // some diaries also have a third table with additional requirements - we can ignore these
  $("div.tabbertab table.diary-table").each((d, tt) => {
    const difficulty = difficulties[d];
    const requirements: Requirements = { quests: [], skills: [] };

    $(tt)
      .find("table")
      .each((i, table) => {
        const $cells = $(table).find("td");
        switch (i) {
          case 0:
            // skill requirements
            // unused skills are 'th' instead of 'td' and are excluded automatically
            // "a" descendant of td has title which gives you the skill
            // text of td is just the number which gives you the level
            $cells.each((_, td) => {
              const $td = $(td);
              const name = $td.find("a").first().attr("title") as Skill;
              const target = Number(
                $td.clone().children().remove().end().text().replace("+", ""),
              );
              if (target > 1) requirements.skills.push({ name, target });
            });
            break;
          case 1:
            // quest requirements
            // these can also include miniquests
            // need a special case for lumbridge elite, which requires all quests
            $cells.each((_, td) => {
              const name = $(td).find("a").first().attr("title")!;
              if (name === "Quests/List") return; // lumbridge elite
              requirements.quests.push({ name });
            });
            break;
          default:
          // do nothing
        }
      });

    output[difficulty].requirements = requirements;
  });

  // now handle the lower tables to get task info
  difficulties.forEach((difficulty) => {
    $(`table[data-diary-tier="${difficulty}"]`)
      .first()
      .find("tr > td:first-child")
      .each((_, r) => {
        const text = $(r)
          .clone() // clone the node
          .find(".floornumber-gb, sup:not(.floornumber-ordinal-suffix)")
          .remove()
          .end() // go back to the cloned root
          .text()
          .split("Note: ");
        output[difficulty].tasks.push({
          // remove leading item number
          name: text[0].trim().replace(/^\d+\.\s/, ""),
          notes: text[1]?.trim(),
        });
      });
  });

  return output;
}
