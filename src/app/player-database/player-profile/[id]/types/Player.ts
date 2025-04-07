export interface Player {
  id: string | number;
  name: string;
  position: string;
  age: number;
  country: string;
  image: string;
  number?: number;
  height?: number;
  weight?: number;
  salary?: number;
  contract?: string;
}

export type PlayerStat = {
  year: string;
  team: string;
  GP: number;
  Min: number;
  PTS: number;
  FGM: number;
  FGA: number;
  "FG%": number;
  "3PM": number;
  "3P%": number;
  FTM: number;
  FTA: number;
  "FT%": number;
  OREB: number;
  DREB: number;
  REB: number;
  AST: number;
  TOV: number;
  STL: number;
};
