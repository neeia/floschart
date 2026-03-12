import React from "react";
import {
  applyFnToAllReqs,
  QuestInfo,
  QuestRequirements,
  SkillInfo,
} from "./AddDependencies";
import { Checkbox } from "@/components/ui/checkbox";
import getSkillSrc from "@/util/ui/getSkillSrc";
import clsx from "clsx";
import { AppState } from "@/store/types";
import useStore from "@/store/store";
import { useShallow } from "zustand/shallow";

const selector = (state: AppState) => ({
  accountData: state.accountData,
  getSkillLevel: state.getSkillLevel,
});
interface Props {
  reqs: QuestRequirements;
  onChecked: (tree: QuestRequirements, checked: boolean) => void;
  filter: <T extends SkillInfo | QuestInfo>(
    req: T,
    nodeInfo: { isSkill: boolean; depth: number },
  ) => boolean;
  depth?: number;
}
export default function QuestTree(props: Props) {
  const {
    reqs: { skills, quests },
    onChecked,
    filter,
    depth = 0,
  } = props;

  const { accountData, getSkillLevel } = useStore(useShallow(selector));

  return (
    <>
      <ul>
        {skills
          .filter((s) => filter(s, { isSkill: true, depth }))
          .map((s, i) => (
            <li
              key={s.name}
              className={clsx(
                "flex items-center gap-1",
                getSkillLevel(s.name) >= s.target &&
                  "completed",
              )}
            >
              <Checkbox
                className="bg-muted mr-2"
                checked={s.checked}
                onCheckedChange={() => {
                  skills[i] = { ...s, checked: !s.checked };
                  onChecked({ skills, quests }, !s.checked);
                }}
              />
              <img
                src={getSkillSrc(s.name)}
                className="size-4 object-contain inline"
              />
              {s.target} {s.name}
            </li>
          ))}
      </ul>
      {quests.length > 0 && (
        <ul>
          {quests
            .filter((q) => filter(q, { isSkill: false, depth }))
            .map((q, i) => (
              <React.Fragment key={q.name}>
                <li
                  key={q.name}
                  className={clsx(
                    "flex items-center gap-2",
                    accountData &&
                      accountData.quests[q.name] === 2 &&
                      "completed",
                  )}
                >
                  <Checkbox
                    className="bg-muted"
                    checked={q.checked}
                    onCheckedChange={() => {
                      quests[i] = { ...q, checked: !q.checked };
                      if (!q.checked) onChecked({ skills, quests }, true);
                      else {
                        q.checked = false;
                        q.reqs = applyFnToAllReqs(q.reqs, (req) => ({
                          ...req,
                          checked: false,
                        }));
                        quests[i] = q;
                        onChecked({ skills, quests }, false);
                      }
                    }}
                  />
                  {q.name}
                </li>
                <li>
                  <QuestTree
                    reqs={q.reqs}
                    onChecked={(r, checked) => {
                      if (checked) q.checked = true;
                      quests[i] = { ...q, reqs: r };
                      onChecked({ skills, quests }, q.checked);
                    }}
                    filter={filter}
                    depth={depth + 1}
                  />
                </li>
              </React.Fragment>
            ))}
        </ul>
      )}
    </>
  );
}
