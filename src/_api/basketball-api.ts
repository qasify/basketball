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

export interface PlayerSeason {
  id: number; // Unique ID for this player-season combination
  season: string;
  team: string;
  league: string;
  // Advanced / per-game stats (primarily populated from Excel data)
  gamesPlayed?: number; // GP
  gamesStarted?: number; // GS
  minutesPerGame?: number;
  pointsPerGame?: number;
  reboundsPerGame?: number;
  assistsPerGame?: number;
  stealsPerGame?: number;
  blocksPerGame?: number;
  turnoversPerGame?: number;
  tsPercent?: number; // TS%
  efgPercent?: number; // eFG%
  orbPercent?: number; // ORB%
  drbPercent?: number; // DRB%
  trbPercent?: number; // TRB%
  astPercent?: number; // AST%
  tovPercent?: number; // TOV%
  stlPercent?: number; // STL%
  blkPercent?: number; // BLK%
  usgPercent?: number; // USG%
  offensiveRating?: number; // ORtg
  defensiveRating?: number; // DRtg
  playerEfficiencyRating?: number; // PER
}

export interface Player {
  id: number;
  name: string;
  number?: string;
  position?: string;
  age?: number;
  country?: string;
  photo?: string;
  isInWatchlist?: boolean;
  isInTeam?: boolean;
  priority?: Priority;
  pinned?: boolean;
  salary?: string;
  contract?: string;
  image?: string;
  height?: string;
  weight?: string;
  team?: string;
  seasons?: PlayerSeason[]; // All seasons for this player
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
  // Since we're now using grouped players from excel data,
  // we need to search through all teams to find the player
  // This is a temporary solution - in a real app, you'd want to index players by ID
  try {
    const { getLeagues, getTeams, getPlayers } = await import("./excel-league-api");

    const leagues = await getLeagues();

    for (const league of leagues) {
      const teams = await getTeams(league.id);

      for (const team of teams) {
        const players = await getPlayers(team.id);

        const foundPlayer = players.find(player => player.id === playerId);
        if (foundPlayer) {
          return foundPlayer;
        }
      }
    }

    throw new Error(`Player with ID ${playerId} not found`);
  } catch (error) {
    console.error("Error fetching player:", error);
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
