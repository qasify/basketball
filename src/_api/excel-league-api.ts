"use server";

import fs from "fs";
import path from "path";
import type {
  League as ApiLeague,
  Team as ApiTeam,
  Player as ApiPlayer,
  PlayerSeason,
} from "./basketball-api";
import type { CatalogPlayerRow, CatalogTeamRow } from "@/types/excel-catalog-rows";
import {
  getLeaguesFromFirestore,
  getTeamsFromFirestore,
  getPlayerRowsByTeamIdsFromFirestore,
  getPlayerRowsPageByTeamIdsFromFirestore,
  getPlayerRowsForIdFromFirestore,
} from "@/server/catalog-firestore-queries";

export type League = ApiLeague;
export type Team = ApiTeam;
export type Player = ApiPlayer;

let leaguesCache: League[] | null = null;
let teamsCache: CatalogTeamRow[] | null = null;
let playersCache: CatalogPlayerRow[] | null = null;

const useFirestoreCatalog = () =>
  process.env.USE_FIRESTORE_CATALOG === "true" ||
  process.env.USE_FIRESTORE_CATALOG === "1";

function loadCatalogFromJsonFilesSync(): void {
  const dataDir = path.join(process.cwd(), "public", "data");

  const leaguesPath = path.join(dataDir, "leagues.json");
  const teamsPath = path.join(dataDir, "teams.json");
  const playersPath = path.join(dataDir, "players.json");

  const leaguesData = fs.readFileSync(leaguesPath, "utf-8");
  const teamsData = fs.readFileSync(teamsPath, "utf-8");
  const playersData = fs.readFileSync(playersPath, "utf-8");

  leaguesCache = JSON.parse(leaguesData);
  teamsCache = JSON.parse(teamsData);
  playersCache = JSON.parse(playersData);
}

/** Load full JSON into memory (JSON catalog mode only). */
function ensureJsonLoaded(): void {
  if (leaguesCache && teamsCache && playersCache) return;
  loadCatalogFromJsonFilesSync();
}

function leagueNameMapFromCache(): Map<number, string> {
  return new Map((leaguesCache ?? []).map((l) => [l.id, l.name] as const));
}

const ALL_LEAGUES_ID = 0;

export const getLeagues = async (): Promise<League[]> => {
  if (useFirestoreCatalog()) {
    const list = await getLeaguesFromFirestore();
    const allLeagues: League = {
      id: ALL_LEAGUES_ID,
      name: "All Leagues",
      type: "League",
      logo: "",
      country: { id: 0, name: "", code: "", flag: "" },
      seasons: [],
    };
    return [allLeagues, ...list];
  }

  ensureJsonLoaded();
  const list = leaguesCache ?? [];
  const allLeagues: League = {
    id: ALL_LEAGUES_ID,
    name: "All Leagues",
    type: "League",
    logo: "",
    country: { id: 0, name: "", code: "", flag: "" },
    seasons: [],
  };
  return [allLeagues, ...list];
};

export const getTeams = async (leagueId: number): Promise<Team[]> => {
  if (useFirestoreCatalog()) {
    const list = await getTeamsFromFirestore(leagueId);
    return list.map((team) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { leagueId: _ignored, ...rest } = team;
      return rest as Team;
    });
  }

  ensureJsonLoaded();
  const list = teamsCache ?? [];
  const filtered =
    leagueId === ALL_LEAGUES_ID
      ? list
      : list.filter((team) => team.leagueId === leagueId);
  return filtered.map((team) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { leagueId: _ignored, ...rest } = team;
    return rest as Team;
  });
};

