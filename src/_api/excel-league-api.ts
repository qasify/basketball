"use server";

import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

import type { League as ApiLeague, Team as ApiTeam, Player as ApiPlayer } from "./basketball-api";

// Re-export core types so existing components can keep using `League`, `Team`, `Player`
export type League = ApiLeague;
export type Team = ApiTeam;
export type Player = ApiPlayer;

type InternalLeague = ApiLeague & { _fileName: string };

type InternalTeam = ApiTeam & {
  leagueId: number;
};

type InternalPlayer = ApiPlayer & {
  leagueId: number;
  teamId: number;
};

const DATA_DIR = path.join(
  process.cwd(),
  "src",
  "data",
  "Basketballs_leagues_files"
);

let leaguesCache: InternalLeague[] | null = null;
let teamsCache: InternalTeam[] | null = null;
let playersCache: InternalPlayer[] | null = null;

const normalizeHeader = (header: string) =>
  header.toLowerCase().replace(/[^a-z0-9]/g, "");

const findKey = (keys: string[], candidates: string[]): string | undefined => {
  const normalizedKeys = keys.map((key) => ({
    original: key,
    norm: normalizeHeader(key),
  }));
  const candidateNorms = candidates.map(normalizeHeader);

  const match = normalizedKeys.find((k) => candidateNorms.includes(k.norm));
  return match?.original;
};

