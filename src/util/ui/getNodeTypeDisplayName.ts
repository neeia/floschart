function capitalizeFirstLetter(s: string) {
  return String(s).charAt(0).toUpperCase() + String(s).slice(1);
}

export default function getNodeTypeDisplayName(type: string) {
  switch (type) {
    case "generic":
      return "Other";
    case "collection":
      return "Other (Group)";
    default:
      return capitalizeFirstLetter(type);
  }
}
