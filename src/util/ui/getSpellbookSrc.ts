export default function getSpellbookSrc(spellbook: string) {
  return `https://oldschool.runescape.wiki/images/${spellbook.split(" ")[0]}_spellbook.png`;
}
