export type WikiPopover = {
  batchComplete: boolean;
  query: {
    normalized: unknown;
    pages: [
      {
        pageid: number;
        title: string;
        extract: string; // description of the page
        fullurl: string;
        thumbnail?: { source: string; width: number; height: number };
      },
    ];
  };
};