function mergePlayerRows(
  rows: CatalogPlayerRow[],
  leagueIdToName: Map<number, string>
): Player[] {
  const playerMap = new Map<
    string,
    Player & { seasons: PlayerSeason[]; season?: string }
  >();

  for (const player of rows) {
    const playerKey =
      player.realgmId != null
        ? `realgm-${player.realgmId}`
        : `${player.name}-${player.country || "unknown"}`;

    if (!playerMap.has(playerKey)) {
      const { leagueId: _l, teamId: _t, realgmId: _rg, ...rest } = player;
      playerMap.set(playerKey, {
        ...rest,
        id: player.realgmId ?? player.id,
        realgmId: player.realgmId,
        seasons: [],
      });
    }

    const u = playerMap.get(playerKey)!;
    if (player.realgmId != null && u.realgmId == null) {
      u.realgmId = player.realgmId;
    }
    if (player.position && !u.position) u.position = player.position;
    if (player.height && !u.height) u.height = player.height;
    if (player.weight && (!u.weight || u.weight === "")) u.weight = player.weight;
    if (player.number && !u.number) u.number = player.number;
    if (player.salary && !u.salary) u.salary = player.salary;
    if (player.contract && !u.contract) u.contract = player.contract;
    if (player.agency && !u.agency) u.agency = player.agency;

    const currYear = player.season
      ? parseInt(String(player.season).split("-")[0], 10) || 0
      : 0;
    const existYear = u.season
      ? parseInt(String(u.season).split("-")[0], 10) || 0
      : 0;
    if (currYear > existYear && player.age != null) {
      u.age = player.age;
      u.season = player.season;
    }

    const league = leagueIdToName.get(player.leagueId);
    u.seasons!.push({
      id: player.id,
      season: player.season || "",
      team: player.team || "",
      league: league ?? "",
      mainSearchedLeague: player.mainSearchedLeague,
      age: player.seasonAge ?? player.age,
      gamesPlayed: player.gamesPlayed,
      gamesStarted: player.gamesStarted,
      minutesPerGame: player.minutesPerGame,
      pointsPerGame: player.pointsPerGame,
      reboundsPerGame: player.reboundsPerGame,
      assistsPerGame: player.assistsPerGame,
      stealsPerGame: player.stealsPerGame,
      blocksPerGame: player.blocksPerGame,
      turnoversPerGame: player.turnoversPerGame,
      personalFouls: player.personalFouls,
      fieldGoalsMade: player.fgm,
      fieldGoalsAttempted: player.fga,
      fieldGoalPercent: player.fgPercent,
      threePointersMade: player.threePm,
      threePointersAttempted: player.threePa,
      threePointPercent: player.threePPercent,
      freeThrowsMade: player.ftm,
      freeThrowsAttempted: player.fta,
      freeThrowPercent: player.ftPercent,
      offensiveRebounds: player.offReb,
      defensiveRebounds: player.defReb,
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
  if (teamIds.length === 0) return [];

  if (useFirestoreCatalog()) {
    const [leagues, rows] = await Promise.all([
      getLeaguesFromFirestore(),
      getPlayerRowsByTeamIdsFromFirestore(teamIds),
    ]);
    const leagueIdToName = new Map(leagues.map((l) => [l.id, l.name] as const));
    return mergePlayerRows(rows, leagueIdToName);
  }

  ensureJsonLoaded();
  const set = new Set(teamIds);
  const rows = (playersCache ?? []).filter((p) => set.has(p.teamId));
  return mergePlayerRows(rows, leagueNameMapFromCache());
};

/** Firestore: cursor-paged raw rows → merged players (reduces reads vs loading all rows at once). JSON catalog: returns full list in one page. */
export const getPlayersPageByTeamIds = async (
  teamIds: number[],
  rawLimit: number,
  cursor: string | null
): Promise<{ players: Player[]; nextCursor: string | null }> => {
  if (teamIds.length === 0) return { players: [], nextCursor: null };

  if (useFirestoreCatalog()) {
    const [leagues, page] = await Promise.all([
      getLeaguesFromFirestore(),
      getPlayerRowsPageByTeamIdsFromFirestore(teamIds, rawLimit, cursor),
    ]);
    const leagueIdToName = new Map(leagues.map((l) => [l.id, l.name] as const));
    const merged = mergePlayerRows(page.rows, leagueIdToName);
    merged.sort((a, b) => a.name.localeCompare(b.name));
    return { players: merged, nextCursor: page.nextCursor };
  }

  const all = await getPlayersByTeamIds(teamIds);
  return {
    players: all.sort((a, b) => a.name.localeCompare(b.name)),
    nextCursor: null,
  };
};

export const getPlayers = async (
  teamId: number,
  _season?: string,
  _teamName?: string
): Promise<Player[]> => {
  return getPlayersByTeamIds([teamId]);
};

export const getPlayerById = async (id: number): Promise<Player> => {
  if (useFirestoreCatalog()) {
    const [leagues, rows] = await Promise.all([
      getLeaguesFromFirestore(),
      getPlayerRowsForIdFromFirestore(id),
    ]);
    const leagueIdToName = new Map(leagues.map((l) => [l.id, l.name] as const));
    const merged = mergePlayerRows(rows, leagueIdToName);
    if (merged.length === 0) throw new Error(`Player with ID ${id} not found`);
    merged[0].id = id;
    return merged[0];
  }

  ensureJsonLoaded();
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
            (p.country || "unknown") === (row.country || "unknown")
        );
  const merged = mergePlayerRows(rows, leagueNameMapFromCache());
  if (merged.length === 0) throw new Error(`Player with ID ${id} not found`);
  merged[0].id = id;
  return merged[0];
};
