export const baseUrl = "https://oldschool.runescape.wiki/images/";

export default function getImgSrcFromPageName(
  name: string,
  categories: string[],
) {
  const processedName = name.replaceAll(" ", "_");
  let output = processedName;

  if (categories.includes("Prayers")) {
  } else if (categories.includes("Furniture")) output += "_icon";
  else if (categories.includes("Spells")) output += "_icon_(mobile)";
  else if (categories.includes("Monsters")) output += "_icon";
  else if (categories.includes("Non-player characters")) output += "_chathead";
  else if (categories.includes("Minigames")) output += "Minigames";
}
