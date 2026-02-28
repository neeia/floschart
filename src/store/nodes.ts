import Node from "@/types/node";
import Skill from "@/types/skill";

export const initialNodes: Node[] = [
  {
    id: "1",
    type: "node",
    data: {
      type: "skill",
      name: Skill.Firemaking,
      target: 99,
      current: 65,
      outgoing: new Set(["2"]),
      incoming: {},
    },
    position: { x: 5, y: 5 },
  },
  {
    id: "2",
    type: "node",
    data: {
      type: "skill",
      name: Skill.Woodcutting,
      target: 99,
      current: 80,
      outgoing: new Set(),
      incoming: { "1": false },
    },
    position: { x: 5, y: 100 },
  },
  {
    id: "3",
    type: "node",
    data: {
      type: "skill",
      name: Skill.Combat_Level,
      target: 126,
      current: 99,
      outgoing: new Set(),
      incoming: {},
    },
    position: { x: 55, y: 100 },
  },
  {
    id: "4",
    type: "node",
    data: {
      type: "skill",
      name: Skill.Overall,
      target: 126,
      current: 99,
      outgoing: new Set(),
      incoming: {},
    },
    position: { x: 55, y: -50 },
  },
  {
    id: "5",
    type: "node",
    data: {
      type: "skill",
      name: Skill.Quest_Points,
      target: 126,
      current: 99,
      outgoing: new Set(),
      incoming: {},
    },
    position: { x: -40, y: 60 },
  },
  {
    id: "6",
    type: "node",
    data: {
      type: "quest",
      name: "Monkey Madness I",
      target: 1,
      current: 0,
      incoming: {},
      outgoing: new Set(["7"]),
      url: "https://oldschool.runescape.wiki/w/Monkey_Madness_I",
      imgUrl:
        "https://oldschool.runescape.wiki/images/thumb/Awowogei_%28scenery%29.png/60px-Awowogei_%28scenery%29.png",
    },
    position: { x: 200, y: 5 },
  },
  {
    id: "7",
    type: "node",
    data: {
      type: "item",
      name: "Dragon Scimitar",
      target: 1,
      current: 0,
      incoming: { "6": false },
      outgoing: new Set(),
      url: "https://oldschool.runescape.wiki/w/Dragon_scimitar",
      imgUrl:
        "https://oldschool.runescape.wiki/images/thumb/Dragon_scimitar_detail.png/60px-Dragon_scimitar_detail.png",
    },
    position: { x: 180, y: 57 },
  },
  {
    id: "8",
    type: "node",
    data: {
      type: "diary",
      name: "Desert",
      current: 9,
      target: 10,
      incoming: {},
      outgoing: new Set(),
      expanded: true,
      items: [
        {
          name: "Knock out and pickpocket a Menaphite Thug.",
          completed: true,
        },
        { name: "Mine some Granite.", completed: true },
        {
          name: "Refill your waterskins in the Desert using Lunar magic.",
          completed: true,
        },
        { name: "Kill the Kalphite Queen.", completed: true },
        {
          name: "Complete a lap of the Pollnivneach agility course.",
          completed: true,
        },
        {
          name: "Slay a Dust Devil in the desert cave with a Slayer helmet equipped.",
          completed: true,
        },
        {
          name: "Activate Ancient Magicks at the altar in the Jaldraocht Pyramid.",
          completed: true,
        },
        {
          name: "Defeat a Locust Rider with Keris.",
          completed: true,
        },
        {
          name: "Burn some yew logs on the Nardah Mayor's balcony.",
          completed: true,
        },
        {
          name: "Create a Mithril Platebody in Nardah.",
          completed: false,
        },
      ],
      tier: "Hard",
      url: "https://oldschool.runescape.wiki/w/Desert_Diary#Hard",
    },
    position: { x: 180, y: 240 },
  },
  {
    id: "9",
    type: "node",
    data: {
      type: "skill",
      name: Skill.Smithing,
      current: 64,
      target: 68,
      incoming: {},
      outgoing: new Set(),
      url: "https://oldschool.runescape.wiki/w/Smithing",
    },
    position: { x: 80, y: 240 },
  },
  {
    id: "10",
    type: "node",
    data: {
      type: "item",
      name: "Desert Amulet 3",
      current: 0,
      target: 1,
      incoming: {},
      outgoing: new Set(),
      url: "https://oldschool.runescape.wiki/w/Desert_amulet_3",
      imgUrl: "https://oldschool.runescape.wiki/images/Desert_amulet_3.png",
    },
    position: { x: 400, y: 240 },
  },
];
