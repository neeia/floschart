import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useStore from "@/store/store";
import { AppState } from "@/store/types";
import Node, { nodeTypes } from "@/types/node";
import getNodeTypeDisplayName from "@/util/ui/getNodeTypeDisplayName";
import getNodeTypeIcon from "@/util/ui/getNodeTypeIcon";
import { useReactFlow, ViewportPortal } from "@xyflow/react";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";

const selector = (state: AppState) => ({
  nodes: state.nodes,
  setNodes: state.setNodes,
  filter: state.filter,
  setSearch: state.setSearch,
  setTypes: state.setTypes,
  // 0: unstarted, 1: partial, 2: completed
  setCompletion: state.setCompletion,
  setPrereqCompletion: state.setPrereqCompletion,
  filterNode: state.filterNode,
});

export default function Filter() {
  const {
    nodes,
    setNodes,
    filter,
    setSearch,
    setTypes,
    setCompletion,
    setPrereqCompletion,
    filterNode,
  } = useStore(useShallow(selector));

  const { setCenter, getViewport } = useReactFlow();
  const filteredNodes = nodes.filter(filterNode);

  function centerNode(node: Node) {
    setNodes(
      nodes.map((_node) => {
        if (_node.id === node.id) return { ..._node, selected: true };
        if (_node.selected) return { ..._node, selected: false };
        return _node;
      }),
    );
    setCenter(node.position.x, node.position.y, { duration: 300, zoom: 1 });
  }

  function selectAllNodes() {
    setNodes(
      nodes.map((node) => {
        if (filteredNodes.some((_node) => _node.id === node.id))
          return { ...node, selected: true };
        if (node.selected) return { ...node, selected: false };
        return node;
      }),
    );
  }

  function getNodeBounds(node: Node) {
    const rect = document
      .getElementById(`node-${node.id}`)!
      .getBoundingClientRect();

    const zoom = getViewport().zoom;

    return { x: rect.width / zoom, y: rect.height / zoom };
  }

  const [hoveredNode, setHoveredNode] = useState<{
    node: Node;
    size: { x: number; y: number };
  } | null>(null);
  const previousNode = useRef(hoveredNode);
  useEffect(() => {
    previousNode.current = hoveredNode;
  }, [hoveredNode]);

  function hoverNode(node: Node) {
    setHoveredNode({
      node,
      size: getNodeBounds(node),
    });
  }
  function releaseNode(node: Node) {
    if (node === hoveredNode?.node) setHoveredNode(null);
  }

  return (
    <div>
      <FieldSet className="px-2 gap-4">
        <Field>
          <FieldLabel htmlFor="sidebar-filter-search">Name</FieldLabel>
          <Input
            id="sidebar-filter-search"
            value={filter.search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel>Types</FieldLabel>
          <ToggleGroup
            type="multiple"
            className="flex flex-wrap gap-x-2 gap-y-1 *:rounded-full! *:bg-card"
            value={filter.types}
            onValueChange={setTypes}
          >
            {nodeTypes.map((type) => (
              <ToggleGroupItem key={type} value={type}>
                <img
                  src={getNodeTypeIcon(type)}
                  alt=""
                  width={16}
                  height={16}
                  className="size-6"
                />
                {getNodeTypeDisplayName(type)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Field>
        <Field>
          <FieldLabel>Completion Status</FieldLabel>
          <ToggleGroup
            type="multiple"
            className="w-full flex gap-2 *:size-8 *:rounded-full! *:opacity-50 *:aria-pressed:border-3 *:aria-pressed:opacity-100"
            value={filter.completion.map((n) => n.toString())}
            onValueChange={(v) => setCompletion(v.map((s) => Number(s)))}
          >
            <ToggleGroupItem
              title="Not Started"
              value="0"
              className="bg-unstarted! border-unstarted-foreground!"
            />
            <ToggleGroupItem
              title="Incomplete"
              value="1"
              className="bg-incomplete! border-incomplete-foreground!"
            />
            <ToggleGroupItem
              title="Completed"
              value="2"
              className="bg-complete!  border-complete-foreground"
            />
          </ToggleGroup>
        </Field>
        <Field>
          <FieldLabel>Prerequisites Status</FieldLabel>
          <ToggleGroup
            type="multiple"
            className="w-full flex gap-2 *:size-8 *:rounded-full! *:opacity-50 *:aria-pressed:border-3 *:aria-pressed:opacity-100"
            value={filter.prereqCompletion.map((n) => n.toString())}
            onValueChange={(v) => setPrereqCompletion(v.map((s) => Number(s)))}
          >
            <ToggleGroupItem
              title="No Prerequisites"
              value="-1"
              className="relative bg-muted-foreground! border-unstarted-foreground! overflow-hidden aria-pressed:*:w-6"
            >
              <div className="absolute -rotate-45 w-8 h-0.5 bg-muted" />
            </ToggleGroupItem>
            <ToggleGroupItem
              title="No Prerequisites Fulfilled"
              value="0"
              className="bg-unstarted! border-unstarted-foreground!"
            />
            <ToggleGroupItem
              title="Some Prerequisites Complete"
              value="1"
              className="bg-incomplete! border-incomplete-foreground!"
            />
            <ToggleGroupItem
              title="All Prerequisites Complete"
              value="2"
              className="bg-complete!  border-complete-foreground"
            />
          </ToggleGroup>
        </Field>
      </FieldSet>
      {filter.search ||
      filter.types.length ||
      filter.completion.length ||
      filter.prereqCompletion.length ? (
        <>
          <ViewportPortal>
            {filteredNodes.map((node) => (
              <div
                className="absolute opacity-75 rounded-xs active-animation"
                style={{
                  transform: `translate(${node.position.x - 6}px, ${node.position.y - 6}px)`,
                  width: `${getNodeBounds(node).x}px`,
                  height: `${getNodeBounds(node).y + 12}px`,
                }}
              />
            ))}
            <div
              className="absolute outline-6 opacity-75 outline-accent rounded-xs"
              style={{
                transform: `translate(${((hoveredNode ?? previousNode.current)?.node.position.x ?? 2) - 2}px,
                 ${((hoveredNode ?? previousNode.current)?.node.position.y ?? 2) - 2}px)`,
                width: `${((hoveredNode ?? previousNode.current)?.size.x ?? 8) - 8}px`,
                height: `${((hoveredNode ?? previousNode.current)?.size.y ?? -4) + 4}px`,
                outlineWidth: hoveredNode
                  ? `${8 / getViewport().zoom}px`
                  : "0px",
                boxShadow: hoveredNode
                  ? `0px 0px 0px ${99999 / getViewport().zoom}px #000000cc`
                  : "",
                transition:
                  "box-shadow 0.15s cubic-bezier(1,0,1,1), transform 0.15s",
              }}
            />
          </ViewportPortal>
          <Separator className="mt-8 mb-4" />
          {filteredNodes.length > 0 ? (
            <div className="px-2 flex flex-col gap-2">
              <h3>Matching Nodes ({filteredNodes.length})</h3>
              <Button
                variant="link"
                className="h-min w-min p-0 text-current underline decoration-dotted decoration-2"
                onClick={selectAllNodes}
              >
                select all
              </Button>
              <ul className="flex flex-col gap-1">
                {filteredNodes.map((node) => (
                  <li key={node.id}>
                    <Button
                      title="pan to node"
                      variant="outline"
                      onMouseOver={() => {
                        hoverNode(node);
                      }}
                      onMouseLeave={() => {
                        releaseNode(node);
                      }}
                      onClick={() => {
                        releaseNode(node);
                        centerNode(node);
                      }}
                      className="px-2 py-1 h-auto w-full items-start justify-start gap-2"
                    >
                      {node.data.imgUrl && (
                        <img
                          src={node.data.imgUrl}
                          width={32}
                          height={32}
                          className="aspect-square object-contain"
                        />
                      )}
                      <div className="flex-col gap-0.5">
                        <span className="text-xs text-muted-foreground ml-1 leading-none font-normal flex gap-1">
                          <img
                            src={getNodeTypeIcon(node.data.type)}
                            className="size-3 object-contain"
                          />
                          {getNodeTypeDisplayName(node.data.type)}
                        </span>
                        <div className="flex gap-2">
                          <span className="text-wrap text-left leading-tight">
                            {node.data.name}
                            {node.data.type === "diary" &&
                              ` Diary (${node.data.tier})`}
                          </span>
                        </div>
                      </div>
                      {node.data.target > 1 && (
                        <span className="ml-auto pt-1 relative font-normal text-base">
                          <sup>{node.data.current}</sup>⁄
                          <sub>{node.data.target}</sub>
                        </span>
                      )}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="px-2">No results.</div>
          )}
        </>
      ) : null}
    </div>
  );
}
