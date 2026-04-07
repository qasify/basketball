"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Building2, Hash, User } from "lucide-react";
import { getLeagues, getTeams } from "@/_api/excel-league-api";
import type { League, Team } from "@/_api/excel-league-api";
import { createCatalogPlayerRowAction } from "@/_api/catalog-player-actions";
import { getAuth } from "firebase/auth";
import { SectionCard } from "@/app/profile/_components/SectionCard";

const fieldClass =
  "mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2.5 text-sm leading-snug text-white placeholder:text-white/35 focus:border-purplish focus:outline-none focus:ring-2 focus:ring-purplish/30 sm:px-3.5 sm:py-2.5 sm:text-[15px]";
const labelClass =
  "block text-[11px] font-medium uppercase tracking-wide text-white/55 sm:text-xs";
const cardClass = "!p-4 sm:!p-5 !rounded-xl";

export default function AddCatalogPlayerForm() {
  const router = useRouter();
  const { role, loading: authLoading } = useAuth();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loadingLeagues, setLoadingLeagues] = useState(true);

  const leagueOptions = leagues.filter((l) => l.id !== 0);
  const [leagueId, setLeagueId] = useState<number>(0);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamId, setTeamId] = useState<number>(0);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [country, setCountry] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [season, setSeason] = useState(() =>
    String(new Date().getFullYear())
  );
  const [realgmIdInput, setRealgmIdInput] = useState("");
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getLeagues()
      .then((data) => {
        if (!cancelled) {
          setLeagues(data);
          const opts = data.filter((l) => l.id !== 0);
          if (opts[0]) setLeagueId(opts[0].id);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingLeagues(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (leagueId <= 0) return;
    let cancelled = false;
    setLoadingTeams(true);
    getTeams(leagueId)
      .then((t) => {
        if (!cancelled) {
          setTeams(t);
          setTeamId(t[0]?.id ?? 0);
        }
      })
      .catch(() => {
        if (!cancelled) setTeams([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingTeams(false);
      });
    return () => {
      cancelled = true;
    };
  }, [leagueId]);

  const handleCreate = async () => {
    if (!name.trim() || !leagueId || !teamId) {
      setError("Name, league, and team are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        setError("Sign in required.");
        return;
      }
      const teamName = teams.find((t) => t.id === teamId)?.name ?? "";
      const ageNum = parseInt(age, 10);
      const rid = parseInt(realgmIdInput.trim(), 10);
      const realgmId =
        realgmIdInput.trim() !== "" && !Number.isNaN(rid) && rid > 0
          ? rid
          : undefined;
      const res = await createCatalogPlayerRowAction(token, {
        leagueId,
        teamId,
        team: teamName,
        name: name.trim(),
        realgmId,
        position: position.trim() || undefined,
        country: country.trim() || undefined,
        height: height.trim() || undefined,
        weight: weight.trim() || undefined,
        season: season.trim() || undefined,
        age: Number.isNaN(ageNum) ? undefined : ageNum,
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push("/player-database");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <p className="text-textGrey text-sm py-8">Loading…</p>
    );
  }

  if (role !== "admin") {
    return (
      <div className="rounded-2xl border border-amber-500/25 bg-amber-950/20 px-5 py-4 text-sm text-amber-100/90 max-w-2xl">
        Only accounts with the <strong className="text-white">admin</strong>{" "}
        role can add catalog players. Ask an administrator to update your role in
        Firestore.
      </div>
    );
  }

  if (loadingLeagues) {
    return (
      <p className="text-textGrey text-sm py-8">Loading leagues…</p>
    );
  }

  return (
    <div className="w-full max-w-none flex flex-col gap-4">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-950/35 px-3 py-2.5 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5 lg:items-stretch lg:min-h-0">
        {/* Left: placement + id — narrow column on large screens */}
        <div className="flex flex-col gap-4 lg:col-span-4 lg:h-full">
          <SectionCard
            className={cardClass}
            title="League & team"
            subtitle="Catalog placement."
            icon={<Building2 className="h-4 w-4" strokeWidth={2} aria-hidden />}
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <label className={labelClass}>League</label>
                <select
                  className={fieldClass}
                  value={leagueId || ""}
                  onChange={(e) => setLeagueId(Number(e.target.value))}
                >
                  {leagueOptions.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Team</label>
                <select
                  className={`${fieldClass} disabled:opacity-50`}
                  value={teamId || ""}
                  disabled={loadingTeams || teams.length === 0}
                  onChange={(e) => setTeamId(Number(e.target.value))}
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                {loadingTeams && (
                  <p className="mt-1 text-[11px] text-textGrey">Loading teams…</p>
                )}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            className={cardClass}
            title="RealGM ID"
            subtitle="Use the ID from the RealGM player URL when you care about Excel import."
            icon={<Hash className="h-4 w-4" strokeWidth={2} aria-hidden />}
          >
            <div>
              <label className={labelClass}>Player ID</label>
              <input
                type="number"
                min={1}
                placeholder="e.g. 12345"
                value={realgmIdInput}
                onChange={(e) => setRealgmIdInput(e.target.value)}
                className={fieldClass}
              />
              <p className="mt-1.5 text-[11px] leading-snug text-textGrey">
                Without this ID, rows from Excel that are keyed by RealGM won’t
                merge with this manual player. Add the same number as in your
                sheet, or set it later in Edit.
              </p>
            </div>
          </SectionCard>
        </div>

        {/* Right: profile — same row height as left column on lg+ */}
        <SectionCard
          className={`lg:col-span-8 ${cardClass} lg:flex lg:h-full lg:min-h-0 lg:flex-col`}
          title="Player profile"
          subtitle="Name and biometrics."
          icon={<User className="h-4 w-4" strokeWidth={2} aria-hidden />}
        >
          <div className="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
            <div className="flex min-h-0 flex-1 flex-col gap-3.5 sm:gap-4">
              <div className="sm:max-w-xl lg:max-w-none">
                <label className={labelClass}>Full name *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={fieldClass}
                  placeholder="e.g. Janis Berzins"
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">
                <div>
                  <label className={labelClass}>Position</label>
                  <input
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className={fieldClass}
                    placeholder="e.g. PG, SF, C"
                  />
                </div>
                <div>
                  <label className={labelClass}>Season</label>
                  <input
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className={fieldClass}
                    placeholder="e.g. 2025"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">
                <div>
                  <label className={labelClass}>Country</label>
                  <input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className={fieldClass}
                    placeholder="e.g. Latvia"
                  />
                </div>
                <div>
                  <label className={labelClass}>Age</label>
                  <input
                    type="number"
                    min={0}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className={fieldClass}
                    placeholder="e.g. 24"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">
                <div>
                  <label className={labelClass}>Height</label>
                  <input
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className={fieldClass}
                    placeholder={`e.g. 6'7" or 201 cm`}
                  />
                </div>
                <div>
                  <label className={labelClass}>Weight</label>
                  <input
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className={fieldClass}
                    placeholder="e.g. 210 lbs or 95 kg"
                  />
                </div>
              </div>
              <div
                className="min-h-0 flex-1 max-lg:hidden"
                aria-hidden
              />
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={() => router.push("/player-database")}
          className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={saving || !teamId ? undefined : handleCreate}
          disabled={saving || !teamId}
          className="rounded-xl border border-purpleFill/50 bg-purplish/45 px-6 py-2.5 text-sm font-medium text-white shadow-[0_0_20px_rgba(176,55,255,0.12)] transition-colors hover:bg-purplish/65 hover:border-purpleFill disabled:opacity-45 disabled:pointer-events-none"
        >
          {saving ? "Creating…" : "Create player"}
        </button>
      </div>
    </div>
  );
}
