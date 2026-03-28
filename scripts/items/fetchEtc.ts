import { load } from "cheerio";
import type CategoryMemberResults from "../../src/types/external/wikiCategoryMemberResults";
import type { Item } from "../../src/types/data/item";
import { ItemMap } from "../fetchItems";

const exceptions = ["Basket", "Empty sack", "Gnomish firelighter"];

const url =
  "https://oldschool.runescape.wiki/api.php?action=query&format=json&generator=categorymembers&gcmtitle=Category:Storage_items&gcmlimit=max";

export default async function () {
  console.log("fetching other items");
  const response = (await (await fetch(url)).json()) as CategoryMemberResults;
  if (!response)
    throw new Error("Failure to fetch etc items : no response body");

  const storage: ItemMap = { Storage: {} };

  Object.values(response.query.pages).forEach(({ pageid, title }) => {
    if (!exceptions.includes(title))
      storage["Storage"][title] = {
        category: ["Storage"],
        item: {
          name: title,
          url: `https://oldschool.runescape.wiki/w/?curid=${pageid}`,
          imgUrl: `https://oldschool.runescape.wiki/images/${title.replaceAll(" ", "_")}.png`,
        },
      };
  });

  console.log(
    `storage: returned ${Object.values(Object.values(storage)).length} items`,
  );
  return storage;
}
