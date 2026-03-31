import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import React, { useDeferredValue, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { furnitureJson, prayerJson, slayerJson, spellJson } from "@/data";
import WikiItemSearch from "./WikiItemSearch";

interface Props {
  id?: string;
  value: string;
  onChange: (
    newValue: string,
    optionalInfo?: { url?: string; imgUrl?: string },
  ) => void;
}
export default function UnlockSelector(props: Props) {
  const { id, value, onChange } = props;
  const _value = useDeferredValue(value);
  const input = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full relative focus-within:[&_.dropdown]:scale-y-100 focus-within:[&_.dropdown]:opacity-100">
      <Input
        ref={input}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => {
          e.target.select();
        }}
      />
      <div
        className={clsx(
          "dropdown bg-muted absolute left-0 bottom-0 translate-y-[calc(100%+4px)] h-72 w-full",
          "opacity-0 scale-y-1 origin-top transition-all",
        )}
      >
        <Tabs
          orientation="vertical"
          defaultValue="furniture"
          className="h-full overflow-y-scroll px-0.5 gap-1"
        >
          <TabsList
            className={clsx(
              "gap-1 sticky top-0",
              "*:p-1 *:h-fit *:rounded-sm *:aria-selected:bg-primary!",
            )}
          >
            <TabsTrigger value="furniture">
              <img
                src="https://oldschool.runescape.wiki/images/Construction_icon.png"
                className="size-6 pixelate"
              />
            </TabsTrigger>
            <TabsTrigger value="prayers">
              <img
                src="https://oldschool.runescape.wiki/images/Prayer_icon.png"
                className="size-6 pixelate"
              />
            </TabsTrigger>
            <TabsTrigger value="slayer">
              <img
                src="https://oldschool.runescape.wiki/images/Slayer_icon.png"
                className="size-6 pixelate"
              />
            </TabsTrigger>
            <TabsTrigger value="spells">
              <img
                src="https://oldschool.runescape.wiki/images/Magic_icon.png"
                className="size-6 pixelate"
              />
            </TabsTrigger>
          </TabsList>
          <Separator
            orientation="vertical"
            className="self-stretch h-auto! sticky top-0"
          />
          <TabsContent value="furniture">
            <div className="flex flex-col w-full">
              {value.trim() ? (
                <WikiItemSearch
                  value={value}
                  category="Furniture"
                  onClick={(r) => {
                    onChange(r.title, {
                      url: `https://oldschool.runescape.wiki/w/?curid=${r.pageid}`,
                    });
                    input.current?.focus();
                    input.current?.blur();
                  }}
                />
              ) : undefined}
              {Object.values(furnitureJson)
                .filter((p) =>
                  p.name.toLowerCase().includes(_value.toLowerCase()),
                )
                .map((furniture) => (
                  <Button
                    key={furniture.name}
                    variant="ghost"
                    className="p-1 flex justify-start items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      onChange(furniture.name, {
                        url: furniture.url,
                        imgUrl: furniture.imgUrl,
                      });
                      input.current?.focus();
                      input.current?.blur();
                    }}
                  >
                    <img
                      src={furniture.imgUrl}
                      width={32}
                      height={32}
                      className="size-6 aspect-square object-contain"
                    />
                    <span className="text-wrap text-start leading-none h-7 font-normal text-sm">
                      {furniture.name}
                    </span>
                  </Button>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="prayers">
            <div className="w-full grid grid-cols-5 gap-1">
              {Object.values(prayerJson)
                .filter((p) =>
                  p.name.toLowerCase().includes(_value.toLowerCase()),
                )
                .sort((p1, p2) => p1.levelRequirement - p2.levelRequirement)
                .map((prayer) => (
                  <Button
                    key={prayer.name}
                    variant="ghost"
                    className="aspect-square p-1 hover:bg-primary focus:bg-primary rounded-full"
                    onClick={(e) => {
                      e.preventDefault();
                      onChange(prayer.name, {
                        url: prayer.url,
                        imgUrl: prayer.imgUrl,
                      });
                    }}
                  >
                    <img
                      src={prayer.imgUrl}
                      alt={prayer.name}
                      className="size-full object-contain"
                      width={28}
                      height={28}
                    />
                  </Button>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="slayer">
            <div className="flex flex-col w-full relative">
              {Object.entries(slayerJson).map(([category, items]) => (
                <React.Fragment key={category}>
                  <div className="sticky top-0 bg-muted text-muted-foreground text-xs pt-2 text-nowrap overflow-hidden text-ellipsis max-w-full">
                    {category}
                  </div>
                  {Object.values(items)
                    .filter((p) =>
                      p.name.toLowerCase().includes(_value.toLowerCase()),
                    )
                    .map((slayer) => (
                      <Button
                        key={slayer.name}
                        variant="ghost"
                        className="p-1 flex justify-start items-center"
                        onClick={(e) => {
                          e.preventDefault();
                          onChange(slayer.name, {
                            url: `https://oldschool.runescape.wiki/w/Slayer_Rewards#${category}`,
                            imgUrl: slayer.imgUrl,
                          });
                        }}
                      >
                        <img
                          src={slayer.imgUrl}
                          width={32}
                          height={32}
                          className="size-6 aspect-square object-contain"
                        />
                        <span className="text-wrap text-start leading-none font-normal text-sm">
                          {slayer.name}
                        </span>
                      </Button>
                    ))}
                </React.Fragment>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="spells">
            <div className="flex flex-col w-full relative">
              {Object.entries(spellJson).map(([category, items]) => (
                <React.Fragment key={category}>
                  <div
                    key={category}
                    className="sticky top-0 bg-muted text-muted-foreground text-xs pt-2 text-nowrap overflow-hidden text-ellipsis max-w-full"
                  >
                    {category}
                  </div>
                  {Object.values(items)
                    .filter((p) =>
                      p.name.toLowerCase().includes(_value.toLowerCase()),
                    )
                    .map((spell) => (
                      <Button
                        key={spell.name}
                        variant="ghost"
                        className="p-1 flex justify-start items-center"
                        onClick={(e) => {
                          e.preventDefault();
                          onChange(spell.name, {
                            url: `https://oldschool.runescape.wiki/w/Slayer_Rewards#${category}`,
                            imgUrl: spell.imgUrl,
                          });
                        }}
                      >
                        <img
                          src={spell.imgUrl}
                          width={32}
                          height={32}
                          className="size-6 aspect-square object-contain"
                        />
                        <span className="text-wrap text-start leading-none font-normal text-sm">
                          {spell.name}
                        </span>
                      </Button>
                    ))}
                </React.Fragment>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
