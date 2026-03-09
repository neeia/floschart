export default function mapRuneliteQuestToWiki(q: string) {
  switch (q) {
    case "Tutorial Island":
      return "Learning the Ropes";
    case "Recipe for Disaster - Another Cook's Quest":
      return "Recipe for Disaster/Another Cook's Quest";
    case "Recipe for Disaster - Culinaromancer":
      return "Recipe for Disaster/Defeating the Culinaromancer";
    case "Recipe for Disaster - Evil Dave":
      return "Recipe for Disaster/Freeing Evil Dave";
    case "Recipe for Disaster - King Awowogei":
      return "Recipe for Disaster/Freeing King Awowogei";
    case "Recipe for Disaster - Lumbridge Guide":
      return "Recipe for Disaster/Freeing the Lumbridge Guide";
    case "Recipe for Disaster - Mountain Dwarf":
      return "Recipe for Disaster/Freeing the Mountain Dwarf";
    case "Recipe for Disaster - Pirate Pete":
      return "Recipe for Disaster/Freeing Pirate Pete";
    case "Recipe for Disaster - Sir Amik Varze":
      return "Recipe for Disaster/Freeing Sir Amik Varze";
    case "Recipe for Disaster - Skrach Uglogwee":
      return "Recipe for Disaster/Freeing Skrach Uglogwee";
    case "Recipe for Disaster - Wartface & Bentnoze":
      return "Recipe for Disaster/Freeing the Goblin generals";
    default:
      return q;
  }
}
