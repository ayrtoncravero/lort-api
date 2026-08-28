export interface QuoteCharacterSummary {
  id: number;
  name: string;
}

export interface QuoteMovieSummary {
  id: number;
  name: string;
}

export interface QuoteWithRelations {
  id: number;
  dialog: string;
  character: QuoteCharacterSummary | null;
  movie: QuoteMovieSummary | null;
}
