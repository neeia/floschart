import Node from "@/types/node";
import rottenTomato from "@/util/templates/rottenTomato";

export const initialNodes: Node[] = [
  {
    id: "0",
    type: "node",
    data: rottenTomato,
    position: { x: 0, y: 0 },
  },
];
