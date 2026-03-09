export type ItemSearchResult = {
  ns: number;
  title: string;
  pageid: number;
  size: number;
  wordcount: number;
  snippet: string;
  timestamp: string;
};

export type ItemSearchResponse = {
  batchcomplete: "";
  query: {
    searchinfo: {
      totalhits: number;
    };
    search: ItemSearchResult[];
  };
};
