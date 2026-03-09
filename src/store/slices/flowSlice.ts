import { StateCreator } from "zustand";
import { addEdge, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";

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
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onEdgesDelete: (deleted) => {
    const deletedOutgoing = Object.fromEntries(
      deleted.map((e) => [e.source, e.target]),
    );
    const deletedIncoming = Object.fromEntries(
      deleted.map((e) => [e.target, e.source]),
    );
    set({
      nodes: get().nodes.map((n) => {
        if (n.id in deletedOutgoing) {
          const outgoing = n.data.outgoing;
          outgoing.delete(deletedOutgoing[n.id]);
          return {
            ...n,
            data: { ...n.data, outgoing },
          } as Node;
        } else if (n.id in deletedIncoming) {
          const incoming = { ...n.data.incoming };
          delete incoming[deletedIncoming[n.id]];
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
          outgoing.add(connection.target);
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
        } else if (data.outgoing.has(n.id)) {
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
  removeNode: (nodeId: string) => {
    set({
      nodes: get()
        .nodes.filter((n) => n.id !== nodeId)
        .map((n) => {
          n.data.outgoing.delete(nodeId);
          delete n.data.incoming[nodeId];
          return { ...n };
        }),
    });
  },
  syncNodesToAccountData: () => {
    const accountData = get().accountData;
    if (!accountData) return;
    set({
      nodes: get().nodes.map((n) => {
        if (["collection", "generic", "item"].includes(n.data.type)) return n;

        switch (n.data.type) {
          case "skill":
            const skillNodeData = { ...n.data };
            let skillLevel = skillNodeData.current;
            switch (skillNodeData.name) {
              case Skill.Quest_Points:
                skillLevel = getQuestPoints(
                  Object.entries(accountData.quests)
                    .filter(([_, n]) => n === 2)
                    .map(([s]) => s),
                );
                break;
              case Skill.Combat_Level:
                skillLevel = getCombatLevel(accountData.levels);
                break;
              case Skill.Overall:
                skillLevel = Object.values(accountData.levels).reduce(
                  (acc, cur) => acc + cur,
                  0,
                );
                break;
              default:
                skillLevel = accountData.levels[skillNodeData.name];
            }
            return n;
          case "quest":
            const questNodeData = { ...n.data };
            const questCompletion =
              accountData.quests[questNodeData.name] === 2;
            questNodeData.current = questCompletion ? 1 : 0;
            return { ...n, data: questNodeData };
          case "diary":
            const diaryNodeData = { ...n.data };
            const taskCompletion =
              accountData.achievement_diaries[diaryNodeData.name][
                diaryNodeData.tier
              ].tasks;
            diaryNodeData.items = diaryNodeData.items.map(
              ({ name, notes }, i) => ({
                name,
                completed: taskCompletion[i],
                notes,
              }),
            );
            diaryNodeData.current = taskCompletion.filter((b) => b).length;
            return { ...n, data: diaryNodeData };
          default:
            return n;
        }
      }),
    });
  },
});

export default createFlowSlice;
