export type SearchResult = {
  key: string; // add to https://oldschool.runescape.wiki/w/${key} to get the wiki page
  title: string;
  thumbnail: {
    width: number;
    height: number;
    url: string;
  };
};