import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { diariesJson, miniquestJson, questJson } from "@/data";
import { Requirements } from "@/types/data/requirements";
import Node from "@/types/node";
import { Minus, Plus, Workflow } from "lucide-react";
import QuestTree from "./QuestTree";
import Skill from "@/types/data/skill";
import clsx from "clsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import useStore from "@/store/store";
import { useShallow } from "zustand/shallow";
import { AppState } from "@/store/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Edge } from "@xyflow/react";

export interface QuestRequirements {
  skills: SkillInfo[];
  quests: QuestInfo[];
}
export interface SkillInfo {
  name: Skill;
  target: number;
  checked: boolean;
}

export interface QuestInfo {
  name: string;
  checked: boolean;
  reqs: QuestRequirements;
}
function getQuestRequirementsRecursive(reqs: Requirements): QuestRequirements {
  const recursiveReqs = reqs.quests.map(({ name }) => {
    const _reqs = (questJson[name] || miniquestJson[name]).requirements;
    return {
      name,
      checked: true,
      reqs: getQuestRequirementsRecursive(_reqs),
    };
  });
  return {
    skills: reqs.skills.map((s) => ({ ...s, checked: true })),
    quests: recursiveReqs,
  };
}

export function applyFnToAllReqs(
  reqs: QuestRequirements,
  fn: <T extends SkillInfo | QuestInfo>(
    req: T,
    nodeInfo: { isSkill: boolean; depth: number },
  ) => T,
  depth: number = 0,
): QuestRequirements {
  const skills: SkillInfo[] = reqs.skills.map((r) =>
    fn(r, { isSkill: true, depth }),
  );
  const quests = reqs.quests
    .map((q) => fn(q, { isSkill: false, depth }))
    .map((q) => ({ ...q, reqs: applyFnToAllReqs(q.reqs, fn, depth + 1) }));
  return { skills, quests };
}

function countMatch(
  reqs: QuestRequirements,
  fn: <T extends SkillInfo | QuestInfo>(
    req: T,
    nodeInfo: { isSkill: boolean; depth: number },
  ) => boolean,
  depth: number = 0,
): number {
  const skills: number = reqs.skills.filter((s) =>
    fn(s, { isSkill: true, depth }),
  ).length;

  const quests = reqs.quests.reduce(
    (acc, q) =>
      acc +
      (fn(q, { isSkill: false, depth }) ? 1 : 0) +
      countMatch(q.reqs, fn, depth + 1),
    0,
  );

  return skills + quests;
}

const selector = (state: AppState) => ({
  accountData: state.accountData,
  getSkillLevel: state.getSkillLevel,
  editNode: state.editNode,
  addNode: state.addNode,
  addEdge: state.addEdge,
  getId: state.getId,
});
interface Props {
  node?: Node;
}

