import { load } from "cheerio";
import type PageData from "../src/types/external/wikiPageData";
import { Requirements } from "../src/types/data/requirements";
import Skill from "../src/types/data/skill";

export default async function parseQuest(
  questName: string,
  questList: Set<string>,
): Promise<Requirements> {
  const url = `https://oldschool.runescape.wiki/api.php?action=parse&page=${questName}&format=json`;
  const response = (await (await fetch(url)).json()) as PageData;
  if (!response) throw new Error("Failure to fetch Quest : no response body");

  const $ = load(response.parse.text["*"]);

  const output: Requirements = {
    skills: [],
    quests: [],
  };

  const _skills: Partial<Record<Skill, number>> = {};

  const $requirements = $(".questdetails-info.qc-input");

  // skills are pretty simple, only need to make a check for the warrior's guild afterwards
  // also check for duplicated skills, just in case
  const wguild = $requirements.find(`a[title="Warriors' Guild"]`).length > 0;
  $requirements.find(".scp").each((_, s) => {
    const $s = $(s);
    const name = $s.attr("data-skill") as Skill;
    const target = Number($s.attr("data-level"));
    if (!name || !target) return;
    if (
      wguild &&
      target === 99 &&
      (name === Skill.Attack || name === Skill.Strength)
    ) {
      return;
    }

    if (_skills[name]) {
      console.log("Alert: repeated skill in quest " + questName + ": " + name);
      _skills[name] = Math.max(_skills[name], target);
    } else _skills[name] = target;
  });

  Object.entries(_skills).forEach(([name, target]) => {
    output.skills.push({ name: name as Skill, target });
  });

  // quest requirement lists are extremely inconsistent, but afaik these are all the possibilities for top-level quests
  // 'a' matches some miniquest page (i.e. "completion of cook's assistant")
  // 'ul > li > a' matches pages with a single quest (i.e. "- completion of cook's assistant")
  // 'ul > li > ul > li > a' matches multi level quests (i.e. "- completion of the following quests:")
  // this casts an overly broad net so we need to ensure that the title of the 'a' is in questList
  const selectors = ["ul > li > ul > li > a", "ul > li > a", "a"];

  let $quests!: typeof $requirements;

  for (const selector of selectors) {
    $quests = $(`.questdetails-info.qc-input > ${selector}`);
    if ($quests.length) break;
  }

  $quests.each((_, q) => {
    const possibleQuestName = $(q).attr("title");
    if (
      possibleQuestName &&
      questList.has(possibleQuestName) &&
      !output.quests.some(({ name }) => name === possibleQuestName)
    ) {
      output.quests.push({ name: possibleQuestName });
    }
  });

  return output;
}
