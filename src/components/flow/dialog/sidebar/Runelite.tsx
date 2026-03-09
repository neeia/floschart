import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { questJson } from "@/data";
import useStore from "@/store/store";
import { AppState } from "@/store/types";
import Skill from "@/types/data/skill";
import { Diaries, DiaryDifficulty } from "@/types/external/runelite";
import fetchRuneliteUser from "@/util/api/fetchRuneliteUser";
import { getCombatLevel } from "@/util/getCombatLevel";
import { getQuestPoints } from "@/util/getQuestPoints";
import getSkillSrc from "@/util/ui/getSkillSrc";
import clsx from "clsx";
import { Check } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";

function msToTime(ms: number) {
  if (ms < 10000) return "Just now";

  const seconds = +(ms / 1000).toFixed(0) % 60;
  const minutes = +(ms / (1000 * 60)).toFixed(0) % 60;
  const hours = +(ms / (1000 * 60 * 60)).toFixed(0) % 24;
  const days = +(ms / (1000 * 60 * 60 * 24)).toFixed(0);

  if (days) return `${days}d:${hours}h:${minutes}m:${seconds}s ago`;
  else if (hours) return `${hours}h:${minutes}m:${seconds}s ago`;
  else if (minutes) return `${minutes}m:${seconds}s ago`;
  else return `${seconds}s ago`;
}

const maxQp = Object.values(questJson).reduce((acc, cur) => acc + cur.qp, 0);

