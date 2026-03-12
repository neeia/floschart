import { StateCreator } from "zustand";
import { AllSlice, FilterSlice } from "../types";
import Node, { NodeType } from "@/types/node";

export const createFilterSlice: StateCreator<AllSlice, [], [], FilterSlice> = (
  set,
  get,
) => ({
  filter: {
    search: "",
    types: [],
    completion: [],
    prereqCompletion: [],
  },
  setSearch: (s: string) =>
    set((state) => ({ filter: { ...state.filter, search: s } })),
  setTypes: (types: NodeType[]) => {
    set((state) => ({
      filter: { ...state.filter, types },
    }));
  },
  setCompletion: (completion: number[]) => {
    set((state) => ({
      filter: {
        ...state.filter,
        completion,
      },
    }));
  },
  setPrereqCompletion: (prereqCompletion: number[]) => {
    set((state) => ({
      filter: {
        ...state.filter,
        prereqCompletion,
      },
    }));
  },
  filterNode: (n: Node) => {
    const filter = get().filter;
    if (!n.data.name.toLowerCase().trim().includes(filter.search.toLowerCase()))
      return false;

    const types = filter.types;
    if (types.length && !types.includes(n.data.type)) return false;

    const completion = filter.completion;
    if (
      completion.length &&
      !completion.includes(
        n.data.current >= n.data.target ? 2 : n.data.current > 0 ? 1 : 0,
      )
    )
      return false;
    const prereqCompletion = filter.prereqCompletion;
    const incoming = Object.values(n.data.incoming);
    const incomingStatus =
      incoming.length === 0
        ? -1
        : incoming.every((a) => a)
          ? 2
          : incoming.some((a) => a)
            ? 1
            : 0;
    if (prereqCompletion.length && !prereqCompletion.includes(incomingStatus))
      return false;

    return true;
  },
});
