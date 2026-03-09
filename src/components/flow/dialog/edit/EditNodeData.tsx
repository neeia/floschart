import { Plus } from "lucide-react";
import Node, {
  CollectionNodeData,
  GenericNodeData,
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
import Skill from "@/types/data/skill";
import getSkillSrc from "@/util/ui/getSkillSrc";
import NumericInput from "@/components/ui/NumericInput";
import { Badge } from "@/components/ui/badge";
import { createDiaryNodeData } from "@/util/createDiaryNodeData";
import { createQuestNodeData } from "@/util/createQuestNodeData";
import { getMaxSkilllevel } from "@/util/getMaxSkillLevel";
import rottenTomato from "@/util/templates/rottenTomato";
import { AppState } from "@/store/types";
import useStore from "@/store/store";
import { useShallow } from "zustand/shallow";
import clamp from "@/util/clamp";
import { createSkillNodeData } from "@/util/createSkillNodeData";
import { Diaries, DiaryDifficulty } from "@/types/external/runelite";
import {
  diariesJson,
  itemsJson,
  miniquestJson,
  prayerJson,
  questJson,
  spellJson,
} from "@/data";
import getDiarySrc from "@/util/ui/getDiarySrc";
import getNodeTypeIcon from "@/util/ui/getNodeTypeIcon";
import { Separator } from "@/components/ui/separator";
import getNodeTypeDisplayName from "@/util/ui/getNodeTypeDisplayName";
import Autosize from "./Autosize";
import EditListItem from "./EditListItem";
import capitalizeFirstLetter from "@/util/capitalizeFirstLetter";
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
} from "@/components/ui/combobox";
import mountedGlory from "@/util/templates/mountedGlory";
import ItemSelector from "./ItemSelector";
import { Item } from "@/types/data/item";
import UnlockSelector from "./UnlockSelector";
import WikiItemSearch from "./WikiItemSearch";

function RequiredBadge() {
  return (
    <Badge variant="secondary" className="ml-auto">
      <abbr title="Required" className="decoration-transparent">
        Req.
      </abbr>
    </Badge>
  );
}

const imgClassName = "w-6 h-6 object-contain";

const questList = Object.keys(questJson).sort((a, b) => a.localeCompare(b));
const miniquestList = Object.keys(miniquestJson).sort((a, b) =>
  a.localeCompare(b),
);
const questGroups = [
  { name: "Quests", items: questList },
  { name: "Miniquests", items: miniquestList },
];

type ItemInfo = { category: string[]; item: Item };
const itemGroups: [string, ItemInfo[]][] = Object.entries(itemsJson).map(
  ([categoryName, items]) =>
    [categoryName, Object.values(items)] as [string, ItemInfo[]],
);

const selector = (state: AppState) => ({
  accountData: state.accountData,
  getSkillLevel: state.getSkillLevel,
});

interface Props {
  id: string;
  draftNode: Node["data"];
  onChange: (nodeData: Node["data"]) => void;
  children?: React.ReactNode;
}

