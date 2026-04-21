import type { Player, PlayerSeason, Team } from "@/_api/basketball-api";

/** Team row as stored in teams.json / Firestore catalogTeams */
export type CatalogTeamRow = Team & {
  leagueId: number;
};

/** One season row per player as stored in players.json / Firestore catalogPlayerRows */
export type CatalogPlayerRow = Player & {
  leagueId: number;
  teamId: number;
  season?: string;
  realgmId?: number;
  seasonAge?: number;
  mainSearchedLeague?: string;
  gamesPlayed?: number;
  gamesStarted?: number;
  minutesPerGame?: number;
  pointsPerGame?: number;
  reboundsPerGame?: number;
  assistsPerGame?: number;
  stealsPerGame?: number;
  blocksPerGame?: number;
  turnoversPerGame?: number;
  personalFouls?: number;
  fgm?: number;
  fga?: number;
  fgPercent?: number;
  threePm?: number;
  threePa?: number;
  threePPercent?: number;
  ftm?: number;
  fta?: number;
  ftPercent?: number;
  offReb?: number;
  defReb?: number;
  tsPercent?: number;
  efgPercent?: number;
  orbPercent?: number;
  drbPercent?: number;
  trbPercent?: number;
  astPercent?: number;
  tovPercent?: number;
  stlPercent?: number;
  blkPercent?: number;
  usgPercent?: number;
  offensiveRating?: number;
  defensiveRating?: number;
  playerEfficiencyRating?: number;
  seasons?: PlayerSeason[];
};
