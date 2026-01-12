"use server";

import fs from "fs";
import path from "path";
import type { League as ApiLeague, Team as ApiTeam, Player as ApiPlayer } from "./basketball-api";

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