const selector = (state: AppState) => ({
  accountData: state.accountData,
  setAccountData: state.setAccountData,
});
export default function Runelite() {
  const { setAccountData, accountData } = useStore(useShallow(selector));

  const [username, setUsername] = useState("");
  const [ago, setAgo] = useState("");

  useEffect(() => {
    if (!accountData) return;
    setUsername(accountData.username);

    const gap = msToTime(Date.now() - Date.parse(accountData.timestamp));
    setAgo(`${gap}`);

    const timeout = setInterval(() => {
      if (!accountData) return;
      const gap = msToTime(Date.now() - Date.parse(accountData.timestamp));
      setAgo(`${gap}`);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [accountData]);

  return (
    <div className={"px-2"}>
      {!accountData && (
        <>
          <p>
            You can use the{" "}
            <a
              href="https://oldschool.runescape.wiki/w/RuneScape:WikiSync"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-dotted"
            >
              WikiSync
            </a>{" "}
            plugin to look up some information about your account. This will
            automatically keep goals in sync with your account data.
          </p>
          <Separator className="my-4" />
        </>
      )}
      <form>
        <Field>
          <FieldLabel>Username</FieldLabel>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={12}
            placeholder="username..."
          />
          <Button
            variant="accent"
            type="submit"
            disabled={!username}
            onClick={(e) => {
              e.preventDefault();
              if (username)
                fetchRuneliteUser(username.trim()).then((data) => {
                  if (data.username) {
                    setAccountData(data);
                    toast.success("Data imported successfully.");
                  } else {
                    toast.error("User not found.");
                  }
                });
            }}
          >
            <img
              src="https://oldschool.runescape.wiki/images/RuneLite_icon.png"
              width={16}
              height={16}
            />
            Lookup with RuneLite
          </Button>
        </Field>
      </form>
      {accountData != null && (
        <div
          className={clsx(
            "[&_h3]:text-sm [&_h3]:opacity-50 [&_h3]:mt-2 [&_h3]:-mb-1",
            "[&_:not(h2)]:font-[osrs]",
          )}
        >
          <Separator className="my-4" />
          <h2>Account Info</h2>
          <h3>Username</h3>
          <p>{accountData.username}</p>
          <h3>Last Updated</h3>
          <p>{ago}</p>
          <h3>Skills</h3>
          <ul className="grid grid-cols-3 grid-rows-8 grid-flow-col">
            {Object.keys(Skill).map((s) => {
              if (
                s === "Combat_Level" ||
                s === "Quest_Points" ||
                s === "Overall"
              )
                return;
              return (
                <li key={s} className="flex items-center h-8 gap-1.5">
                  <img
                    src={getSkillSrc(s)}
                    width={32}
                    height={32}
                    className="size-6 object-contain pixelate"
                  />
                  {accountData.levels[s as keyof typeof accountData.levels]}
                </li>
              );
            })}
          </ul>
          <div className="grid grid-cols-2 my-4">
            <div className="flex items-center gap-2">
              <img
                src={getSkillSrc(Skill.Combat_Level)}
                width={32}
                height={32}
                className="size-6 object-contain pixelate"
              />
              <div>{getCombatLevel(accountData.levels)}</div>
            </div>
            <div className="flex items-center gap-2">
              <img
                src={getSkillSrc(Skill.Overall)}
                width={32}
                height={32}
                className="size-6 object-contain pixelate"
              />
              <div>
                {Object.values(accountData.levels).reduce(
                  (acc, cur) => acc + cur,
                  0,
                )}
              </div>
            </div>
          </div>
          <h3>Quests</h3>
          <p className="grid grid-cols-2">
            <span className="flex items-center gap-1">
              <span className="relative">
                <img
                  src="https://oldschool.runescape.wiki/images/Quests.png"
                  width={16}
                  height={16}
                  alt="quests completed"
                  className="size-6 object-contain pixelate"
                />
                <Check className="size-5 absolute -bottom-1 -right-1 text-complete" />
              </span>
              {Object.values(accountData.quests).filter((n) => n === 2).length +
                " / " +
                Object.keys(questJson).length}
            </span>
            <span className="flex items-center gap-1">
              <img
                src="https://oldschool.runescape.wiki/images/Quests.png"
                width={16}
                height={16}
                alt="quest points"
                className="size-6 object-contain pixelate"
              />
              {getQuestPoints(
                Object.entries(accountData.quests)
                  .filter(([_, n]) => n === 2)
                  .map(([s]) => s),
              ) +
                " / " +
                maxQp}
            </span>
          </p>
          <h3>Diaries</h3>
          <dl>
            {Object.keys(accountData.achievement_diaries).map((d) => {
              const diary = accountData.achievement_diaries[d as Diaries];
              const tasks = Object.keys(diary).flatMap(
                (d) => diary[d as DiaryDifficulty].tasks,
              );
              const tasksDone = tasks.filter((t) => t).length;
              return (
                <React.Fragment key={d}>
                  <dt className={clsx("flex gap-1 items-center")}>
                    <span>{d}</span>
                    <span className="ml-auto">
                      {tasksDone} / {tasks.length}
                    </span>
                    <span
                      className={clsx(
                        "block",
                        "size-2",
                        tasksDone === tasks.length
                          ? "bg-complete-foreground"
                          : "bg-incomplete-foreground",
                      )}
                    />
                  </dt>
                  <dd className="-mt-0.5 grid grid-cols-4 h-3 border border-gray-500">
                    {["Easy", "Medium", "Hard", "Elite"].map((s) => {
                      const t = diary[s as DiaryDifficulty].tasks;
                      const c = t.filter((t) => t);
                      return (
                        <div
                          key={s}
                          className={clsx(
                            "h-full bg-gray-500",
                            c.length === t.length,
                          )}
                        >
                          <div
                            className={clsx(
                              "h-full",
                              c.length === t.length
                                ? "bg-complete"
                                : c.length === 0
                                  ? "bg-unstarted"
                                  : "bg-incomplete",
                            )}
                            style={{
                              width: `calc(${(100 * c.length) / t.length}% - 1px)`,
                            }}
                          />
                        </div>
                      );
                    })}
                  </dd>
                </React.Fragment>
              );
            })}
          </dl>
        </div>
      )}
    </div>
  );
}
