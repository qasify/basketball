export type TeamRanking = {
  position: string;
  team: string;
  matches: number;
  points: number;
  rating: number;
  flagUrl?: string;
};

export type Ranking = {
  id: string;
  value: string;
}