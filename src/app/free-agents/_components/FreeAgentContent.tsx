"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import type { FreeAgent, TeamOpening, FreeAgentData } from "../_types";
import { formatStat, formatPct } from "../_utils";

// ---- KPI Card ----
function KpiCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white/5 border border-borderLight rounded-lg px-5 py-3 min-w-[130px]">
      <div className="text-2xl font-bold text-blue-500">{value}</div>
      <div className="text-[10px] text-textLight uppercase tracking-wide mt-0.5">
        {label}
      </div>
    </div>
  );
}

// ---- Badge ----
function Badge({
  variant,
  children,
}: {
  variant: string;
  children: React.ReactNode;
}) {
  const styles: Record<string, string> = {
    high: "bg-emerald-950 text-emerald-400",
    medium: "bg-amber-950 text-amber-400",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${styles[variant] || ""}`}
    >
      {children}
    </span>
  );
}

// ---- Stat Cell ----
function StatCell({ value, hasData }: { value: string; hasData: boolean }) {
  return (
    <td
      className={`text-right tabular-nums px-3 py-2 text-sm ${!hasData ? "text-white/20" : ""}`}
    >
      {value}
    </td>
  );
}

// ---- Sort Header ----
function SortHeader({
  label,
  sortKey,
  currentSort,
  currentDir,
  onSort,
  align = "left",
}: {
  label: string;
  sortKey: string;
  currentSort: string;
  currentDir: number;
  onSort: (key: string) => void;
  align?: "left" | "right";
}) {
  const active = currentSort === sortKey;
  return (
    <th
      className={`px-3 py-2.5 text-[10px] uppercase tracking-wider border-b border-borderLight cursor-pointer whitespace-nowrap select-none
        ${align === "right" ? "text-right" : "text-left"}
        ${active ? "text-blue-500" : "text-textLight hover:text-white"}`}
      onClick={() => onSort(sortKey)}
    >
      {label}
      {active && (currentDir === 1 ? " \u25B2" : " \u25BC")}
    </th>
  );
}

// ---- Watchlist Star Button ----
function WatchlistBtn({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`text-lg leading-none transition-colors ${active ? "text-yellow-400" : "text-white/15 hover:text-yellow-400/60"}`}
      title={active ? "Remove from Watchlist" : "Add to Watchlist"}
    >
      {active ? "\u2605" : "\u2606"}
    </button>
  );
}

// ---- Main Component ----
export default function FreeAgentContent({ data, isAdmin = false }: { data: FreeAgentData; isAdmin?: boolean }) {
  const [tab, setTab] = useState<"fa" | "openings">("fa");
  const [search, setSearch] = useState("");
  const [posFilter, setPosFilter] = useState("");
  const [confFilter, setConfFilter] = useState("");
  const [natFilter, setNatFilter] = useState("");
  const [sortCol, setSortCol] = useState("name");
  const [sortDir, setSortDir] = useState(1);
  const [openingsSearch, setOpeningsSearch] = useState("");
  const [watchlist, setWatchlist] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const saved = localStorage.getItem("hr_watchlist");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  useEffect(() => {
    try { localStorage.setItem("hr_watchlist", JSON.stringify([...watchlist])); } catch {}
  }, [watchlist]);

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir((d) => d * -1);
    else {
      setSortCol(col);
      setSortDir(1);
    }
  };

  const toggleWatchlist = useCallback((name: string) => {
    setWatchlist((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  // Extract unique nationalities for filter dropdown
  const nationalities = useMemo(() => {
    const nats = new Set(data.freeAgents.map((p) => p.nationality));
    return Array.from(nats).sort();
  }, [data.freeAgents]);

  const filteredPlayers = useMemo(() => {
    let result = data.freeAgents.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.lastTeam.toLowerCase().includes(q) && !p.nationality.toLowerCase().includes(q)) return false;
      }
      if (posFilter) {
        if (posFilter === "G" && !/G|PG|SG/.test(p.position)) return false;
        if (posFilter === "F" && !/F|SF|PF/.test(p.position)) return false;
        if (posFilter === "C" && !/C/.test(p.position)) return false;
      }
      if (natFilter && p.nationality !== natFilter) return false;
      if (confFilter && p.confidence !== confFilter) return false;
      return true;
    });
    const statCols = ["pts", "trb", "ast", "fgp", "tpp"];
    result.sort((a, b) => {
      let va: any, vb: any;
      if (sortCol === "watchlist") {
        va = watchlist.has(a.name) ? 1 : 0;
        vb = watchlist.has(b.name) ? 1 : 0;
      } else if (statCols.includes(sortCol)) {
        va = a.stats?.[sortCol as keyof typeof a.stats] ?? -999;
        vb = b.stats?.[sortCol as keyof typeof b.stats] ?? -999;
      } else {
        va = (a as any)[sortCol]; vb = (b as any)[sortCol];
        if (typeof va === "string") { va = va.toLowerCase(); vb = (vb || "").toLowerCase(); }
      }
      if (va < vb) return -1 * sortDir;
      if (va > vb) return 1 * sortDir;
      return 0;
    });
    return result;
  }, [data.freeAgents, search, posFilter, natFilter, confFilter, sortCol, sortDir, watchlist]);

  const filteredOpenings = useMemo(() => {
    const q = openingsSearch.toLowerCase();
    return data.teamOpenings.filter((o) => !q || o.team.toLowerCase().includes(q) || o.league.toLowerCase().includes(q)).sort((a, b) => b.openSpots - a.openSpots);
  }, [data.teamOpenings, openingsSearch]);

  const exportCSV = () => {
    const headers = ["Name","Position","Height","Age","Nationality","Last Team","PPG","RPG","APG","FG%","3P%","Watchlist"];
    if (isAdmin) headers.push("Confidence");
    const rows = [headers];
    data.freeAgents.forEach((p) => {
      const row = [p.name, p.position, String(p.height), String(p.age), p.nationality, p.lastTeam, formatStat(p.stats?.pts ?? null), formatStat(p.stats?.trb ?? null), formatStat(p.stats?.ast ?? null), formatPct(p.stats?.fgp ?? null), formatPct(p.stats?.tpp ?? null), watchlist.has(p.name) ? "Yes" : ""];
      if (isAdmin) row.push(p.confidence);
      rows.push(row);
    });
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "hooproster_free_agents.csv";
    a.click();
  };

  const inputClasses = "bg-white/5 border border-borderLight text-white px-3 py-2 rounded-md text-sm focus:outline-none focus:border-blue-500";

  return (
    <div className="flex flex-col gap-5">
      <div><p className="text-xs text-textLight mt-1">Season 2025-26 | Data as of {data.metadata.generated} | {data.metadata.totalFreeAgents} verified free agents{isAdmin && ` | ${data.teamOpenings.length} teams with open spots`}{isAdmin && data.metadata.statsMatched > 0 && ` | ${data.metadata.statsMatched} with stats`}</p></div>
      <div className="flex gap-4 flex-wrap">
        <KpiCard value={data.metadata.totalFreeAgents} label="Free Agents" />
        {isAdmin && <KpiCard value={data.teamOpenings.length} label="Openings" />}
        {watchlist.size > 0 && <KpiCard value={watchlist.size} label="Watchlist" />}
      </div>
      <div className="flex border-b border-borderLight">
        <button className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors ${tab === "fa" ? "text-blue-500 border-blue-500" : "text-textLight border-transparent hover:text-white"}`} onClick={() => setTab("fa")}>Free Agents</button>
        {isAdmin && <button className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors ${tab === "openings" ? "text-blue-500 border-blue-500" : "text-textLight border-transparent hover:text-white"}`} onClick={() => setTab("openings")}>Team Openings</button>}
      </div>
      {tab === "fa" && (<>
        <div className="flex gap-3 flex-wrap items-center">
          <input type="text" placeholder="Search by name, team, nationality..." className={`${inputClasses} w-60`} value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className={inputClasses} value={posFilter} onChange={(e) => setPosFilter(e.target.value)}><option value="">All Positions</option><option value="G">Guards</option><option value="F">Forwards</option><option value="C">Centers</option></select>
          <select className={inputClasses} value={natFilter} onChange={(e) => setNatFilter(e.target.value)}><option value="">All Nationalities</option>{nationalities.map((n) => <option key={n} value={n}>{n}</option>)}</select>
          {isAdmin && <select className={inputClasses} value={confFilter} onChange={(e) => setConfFilter(e.target.value)}><option value="">All Confidence</option><option value="HIGH">HIGH only</option><option value="MEDIUM">MEDIUM only</option></select>}
          <button onClick={exportCSV} className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-xs font-semibold transition-colors">Export CSV</button>
        </div>
        <p className="text-xs text-textLight">Showing {filteredPlayers.length} of {data.freeAgents.length} free agents{watchlist.size > 0 && ` | ${watchlist.size} in watchlist`}</p>
        <div className="overflow-x-auto rounded-lg border border-borderLight">
          <table className="w-full border-collapse">
            <thead className="bg-white/5"><tr>
              <SortHeader label={"\u2606"} sortKey="watchlist" currentSort={sortCol} currentDir={sortDir} onSort={handleSort} />
              <SortHeader label="Name" sortKey="name" currentSort={sortCol} currentDir={sortDir} onSort={handleSort} />
              <SortHeader label="Pos" sortKey="position" currentSort={sortCol} currentDir={sortDir} onSort={handleSort} />
              <SortHeader label="Ht" sortKey="height" currentSort={sortCol} currentDir={sortDir} onSort={handleSort} align="right" />
              <SortHeader label="Age" sortKey="age" currentSort={sortCol} currentDir={sortDir} onSort={handleSort} align="right" />
              <SortHeader label="Nat" sortKey="nationality" currentSort={sortCol} currentDir={sortDir} onSort={handleSort} />
              <SortHeader label="Last Team" sortKey="lastTeam" currentSort={sortCol} currentDir={sortDir} onSort={handleSort} />
              <SortHeader label="PPG" sortKey="pts" currentSort={sortCol} currentDir={sortDir} onSort={handleSort} align="right" />
              <SortHeader label="RPG" sortKey="trb" currentSort={sortCol} currentDir={sortDir} onSort={handleSort} align="right" />
              <SortHeader label="APG" sortKey="ast" currentSort={sortCol} currentDir={sortDir} onSort={handleSort} align="right" />
              <SortHeader label="FG%" sortKey="fgp" currentSort={sortCol} currentDir={sortDir} onSort={handleSort} align="right" />
              <SortHeader label="3P%" sortKey="tpp" currentSort={sortCol} currentDir={sortDir} onSort={handleSort} align="right" />
              {isAdmin && <SortHeader label="Conf" sortKey="confidence" currentSort={sortCol} currentDir={sortDir} onSort={handleSort} />}
            </tr></thead>
            <tbody>
              {filteredPlayers.map((p, i) => (<tr key={i} className="hover:bg-white/5 border-b border-borderLight">
                <td className="px-3 py-2 text-center"><WatchlistBtn active={watchlist.has(p.name)} onClick={() => toggleWatchlist(p.name)} /></td>
                <td className="px-3 py-2 text-sm font-semibold text-white">{p.name}</td>
                <td className="px-3 py-2 text-sm">{p.position}</td>
                <td className="px-3 py-2 text-sm text-right">{p.height}</td>
                <td className="px-3 py-2 text-sm text-right">{p.age}</td>
                <td className="px-3 py-2 text-sm">{p.nationality}</td>
                <td className="px-3 py-2 text-sm">{p.lastTeam}</td>
                <StatCell value={formatStat(p.stats?.pts ?? null)} hasData={!!p.stats} />
                <StatCell value={formatStat(p.stats?.trb ?? null)} hasData={!!p.stats} />
                <StatCell value={formatStat(p.stats?.ast ?? null)} hasData={!!p.stats} />
                <StatCell value={formatPct(p.stats?.fgp ?? null)} hasData={!!p.stats} />
                <StatCell value={formatPct(p.stats?.tpp ?? null)} hasData={!!p.stats} />
                {isAdmin && <td className="px-3 py-2"><Badge variant={p.confidence.toLowerCase()}>{p.confidence}</Badge></td>}
              </tr>))}
            </tbody>
          </table>
        </div>
      </>)}
      {tab === "openings" && isAdmin && (<>
        <div><input type="text" placeholder="Search teams or leagues..." className={`${inputClasses} w-60`} value={openingsSearch} onChange={(e) => setOpeningsSearch(e.target.value)} /></div>
        <p className="text-xs text-textLight">{filteredOpenings.length} teams with open roster spots</p>
        <div className="overflow-x-auto rounded-lg border border-borderLight">
          <table className="w-full border-collapse">
            <thead className="bg-white/5"><tr>
              <th className="text-left px-3 py-2.5 text-[10px] text-textLight uppercase border-b border-borderLight">Team</th>
              <th className="text-left px-3 py-2.5 text-[10px] text-textLight uppercase border-b border-borderLight">League</th>
              <th className="text-right px-3 py-2.5 text-[10px] text-textLight uppercase border-b border-borderLight">Released</th>
              <th className="text-right px-3 py-2.5 text-[10px] text-textLight uppercase border-b border-borderLight">Signed</th>
              <th className="text-right px-3 py-2.5 text-[10px] text-textLight uppercase border-b border-borderLight">Open Spots</th>
              <th className="text-left px-3 py-2.5 text-[10px] text-textLight uppercase border-b border-borderLight">Released Players</th>
            </tr></thead>
            <tbody>
              {filteredOpenings.map((o, i) => (<tr key={i} className="hover:bg-white/5 border-b border-borderLight">
                <td className="px-3 py-2 text-sm font-semibold text-white">{o.team}</td>
                <td className="px-3 py-2 text-sm">{o.league}</td>
                <td className="px-3 py-2 text-sm text-right">{o.released}</td>
                <td className="px-3 py-2 text-sm text-right">{o.signed}</td>
                <td className="px-3 py-2 text-sm text-right font-bold text-red-500">{o.openSpots}</td>
                <td className="px-3 py-2 text-xs text-textLight">{o.releasedPlayers}</td>
              </tr>))}
            </tbody>
          </table>
        </div>
      </>)}
      <div className="text-[11px] text-textLight pt-2">HoopRoster Transfer Intelligence | Sources: Eurobasket.com, RealGM</div>
    </div>
  );
}
