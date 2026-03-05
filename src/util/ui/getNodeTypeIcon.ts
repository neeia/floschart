export default function getNodeTypeIcon(type: string) {
  switch (type) {
    case "skill":
      return "https://oldschool.runescape.wiki/images/Stats_icon.png";
    case "quest":
      return "https://oldschool.runescape.wiki/images/Quests.png";
    case "diary":
      return "https://oldschool.runescape.wiki/images/Achievement_Diaries.png";
    case "item":
      return "https://oldschool.runescape.wiki/images/Inventory.png";
    case "generic":
      return "https://oldschool.runescape.wiki/images/Cow_chathead.png";
    case "collection":
      return "https://oldschool.runescape.wiki/images/Scroll_%28Barbarian_Assault%29_detail.png";
  }
}
