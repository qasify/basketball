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
  realgmId?: number; // from Player ID Link, e.g. 121851
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

const ALL_LEAGUES_ID = 0;

export const getLeagues = async (): Promise<League[]> => {
  await ensureLoaded();
  const list = leaguesCache ?? [];
  const allLeagues: League = {
    id: ALL_LEAGUES_ID,
    name: 'All Leagues',
    type: 'League',
    logo: '',
    country: { id: 0, name: '', code: '', flag: '' },
    seasons: [],
  };
  return [allLeagues, ...list];
};

export const getTeams = async (leagueId: number): Promise<Team[]> => {
  await ensureLoaded();
  const list = teamsCache ?? [];
  const filtered = leagueId === ALL_LEAGUES_ID
    ? list
    : list.filter((team) => team.leagueId === leagueId);
  return filtered.map((team) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { leagueId: _ignored, ...rest } = team;
    return rest as Team;
  });
};

function mergePlayerRows(rows: InternalPlayer[]): Player[] {
  const playerMap = new Map<string, Player & { seasons: PlayerSeason[]; season?: string }>();

  for (const player of rows) {
    const playerKey =
      player.realgmId != null
        ? `realgm-${player.realgmId}`
        : `${player.name}-${player.country || 'unknown'}`;

    if (!playerMap.has(playerKey)) {
      const { leagueId: _l, teamId: _t, realgmId: _rg, ...rest } = player;
      playerMap.set(playerKey, {
        ...rest,
        id: player.realgmId ?? player.id,
        seasons: [],
      });
    }

    const u = playerMap.get(playerKey)!;
    if (player.position && !u.position) u.position = player.position;
    if (player.height && !u.height) u.height = player.height;
    if (player.weight && (!u.weight || u.weight === '')) u.weight = player.weight;
    if (player.number && !u.number) u.number = player.number;
    if (player.salary && !u.salary) u.salary = player.salary;
    if (player.contract && !u.contract) u.contract = player.contract;

    const currYear = player.season ? parseInt(String(player.season).split('-')[0], 10) || 0 : 0;
    const existYear = u.season ? parseInt(String(u.season).split('-')[0], 10) || 0 : 0;
    if (currYear > existYear && player.age != null) {
      u.age = player.age;
      u.season = player.season;
    }

    const league = leaguesCache?.find((l) => l.id === player.leagueId);
    u.seasons!.push({
      id: player.id,
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
    });
  }

  return Array.from(playerMap.values());
}

export const getPlayersByTeamIds = async (teamIds: number[]): Promise<Player[]> => {
  await ensureLoaded();
  if (teamIds.length === 0) return [];
  const set = new Set(teamIds);
  const rows = (playersCache ?? []).filter((p) => set.has(p.teamId));
  return mergePlayerRows(rows);
};

export const getPlayers = async (
  teamId: number,
  _season?: string,
  _teamName?: string
): Promise<Player[]> => {
  return getPlayersByTeamIds([teamId]);
};

export const getPlayerById = async (id: number): Promise<Player> => {
  await ensureLoaded();
  const row = (playersCache ?? []).find(
    (p) => p.realgmId === id || p.id === id
  );
  if (!row) throw new Error(`Player with ID ${id} not found`);
  const rows =
    row.realgmId != null
      ? (playersCache ?? []).filter((p) => p.realgmId === row.realgmId)
      : (playersCache ?? []).filter(
          (p) =>
            p.name === row.name &&
            (p.country || 'unknown') === (row.country || 'unknown')
        );
  const merged = mergePlayerRows(rows);
  if (merged.length === 0) throw new Error(`Player with ID ${id} not found`);
  merged[0].id = id;
  return merged[0];
};