export default function EditNodeData(props: Props) {
  const { id, draftNode, onChange, children } = props;

  const { accountData, getSkillLevel } = useStore(useShallow(selector));

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
      case "unlock":
        return {
          type,
          name: "",
          current: 0,
          target: 1,
          incoming,
          outgoing,
        };
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
    onChange({
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

  return (
    <form className="flex flex-col bg-card min-w-72 max-h-[80dvh] overflow-y-auto nowheel">
      <FieldGroup>
        <FieldSet>
          {children}
          <FieldGroup className="px-2 pb-2">
            <Field>
              <FieldLabel htmlFor={`${id}-node-type`}>
                Type <RequiredBadge />
              </FieldLabel>
              <Select
                name="node-type"
                value={draftNode.type}
                onValueChange={(nodeType: typeof draftNode.type) => {
                  onChange(changeNodeType(nodeType));
                }}
              >
                <SelectTrigger id={`${id}-node-type`}>
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
                <FieldLabel htmlFor={`${id}-node-skill`}>
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
                    onChange({
                      ...draftNode,
                      name,
                      current,
                      target,
                    } as typeof draftNode);
                  }}
                >
                  <SelectTrigger id={`${id}-node-skill`}>
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
                <FieldLabel htmlFor={`${id}-node-diary`}>
                  Region <RequiredBadge />
                </FieldLabel>
                <Select
                  value={draftNode.name}
                  onValueChange={(diary) =>
                    updateDiary(diary as Diaries, draftNode.tier)
                  }
                >
                  <SelectTrigger id={`${id}-node-diary`}>
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
            ) : draftNode.type === "quest" ? (
              <Field>
                <FieldLabel htmlFor={`${id}-node-quest`}>
                  Quest Name <RequiredBadge />
                </FieldLabel>
                <Combobox
                  value={draftNode.name}
                  onValueChange={(name) =>
                    name
                      ? onChange({
                          ...draftNode,
                          name,
                          current: +(accountData?.quests[name] === 2),
                          url: questJson[name].url,
                        })
                      : null
                  }
                  items={questGroups}
                  autoHighlight
                >
                  <ComboboxInput
                    placeholder="Select a quest"
                    id={`${id}-node-quest`}
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                    <ComboboxList className="py-0">
                      {(group, i) => (
                        <ComboboxGroup
                          key={group.name}
                          items={group.items}
                          className="relative"
                        >
                          <ComboboxLabel className="sticky top-0 bottom-0 bg-popover/90 z-10">
                            {group.name}
                          </ComboboxLabel>
                          <ComboboxCollection>
                            {(item) => (
                              <ComboboxItem key={item} value={item}>
                                {item}
                              </ComboboxItem>
                            )}
                          </ComboboxCollection>
                          {i === 0 && <ComboboxSeparator />}
                        </ComboboxGroup>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>
            ) : draftNode.type === "item" ? (
              <Field>
                <FieldLabel htmlFor={`${id}-node-item`}>
                  Item <RequiredBadge />
                </FieldLabel>
                <ItemSelector
                  id={`${id}-node-item`}
                  groups={itemGroups}
                  value={draftNode.name}
                  onChange={(s, { url, imgUrl } = {}) =>
                    onChange({ ...draftNode, name: s, url, imgUrl })
                  }
                />
              </Field>
            ) : draftNode.type === "unlock" ? (
              <Field>
                <FieldLabel htmlFor={`${id}-node-unlock`}>
                  Unlock <RequiredBadge />
                </FieldLabel>
                <UnlockSelector
                  id={`${id}-node-unlock`}
                  value={draftNode.name}
                  onChange={(s, { url, imgUrl } = {}) =>
                    onChange({ ...draftNode, name: s, url, imgUrl })
                  }
                />
              </Field>
            ) : (
              <Field>
                <FieldLabel htmlFor={`${id}-node-name`}>
                  Name <RequiredBadge />
                </FieldLabel>
                <div className="focus-within:[&_.dropdown]:scale-y-100 focus-within:[&_.dropdown]:opacity-100 w-full relative">
                  <Input
                    id={`${id}-node-name`}
                    value={draftNode.name}
                    onChange={(e) =>
                      onChange({
                        ...draftNode,
                        name: e.target.value,
                      } as typeof draftNode)
                    }
                  />
                  <div
                    className={clsx(
                      "absolute w-full dropdown scale-y-0 opacity-0 origin-top transition-all bg-muted",
                      draftNode.name.length === 0 && "scale-y-0!",
                    )}
                  >
                    <WikiItemSearch
                      value={draftNode.name}
                      onClick={(r) => {
                        onChange({
                          ...draftNode,
                          name: r.title,
                          url: `https://oldschool.runescape.wiki/w/?curid=${r.pageid}`,
                        });
                      }}
                    />
                  </div>
                </div>
              </Field>
            )}
            {draftNode.type === "diary" && (
              <Field>
                <FieldLabel htmlFor={`${id}-node-tier`}>
                  Tier <RequiredBadge />
                </FieldLabel>
                <Select
                  value={draftNode.tier}
                  onValueChange={(difficulty) =>
                    updateDiary(draftNode.name, difficulty as DiaryDifficulty)
                  }
                >
                  <SelectTrigger id={`${id}-node-tier`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      {(
                        ["Easy", "Medium", "Hard", "Elite"] as DiaryDifficulty[]
                      ).map((s) => (
                        <SelectItem value={s} key={s}>
                          <img
                            src={diariesJson[draftNode.name].rewards[s].imgUrl}
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
                  <FieldLabel htmlFor={`${id}-node-current`}>
                    Current
                    {draftNode.type === "skill" && <RequiredBadge />}
                  </FieldLabel>
                  <NumericInput
                    id={`${id}-node-current`}
                    value={draftNode.current}
                    min={draftNode.type === "skill" ? 1 : 0}
                    max={draftNode.target}
                    onChange={(n) => onChange({ ...draftNode, current: n })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor={`${id}-node-target`}>
                    Target {draftNode.type === "skill" && <RequiredBadge />}
                  </FieldLabel>
                  <NumericInput
                    id={`${id}-node-target`}
                    value={draftNode.target}
                    min={draftNode.type === "skill" ? 2 : 1}
                    max={
                      draftNode.type === "skill"
                        ? getMaxSkilllevel(draftNode.name)
                        : 2147483647
                    }
                    onChange={(n) =>
                      onChange({
                        ...draftNode,
                        current: Math.min(draftNode.current, n),
                        target: n,
                      } as typeof draftNode)
                    }
                  />
                </Field>
              </FieldGroup>
            )}
            {draftNode.type === "collection" && (
              <>
                <Separator />
                <Field id={`${id}-node-quest`}>
                  <FieldLabel>Items</FieldLabel>
                  {draftNode.items.map((item, i) => (
                    <EditListItem
                      key={i}
                      item={item}
                      setComplete={(b) => {
                        const items = draftNode.items;
                        items[i].completed = b;
                        onChange({ ...draftNode, items });
                      }}
                      setNotes={(s) => {
                        if (!s) return;
                        const items = draftNode.items;
                        items[i].notes = s;
                        onChange({ ...draftNode, items });
                      }}
                      onDelete={() => {
                        const items = draftNode.items;
                        items.splice(i, 1);
                        const current = items.reduce(
                          (acc, cur) => (cur.completed ? acc + 1 : acc),
                          0,
                        );
                        const target = items.length;
                        onChange({
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
                          onChange({ ...draftNode, items });
                        }}
                      />
                    </EditListItem>
                  ))}
                  <Button
                    variant="ghost"
                    className="flex justify-start rounded-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      onChange({
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
              <FieldLabel htmlFor={`${id}-node-url`}>URL</FieldLabel>
              <div className="flex items-center">
                <span>osrs.wiki/w/</span>
                <Input
                  id={`${id}-node-url`}
                  className="inline px-0.5"
                  value={
                    draftNode.url
                      ? (draftNode.url.split(
                          "https://oldschool.runescape.wiki/w/",
                        )[1] ?? "")
                      : ""
                  }
                  onChange={(e) => {
                    const _draftNode = { ...draftNode };
                    if (e.target.value.length === 0) {
                      delete _draftNode.url;
                      onChange({ ..._draftNode });
                    } else
                      onChange({
                        ...draftNode,
                        url: `https://oldschool.runescape.wiki/w/${e.target.value}`,
                      } as typeof draftNode);
                  }}
                />
              </div>
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-node-img`}>
                Image URL
                {draftNode.imgUrl && (
                  <Badge variant="secondary" className="ml-auto -my-1">
                    <abbr title="Preview" className="decoration-transparent">
                      Pv:
                    </abbr>
                    <img src={draftNode.imgUrl} className="w-6 h-6 ml-1" />
                  </Badge>
                )}
              </FieldLabel>
              <Input
                id={`${id}-node-img`}
                className="inline px-0.5"
                value={draftNode.imgUrl ?? ""}
                onChange={(e) => {
                  if (e.target.value.length === 0) {
                    const _draftNode = { ...draftNode };
                    delete _draftNode.imgUrl;
                    onChange({ ..._draftNode });
                  } else
                    onChange({
                      ...draftNode,
                      imgUrl: e.target.value,
                    } as typeof draftNode);
                }}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-node-notes`}>Notes</FieldLabel>
              <Autosize
                id={`${id}-node-notes`}
                className="rounded-md min-h-16"
                value={draftNode.notes ?? ""}
                onChange={(e) => {
                  const _draftNode = { ...draftNode };
                  if (e.target.value.length === 0) {
                    delete _draftNode.notes;
                    onChange({ ..._draftNode });
                  } else
                    onChange({
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
  );
}
