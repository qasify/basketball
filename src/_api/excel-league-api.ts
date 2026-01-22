"use server";

import fs from "fs";
import path from "path";
import type { League as ApiLeague, Team as ApiTeam, Player as ApiPlayer, PlayerSeason } from "./basketball-api";

// Re-export core types so existing components can keep using `League`, `Team`, `Player`
export type League = ApiLeague;
export type Team = ApiTeam;
export type Player = ApiPlayer;

type InternalTeam = ApiTeam & {
  leagueId: number;
};

type InternalPlayer = ApiPlayer & {
  leagueId: number;
  teamId: number;
  season?: string;
  // Statistical properties from Excel data
  gamesPlayed?: number;
  gamesStarted?: number;
  minutesPerGame?: number;
  pointsPerGame?: number;
  reboundsPerGame?: number;
  assistsPerGame?: number;
  stealsPerGame?: number;
  blocksPerGame?: number;
  turnoversPerGame?: number;
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
};

let leaguesCache: League[] | null = null;
let teamsCache: InternalTeam[] | null = null;
let playersCache: InternalPlayer[] | null = null;

const ensureLoaded = async () => {
  if (leaguesCache && teamsCache && playersCache) return;

  try {
    // Load pre-processed JSON data from file system
    const dataDir = path.join(process.cwd(), 'public', 'data');

    const leaguesPath = path.join(dataDir, 'leagues.json');
    const teamsPath = path.join(dataDir, 'teams.json');
    const playersPath = path.join(dataDir, 'players.json');

    const leaguesData = fs.readFileSync(leaguesPath, 'utf-8');
    const teamsData = fs.readFileSync(teamsPath, 'utf-8');
    const playersData = fs.readFileSync(playersPath, 'utf-8');

    leaguesCache = JSON.parse(leaguesData);
    teamsCache = JSON.parse(teamsData);
    playersCache = JSON.parse(playersData);
  } catch (error) {
    console.error('Error loading pre-processed data:', error);
    throw error;
  }
};

export const getLeagues = async (): Promise<League[]> => {
  await ensureLoaded();
  return leaguesCache ?? [];
};

export const getTeams = async (leagueId: number): Promise<Team[]> => {
  await ensureLoaded();
  return (teamsCache ?? [])
    .filter((team) => team.leagueId === leagueId)
    .map((team) => {
      // Strip internal leagueId before exposing to callers
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { leagueId: _ignored, ...rest } = team;
      return rest as Team;
    });
};

export const getPlayers = async (
  teamId: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _season?: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _teamName?: string
): Promise<Player[]> => {
  await ensureLoaded();

  // Group players by unique identifier (name + country only, not age since it changes)
  const playerMap = new Map<string, Player & { seasons: PlayerSeason[]; season?: string }>();

  (playersCache ?? [])
    .filter((player) => player.teamId === teamId)
    .forEach((player) => {
      // Create unique key for player identification (name + country)
      const playerKey = `${player.name}-${player.country || 'unknown'}`;

      if (!playerMap.has(playerKey)) {
        // Create new unique player - collect best available data across seasons
        const { leagueId: _ignoredLeague, teamId: _ignoredTeam, ...playerData } = player;
        playerMap.set(playerKey, {
          ...playerData,
          seasons: []
        });
      }

      // Update player with most complete information from all seasons
      const uniquePlayer = playerMap.get(playerKey)!;

      // Update basic info - prefer non-null values
      if (player.position && !uniquePlayer.position) uniquePlayer.position = player.position;
      if (player.height && !uniquePlayer.height) uniquePlayer.height = player.height;
      if (player.weight && (!uniquePlayer.weight || uniquePlayer.weight === '')) uniquePlayer.weight = player.weight;
      if (player.number && !uniquePlayer.number) uniquePlayer.number = player.number;
      if (player.salary && !uniquePlayer.salary) uniquePlayer.salary = player.salary;
      if (player.contract && !uniquePlayer.contract) uniquePlayer.contract = player.contract;

      // Use the most recent age (highest season year)
      const currentSeasonYear = player.season ? parseInt(player.season.split('-')[0]) || 0 : 0;
      const existingSeasonYear = uniquePlayer.season ? parseInt(uniquePlayer.season.split('-')[0]) || 0 : 0;
      if (currentSeasonYear > existingSeasonYear && player.age) {
        uniquePlayer.age = player.age;
        uniquePlayer.season = player.season; // Keep track of latest season
      }

      // Add season data to the player
      const league = leaguesCache?.find(l => l.id === player.leagueId);
      const seasonData: PlayerSeason = {
        id: player.id, // Use original player ID as season ID for now
        season: player.season || '',
        team: player.team || '',
        league: league?.name || '',
        gamesPlayed: player.gamesPlayed,
        gamesStarted: player.gamesStarted,
        minutesPerGame: player.minutesPerGame,
        pointsPerGame: player.pointsPerGame,
        reboundsPerGame: player.reboundsPerGame,
        assistsPerGame: player.assistsPerGame,
        stealsPerGame: player.stealsPerGame,
        blocksPerGame: player.blocksPerGame,
        turnoversPerGame: player.turnoversPerGame,
        tsPercent: player.tsPercent,
        efgPercent: player.efgPercent,
        orbPercent: player.orbPercent,
        drbPercent: player.drbPercent,
        trbPercent: player.trbPercent,
        astPercent: player.astPercent,
        tovPercent: player.tovPercent,
        stlPercent: player.stlPercent,
        blkPercent: player.blkPercent,
        usgPercent: player.usgPercent,
        offensiveRating: player.offensiveRating,
        defensiveRating: player.defensiveRating,
        playerEfficiencyRating: player.playerEfficiencyRating,
      };

      uniquePlayer.seasons.push(seasonData);
    });

  return Array.from(playerMap.values());
};


