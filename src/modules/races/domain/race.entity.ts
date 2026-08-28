export interface Race {
  id: number;
  name: string;
  type: string;
  parentId: number | null;
  wikiUrl: string | null;
}
