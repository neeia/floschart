import { NodeToolbar, Position } from "@xyflow/react";
import { ArrowLeftToLine, Plus, RotateCcw } from "lucide-react";
import Node, {
  CollectionNodeData,
  GenericNodeData,
  NodeData,
  NodeType,
  nodeTypes,
} from "@/types/node";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
import Skill from "@/types/data/skill";
import getSkillSrc from "@/util/ui/getSkillSrc";
import NumericInput from "@/components/ui/NumericInput";
import { Badge } from "@/components/ui/badge";
import { createDiaryNodeData } from "@/util/createDiaryNodeData";
import { createQuestNodeData } from "@/util/createQuestNodeData";
import { getMaxSkilllevel } from "@/util/getMaxSkillLevel";
import rottenTomato from "@/util/rottenTomato";
import { AppState } from "@/store/types";
import useStore from "@/store/store";
import { useShallow } from "zustand/shallow";
import clamp from "@/util/clamp";
import { createSkillNodeData } from "@/util/createSkillNodeData";
import { Diaries, DiaryDifficulty } from "@/types/external/runelite";
import { diariesJson } from "@/data";
import getDiarySrc from "@/util/ui/getDiarySrc";
import getNodeTypeIcon from "@/util/ui/getNodeTypeIcon";
import { Separator } from "@/components/ui/separator";
import getNodeTypeDisplayName from "@/util/ui/getNodeTypeDisplayName";
import Autosize from "./Autosize";
import EditListItem from "./EditListItem";

function capitalizeFirstLetter(s: string) {
  return String(s).charAt(0).toUpperCase() + String(s).slice(1);
}

function RequiredBadge() {
  return (
    <Badge variant="secondary" className="ml-auto">
      <abbr title="Required" className="decoration-transparent">
        Req.
      </abbr>
    </Badge>
  );
}

const imgClassName = "w-6 h-6 object-contain pixelate";

const selector = (state: AppState) => ({
  accountData: state.accountData,
  getSkillLevel: state.getSkillLevel,
});

interface Props {
  sourceNode?: Node;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (id: string, nodeData: NodeData) => void;
}

