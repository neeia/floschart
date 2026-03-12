import { StateCreator } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Edge,
} from "@xyflow/react";

import { initialNodes } from "./defaults/nodes";
import { initialEdges } from "./defaults/edges";
import { AllSlice, FlowSlice } from "../types";
import Node, { NodeData } from "@/types/node";
import Skill from "@/types/data/skill";
import { getCombatLevel } from "@/util/getCombatLevel";
import { getQuestPoints } from "@/util/getQuestPoints";

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const createFlowSlice: StateCreator<AllSlice, [], [], FlowSlice> = (
  set,
  get,
) => ({
  id: initialNodes.length,
  getId: () => {
    const id = get().id;
    set({ id: id + 1 });
    return id + 1;
  },
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onNodesDelete: (deleted) => {
    const deletedOutgoing: Record<string, string[]> = {};
    const deletedIncoming: Record<string, string[]> = {};
    deleted.forEach((n) => {
      deletedOutgoing[n.id] ??= [];
      deletedOutgoing[n.id].push(...Object.keys(n.data.outgoing));
      Object.keys(n.data.incoming).map((id) => {
        deletedIncoming[id] ??= [];
        deletedIncoming[id].push(n.id);
      });
    });
    set({
      nodes: get().nodes.map((n) => {
        if (n.id in deletedOutgoing) {
          const outgoing = n.data.outgoing;
          deletedOutgoing[n.id].forEach((id) => delete outgoing[id]);
          return {
            ...n,
            data: { ...n.data, outgoing },
          } as Node;
        } else if (n.id in deletedIncoming) {
          const incoming = { ...n.data.incoming };
          deletedIncoming[n.id].forEach((id) => delete incoming[id]);
          return {
            ...n,
            data: { ...n.data, incoming },
          } as Node;
        } else return n;
      }),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onEdgesDelete: (deleted) => {
    const deletedOutgoing: Record<string, string[]> = {};
    const deletedIncoming: Record<string, string[]> = {};
    deleted.forEach((e) => {
      deletedOutgoing[e.source] ??= [];
      deletedOutgoing[e.source].push(e.target);
      deletedIncoming[e.target] ??= [];
      deletedIncoming[e.target].push(e.source);
    });
    set({
      nodes: get().nodes.map((n) => {
        if (n.id in deletedOutgoing) {
          const outgoing = n.data.outgoing;
          deletedOutgoing[n.id].forEach((id) => delete outgoing[id]);
          return {
            ...n,
            data: { ...n.data, outgoing },
          } as Node;
        } else if (n.id in deletedIncoming) {
          const incoming = { ...n.data.incoming };
          deletedIncoming[n.id].forEach((id) => delete incoming[id]);
          return {
            ...n,
            data: { ...n.data, incoming },
          } as Node;
        } else return n;
      }),
    });
  },
  onConnect: (connection) => {
    const sourceNode = get().nodes.find((n) => connection.source === n.id);
    set({
      edges: addEdge(connection, get().edges),
      nodes: get().nodes.map((n) => {
        if (!sourceNode) return n;
        if (connection.source === n.id) {
          // Found the source node - add connection.target as outgoer
          const outgoing = n.data.outgoing;
          outgoing[connection.target] = true;
          return { ...n, data: { ...n.data, outgoing } } as Node;
        } else if (connection.target === n.id) {
          // Found the target node - add connection.source as incomer
          const incoming = n.data.incoming;
          incoming[connection.source] =
            sourceNode.data.current >= sourceNode.data.target;
          return { ...n, data: { ...n.data, incoming } } as Node;
        } else return n;
      }),
    });
  },
  setNodes: (nodes) => {
    set({ nodes });
  },
  setEdges: (edges) => {
    set({ edges });
  },
  toggleNodeCompleted: (node: Node) => {
    if (!node) return;
    const newValue = !(node.data.current >= node.data.target);
    set({
      nodes: get().nodes.map((n) => {
        if (n.id === node.id) {
          // Found target node - update its completion accordingly
          switch (n.data.type) {
            case "skill":
              return {
                ...n,
                data: {
                  ...n.data,
                  current: newValue
                    ? n.data.target
                    : (get().accountData?.levels[n.data.name] ?? 1),
                },
              } as Node;
            case "collection":
            case "diary":
              const userDiary: boolean[] | undefined =
                n.data.type === "diary"
                  ? get().accountData?.achievement_diaries[n.data.name][
                      n.data.tier
                    ].tasks
                  : undefined;

              const tasks = [...n.data.items].map((t, i) => ({
                name: t.name,
                completed: newValue ? true : (userDiary?.[i] ?? false),
              }));

              return {
                ...n,
                data: {
                  ...n.data,
                  current: tasks.reduce((acc, cur) => acc + +cur.completed, 0),
                  items: tasks,
                },
              } as Node;
            default:
              // it's important to create a new object here, to inform React Flow about the changes
              return {
                ...n,
                data: { ...n.data, current: newValue ? n.data.target : 0 },
              } as Node;
          }
        } else if (node.id in n.data.incoming) {
          // Found node that has target node as an incomer - update its completion accordingly
          const incoming = { ...n.data.incoming };
          incoming[node.id] = newValue;
          return {
            ...n,
            data: { ...n.data, incoming },
          } as Node;
        } else return n;
      }),
    });
  },
  toggleSubnodeCompleted: (nodeId: string, subnodeName: string) => {
    // check if the entire node is now completed...
    const node = get().nodes.find((n) => n.id === nodeId);
    if (
      !node ||
      (node.data.type !== "collection" && node.data.type !== "diary")
    )
      return;
    const items = node.data.items.map((task) =>
      task.name === subnodeName
        ? { ...task, completed: !task.completed }
        : task,
    );
    const count = items.reduce(
      (acc, cur) => (cur.completed ? acc + 1 : acc),
      0,
    );
    node.data.current = count;
    node.data.items = items;
    const nodeIsNowCompleted = count >= node.data.target;

    set({
      nodes: get().nodes.map((n) => {
        // changed node
        if (n.id === nodeId) return { ...node } as Node;

        // need to reflect changes
        if (node.id in n.data.incoming)
          return {
            ...n,
            data: {
              ...n.data,
              incoming: { ...n.data.incoming, [node.id]: nodeIsNowCompleted },
            },
          } as Node;
        else return n;
      }),
    });
  },
  toggleNodeExpanded: (nodeId: string) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId && n.data.expanded != null
          ? ({ ...n, data: { ...n.data, expanded: !n.data.expanded } } as Node)
          : n,
      ),
    });
  },
  editNode: (id: string, data: NodeData) => {
    const isCompleted = data.current >= data.target;
    set({
      nodes: get().nodes.map((n) => {
        if (n.id === id) {
          // Found target node
          // it's important to create a new object here, to inform React Flow about the changes
          return {
            ...n,
            data,
          } as Node;
        } else if (n.id in data.outgoing) {
          // Found node that has target node as an incomer - update its completion accordingly
          const incoming = { ...n.data.incoming };
          incoming[id] = isCompleted;
          return {
            ...n,
            data: { ...n.data, incoming },
          } as Node;
        } else return n;
      }),
    });
  },
  addNode: (node: Node) => {
    set({ nodes: [...get().nodes, node] });
  },
  addEdge: (edge: Edge) => {
    set({ edges: [...get().edges, edge] });
  },
  removeNode: (nodeId: string) => {
    set({
      nodes: get()
        .nodes.filter((n) => n.id !== nodeId)
        .map((n) => {
          delete n.data.outgoing[nodeId];
          delete n.data.incoming[nodeId];
          return { ...n };
        }),
    });
  },
  deduplicate: () => {
    const nodes = get().nodes;
    const edges = get().edges;

    /** Records any duplicate nodes that are found in the graph.
     *
     * @remarks
     * Only compares quests, diaries, and skills.
     *
     * @param key - For quests, node name. For diaries, node name + tier. For skills, node name + target.
     * @param value - The first occurring node data that duplicate nodes will update / merge into.
     */
    const nodeLog: Record<string, Node> = {};
    // keep track of merged IDs (<original:new>) to update edges with
    const mergedIds: Record<string, string> = {};
    nodes.forEach((node) => {
      node.selected = false;
      const _node = structuredClone(node);
      const data = _node.data;
      let key = "";
      switch (data.type) {
        case "skill":
          key = `${data.name}${data.target}`;
          break;
        case "quest":
          key = `${data.name}`;
          break;
        case "diary":
          key = `${data.name}${data.tier}`;
          break;
        default:
          nodeLog[_node.id] = _node;
          return;
      }
      const existingNode = nodeLog[key];
      if (!existingNode) {
        nodeLog[key] = _node;
        return;
      }
      // we are currently on a duplicate node
      // add its incoming and outgoing connections to the existing node
      mergedIds[_node.id] = existingNode.id;
      Object.entries(_node.data.outgoing).forEach(([id, value]) => {
        existingNode.data.outgoing[id] = value;
      });
      Object.entries(_node.data.incoming).forEach(([id, value]) => {
        existingNode.data.incoming[id] = value;
      });
      existingNode.selected = true;
    });

    // now apply any merged IDs
    const _nodes = Object.values(nodeLog).map((node) => {
      node.data.incoming = Object.fromEntries(
        Object.entries(node.data.incoming).map(([k, v]) => [
          mergedIds[k] || k,
          v,
        ]),
      );
      node.data.outgoing = Object.fromEntries(
        Object.entries(node.data.outgoing).map(([k, v]) => [
          mergedIds[k] || k,
          v,
        ]),
      );

      return { ...node };
    });

    const edgeMap: Record<string, Edge> = {};
    edges.forEach((e) => {
      const source = mergedIds[e.source] || e.source;
      const target = mergedIds[e.target] || e.target;
      const id = `xy-edge__${source}-${target}`;
      edgeMap[id] = {
        id,
        source,
        target,
      };
    });

    set({ nodes: _nodes, edges: Object.values(edgeMap) });
  },
});

export default createFlowSlice;
