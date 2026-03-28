import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import fetchClog from "./items/fetchClog";
import fetchGear from "./items/fetchGear";
import fetchOutfits from "./items/fetchOutfits";
import fetchTele from "./items/fetchTele";
import fetchEtc from "./items/fetchEtc";
import { Item } from "../src/types/data/item";

export type ItemMap = Record<
  string, // category
  Record<
    string, // item name
    { category: string[]; item: Item }
  >
>;

export default async function fetchItems() {
  const clog = await fetchClog();
  const teleports = await fetchTele();
  const skilling = await fetchOutfits();
  const gear = await fetchGear();
  const storage = await fetchEtc();

  const items = {
    ...gear,
    ...skilling,
    ...teleports,
    ...storage,
    ...clog,
  };

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const outDir = path.join(__dirname, "..", "src/data");
  const itemPath = path.join(outDir, "items.json");
  fs.writeFileSync(itemPath, JSON.stringify(items, null, 2));
  console.log(`items: wrote ${Object.keys(items).length} items to ${itemPath}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fetchItems();
}
