// Free Agent Tracker - Type definitions

export interface PlayerStats {
  season: string;
  team: string;
  league: string;
  gp: number | null;
  min: number | null;
  pts: number | null;
  trb: number | null;
  ast: number | null;
  stl: number | null;
  blk: number | null;
  tov: number | null;
  fgp: number | null;
  tpp: number | null;
  ftp: number | null;
  per: number | null;
  ts_pct: number | null;
  usg: number | null;
  realgm_url: string;
}

export interface FreeAgent {
  name: string;
  position: string;
  height: number;
  born: number;
  age: number;
  nationality: string;
  lastTeam: string;
  confidence: "HIGH" | "MEDIUM";
  source: string;
  stats: PlayerStats | null;
}

export interface TeamOpening {
  team: string;
  league: string;
  released: number;
  signed: number;
  openSpots: number;
  releasedPlayers: string;
}

export interface FreeAgentData {
  metadata: {
    generated: string;
    totalFreeAgents: number;
    statsMatched: number;
    statsSource: string;
  };
  freeAgents: FreeAgent[];
  teamOpenings: TeamOpening[];
}
