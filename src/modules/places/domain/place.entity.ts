export interface Place {
  id: number;
  name: string;
  type: string;
  parentId: number | null;
  wikiUrl: string | null;
}
