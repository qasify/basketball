"use server";

import { Priority } from "@/types/Player";
import { api } from "./api";
import { teamRosterDB, watchListDB } from "./firebase-api";
import { LEAGUES_IDS, LEAGUES } from "@/utils/constants/basketballApiLeagues";

const CURRENT_SEASON = new Date(Date.now()).getFullYear().toString();

export interface League {
  id: number;
  name: string;
  type: string;
  logo: string;
  country: {
    id: number;
    name: string;
    code: string;
    flag: string;
  };
  seasons: {
    season: number;
    start: string;
    end: string;
  }[];
}

export interface Team {
  id: number;
  name: string;
  logo: string;
  national: boolean;
  season: string;
  country: {
    id: number;
    name: string;
    code: string;
    flag: string;
  };
}

export interface Player {
  id: number;
  name: string;
  number?: string;
  position?: string;
  age?: number;
  country?: string;
  team?: string;
  photo?: string;
  isInWatchlist?: boolean;
  isInTeam?: boolean;
  priority?: Priority;
  pinned?: boolean;
  salary?: string;
  contract?: string;
  image?: string;
  height?: string;
  weight: string;
}

export const getLeagues = async (): Promise<League[]> => {
  try {
    const leagues = await api.get<League[]>("/leagues");
    return leagues
      .filter((league) => LEAGUES_IDS.includes(league.id))
      .map((league) => ({
        ...league,
        name: LEAGUES[league.id].name
          ? LEAGUES[league.id].name ?? ""
          : league.name,
      }))
      .sort((league1, league2) => league1.name.localeCompare(league2.name));
  } catch (error) {
    console.error("Error fetching leagues:", error);
    throw error;
  }
};

export const getTeams = async (
  leagueId: number,
  season: string = CURRENT_SEASON
): Promise<Team[]> => {
  try {
    const resp = await api.get<Team[]>("/teams", {
      params: {
        league: leagueId.toString(),
        season,
      },
    });
    resp.forEach((team) => {
      team.season = season;
    });
    return resp;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};

export const getPlayers = async (
  teamId: number,
  season: string = CURRENT_SEASON,
  teamName?: string
): Promise<Player[]> => {
  try {
    const watchlist = await watchListDB.getAll();
    const teamRoster = await teamRosterDB.getAll();

    const players = await api.get<Player[]>("/players", {
      params: {
        team: teamId.toString(),
        season,
      },
    });
    players.forEach((player) => {
      player.team = teamName;
      player.isInWatchlist = watchlist.find((p) => p.id === player.id)
        ? true
        : false;
      player.isInTeam = teamRoster.find((p) => p.id === player.id)
        ? true
        : false;
    });
    return players;
  } catch (error) {
    console.error("Error fetching players:", error);
    throw error;
  }
};

export const getPlayer = async (playerId: number): Promise<Player> => {
  try {
    const player = await api.get<Player[]>("/players", {
      params: {
        id: playerId.toString(),
      },
    });
    return player[0];
  } catch (error) {
    console.error("Error fetching players:", error);
    throw error;
  }
};


export const searchPlayer = async (name: string): Promise<Player[]> => {
  try {
    const players = await api.get<Player[]>("/players", {
      params: {
        search: name,
      },
    });
    return players;
  } catch (error) {
    console.error("Error fetching players:", error);
    throw error;
  }
};
