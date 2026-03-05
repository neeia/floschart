import fs from "fs";
import { load } from "cheerio";
import { fileURLToPath } from "url";
import type PageData from "../src/types/external/wikiPageData";
import type { Diary, DiaryReward, Tiers } from "../src/types/data/Diary";
import path from "path";
import { Diaries, DiaryDifficulty } from "../src/types/external/runelite";
import parseDiary from "./parseDiary";

const url =
  "https://oldschool.runescape.wiki/api.php?action=parse&page=Achievement_Diary&format=json";

const difficulties: DiaryDifficulty[] = ["Easy", "Medium", "Hard", "Elite"];

export default async function fetchDiaries() {
  const response = (await (await fetch(url)).json()) as PageData;
  if (!response) throw new Error("Failure to fetch Diaries : no response body");

  const $ = load(response.parse.text["*"]);
  const diaries: Partial<Record<Diaries, Partial<Diary>>> = {};

  // jump to list of diaries - ignore everything else on the page
  $("table.wikitable.sortable > tbody")
    .first()
    .find("tr")
    .each((_, r) => {
      const diary: Partial<Diary> = {};
      const rewards: Partial<Record<DiaryDifficulty, DiaryReward>> = {};
      $(r)
        .find("a")
        .each((c, a) => {
          const $a = $(a);
          switch (c) {
            case 0: // name
              diary.name = $a.text().trim() as Diaries;
              diary.url = `https://oldschool.runescape.wiki${$a.attr("href") ?? $a.text().trim() + "_Diary"}`;
              break;
            case 1: // the four tiers of items
            case 2:
            case 3:
            case 4:
              rewards[difficulties[c - 1]] = {
                name: $a.attr("title")!,
                url: `https://oldschool.runescape.wiki${$a.attr("href")!}`,
                imgUrl: `https://oldschool.runescape.wiki${$a.children("img").attr("src")!.split("?")[0]}`,
              };
              break;
            default:
            // we don't care about any of the other cells
          }
          diary.rewards = rewards as Record<DiaryDifficulty, DiaryReward>;
          if (diary.name) diaries[diary.name] = diary;
        });
    });

  // iterate through each diary and run parseDiary
  const results = await Promise.all(
    Object.entries(diaries).map(async ([name, diary]) => {
      if (!diary.url || !diary.name) return [null, null];

      const parsedTiers = await parseDiary(diary.url.split("/w/")[1]);
      return [name, parsedTiers] as [Diaries, Tiers];
    }),
  );
  results.forEach(([name, tiers]) => {
    if (tiers == null || name == null || !diaries[name]) return;
    diaries[name].tiers = tiers;
  });

  if (Object.keys(diaries).length === 0)
    throw new Error("Failed to find Diaries: length 0");

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const outDir = path.join(__dirname, "..", "src/data");
  const diaryPath = path.join(outDir, "diaries.json");
  fs.writeFileSync(diaryPath, JSON.stringify(diaries, null, 2));
  console.log(
    `diaries: wrote ${Object.keys(diaries).length} diaries to ${diaryPath}`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fetchDiaries();
}
