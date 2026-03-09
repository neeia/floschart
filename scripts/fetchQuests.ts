import fs from "fs";
import { load } from "cheerio";
import { fileURLToPath } from "url";
import type PageData from "../src/types/external/wikiPageData";
import type {
  Quest,
  Miniquest,
  QuestDifficulty,
  QuestLength,
} from "../src/types/data/quest";
import path from "path";
import parseQuest from "./parseQuest";
import { Requirements } from "../src/types/data/requirements";

const url =
  "https://oldschool.runescape.wiki/api.php?action=parse&page=Quests/List&format=json";

export default async function fetchQuests() {
  console.log("sending response");
  const response = (await (await fetch(url)).json()) as PageData;
  if (!response) throw new Error("Failure to fetch Quests: no response body");
  console.log("loading quests");

  const $ = load(response.parse.text["*"]);

  const quests: Record<string, Quest> = {};
  const miniquests: Record<string, Miniquest> = {};

  // now go through the html and find f2p quests, p2p quests, and miniquests
  $("table.wikitable.sortable > tbody").each((i, e) => {
    const $rows = $(e).find("tr");
    switch (i) {
      case 0: // f2p quests
      case 1: // p2p quests
        $rows.each((_, r) => {
          const q: Quest = {
            isMiniquest: false,
            id: 0, // release order
            name: "",
            title: "",
            difficulty: "Novice",
            length: "Very Short",
            qp: 0,
            members: i === 1,
            url: "",
            requirements: { quests: [], skills: [] }, // need to parse the quest page, populate with another script
          };
          $(r)
            .find("td")
            .each((j, td) => {
              const $td = $(td);
              const s = $td.text().trim();
              switch (j) {
                case 0: // quest release order
                  if (s.includes(".")) {
                    q.id = +s.split(".")[0];
                    q.subId = +s.split(".")[1];
                  } else q.id = +s;
                  break;
                case 1: // quest name
                  q.name = s;
                  q.title = s.replaceAll(" ", "_");
                  q.url = `https://oldschool.runescape.wiki${$td.children("a").attr("href") ?? q.title}`;
                  break;
                case 2: // quest difficulty
                  q.difficulty = s as QuestDifficulty;
                  break;
                case 3: // quest length
                  q.length = s as QuestLength;
                  break;
                case 4: // quest points
                  if (q.name === "Recipe for Disaster") q.qp = 0;
                  else q.qp = +s;
                  break;
                case 5: // quest series
                  break;
                case 6: // release date
                  break;
              }
            });
          if (q.name) quests[q.name] ??= q;
        });
        break;
      case 2: // miniquests
        $rows.each((_, r) => {
          const mq: Miniquest = {
            isMiniquest: true,
            name: "",
            title: "",
            difficulty: "Novice",
            length: "Very Short",
            members: true,
            url: "",
            requirements: { quests: [], skills: [] }, // need to parse the quest page, populate with another script
          };
          $(r)
            .find("td")
            .each((j, td) => {
              const $td = $(td);
              const s = $td.text().trim();
              switch (j) {
                case 0: // name
                  mq.name = s;
                  mq.title = s.replaceAll(" ", "_");
                  mq.url = `https://oldschool.runescape.wiki/${$td.children("a").attr("href") ?? mq.title}`;
                  break;
                case 1: // difficulty
                  mq.difficulty = s as QuestDifficulty;
                  break;
                case 2: // length
                  mq.length = s as QuestLength;
                  break;
                case 3: // quest series
                  break;
                case 4: // release date
                  break;
              }
              miniquests[mq.name] = mq;
            });
        });
        break;
      default:
        // uh oh they added another table
        console.log("fetchQuests.ts: unexpected table found");
    }
  });

  if (Object.keys(quests).length === 0)
    throw new Error("Failed to find Quests: length 0");

  console.log("parsing quests");

  // now go through each quest and parse their requirements
  const questList: Set<string> = new Set([
    ...Object.keys(quests),
    ...Object.keys(miniquests),
  ]);

  // parse all quest reqs
  const questResults: [string, Requirements][] = [];

  for (let quest of Object.values(quests)) {
    if (!quest.url) {
      continue;
    }

    const parsedQuestRequirements = await parseQuest(
      quest.url.split("/w/")[1],
      questList,
    );
    questResults.push([quest.name, parsedQuestRequirements] as [
      string,
      Requirements,
    ]);
  }

  questResults.forEach(([name, requirements]) => {
    if (requirements == null || name == null || !quests[name]) return;
    quests[name].requirements = requirements;
  });

  console.log("parsing miniquests");

  // parse all miniquest reqs
  const miniquestResults: [string, Requirements][] = [];

  for (let miniquest of Object.values(miniquests)) {
    if (!miniquest.url) continue;

    const parsedQuestRequirements = await parseQuest(
      miniquest.url.split("/w/")[1],
      questList,
    );
    miniquestResults.push([miniquest.name, parsedQuestRequirements] as [
      string,
      Requirements,
    ]);
  }
  miniquestResults.forEach(([name, requirements]) => {
    if (requirements == null || name == null || !miniquests[name]) return;
    miniquests[name].requirements = requirements;
  });

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const outDir = path.join(__dirname, "..", "src/data");
  const questPath = path.join(outDir, "quests.json");
  fs.writeFileSync(questPath, JSON.stringify(quests, null, 2));
  console.log(
    `quests: wrote ${Object.keys(quests).length} quests to ${questPath}`,
  );

  const miniquestPath = path.join(outDir, "miniquests.json");
  fs.writeFileSync(miniquestPath, JSON.stringify(miniquests, null, 2));
  console.log(
    `miniquests: wrote ${Object.keys(miniquests).length} miniquests to ${miniquestPath}`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fetchQuests();
}
