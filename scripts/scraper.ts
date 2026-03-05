import { fileURLToPath } from "url";
import fetchDiaries from "./fetchDiaries";
import fetchFurniture from "./fetchFurniture";
import fetchItems from "./fetchItems";
import fetchPrayers from "./fetchPrayers";
import fetchQuests from "./fetchQuests";
import fetchSlayerUnlocks from "./fetchSlayerUnlocks";
import fetchSpells from "./fetchSpells";

export default async function scraper() {
  fetchDiaries();
  fetchFurniture();
  fetchItems();
  fetchPrayers();
  fetchQuests();
  fetchSlayerUnlocks();
  fetchSpells();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  scraper();
}
