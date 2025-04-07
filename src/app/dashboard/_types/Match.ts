export type Team = { name: string; score: number, logo?: string };

export type Match = {
  day: string;
  dateTime: string;
  teams: Team[];
};