export default function Edit(props: Props) {
  const { sourceNode, open, setOpen, onSubmit } = props;

  const { accountData, getSkillLevel } = useStore(useShallow(selector));

  const [draftNode, setDraftNode] = useState<Node["data"]>(
    sourceNode?.data ?? rottenTomato,
  );

  useEffect(() => {
    if (open && sourceNode) setDraftNode(sourceNode.data);
  }, [open]);

  function changeNodeType(type: NodeType): Node["data"] {
    const { incoming, outgoing } = draftNode;
    switch (type) {
      case "skill":
        return {
          ...createSkillNodeData(Skill.Overall, getSkillLevel(Skill.Overall)),
        };
      case "quest":
        return {
          ...createQuestNodeData("Learning the Ropes"),
          incoming,
          outgoing,
        };
      case "diary":
        return {
          ...createDiaryNodeData(
            "Ardougne",
            "Easy",
            accountData?.achievement_diaries["Ardougne"]["Easy"].tasks,
          ),
          incoming,
          outgoing,
        };
      case "item":
        return { ...rottenTomato, incoming, outgoing };
      case "generic":
        return {
          type,
          name: draftNode.name,
          current: 0,
          target: 1,
          incoming,
          outgoing,
        } as GenericNodeData;
      case "collection":
        const items = draftNode.type === "diary" ? draftNode.items : [];
        return {
          type,
          name: draftNode.name,
          current: items.reduce(
            (acc, cur) => (cur.completed ? acc + 1 : acc),
            0,
          ),
          target: items.length,
          items,
          expanded: draftNode.expanded ?? false,
          incoming,
          outgoing,
        } as CollectionNodeData;
    }
  }
  function updateDiary(name: Diaries, difficulty: DiaryDifficulty) {
    setDraftNode({
      ...draftNode,
      ...createDiaryNodeData(
        name,
        difficulty,
        accountData?.achievement_diaries[name][difficulty].tasks,
      ),
      incoming: draftNode.incoming,
      outgoing: draftNode.outgoing,
    } as typeof draftNode);
  }

  const lastActive = useRef<Node | undefined>(undefined);
  if (sourceNode && lastActive.current?.id !== sourceNode.id) {
    // active node has changed
    lastActive.current = sourceNode;
  }

  const current = sourceNode || lastActive.current;

  return (
    <NodeToolbar
      nodeId={current?.id}
      isVisible={true}
      position={Position.Right}
      align="start"
      className="nopan"
      inert={!open}
    >
      <div
        className={clsx(
          "transition-all",
          open ? "-translate-x-5" : "-translate-1/2 opacity-0 scale-0",
        )}
      >
        <form className="flex flex-col bg-card min-w-72 max-h-[80dvh] overflow-y-auto nowheel">
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <Field orientation="horizontal">
                  <Button
                    variant="default"
                    className="rounded-none"
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      if (sourceNode) {
                        onSubmit(sourceNode.id, draftNode);
                        setOpen(false);
                      }
                    }}
                  >
                    <ArrowLeftToLine /> Apply Changes
                  </Button>
                  <Button
                    variant="ghost"
                    className="rounded-none ml-auto"
                    size="icon-sm"
                    type="reset"
                    title="Undo all changes"
                    onClick={(e) => {
                      e.preventDefault();
                      if (sourceNode) setDraftNode(sourceNode.data);
                    }}
                  >
                    <RotateCcw />
                  </Button>
                </Field>
              </FieldGroup>
              <FieldGroup className="px-2 pb-2">
                <Field>
                  <FieldLabel htmlFor="edit-node-type">
                    Type <RequiredBadge />
                  </FieldLabel>
                  <Select
                    value={draftNode.type}
                    onValueChange={(nodeType: typeof draftNode.type) => {
                      setDraftNode(changeNodeType(nodeType));
                    }}
                  >
                    <SelectTrigger id="edit-node-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectGroup>
                        {nodeTypes.map((s) => (
                          <SelectItem value={s} key={s}>
                            <img
                              src={getNodeTypeIcon(s)}
                              alt=""
                              className={imgClassName}
                            />
                            {getNodeTypeDisplayName(s)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                {draftNode.type === "skill" ? (
                  <Field className={clsx()}>
                    <FieldLabel htmlFor="edit-node-skill">
                      Skill <RequiredBadge />
                    </FieldLabel>
                    <Select
                      value={draftNode.name}
                      onValueChange={(name: Skill) => {
                        if (!name) return;
                        const current = getSkillLevel(name);
                        const target = clamp(
                          current + 1,
                          draftNode.target,
                          getMaxSkilllevel(name),
                        );
                        setDraftNode({
                          ...draftNode,
                          name,
                          current,
                          target,
                        } as typeof draftNode);
                      }}
                    >
                      <SelectTrigger id="edit-node-skill">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectGroup>
                          {Object.values(Skill).map((s) => (
                            <SelectItem value={s} key={s}>
                              <img
                                src={getSkillSrc(s)}
                                alt=""
                                className={imgClassName}
                              />
                              {capitalizeFirstLetter(s)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                ) : draftNode.type === "diary" ? (
                  <Field>
                    <FieldLabel htmlFor="edit-node-diary">
                      Region <RequiredBadge />
                    </FieldLabel>
                    <Select
                      value={draftNode.name}
                      onValueChange={(diary) =>
                        updateDiary(diary as Diaries, draftNode.tier)
                      }
                    >
                      <SelectTrigger id="edit-node-diary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectGroup>
                          {Object.keys(diariesJson).map((s) => (
                            <SelectItem value={s} key={s}>
                              <img
                                src={getDiarySrc(s as Diaries)}
                                alt=""
                                className={imgClassName}
                              />
                              {s}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                ) : (
                  <Field>
                    <FieldLabel htmlFor="edit-node-name">
                      Name <RequiredBadge />
                    </FieldLabel>
                    <Input
                      id="edit-node-name"
                      value={draftNode.name}
                      onChange={(e) =>
                        setDraftNode({
                          ...draftNode,
                          name: e.target.value,
                        } as typeof draftNode)
                      }
                    />
                  </Field>
                )}
                {draftNode.type === "diary" && (
                  <Field>
                    <FieldLabel htmlFor="edit-node-tier">
                      Tier <RequiredBadge />
                    </FieldLabel>
                    <Select
                      value={draftNode.tier}
                      onValueChange={(difficulty) =>
                        updateDiary(
                          draftNode.name,
                          difficulty as DiaryDifficulty,
                        )
                      }
                    >
                      <SelectTrigger id="edit-node-tier">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectGroup>
                          {(
                            [
                              "Easy",
                              "Medium",
                              "Hard",
                              "Elite",
                            ] as DiaryDifficulty[]
                          ).map((s) => (
                            <SelectItem value={s} key={s}>
                              <img
                                src={
                                  diariesJson[draftNode.name].rewards[s].imgUrl
                                }
                                alt=""
                                className={imgClassName}
                              />
                              {s}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
                {["skill", "generic", "item"].includes(draftNode.type) && (
                  <FieldGroup className="flex flex-row">
                    <Field>
                      <FieldLabel htmlFor="edit-node-current">
                        Current
                        {draftNode.type === "skill" && <RequiredBadge />}
                      </FieldLabel>
                      <NumericInput
                        id="edit-node-current"
                        value={draftNode.current}
                        min={draftNode.type === "skill" ? 1 : 0}
                        max={draftNode.target}
                        onChange={(n) =>
                          setDraftNode({ ...draftNode, current: n })
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="edit-node-target">
                        Target {draftNode.type === "skill" && <RequiredBadge />}
                      </FieldLabel>
                      <NumericInput
                        id="edit-node-target"
                        value={draftNode.target}
                        min={draftNode.type === "skill" ? 2 : 1}
                        max={draftNode.target}
                        onChange={(n) =>
                          setDraftNode({
                            ...draftNode,
                            current: Math.min(draftNode.current, n),
                            target: n,
                          })
                        }
                      />
                    </Field>
                  </FieldGroup>
                )}
                {draftNode.type === "collection" && (
                  <>
                    <Separator />
                    <Field id="edit-collection-items">
                      <FieldLabel>Items</FieldLabel>
                      {draftNode.items.map((item, i) => (
                        <EditListItem
                          key={i}
                          item={item}
                          setComplete={(b) => {
                            const items = draftNode.items;
                            items[i].completed = b;
                            setDraftNode({ ...draftNode, items });
                          }}
                          setNotes={(s) => {
                            if (!s) return;
                            const items = draftNode.items;
                            items[i].notes = s;
                            setDraftNode({ ...draftNode, items });
                          }}
                          onDelete={() => {
                            const items = draftNode.items;
                            items.splice(i, 1);
                            const current = items.reduce(
                              (acc, cur) => (cur.completed ? acc + 1 : acc),
                              0,
                            );
                            const target = items.length;
                            setDraftNode({
                              ...draftNode,
                              current,
                              target,
                              items,
                            });
                          }}
                        >
                          <Autosize
                            name={item.name}
                            value={item.name}
                            placeholder="Details..."
                            onChange={(e) => {
                              const items = draftNode.items;
                              items[i].name = e.target.value;
                              setDraftNode({ ...draftNode, items });
                            }}
                          />
                        </EditListItem>
                      ))}
                      <Button
                        variant="ghost"
                        className="flex justify-start rounded-xs"
                        onClick={(e) => {
                          e.preventDefault();
                          setDraftNode({
                            ...draftNode,
                            current: draftNode.current,
                            target: draftNode.target + 1,
                            items: [
                              ...draftNode.items,
                              { name: "", completed: false },
                            ],
                          });
                          setTimeout(() => {
                            const el = document.querySelector(
                              "#edit-collection-items > textarea:last-of-type",
                            ) as HTMLTextAreaElement;
                            el.focus();
                            el.readOnly = false;
                          }, 10);
                        }}
                      >
                        <Plus /> New Item
                      </Button>
                    </Field>
                  </>
                )}
                <Separator />
                <Field>
                  <FieldLabel htmlFor="edit-node-url">URL</FieldLabel>
                  <div className="flex items-center">
                    <span>osrs.wiki/w/</span>
                    <Input
                      id="edit-node-url"
                      className="inline px-0.5"
                      value={
                        draftNode.url
                          ? draftNode.url.split(
                              "https://oldschool.runescape.wiki/w/",
                            )[1]
                          : ""
                      }
                      onChange={(e) => {
                        const _draftNode = { ...draftNode };
                        if (e.target.value.length === 0) {
                          delete _draftNode.url;
                          setDraftNode({ ..._draftNode });
                        } else
                          setDraftNode({
                            ...draftNode,
                            url: `https://oldschool.runescape.wiki/w/${e.target.value}`,
                          } as typeof draftNode);
                      }}
                    />
                  </div>
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-node-imgurl">
                    Image URL
                    {draftNode.imgUrl && (
                      <Badge variant="secondary" className="ml-auto -my-1">
                        <abbr
                          title="Preview"
                          className="decoration-transparent"
                        >
                          Pv:
                        </abbr>
                        <img src={draftNode.imgUrl} className="w-6 h-6 ml-1" />
                      </Badge>
                    )}
                  </FieldLabel>
                  <Input
                    id="edit-node-imgurl"
                    className="inline px-0.5"
                    value={draftNode.imgUrl ?? ""}
                    onChange={(e) => {
                      if (e.target.value.length === 0) {
                        const _draftNode = { ...draftNode };
                        delete _draftNode.imgUrl;
                        setDraftNode({ ..._draftNode });
                      } else
                        setDraftNode({
                          ...draftNode,
                          imgUrl: e.target.value,
                        } as typeof draftNode);
                    }}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-node-notes">Notes</FieldLabel>
                  <Autosize
                    id="edit-node-notes"
                    className="rounded-md min-h-16"
                    value={draftNode.notes ?? ""}
                    onChange={(e) => {
                      const _draftNode = { ...draftNode };
                      if (e.target.value.length === 0) {
                        delete _draftNode.notes;
                        setDraftNode({ ..._draftNode });
                      } else
                        setDraftNode({
                          ...draftNode,
                          notes: e.target.value,
                        } as typeof draftNode);
                    }}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </form>
      </div>
    </NodeToolbar>
  );
}
