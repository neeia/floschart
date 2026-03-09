import { Diary } from "@/types/data/diary";
import diaries from "./diaries.json";
import furniture from "./furniture.json";
import items from "./items.json";
import miniquests from "./miniquests.json";
import prayers from "./prayers.json";
import quests from "./quests.json";
import slayer from "./slayer.json";
import spells from "./spells.json";
import { Diaries } from "@/types/external/runelite";
import { Furniture } from "@/types/data/furniture";
import { ItemMap } from "@/../scripts/fetchItems";
import { Miniquest, Quest } from "@/types/data/quest";
import { Prayer } from "@/types/data/prayer";
import { Unlock } from "@/types/data/unlock";
import { Spell } from "@/types/data/spell";

type Dict<T> = Record<string, T>;

export const diariesJson = diaries as Record<Diaries, Diary>;
export const furnitureJson = furniture as Dict<Furniture>;
export const itemsJson = items as ItemMap;
export const miniquestJson = miniquests as Dict<Miniquest>;
export const prayerJson = prayers as Dict<Prayer>;
export const questJson = quests as Dict<Quest>;
export const slayerJson = slayer as Dict<Dict<Unlock>>;
export const spellJson = spells as Dict<Dict<Spell>>;
