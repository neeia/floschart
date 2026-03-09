export default function capitalizeFirstLetter(s: string) {
  return String(s).charAt(0).toUpperCase() + String(s).slice(1);
}