export default function AddDependencies(props: Props) {
  const { node } = props;

  const { accountData, getSkillLevel, editNode, addNode, addEdge, getId } =
    useStore(useShallow(selector));

  const [open, setOpen] = useState(false);

  const [optionsExpanded, setOptionsExpanded] = useState(true);
  const [strikeCompleted, setStrikeCompleted] = useState(true);

  const [showSubquests, setShowSubquests] = useState("all");
  const [showSubquestSkills, setShowSubquestSkills] = useState("highest");
  const [showCompleted, setShowCompleted] = useState("none");

  const [reqs, setReqs] = useState<QuestRequirements>({
    quests: [],
    skills: [],
  });
  useEffect(() => {
    if (node != null) {
      switch (node.data.type) {
        case "quest":
          const questInfo =
            questJson[node.data.name] || miniquestJson[node.data.name];
          setReqs(getQuestRequirementsRecursive(questInfo.requirements));
          break;
        case "diary":
          const diaryInfo = diariesJson[node.data.name].tiers[node.data.tier];
          setReqs(getQuestRequirementsRecursive(diaryInfo.requirements));
          break;
        default:
          break;
      }
    }
  }, [node]);

  const highestPerSkill: Record<Skill, number> = Object.values(Skill).reduce(
    (acc, sk) => ({ ...acc, [sk]: 0 }),
    {} as Record<Skill, number>,
  );
  applyFnToAllReqs(reqs, (r, k) => {
    if (k.isSkill) {
      const s = r as SkillInfo;
      if (s.target > highestPerSkill[s.name])
        highestPerSkill[s.name] = s.target;
    }
    return r;
  });

  function filter(
    req: SkillInfo | QuestInfo,
    nodeInfo: { isSkill: boolean; depth: number },
  ): boolean {
    if (showSubquests === "none" && nodeInfo.depth > 0) return false;
    if (showSubquestSkills === "none" && nodeInfo.depth > 0 && nodeInfo.isSkill)
      return false;
    if (showCompleted === "none" && accountData) {
      if (nodeInfo.isSkill) {
        const _req = req as SkillInfo;
        const cur = getSkillLevel(_req.name);
        if (cur >= _req.target) return false;
      } else {
        const cur = accountData.quests[req.name] === 2;
        if (cur) return false;
      }
    }
    if (
      showSubquestSkills === "highest" &&
      nodeInfo.depth > 0 &&
      nodeInfo.isSkill
    ) {
      const _req = req as SkillInfo;
      if (highestPerSkill[_req.name] > _req.target) return false;
    }
    return true;
  }

  const numLi = countMatch(reqs, filter);
  const numSel = countMatch(
    reqs,
    (req, info) => filter(req, info) && req.checked,
  );

  function generate() {
    if (!node) return;

    const graph: { nodes: { node: Node; depth: number }[]; edges: Edge[] } = {
      nodes: [],
      edges: [],
    };
    function generateGraphFromReqs(
      parentNode: Node,
      reqs: QuestRequirements,
      depth: number = 0,
    ) {
      const x = parentNode.position.x - 300;
      const y = parentNode.position.y;
      reqs.skills
        .filter((q) => filter(q, { isSkill: true, depth }))
        .forEach((s) => {
          if (s.checked) {
            const skillLevel = getSkillLevel(s.name);

            // check if identical node already exists and connect to parent
            const existingNode = graph.nodes.find(
              ({ node: _node }) =>
                _node.data.name === s.name && _node.data.target === s.target,
            );
            const currentNode: Node = existingNode?.node || {
              id: getId().toString(),
              type: "node",
              position: { x, y },
              selected: true,
              data: {
                type: "skill",
                name: s.name,
                current: skillLevel,
                target: s.target,
                incoming: {},
                outgoing: { [parentNode.id]: true },
                url: `https://oldschool.runescape.wiki/w/${s.name.replace(" ", "_")}`,
              },
            };
            const edgeToParent: Edge = {
              id: `xy-edge__${currentNode.id}-${parentNode.id}`,
              source: currentNode.id,
              target: parentNode.id,
            };
            parentNode.data.incoming[currentNode.id] = skillLevel >= s.target;

            if (existingNode) {
              // if node already exists, we only need to change its depth
              existingNode.depth = depth;
            } else {
              graph.nodes.push({ node: currentNode, depth });
            }

            if (graph.edges.every((edge) => edge.id !== edgeToParent.id))
              graph.edges.push(edgeToParent);
          }
        });

      reqs.quests
        .filter((q) => filter(q, { isSkill: false, depth }))
        .forEach((q) => {
          if (q.checked) {
            const questCompleted = accountData
              ? accountData.quests[q.name] === 2
              : false;

            // check if identical node already exists and connect to parent
            const existingNode = graph.nodes.find(
              ({ node: _node }) => _node.data.name === q.name,
            );
            if (existingNode)
              existingNode.node.data.outgoing[parentNode.id] = true;
            const currentNode: Node = existingNode?.node || {
              id: getId().toString(),
              type: "node",
              position: { x, y },
              selected: true,
              data: {
                type: "quest",
                name: q.name,
                current: questCompleted ? 1 : 0,
                target: 1,
                incoming: {},
                outgoing: { [parentNode.id]: true },
                url: (questJson[q.name] || miniquestJson[q.name]).url,
              },
            };
            const edgeId = `xy-edge__${currentNode.id}-${parentNode.id}`;
            const edgeToParent: Edge = {
              id: edgeId,
              source: currentNode.id,
              target: parentNode.id,
            };
            parentNode.data.incoming[currentNode.id] = questCompleted;

            // iterate one level deeper
            generateGraphFromReqs(currentNode, q.reqs, depth + 1);

            if (existingNode) {
              // if node already exists, we only need to change its depth
              existingNode.depth = Math.max(existingNode.depth, depth);
            } else {
              graph.nodes.push({ node: currentNode, depth });
            }
            if (graph.edges.every((edge) => edge.id !== edgeId))
              graph.edges.push(edgeToParent);
          }
        });
    }

    generateGraphFromReqs(node, reqs);

    const questsOfDepth: number[] = [];
    const skillsOfDepth: number[] = [];
    editNode(node.id, node.data);
    graph.nodes
      .map(({ node: _node, depth }) => {
        const isSkill = _node.data.type === "skill";
        if (isSkill) {
          skillsOfDepth[depth] ??= -1;
          skillsOfDepth[depth]++;
        } else {
          questsOfDepth[depth] ??= -1;
          questsOfDepth[depth]++;
        }
        const x = node.position.x - 288 * (depth + 1);
        const y =
          node.position.y +
          (48 + 72 * (isSkill ? skillsOfDepth[depth] : questsOfDepth[depth])) *
            (isSkill ? -1 : 1);
        return { ..._node, position: { x, y } };
      })
      .forEach((n) => addNode(n));
    graph.edges.forEach(addEdge);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          title="Generate Dependencies"
          variant="ghost"
          className={"rounded-full h-8 px-2!"}
        >
          <Workflow />
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Generate Quest Requirements</DialogTitle>
        </DialogHeader>
        <Collapsible
          open={optionsExpanded}
          onOpenChange={() => setOptionsExpanded(!optionsExpanded)}
          className="bg-card rounded-t-sm max-h-dvh"
        >
          <CollapsibleTrigger className="w-full text-sm flex justify-center items-center gap-1">
            options
            {optionsExpanded ? <Minus size={12} /> : <Plus size={12} />}
          </CollapsibleTrigger>
          <CollapsibleContent
            className={clsx(
              "text-sm",
              "overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
            )}
          >
            <Separator />
            <div className="p-2 gap-2 flex justify-between flex-wrap">
              <div className="flex flex-col gap-1">
                <div>Subquests</div>
                <ToggleGroup
                  type="single"
                  className="bg-secondary"
                  value={showSubquests}
                  onValueChange={(v) => v && setShowSubquests(v)}
                >
                  <ToggleGroupItem value="all">Show all</ToggleGroupItem>
                  <ToggleGroupItem value="none">Hide all</ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className="flex flex-col gap-1">
                <div>Subquest Skill Requirements</div>
                <ToggleGroup
                  type="single"
                  className="bg-secondary"
                  value={showSubquestSkills}
                  onValueChange={(v) => v && setShowSubquestSkills(v)}
                >
                  <ToggleGroupItem value="all">Show all</ToggleGroupItem>
                  <ToggleGroupItem value="highest">
                    Show highest
                  </ToggleGroupItem>
                  <ToggleGroupItem value="none">Hide all</ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className="flex flex-col gap-1">
                <div>Completed Prereqs</div>
                <ToggleGroup
                  type="single"
                  className="bg-secondary"
                  value={showCompleted}
                  onValueChange={(v) => v && setShowCompleted(v)}
                >
                  <ToggleGroupItem value="all">Show completed</ToggleGroupItem>
                  <ToggleGroupItem value="none">Hide completed</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <ButtonGroup
          className={clsx(
            "flex gap-2 w-full -my-3",
            "*:font-normal *:bg-transparent *:text-sm *:text-card-foreground *:p-0 *:h-min *:underline *:decoration-dotted *:decoration-2 *:underline-offset-2",
          )}
        >
          <Button
            title="include all requirements"
            onClick={() =>
              setReqs(applyFnToAllReqs(reqs, (n) => ({ ...n, checked: true })))
            }
          >
            Select all
          </Button>
          <Button
            title="removes all requirements"
            onClick={() =>
              setReqs(applyFnToAllReqs(reqs, (n) => ({ ...n, checked: false })))
            }
          >
            Deselect all
          </Button>
          <label
            title="puts a crossed line over completed requirements"
            className="ml-auto flex items-center gap-1"
          >
            mark completed
            <Checkbox
              checked={strikeCompleted}
              onCheckedChange={() => setStrikeCompleted(!strikeCompleted)}
              className="border-muted-foreground"
            />
          </label>
        </ButtonGroup>
        <div
          className={clsx(
            "max-h-[50dvh] overflow-y-auto [&_ul]:ml-4",
            strikeCompleted &&
              "[&_.completed]:italic [&_.completed]:line-through [&_.completed]:text-muted-foreground",
          )}
        >
          {node && (
            <>
              <h3 className="font-bold text-xl">{node.data.name}</h3>
              {numLi === 0 && <div>You've completed all the requirements!</div>}
              <QuestTree reqs={reqs} onChecked={setReqs} filter={filter} />
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="confirm" disabled={numSel === 0} onClick={generate}>
            Add Selected Nodes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
