"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Input from "@/components/Input";
import { IoIosSearch } from "react-icons/io";
import { Option } from "@/types/Select";
import dynamic from "next/dynamic";
import {
  AccordionContainer,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/Accordion";
import Slider from "@/components/Slider";
// import { HiChevronDoubleDown } from "react-icons/hi2";
// import Button from "@/components/Button";
import PlayersTable from "../PlayersTable";
import PlayersTableSkeleton from "../PlayersTable/PlayersTableSkeleton";
import {
  getLeagues,
  getPlayersByTeamIds,
  getPlayersPageByTeamIds,
  getTeams,
  type League,
  type Player,
  type Team,
} from "@/_api/excel-league-api";
import type { PlayerSeason } from "@/_api/basketball-api";
import { combineMergedPlayerPages } from "@/utils/mergePlayerPageChunks";

const MultiSelect = dynamic(() => import("@/components/Select/MultiSelect"), {
  ssr: false,
});

export const positionFilters: Option[] = [
  { label: "PG", value: "Point Guard" },
  { label: "SG", value: "Shooting Guard" },
  { label: "SF", value: "Small Forward" },
  { label: "PF", value: "Power Forward" },
  { label: "C", value: "Center" },
];

type Filters = {
  countries: Option[];
  leagues: Option[];
  teams: Option[];
  positions: Option[];
  height: { to?: string; from?: string };
  weight: string;
  ageRange: [number, number];
  noOfGamesPlayed: string;
  rebG: string;
  astG: string;
  ptsG: string;
  fgPercentage: string;
  minutesG: { to?: string; from?: string };
  stlG: string;
  blkG: string;
  threePtPercentage: string;
  ftPercentage: string;
  // 🔔 Add more filters here easily as needed
};

const initialFilters: Filters = {
  countries: [],
  leagues: [],
  teams: [],
  positions: [],
  height: {},
  ageRange: [14, 40],
  weight: "",
  noOfGamesPlayed: "",
  rebG: "",
  astG: "",
  ptsG: "",
  fgPercentage: "",
  minutesG: {},
  stlG: "",
  blkG: "",
  threePtPercentage: "",
  ftPercentage: "",
};

/** Parse height string like "6-1 (185cm)" or "6'8\"" to inches. Returns null if unparseable. */
function parseHeightToInches(heightStr: string | undefined): number | null {
  if (!heightStr || typeof heightStr !== "string") return null;
  const s = heightStr.trim();
  // Already just a number (inches)
  const onlyNum = /^\d+$/.exec(s);
  if (onlyNum) return parseInt(onlyNum[0], 10);
  // "6-1" or "6-10" (feet-inches)
  const ftIn = /^(\d+)[-' ](\d+)/.exec(s);
  if (ftIn) return parseInt(ftIn[1], 10) * 12 + parseInt(ftIn[2], 10);
  // "6'8" or "6'8\""
  const ftIn2 = /^(\d+)'(\d+)/.exec(s);
  if (ftIn2) return parseInt(ftIn2[1], 10) * 12 + parseInt(ftIn2[2], 10);
  return null;
}

/** Parse country string like "Canada / England" into ["Canada", "England"]. Single country returns [country]. */
function parseCountryToArray(country: string | undefined): string[] {
  if (!country || typeof country !== "string") return [];
  return country
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Parse weight string like "190 lbs (86kg)" to lbs number. Returns null if unparseable. */
function parseWeightToLbs(weightStr: string | undefined): number | null {
  if (!weightStr || typeof weightStr !== "string") return null;
  const match = /(\d+)\s*lbs?/i.exec(weightStr.trim());
  if (match) return parseInt(match[1], 10);
  const onlyNum = /^\d+$/.exec(weightStr.trim());
  if (onlyNum) return parseInt(onlyNum[0], 10);
  return null;
}

/** Config for stats filters: filter key, season key, label, and whether it's a range. */
const STAT_FILTER_CONFIG: {
  filterKey: keyof Filters;
  seasonKey: keyof PlayerSeason;
  label: string;
  isPercentage: boolean;
  isRange: boolean;
}[] = [
  { filterKey: "noOfGamesPlayed", seasonKey: "gamesPlayed", label: "# of Games Played", isPercentage: false, isRange: false },
  { filterKey: "rebG", seasonKey: "reboundsPerGame", label: "REB/G", isPercentage: false, isRange: false },
  { filterKey: "astG", seasonKey: "assistsPerGame", label: "AST/G", isPercentage: false, isRange: false },
  { filterKey: "ptsG", seasonKey: "pointsPerGame", label: "PTS/G", isPercentage: false, isRange: false },
  { filterKey: "fgPercentage", seasonKey: "fieldGoalPercent", label: "FG%", isPercentage: true, isRange: false },
  { filterKey: "minutesG", seasonKey: "minutesPerGame", label: "Minutes/G", isPercentage: false, isRange: true },
  { filterKey: "stlG", seasonKey: "stealsPerGame", label: "STL/G", isPercentage: false, isRange: false },
  { filterKey: "blkG", seasonKey: "blocksPerGame", label: "BLK/G", isPercentage: false, isRange: false },
  { filterKey: "threePtPercentage", seasonKey: "threePointPercent", label: "3PT%", isPercentage: true, isRange: false },
  { filterKey: "ftPercentage", seasonKey: "freeThrowPercent", label: "FT%", isPercentage: true, isRange: false },
];

function getAvailableSeasonStatKeys(players: Player[]): Set<keyof PlayerSeason> {
  const keys = new Set<keyof PlayerSeason>();
  for (const p of players) {
    for (const s of p.seasons ?? []) {
      for (const k of STAT_FILTER_CONFIG.map((c) => c.seasonKey)) {
        const v = s[k];
        if (v != null && typeof v === "number" && !Number.isNaN(v)) keys.add(k);
      }
    }
  }
  return keys;
}

function hasAnyStatFilterSet(f: Filters): boolean {
  if (String(f.noOfGamesPlayed ?? "").trim()) return true;
  if (String(f.rebG ?? "").trim()) return true;
  if (String(f.astG ?? "").trim()) return true;
  if (String(f.ptsG ?? "").trim()) return true;
  if (String(f.fgPercentage ?? "").trim()) return true;
  if (String(f.minutesG?.from ?? "").trim() || String(f.minutesG?.to ?? "").trim()) return true;
  if (String(f.stlG ?? "").trim()) return true;
  if (String(f.blkG ?? "").trim()) return true;
  if (String(f.threePtPercentage ?? "").trim()) return true;
  if (String(f.ftPercentage ?? "").trim()) return true;
  return false;
}

/** Unique country names for filter: split "A / B" into separate options, sorted alphabetically. */
function extractUniqueCountries(list: Player[]): string[] {
  const set = new Set<string>();
  list.forEach((player) => {
    parseCountryToArray(player.country).forEach((c) => set.add(c));
  });
  return Array.from(set).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
}

/** Rows per table page (Previous/Next and “Showing X–Y”). */
const PAGE_SIZE = 10;

/** Raw catalog row reads per Firestore request (merged “players” count is lower when seasons collapse). */
const FIRESTORE_RAW_PAGE_SIZE = 120;

type PlayerDatabaseContentProps = {
  /** Server: `USE_FIRESTORE_CATALOG` — enables catalog CRUD for admins */
  catalogCrudEnabled?: boolean;
};

const PlayerDatabaseContent = ({
  catalogCrudEnabled = false,
}: PlayerDatabaseContentProps) => {
  /** When true, player list uses Firestore cursor pagination (fewer reads per action). */
  const useFirestorePaging = catalogCrudEnabled;
  const queryClient = useQueryClient();
  const { role } = useAuth();
  const showCatalogCrud = catalogCrudEnabled && role === "admin";

  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [page, setPage] = useState(1);
  const [countries, setCountries] = useState<string[]>([]);

  const { data: leagues = [], isPending: leaguesPending, error: leaguesError } =
    useQuery<League[]>({
      queryKey: ["catalog", "leagues"],
      queryFn: getLeagues,
    });

  const leagueSelectionKey = useMemo(
    () => filters.leagues.map((o) => o.value).sort().join(","),
    [filters.leagues]
  );

  const teamsQueryEnabled = leagues.length > 0 && filters.leagues.length > 0;

  const {
    data: teams = [],
    isPending: teamsPending,
    error: teamsError,
  } = useQuery<Team[]>({
    queryKey: ["catalog", "teams", leagueSelectionKey],
    queryFn: async () => {
      const hasAllLeagues = filters.leagues.some((o) => o.value === "0");
      const toFetch = hasAllLeagues
        ? [filters.leagues.find((o) => o.value === "0")!]
        : filters.leagues;
      const teamsPromises = toFetch.map((o) =>
        getTeams(parseInt(o.value, 10))
      );
      const teamsResults = await Promise.all(teamsPromises);
      return teamsResults.flat();
    },
    enabled: teamsQueryEnabled,
  });

  const { teamIds, teamIdsKey } = useMemo(() => {
    if (!filters.teams.length || !teams.length) {
      return { teamIds: [] as number[], teamIdsKey: "" };
    }
    const useAllTeams = filters.teams.some((o) => o.value === "ALL");
    const ids = useAllTeams
      ? teams.map((t) => t.id)
      : filters.teams
          .filter((o) => o.value !== "ALL")
          .map((o) => parseInt(o.value, 10));
    const sorted = [...ids].sort((a, b) => a - b);
    return { teamIds: sorted, teamIdsKey: sorted.join(",") };
  }, [filters.teams, teams]);

  const playersListQuery = useQuery<Player[]>({
    queryKey: ["catalog", "players", "full", teamIdsKey],
    queryFn: async () => {
      const list = await getPlayersByTeamIds(teamIds);
      return list.sort((a, b) => a.name.localeCompare(b.name));
    },
    enabled: Boolean(teamIdsKey) && !useFirestorePaging,
  });

  const playersPagedQuery = useInfiniteQuery({
    queryKey: [
      "catalog",
      "players",
      "paged",
      teamIdsKey,
      FIRESTORE_RAW_PAGE_SIZE,
    ],
    queryFn: async ({ pageParam }) => {
      return getPlayersPageByTeamIds(
        teamIds,
        FIRESTORE_RAW_PAGE_SIZE,
        pageParam as string | null
      );
    },
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    enabled: Boolean(teamIdsKey) && useFirestorePaging,
  });

  const players = useMemo(() => {
    if (!teamIdsKey) return [];
    if (useFirestorePaging) {
      const pages = playersPagedQuery.data?.pages ?? [];
      return combineMergedPlayerPages(pages.map((p) => p.players));
    }
    return playersListQuery.data ?? [];
  }, [
    teamIdsKey,
    useFirestorePaging,
    playersPagedQuery.data?.pages,
    playersListQuery.data,
  ]);

  const playersError = useFirestorePaging
    ? playersPagedQuery.error
    : playersListQuery.error;

  const catalogError =
    leaguesError ?? teamsError ?? playersError
      ? "Failed to load catalog. Try again."
      : null;

  const playersPending = useFirestorePaging
    ? playersPagedQuery.isPending
    : playersListQuery.isPending;

  /** Table area: show skeleton while the player list query is in flight. */
  const playersTableLoading = Boolean(teamIdsKey) && playersPending;

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      // Search
      if (
        searchValue &&
        !player.name.toLowerCase().includes(searchValue.toLowerCase()) &&
        !player.country?.toLowerCase().includes(searchValue.toLowerCase())
      ) {
        return false;
      }
      // Age range
      if (
        player.age != null &&
        (player.age < filters.ageRange[0] || player.age > filters.ageRange[1])
      ) {
        return false;
      }
      // Country: player can have "Country A / Country B"; treat as array and match if any selected
      if (filters.countries.length > 0) {
        const playerCountries = parseCountryToArray(player.country);
        const selectedValues = new Set(filters.countries.map((o) => o.value));
        const hasMatch = playerCountries.some((c) => selectedValues.has(c));
        if (!hasMatch) return false;
      }
      // Position
      if (
        filters.positions.length > 0 &&
        !filters.positions.some((option) => option.label === player.position)
      ) {
        return false;
      }
      // Height (inch) range
      const heightFrom = filters.height.from?.trim();
      const heightTo = filters.height.to?.trim();
      if (heightFrom || heightTo) {
        const playerInches = parseHeightToInches(player.height);
        if (playerInches == null) return false;
        const fromNum = heightFrom ? parseInt(heightFrom, 10) : null;
        const toNum = heightTo ? parseInt(heightTo, 10) : null;
        if (fromNum != null && !Number.isNaN(fromNum) && playerInches < fromNum)
          return false;
        if (toNum != null && !Number.isNaN(toNum) && playerInches > toNum)
          return false;
      }
      // Weight (lbs) - treat as minimum weight when set
      const weightFilter = filters.weight.trim();
      if (weightFilter) {
        const minLbs = parseInt(weightFilter, 10);
        if (!Number.isNaN(minLbs)) {
          const playerLbs = parseWeightToLbs(player.weight);
          if (playerLbs == null || playerLbs < minLbs) return false;
        }
      }
      // Stats filters: require at least one season meeting all specified minimums
      const seasons = player.seasons ?? [];
      if (seasons.length > 0) {
        const meetsStat = (
          seasonKey: keyof PlayerSeason,
          filterVal: string,
          isPercentage: boolean
        ) => {
          if (!filterVal.trim()) return true;
          let num = parseFloat(filterVal);
          if (Number.isNaN(num)) return true;
          if (isPercentage) num = num / 100; // user enters 45.5, data is 0.455
          const hasMatch = seasons.some((s) => {
            const v = s[seasonKey];
            if (v == null || typeof v !== "number") return false;
            return v >= num;
          });
          return hasMatch;
        };
        const meetsRange = (
          seasonKey: keyof PlayerSeason,
          fromVal?: string,
          toVal?: string
        ) => {
          const fromNum = fromVal?.trim() ? parseFloat(fromVal) : null;
          const toNum = toVal?.trim() ? parseFloat(toVal) : null;
          if (fromNum == null && toNum == null) return true;
          const fromOk = fromNum == null || !Number.isNaN(fromNum);
          const toOk = toNum == null || !Number.isNaN(toNum);
          if (!fromOk && !toOk) return true;
          return seasons.some((s) => {
            const m = s[seasonKey];
            if (m == null || typeof m !== "number") return false;
            if (fromNum != null && !Number.isNaN(fromNum) && m < fromNum) return false;
            if (toNum != null && !Number.isNaN(toNum) && m > toNum) return false;
            return true;
          });
        };
        for (const cfg of STAT_FILTER_CONFIG) {
          if (cfg.isRange) {
            const range = filters[cfg.filterKey] as { from?: string; to?: string } | undefined;
            const fromVal = range?.from?.trim();
            const toVal = range?.to?.trim();
            if (fromVal || toVal) {
              if (!meetsRange(cfg.seasonKey, fromVal || undefined, toVal || undefined)) return false;
            }
          } else {
            const filterVal = String(filters[cfg.filterKey] ?? "").trim();
            if (filterVal && !meetsStat(cfg.seasonKey, filterVal, cfg.isPercentage))
              return false;
          }
        }
      } else if (hasAnyStatFilterSet(filters)) {
        // User set a stat filter but player has no season data → exclude
        return false;
      }
      return true;
    });
  }, [filters, players, searchValue]);

  /** Only show stat filters for stats that exist in the loaded player data. */
  const availableStatKeys = useMemo(
    () => getAvailableSeasonStatKeys(players),
    [players]
  );

  const handleFilterChange = <K extends keyof Filters>(
    filterName: K,
    newValue: Filters[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: newValue,
    }));
  };

  const handleAgeRangeChange = (newValues: [number, number]) => {
    setFilters((prev) => ({
      ...prev,
      ageRange: newValues,
    }));
  };

  const handleRangeChange = (
    primaryKey: keyof Filters,
    key: "to" | "from",
    value: string
  ) => {
    setFilters((prev) => {
      const current = prev[primaryKey];
      const currentObj =
        current && typeof current === "object" && !Array.isArray(current)
          ? current
          : {};
      return {
        ...prev,
        [primaryKey]: {
          ...currentObj,
          [key]: value,
        },
      };
    });
  };

  // const handleClearFilters = () => {
  //   setSearchValue("");
  //   setFilters(initialFilters);
  // };

  // Set "All Leagues" as default selection when leagues are loaded
  useEffect(() => {
    if (leagues.length > 0 && filters.leagues.length === 0) {
      const allLeaguesOption = leagues.find(
        (league) => league.name.toLowerCase() === "all leagues"
      );
      if (allLeaguesOption) {
        setFilters((prev) => ({
          ...prev,
          leagues: [
            {
              label: allLeaguesOption.name,
              value: allLeaguesOption.id.toString(),
            },
          ],
        }));
      }
    }
  }, [leagues, filters.leagues.length]);

  // Reset team filter when league selection changes (avoids stale team ids)
  useEffect(() => {
    setFilters((prev) => ({ ...prev, teams: [] }));
  }, [leagueSelectionKey]);

  // Default team selection once teams load for the current league(s)
  useEffect(() => {
    if (filters.leagues.length === 0 || teams.length === 0) return;
    if (filters.teams.length > 0) return;
    const hasAllLeagues = filters.leagues.some((o) => o.value === "0");
    const useAllTeams = teams.length > 50 || hasAllLeagues;
    setFilters((prev) => ({
      ...prev,
      teams: useAllTeams
        ? [{ label: "All Teams", value: "ALL" }]
        : [{ label: teams[0].name, value: teams[0].id.toString() }],
    }));
  }, [filters.leagues, filters.teams.length, teams]);

  useEffect(() => {
    if (players.length > 0) {
      setCountries(extractUniqueCountries(players));
    }
  }, [players]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPlayers.length / PAGE_SIZE)
  );

  useEffect(() => {
    setPage(1);
  }, [teamIdsKey, searchValue]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const tablePlayers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredPlayers.slice(start, start + PAGE_SIZE);
  }, [filteredPlayers, page]);

  const pageStart =
    filteredPlayers.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const pageEnd = Math.min(page * PAGE_SIZE, filteredPlayers.length);

  return (
    <div>
      <Input
        icon={<IoIosSearch size={20} />}
        iconPosition="left"
        placeholder="Search Player......."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="border-white/50 w-full border-white"
      />

      {/* Filters */}
      <AccordionContainer
        type="single"
        collapsible
        className="w-full border-0"
        defaultValue="filter"
      >
        <AccordionItem value="filter" className="border-0">
          <AccordionTrigger className="flex flex-row-reverse justify-end gap-4 hover:no-underline text-xl">
            Filter
          </AccordionTrigger>
          <AccordionContent className="flex gap-[30px]">
            {/* Country filter */}
            <div className="space-y-[10px] flex-1">
              <h2>Country</h2>
              <MultiSelect
                placeholder="Select Country..."
                value={filters.countries}
                options={countries.map((country) => ({
                  label: country,
                  value: country,
                }))}
                className="min-w-full"
                onValueChange={(values) =>
                  handleFilterChange("countries", values)
                }
                isMulti
              />
            </div>
            {/* League filter */}
            <div className="space-y-[10px] flex-1">
              <h2>League</h2>
              <MultiSelect
                placeholder="Select League..."
                value={filters.leagues}
                options={leagues.map((league) => ({
                  label: league.name,
                  value: league.id.toString(),
                }))}
                className="min-w-full"
                onValueChange={(values) =>
                  handleFilterChange("leagues", values)
                }
                isMulti
              />
            </div>
            {/* Teams filter */}
            <div className="space-y-[10px] flex-1">
              <h2>Teams</h2>
              <MultiSelect
                placeholder="Select Team..."
                value={filters.teams}
                options={[
                  { label: "All Teams", value: "ALL" },
                  ...teams.map((team) => ({
                    label: team.name,
                    value: team.id.toString(),
                  })),
                ]}
                className="min-w-full"
                onValueChange={(values) => handleFilterChange("teams", values)}
                isMulti
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </AccordionContainer>

      {/* Biometrics */}
      <AccordionContainer
        type="single"
        collapsible
        className="w-full border-0"
        // defaultValue="biometrics"
      >
        <AccordionItem value="biometrics" className="border-0">
          <AccordionTrigger className="flex flex-row-reverse justify-end gap-4 hover:no-underline text-xl">
            Biometrics
          </AccordionTrigger>
          <AccordionContent className="flex gap-5">
            <div className="flex-1 space-y-5">
              {/* position filter */}
              <div className="space-y-[10px] flex-1">
                <h2>Position</h2>
                <MultiSelect
                  placeholder="Select Position..."
                  value={filters.positions}
                  options={positionFilters}
                  className="min-w-full"
                  onValueChange={(values) =>
                    handleFilterChange("positions", values)
                  }
                  isMulti
                />
              </div>

              {/* age range */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2>Age (range)</h2>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      min={14}
                      max={filters?.ageRange[1]}
                      value={filters?.ageRange[0]?.toString()}
                      onChange={(e) =>
                        handleAgeRangeChange([
                          parseInt(e.target.value),
                          filters?.ageRange[1],
                        ])
                      }
                      className="w-16 !p-0 !px-2 border-white"
                    />
                    <Input
                      type="number"
                      min={filters?.ageRange[0]}
                      max={40}
                      value={filters?.ageRange[1]?.toString()}
                      onChange={(e) =>
                        handleAgeRangeChange([
                          filters?.ageRange[0],
                          parseInt(e.target.value),
                        ])
                      }
                      className="w-16 !p-0 !px-2 border-white"
                    />
                  </div>
                </div>
                <Slider
                  min={14}
                  max={40}
                  step={1}
                  value={filters?.ageRange}
                  onValueChange={handleAgeRangeChange}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex-1 space-y-5">
              {/* height filter */}
              <div className="space-y-[10px] flex-1">
                <h2>Height (inch)</h2>
                <div className="flex items-center gap-5">
                  <Input
                    placeholder="from"
                    value={filters?.height?.from ?? ""}
                    type="number"
                    onChange={(e) =>
                      handleRangeChange("height", "from", e.target.value)
                    }
                    className="border-white/50 w-full border-white"
                  />
                  <span className="text-md">to</span>
                  <Input
                    placeholder="to"
                    type="number"
                    value={filters?.height?.to ?? ""}
                    onChange={(e) =>
                      handleRangeChange("height", "to", e.target.value)
                    }
                    className="border-white/50 w-full border-white"
                  />
                </div>
              </div>

              {/* weight filter  */}
              <div className="space-y-[10px] flex-1">
                <h2>Weight (lbs)</h2>
                <Input
                  placeholder="Weight"
                  value={filters?.weight ?? ""}
                  type="number"
                  onChange={(e) => handleFilterChange("weight", e.target.value)}
                  className="border-white/50 w-full border-white"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </AccordionContainer>

      {/* Stats Filters – only show filters for stats present in the data */}
      <AccordionContainer
        type="single"
        collapsible
        className="w-full border-0"
      >
        <AccordionItem
          value="statsFilters"
          className="border-0 !overflow-hidden"
        >
          <AccordionTrigger className="flex flex-row-reverse justify-end gap-4 hover:no-underline text-xl">
            Stats Filters
          </AccordionTrigger>
          <AccordionContent className="flex gap-5 !overflow-hidden">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {STAT_FILTER_CONFIG.filter((cfg) =>
                availableStatKeys.has(cfg.seasonKey)
              ).map((cfg) =>
                cfg.isRange ? (
                  <div key={cfg.filterKey} className="space-y-[10px]">
                    <h2>{cfg.label}</h2>
                    <div className="flex items-center gap-5">
                      <Input
                        placeholder="from"
                        value={(filters[cfg.filterKey] as { from?: string })?.from ?? ""}
                        type="number"
                        onChange={(e) =>
                          handleRangeChange(
                            cfg.filterKey as "height" | "minutesG",
                            "from",
                            e.target.value
                          )
                        }
                        className="border-white/50 w-full border-white"
                      />
                      <span className="text-md">to</span>
                      <Input
                        placeholder="to"
                        type="number"
                        value={(filters[cfg.filterKey] as { to?: string })?.to ?? ""}
                        onChange={(e) =>
                          handleRangeChange(
                            cfg.filterKey as "height" | "minutesG",
                            "to",
                            e.target.value
                          )
                        }
                        className="border-white/50 w-full border-white"
                      />
                    </div>
                  </div>
                ) : (
                  <div key={cfg.filterKey} className="space-y-[10px]">
                    <h2>{cfg.label}</h2>
                    <Input
                      placeholder={cfg.isPercentage ? "e.g. 45.5" : `Min ${cfg.label}`}
                      value={String(filters[cfg.filterKey] ?? "")}
                      type="number"
                      onChange={(e) =>
                        handleFilterChange(cfg.filterKey, e.target.value)
                      }
                      className="border-white/50 w-full border-white"
                    />
                  </div>
                )
              )}
            </div>
            {availableStatKeys.size === 0 && (
              <p className="text-sm text-white/70 col-span-2">
                Load players (select League/Teams) to see stats filters from the data.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>
      </AccordionContainer>

      {/* filter actions */}
      {/* <div className="space-y-3">
        <h2 className="py-4 flex items-center gap-2 text-xl">
          <HiChevronDoubleDown size={20} />
          Adjustable Filters
        </h2>
        <div className="flex gap-5">
          <Button
            label="Reset"
            className="!px-9 rounded w-[180px] border-white flex !justify-center !items-center"
            onClick={handleClearFilters}
          />
          <Button
            label="Apply"
            className="!px-9 rounded w-[180px] border-searchBorder flex !justify-center !items-center bg-headerBg/30"
          />
        </div>
      </div> */}
      {filteredPlayers.length > 0 && (
        <h2 className="text-md w-full text-right">
          Showing{" "}
          <b>
            {pageStart}–{pageEnd}
          </b>{" "}
          of <b>{filteredPlayers.length}</b> players
          {totalPages > 1 && (
            <span className="text-white/70">
              {" "}
              (page {page} of {totalPages})
            </span>
          )}
        </h2>
      )}

      {catalogError && (
        <div className="bg-red-50 text-red-500 p-4 rounded">
          {catalogError}
        </div>
      )}

      {playersTableLoading ? (
        <PlayersTableSkeleton />
      ) : (
        <PlayersTable
          players={tablePlayers}
          catalogCrud={
            showCatalogCrud
              ? {
                  enabled: true,
                  onInvalidate: () =>
                    queryClient.invalidateQueries({ queryKey: ["catalog"] }),
                }
              : undefined
          }
        />
      )}

      {!playersTableLoading && totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 rounded border border-white/50 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10"
          >
            Previous
          </button>
          <span className="text-sm text-white/80">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 rounded border border-white/50 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10"
          >
            Next
          </button>
        </div>
      )}

      {useFirestorePaging && Boolean(teamIdsKey) && playersPagedQuery.hasNextPage && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            disabled={playersPagedQuery.isFetchingNextPage}
            onClick={() => playersPagedQuery.fetchNextPage()}
            className="rounded-lg border border-purpleFill/40 bg-purplish/30 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-purplish/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {playersPagedQuery.isFetchingNextPage ? "Loading…" : "Load more"}
          </button>
        </div>
      )}

    </div>
  );
};

export default PlayerDatabaseContent;
