import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Item } from "@/types/data/item";
import clsx from "clsx";
import { useDeferredValue } from "react";
import { GroupedVirtuoso } from "react-virtuoso";
import WikiItemSearch from "./WikiItemSearch";
import { Separator } from "@/components/ui/separator";

type ItemInfo = { category: string[]; item: Item };

interface Props {
  id?: string;
  value: string;
  onChange: (
    newValue: string,
    optionalInfo?: { url?: string; imgUrl?: string },
  ) => void;
  groups: [string, ItemInfo[]][];
}
export default function ItemSelector(props: Props) {
  const { id, value, onChange, groups } = props;
  const _value = useDeferredValue(value);

  const filteredGroups: typeof groups = groups
    .map(([categoryName, items]) => {
      return [
        categoryName,
        items.filter((itemInfo: ItemInfo) =>
          itemInfo.item.name.toLowerCase().includes(_value.toLowerCase()),
        ),
      ] as [string, ItemInfo[]];
    })
    .filter((group) => group[1].length > 0);

  const collapsedFilteredItems: ItemInfo[] = filteredGroups.flatMap(
    ([_, items]) => items,
  );

  return (
    <div className="w-full relative focus-within:[&_.dropdown]:scale-y-100 focus-within:[&_.dropdown]:opacity-100">
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
      <div
        className={clsx(
          "dropdown bg-muted absolute left-0 bottom-0 translate-y-[calc(100%+4px)] h-80 w-full",
          "opacity-0 scale-y-1 origin-top transition-all",
        )}
      >
        <GroupedVirtuoso
          className="shadow-md rounded-sm"
          style={{ height: "320px", width: "100%" }}
          components={{
            Header: () =>
              value.trim() ? (
                <WikiItemSearch
                  category="Items"
                  value={value}
                  onClick={(r) => {
                    onChange(r.title, {
                      url: `https://oldschool.runescape.wiki/w/?curid=${r.pageid}`,
                    });
                  }}
                />
              ) : undefined,
            EmptyPlaceholder: () => (
              <>
                <Separator className="my-2" />
                <div className="px-4 italic text-sm">
                  Nothing interesting happens.
                </div>
              </>
            ),
          }}
          groupCounts={filteredGroups.map((arr) => arr[1].length)}
          groupContent={(index) => {
            return (
              // add background to the element to avoid seeing the items below it
              <div className="bg-muted/95 text-muted-foreground text-xs pt-2 text-nowrap overflow-hidden text-ellipsis max-w-full">
                {filteredGroups[index][0]}
              </div>
            );
          }}
          itemContent={(index) => {
            const item = collapsedFilteredItems[index]?.item;
            if (item)
              return (
                <Button
                  className="m-0 py-0 px-2 h-min w-full justify-start bg-muted rounded-none"
                  onClick={(e) => {
                    e.preventDefault();
                    onChange(item.name, { url: item.url, imgUrl: item.imgUrl });
                  }}
                >
                  <img
                    src={item.imgUrl}
                    width={16}
                    height={16}
                    className="size-4 object-contain"
                  />
                  <span className="text-wrap text-start">{item.name}</span>
                </Button>
              );
          }}
        />
      </div>
    </div>
  );
}
