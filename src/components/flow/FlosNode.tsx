import Node from "@/types/node";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Button } from "../ui/button";
import clsx from "clsx";
import getSkillSrc from "@/util/ui/getSkillSrc";
import FlosListNodeContainer from "./FlosListNodeContainer";
import FlosListNode from "./FlosListNode";
import { Item } from "../ui/item";
import { Separator } from "../ui/separator";
import getDiarySrc from "@/util/ui/getDiarySrc";

export default function FlosNode(props: NodeProps<Node>) {
  const { id, data } = props;
  const goalIsComplete = data.current >= data.target;
  const incomingCompletion = Object.values(data.incoming);
  const completeStyle = "font-normal italic text-complete-foreground";

  return (
    <>
      <span className="clipped-container relative">
        <Handle
          position={Position.Left}
          type="target"
          className={clsx(
            "z-10 arrow",
            incomingCompletion.length > 0
              ? incomingCompletion.some((d) => d)
                ? incomingCompletion.every((d) => d)
                  ? "bg-complete!"
                  : "bg-incomplete!"
                : "bg-unstarted!"
              : "bg-card!",
            Object.keys(data.incoming).length > 0
              ? "opacity-100"
              : "opacity-50",
          )}
          style={{
            border: "none",
            borderRadius: "0",
          }}
        />
        <Button
          title="Click to see actions"
          variant="shine"
          size="icon-sm"
          className="relative size-fit bg-card clipped flex h-12 min-w-16 text-base leading-none text-card-foreground hover:text-card-foreground/95"
        >
          <div
            className={clsx(
              "absolute size-full left-0 top-0 bottom-0 transition-all -z-10",
              goalIsComplete ? "bg-complete" : "bg-incomplete",
            )}
            style={{
              width:
                data.target === 0
                  ? "100%"
                  : `calc(${(100 * data.current) / data.target}% - var(--cutout-size))`,
            }}
          />
          {(data.type === "skill" && (
            <div className="flex relative">
              <img
                src={getSkillSrc(data.name)}
                alt={data.name}
                className="w-8 h-8 my-1 mx-1 object-contain pixelate brightness-125"
              />
              <span className="caption bg-card/75 absolute bottom-0.5 right-0.5">
                {data.target}
              </span>
            </div>
          )) ||
            (data.type === "quest" && (
              <div className="flex h-full py-0.5 items-center pr-1">
                <img
                  src={
                    data.imgUrl ||
                    "https://oldschool.runescape.wiki/images/thumb/Quests.png/130px-Quests.png"
                  }
                  alt=""
                  className="w-8 h-8 my-1 mx-1 object-contain"
                />
                <h2 className={clsx("ml-1", goalIsComplete && completeStyle)}>
                  {data.name}
                </h2>
              </div>
            )) ||
            (data.type === "item" &&
              (data.imgUrl != null ? (
                <div className="flex relative">
                  <img
                    src={data.imgUrl}
                    alt=""
                    className="w-10 h-10 object-contain pixelate"
                  />
                  {data.target > 1 && (
                    <span className="caption bg-card/75 absolute bottom-0.5 right-0.5">
                      {data.target}
                    </span>
                  )}
                </div>
              ) : (
                <h2 className={clsx("px-2", goalIsComplete && completeStyle)}>
                  {data.name}
                </h2>
              ))) ||
            (data.type === "diary" && (
              <div className="flex relative size-full items-center min-w-48">
                <img
                  src={data.imgUrl || getDiarySrc(data.name)}
                  alt=""
                  className="w-6 h-6 my-1 mx-1 object-contain"
                />
                <div className={clsx(goalIsComplete && completeStyle)}>
                  <h2
                    className={clsx(
                      "inline ml-1",
                      goalIsComplete && "font-normal",
                    )}
                  >
                    {data.name} Diary
                  </h2>
                  <h3 className={clsx("text-2xs inline ml-1 font-normal")}>
                    ({data.tier})
                  </h3>
                </div>
              </div>
            )) ||
            (data.type === "generic" && (
              <div className="flex relative">
                {data.imgUrl != null && (
                  <img
                    src={data.imgUrl}
                    alt=""
                    className="w-8 h-8 my-1 mx-1 object-contain pixelate"
                  />
                )}
                <h2 className={clsx(goalIsComplete && completeStyle)}>
                  {data.name}
                </h2>
              </div>
            )) ||
            (data.type === "collection" && (
              <div className="flex relative size-full items-center min-w-48">
                {data.imgUrl != null && (
                  <img
                    src={data.imgUrl}
                    alt=""
                    className="w-6 h-6 my-1 mx-1 object-contain"
                  />
                )}
                <div className={clsx(goalIsComplete && completeStyle)}>
                  <h2 className={clsx("ml-1", goalIsComplete && "font-normal")}>
                    {data.name}
                  </h2>
                </div>
              </div>
            ))}
        </Button>
        <Handle
          position={Position.Right}
          type="source"
          className={clsx(
            "arrow",
            data.outgoing.size > 0
              ? goalIsComplete
                ? "bg-complete!"
                : incomingCompletion.every((d) => d)
                  ? "bg-incomplete!"
                  : "bg-unstarted!"
              : "bg-card!",
            data.outgoing.size > 0 ? "opacity-100" : "opacity-50",
          )}
          style={{
            border: "none",
            borderRadius: "0",
          }}
        />
      </span>
      {(data.type === "diary" || data.type === "collection") && (
        <FlosListNodeContainer id={id} expanded={data.expanded}>
          {data.items.map((item) => (
            <FlosListNode key={item.name} id={id} task={item} />
          ))}
        </FlosListNodeContainer>
      )}
      {data.notes && (
        <Item className="absolute show-if-selected block bg-card mt-2 p-0 min-w-[calc(100%-12px)] max-w-72 drop-shadow-sm">
          <h3 className="text-3xs ml-1">notes</h3>
          <Separator />
          <p className="text-2xs ml-1 wrap-break-word">{data.notes}</p>
        </Item>
      )}
    </>
  );
}
