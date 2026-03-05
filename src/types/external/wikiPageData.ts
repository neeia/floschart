type Category = {
  sortKey: string;
  hidden?: string; // is "" if the category is hidden from the user
  "*": string;
};

type Link = {
  ns: number;
  exists: string; // is always "" as far as i can tell
  "*": string; // the page title
};

type Section = {
  toclevel: number;
  level: string;
  line: string; // section title
  number: string; // "number" section index
  index: unknown;
  byteoffset: null;
  anchor: string;
  linkAnchor: string;
};

type TocSection = {
  tocLevel: number;
  hLevel: number;
  line: string;
  number: string;
  anchor: string;
};

type PageData = {
  parse: {
    title: string;
    pageid: number;
    revid: number;
    text: {
      // Page contents (HTML) in string format
      "*": string;
    };
    langlinks: unknown[];
    categories: Category[];
    links: Link[];
    templates: Link[];
    images: string[];
    externallinks: unknown[];
    sections: Section[];
    tocdata: {
      sections: TocSection[];
      extensionData: unknown[];
    };
    showtoc: string;
    parsewarnings: unknown[];
    displaytitle: '\u003Cspan class="mw-page-title-main"\u003EQuests/List\u003C/span\u003E';
    iwlinks: unknown[];
    properties: {
      name: string; // one will be "description" with the page description
      "*": string;
    }[];
  };
};

export default PageData;
