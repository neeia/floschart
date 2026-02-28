import Skill from "@/types/skill";

export default function getSkillSrc(skill: string) {
  switch (skill) {
    case Skill.Quest_Points:
      return "https://oldschool.runescape.wiki/images/Quests.png";
    case Skill.Combat_Level:
      return "https://oldschool.runescape.wiki/images/Attack_style_icon.png";
    case Skill.Overall:
      return "https://oldschool.runescape.wiki/images/Stats_icon.png";
    default:
      return `https://oldschool.runescape.wiki/images/${skill}_icon_(detail).png`;
  }
}
