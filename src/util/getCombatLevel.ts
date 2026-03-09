interface Props {
  Prayer: number;
  Hitpoints: number;
  Defence: number;
  Strength: number;
  Attack: number;
  Magic: number;
  Ranged: number;
}
export function getCombatLevel(props: Props) {
  const base =
    (Math.floor(props.Prayer / 2) + props.Hitpoints + props.Defence) / 4;

  const melee = props.Attack + props.Strength;
  const ranged = Math.floor(props.Ranged * 1.5);
  const magic = Math.floor(props.Magic * 1.5);

  return Math.floor(base + 0.325 * Math.max(melee, ranged, magic));
}
