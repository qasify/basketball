export interface Game {
  id: string;
  date: string;
  time: string;
  homeTeam: {
    name: string;
    abbreviation: string;
    logo: string;
    score?: number;
  };
  awayTeam: {
    name: string;
    abbreviation: string;
    logo: string;
    score?: number;
  };
}
