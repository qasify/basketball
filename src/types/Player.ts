export type Priority = 'High' | 'Medium' | 'Low';

export interface PlayerOLD {
  id: number;
  name: string;
  position: string[];
  age: number;
  height: string;
  weight: string;
  league: string;
  salary: number;
  contractYears: number;
  rebounds: number;
  ppg: number;
  assists: number;
  steals: number;
  blocks: number;
  team: string;
  priority?: Priority;
}