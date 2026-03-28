interface CategoryMember {
  pageid: number;
  ns: number;
  title: string;
}

export default interface CategoryMemberResults {
  batchcomplete: unknown;
  limits: {
    categorymembers: unknown;
  };
  query: {
    pages: Record<string, CategoryMember>;
  };
}
