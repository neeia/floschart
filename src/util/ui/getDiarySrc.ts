import { Diaries } from "@/types/external/runelite";

export default function getDiarySrc(diary: Diaries): string {
  switch (diary) {
    case "Ardougne":
      return "https://oldschool.runescape.wiki/images/Ardougne_icon.png";
    case "Desert":
      return "https://oldschool.runescape.wiki/images/Karamja_Area_Badge.png";
    case "Falador":
      return "https://oldschool.runescape.wiki/images/Asgarnia_Area_Badge.png";
    case "Fremennik Province":
      return "https://oldschool.runescape.wiki/images/Fremennik_Area_Badge.png";
    case "Kandarin":
      return "https://oldschool.runescape.wiki/images/Kandarin_Area_Badge.png";
    case "Karamja":
      return "https://oldschool.runescape.wiki/images/Karamja_Area_Badge.png";
    case "Kourend & Kebos":
      return "https://oldschool.runescape.wiki/images/Kourend_Area_Badge.png";
    case "Lumbridge & Draynor":
      return "https://oldschool.runescape.wiki/images/Misthalin_Area_Badge.png";
    case "Morytania":
      return "https://oldschool.runescape.wiki/images/Morytania_Area_Badge.png";
    case "Varrock":
      return "assets/Varrock_icon.png";
    case "Western Provinces":
      return "https://oldschool.runescape.wiki/images/Tirannwn_Area_Badge.png";
    case "Wilderness":
      return "https://oldschool.runescape.wiki/images/Wilderness_Area_Badge.png";
  }
}
