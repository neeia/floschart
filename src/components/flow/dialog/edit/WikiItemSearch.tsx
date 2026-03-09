import { Button } from "@/components/ui/button";
import { ItemSearchResult } from "@/types/external/itemSearchResult";
import searchWikiForItem from "@/util/api/searchWikiForItem";
import { CornerDownRight } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  value: string;
  disabled?: boolean;
  category?: string;
  onClick: (results: ItemSearchResult) => void;
}
export default function WikiItemSearch(props: Props) {
  const { value, disabled, category, onClick } = props;
  const [searchResult, setSearchResult] = useState<ItemSearchResult[] | null>(
    null,
  );
  useEffect(() => {
    if (searchResult != null) setSearchResult(null);
  }, [value]);

  useEffect(() => {
    if (searchResult != null && searchResult.length > 0)
      document.getElementById("wiki-item-result-0")?.focus();
  }, [searchResult]);

  return (
    <div className="">
      {searchResult == null ? (
        <Button
          className="m-0 py-1 px-1! h-min w-full justify-start items-start bg-muted rounded-none"
          disabled={disabled}
          onClick={(e) => {
            e.preventDefault();
            searchWikiForItem(value.trim(), category).then(setSearchResult);
          }}
        >
          <CornerDownRight />
          <span className="text-wrap break-all text-start leading-none pt-0.5">
            Search: "{value}"
          </span>
        </Button>
      ) : searchResult.length === 0 ? (
        <div className="px-2 pt-2">No results.</div>
      ) : (
        <>
          <div className="bg-muted/95 px-1 gap-1 text-muted-foreground flex items-center justify-start text-xs w-full">
            <CornerDownRight size={12} />
            Search Results
          </div>
          {searchResult.map((r, i) => (
            <Button
              id={`wiki-item-result-${i}`}
              key={r.title}
              className="m-0 py-0 px-2 h-min w-full justify-start bg-muted focus:bg-primary rounded-none"
              onClick={(e) => {
                e.preventDefault();
                onClick(r);
              }}
            >
              {r.title}
            </Button>
          ))}
        </>
      )}
    </div>
  );
}
