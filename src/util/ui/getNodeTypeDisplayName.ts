import capitalizeFirstLetter from "../capitalizeFirstLetter";

export default function getNodeTypeDisplayName(type: string) {
  switch (type) {
    case "generic":
      return "Other";
    case "collection":
      return "Group";
    default:
      return capitalizeFirstLetter(type);
  }
}
