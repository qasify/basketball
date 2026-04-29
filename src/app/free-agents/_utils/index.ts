// Free Agent Tracker - Utility functions

import type { FreeAgent, TeamOpening, FreeAgentData } from "../_types";

// Parse the raw JSON from scraper output into typed data
export function parseFreeAgentData(raw: any): FreeAgentData {
  const freeAgents: FreeAgent[] = [];

  for (const tierKey of ["tier1", "tier2", "tier3"]) {
    const players = raw.free_agents?.[tierKey] || [];
    for (const p of players) {
      const team = p.last_team || p.eb_team || "";
      const stats = p.stats
        ? {
            season: p.stats.season || "",
            team: p.stats.team || "",
            league: p.stats.league || "",
            gp: parseFloat(p.stats.gp) || null,
            min: parseFloat(p.stats.min || p.stats.mpg) || null,
            pts: parseFloat(p.stats.pts) || null,
            trb: parseFloat(p.stats.trb || p.stats.rpg) || null,
            ast: parseFloat(p.stats.ast || p.stats.apg) || null,
            stl: parseFloat(p.stats.stl || p.stats.spg) || null,
            blk: parseFloat(p.stats.blk || p.stats.bpg) || null,
            tov: parseFloat(p.stats.tov) || null,
            fgp: parseFloat(p.stats.fgp) || null,
            tpp: parseFloat(p.stats.tpp) || null,
            ftp: parseFloat(p.stats.ftp) || null,
            per: parseFloat(p.stats.per) || null,
            ts_pct: parseFloat(p.stats.ts_pct) || null,
            usg: parseFloat(p.stats.usg) || null,
            realgm_url: p.stats.realgm_url || "",
          }
        : null;

      freeAgents.push({
        name: fixName(p.name),
        position: p.position,
        height: p.height,
        born: p.born,
        age: new Date().getFullYear() - p.born,
        nationality: p.nationality,
        lastTeam: team.replace(/\s*\(.*?\)/, "").trim(),
        confidence: p.confidence,
        source: p.source || "",
        stats,
      });
    }
  }

  const teamOpenings: TeamOpening[] = (raw.team_openings || []).map(
    (o: any) => ({
      team: o.team,
      league: o.league,
      released: o.released,
      signed: o.signed,
      openSpots: o.open_spots,
      releasedPlayers: o.released_players,
    })
  );

  return {
    metadata: {
      generated: raw.metadata?.generated || "",
      totalFreeAgents: freeAgents.length,
      statsMatched: raw.metadata?.stats_matched || 0,
      statsSource: raw.metadata?.stats_source || "",
    },
    freeAgents,
    teamOpenings,
  };
}

function fixName(name: string): string {
  let n = name.trim();
  for (const suffix of ["III", "Jr.", "II", "IV"]) {
    if (n.startsWith(suffix + " ")) {
      n = n.slice(suffix.length + 1) + " " + suffix;
    }
  }
  return n;
}

// Format stat for display
export function formatStat(val: number | null, decimals = 1): string {
  if (val === null || val === undefined || isNaN(val)) return "-";
  return val.toFixed(decimals);
}

export function formatPct(val: number | null): string {
  if (val === null || val === undefined || isNaN(val)) return "-";
  const pct = val < 1 && val > 0 ? val * 100 : val;
  return pct.toFixed(1);
}