const ensureLoaded = async () => {
  if (leaguesCache && teamsCache && playersCache) return;

  const files = fs
    .readdirSync(DATA_DIR)
    .filter(
      (file) =>
        file.toLowerCase().endsWith(".xlsx") && !file.startsWith("~$")
    );

  const leagues: InternalLeague[] = [];
  const teams: InternalTeam[] = [];
  const players: InternalPlayer[] = [];

  const leagueMap = new Map<string, number>();
  const teamMap = new Map<string, number>();

  let nextLeagueId = 1;
  let nextTeamId = 1;
  let nextPlayerId = 1;

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    
    let workbook;
    try {
      // Read file as buffer first, then parse - this can help with file access issues
      const fileBuffer = fs.readFileSync(filePath);
      workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    } catch (error) {
      console.error(`Error reading file ${file}:`, error);
      throw error; // Re-throw to fail the entire operation if any file can't be read
    }

    const preferredSheets = ["Advanced Table", "Advanced", "AdvancedTable"];
    const sheetName =
      preferredSheets.find((name) => workbook.SheetNames.includes(name)) ??
      workbook.SheetNames[0];

    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;

    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: null,
    });

    if (!rows.length) continue;

    const headers = Object.keys(rows[0]);

    const playerNameKey = findKey(headers, ["Player", "Player Name", "Name"]);
    const positionKey = findKey(headers, ["Pos", "Position"]);
    const ageKey = findKey(headers, ["Age"]);
  const seasonKey = findKey(headers, ["Season", "Year"]);
    const teamKey = findKey(headers, ["Team", "Club"]);
    const leagueKey = findKey(headers, ["League", "Competition"]);
    const countryKey = findKey(headers, ["Country", "Nationality", "Nat"]);
  const gpKey = findKey(headers, ["GP", "Games Played"]);
  const gsKey = findKey(headers, ["GS", "Games Started"]);
  const mpKey = findKey(headers, ["MP", "MIN", "Minutes", "Minutes/G"]);
  const ptsKey = findKey(headers, ["PTS", "PTS/G", "PPG"]);
  const rebKey = findKey(headers, ["TRB", "REB", "REB/G", "Reb"]);
  const astKey = findKey(headers, ["AST", "AST/G"]);
  const stlKey = findKey(headers, ["STL", "STL/G"]);
  const blkKey = findKey(headers, ["BLK", "BLK/G"]);
  const tovKey = findKey(headers, ["TOV", "TOV/G", "TO"]);
  const tsKey = findKey(headers, ["TS%", "TS"]);
  const efgKey = findKey(headers, ["eFG%", "eFG"]);
  const orbKey = findKey(headers, ["ORB%", "ORB"]);
  const drbKey = findKey(headers, ["DRB%", "DRB"]);
  const trbKey = findKey(headers, ["TRB%", "TRB%"]);
  const astPctKey = findKey(headers, ["AST%", "AST%"]);
  const tovPctKey = findKey(headers, ["TOV%", "TOV%"]);
  const stlPctKey = findKey(headers, ["STL%", "STL%"]);
  const blkPctKey = findKey(headers, ["BLK%", "BLK%"]);
  const usgKey = findKey(headers, ["USG%", "USG"]);
  const ortgKey = findKey(headers, ["ORtg"]);
  const drtgKey = findKey(headers, ["DRtg"]);
  const perKey = findKey(headers, ["PER"]);

    const baseLeagueName =
      rows[0][leagueKey ?? ""] ??
      path.basename(file, path.extname(file)); // fallback to filename

    const leagueName = String(baseLeagueName || "").trim() || "Unknown League";

    let leagueId: number;
    if (leagueMap.has(leagueName)) {
      leagueId = leagueMap.get(leagueName)!;
    } else {
      leagueId = nextLeagueId++;
      leagueMap.set(leagueName, leagueId);

      const seasonsSet = new Set<number>();
      if (seasonKey) {
        rows.forEach((row) => {
          const seasonVal = row[seasonKey];
          if (seasonVal != null && seasonVal !== "") {
            const parsed = parseInt(String(seasonVal), 10);
            if (!Number.isNaN(parsed)) seasonsSet.add(parsed);
          }
        });
      }

      const seasonsArray = Array.from(seasonsSet).map((season) => ({
        season,
        start: "",
        end: "",
      }));

      leagues.push({
        id: leagueId,
        name: leagueName,
        type: "League",
        logo: "",
        country: {
          id: 0,
          name: "",
          code: "",
          flag: "",
        },
        seasons: seasonsArray.length ? seasonsArray : [],
        _fileName: file,
      });
    }

    for (const row of rows) {
      const rawName = playerNameKey ? row[playerNameKey] : null;
      if (!rawName) continue;

      const name = String(rawName).trim();
      if (!name) continue;

      const teamName = teamKey ? String(row[teamKey] ?? "").trim() : "";
      const country = countryKey ? String(row[countryKey] ?? "").trim() : "";
      const position = positionKey
        ? String(row[positionKey] ?? "").trim()
        : undefined;
      const ageRaw = ageKey ? row[ageKey] : null;
      const age =
        ageRaw != null && ageRaw !== "" && !Number.isNaN(Number(ageRaw))
          ? Number(ageRaw)
          : undefined;

    const seasonVal = seasonKey ? row[seasonKey] : null;
    const season =
      seasonVal != null && seasonVal !== "" ? String(seasonVal) : "";

    const num = (key?: string): number | undefined => {
      if (!key) return undefined;
      const raw = row[key];
      if (raw == null || raw === "") return undefined;
      const n = Number(raw);
      return Number.isNaN(n) ? undefined : n;
    };

      let teamId: number;
      const teamKeyMap = `${leagueId}::${teamName || "Unknown Team"}`;

      if (teamMap.has(teamKeyMap)) {
        teamId = teamMap.get(teamKeyMap)!;
      } else {
        teamId = nextTeamId++;
        teamMap.set(teamKeyMap, teamId);

        teams.push({
          id: teamId,
          name: teamName || "Unknown Team",
          logo: "",
          national: false,
          season: season || "",
          country: {
            id: 0,
            name: country || "",
            code: "",
            flag: "",
          },
          leagueId,
        });
      }

      const player: InternalPlayer = {
        id: nextPlayerId++,
        name,
        position,
        age,
        country: country || undefined,
        team: teamName || undefined,
        number: undefined,
        photo: undefined,
        isInWatchlist: false,
        isInTeam: false,
        priority: undefined,
        pinned: undefined,
        salary: undefined,
        contract: undefined,
        image: undefined,
      height: undefined,
      weight: "",
      season,
      gamesPlayed: num(gpKey),
      gamesStarted: num(gsKey),
      minutesPerGame: num(mpKey),
      pointsPerGame: num(ptsKey),
      reboundsPerGame: num(rebKey),
      assistsPerGame: num(astKey),
      stealsPerGame: num(stlKey),
      blocksPerGame: num(blkKey),
      turnoversPerGame: num(tovKey),
      tsPercent: num(tsKey),
      efgPercent: num(efgKey),
      orbPercent: num(orbKey),
      drbPercent: num(drbKey),
      trbPercent: num(trbKey),
      astPercent: num(astPctKey),
      tovPercent: num(tovPctKey),
      stlPercent: num(stlPctKey),
      blkPercent: num(blkPctKey),
      usgPercent: num(usgKey),
      offensiveRating: num(ortgKey),
      defensiveRating: num(drtgKey),
      playerEfficiencyRating: num(perKey),
        leagueId,
        teamId,
      };

      players.push(player);
    }
  }

  leaguesCache = leagues;
  teamsCache = teams;
  playersCache = players;
};

export const getLeagues = async (): Promise<League[]> => {
  await ensureLoaded();
  return (leaguesCache ?? []).map((league) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _fileName, ...rest } = league;
    return rest as League;
  });
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
  return (playersCache ?? [])
    .filter((player) => player.teamId === teamId)
    .map((player) => {
      // Strip internal linkage fields before exposing to callers
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { leagueId: _ignoredLeague, teamId: _ignoredTeam, ...rest } =
        player;
      return rest as Player;
    });
};


