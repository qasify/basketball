"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { Hash, Layers, Pencil, User } from "lucide-react";
import type { Player } from "@/_api/basketball-api";
import { updateCatalogPlayerAction } from "@/_api/catalog-player-actions";
import { getAuth } from "firebase/auth";
import { SectionCard } from "@/app/profile/_components/SectionCard";

const fieldClass =
  "mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2.5 text-sm leading-snug text-white placeholder:text-white/35 focus:border-purplish focus:outline-none focus:ring-2 focus:ring-purplish/30 sm:px-3.5 sm:py-2.5 sm:text-[15px]";
const readOnlyFieldClass =
  "mt-1 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2.5 text-sm leading-snug text-white/80 sm:px-3.5 sm:py-2.5 sm:text-[15px]";
const labelClass =
  "block text-[11px] font-medium uppercase tracking-wide text-white/55 sm:text-xs";
/** Slightly stronger app purple rim on cards inside this modal */
const cardClass =
  "!p-4 sm:!p-5 !rounded-xl !shadow-[0_0_0_1px_rgba(176,55,255,0.12)]";

type Props = {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
};

export default function CatalogPlayerEditModal({
  player,
  isOpen,
  onClose,
  onSaved,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, onClose);

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [country, setCountry] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [realgmIdInput, setRealgmIdInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const seasonsSummary = useMemo(() => {
    if (!player?.seasons?.length) return null;
    const uniq = [
      ...new Set(player.seasons.map((s) => String(s.season))),
    ].sort();
    return uniq.join(", ");
  }, [player]);

  useEffect(() => {
    if (!isOpen || !player) return;
    setName(player.name ?? "");
    setPosition(player.position ?? "");
    setCountry(player.country ?? "");
    setAge(player.age != null ? String(player.age) : "");
    setHeight(player.height ?? "");
    setWeight(player.weight ?? "");
    setRealgmIdInput(
      player.realgmId != null ? String(player.realgmId) : ""
    );
    setError(null);
  }, [isOpen, player]);

  const handleSave = async () => {
    if (!player) return;
    if (!name.trim()) {
      setError("Name is required.");
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
      const patch: Partial<
        Pick<
          Player,
          | "name"
          | "position"
          | "country"
          | "age"
          | "height"
          | "weight"
          | "realgmId"
        >
      > = {
        name: name.trim(),
        position: position.trim() || undefined,
        country: country.trim() || undefined,
        height: height.trim() || undefined,
        weight: weight.trim() || undefined,
      };
      const ageNum = parseInt(age, 10);
      if (!Number.isNaN(ageNum)) patch.age = ageNum;
      else if (age.trim() === "") patch.age = undefined;

      const rid = parseInt(realgmIdInput.trim(), 10);
      if (realgmIdInput.trim() !== "" && !Number.isNaN(rid) && rid > 0) {
        patch.realgmId = rid;
      }

      const res = await updateCatalogPlayerAction(token, player, patch);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !player) return null;

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex min-h-[100lvh] w-full max-w-full items-center justify-center overflow-hidden overscroll-none bg-black/44 bg-[radial-gradient(ellipse_90%_55%_at_50%_-12%,rgba(139,92,246,0.11),transparent_58%)] p-3 backdrop-blur-[3px] [-webkit-backdrop-filter:blur(3px)] sm:p-4"
      role="presentation"
      style={{
        minHeight: "100dvh",
      }}
    >
      <div
        ref={ref}
        className="flex max-h-[min(92vh,880px)] w-full max-w-[min(96vw,56rem)] flex-col gap-4 overflow-y-auto rounded-2xl border border-white/12 ring-1 ring-purpleFill/25 bg-gradient-to-b from-zinc-800/[0.88] via-zinc-900/[0.94] to-zinc-950/[0.98] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_0_0_1px_rgba(176,55,255,0.12),0_8px_40px_-8px_rgba(139,92,246,0.14),0_24px_56px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-5 md:p-6"
      >
        <header className="shrink-0 border-b border-white/10 pb-4 shadow-[inset_0_-1px_0_0_rgba(176,55,255,0.14)]">
          <div className="flex flex-wrap items-start gap-3 sm:gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purpleFill/30 bg-gradient-to-br from-purplish/25 to-white/[0.06] text-purpleFill sm:h-11 sm:w-11">
              <Pencil className="h-5 w-5 sm:h-[22px] sm:w-[22px]" strokeWidth={2} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold uppercase tracking-wide text-white sm:text-xl">
                Edit catalog player
              </h2>
              <p className="mt-1 text-xs leading-snug text-textGrey sm:text-sm">
                Profile and RealGM ID update every Firestore row for this merged
                player. Per-season stats stay on each season row.
              </p>
            </div>
          </div>
        </header>

        {error && (
          <div className="shrink-0 rounded-lg border border-red-500/30 bg-red-950/35 px-3 py-2.5 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="grid min-h-0 w-full grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5 lg:items-stretch">
          <div className="flex flex-col gap-4 lg:col-span-4 lg:h-full">
            <SectionCard
              className={cardClass}
              title="RealGM ID"
              subtitle="Optional — match Excel import."
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
                  Use the same id as in your spreadsheet so imports merge
                  correctly.
                </p>
              </div>
            </SectionCard>

            <SectionCard
              className={cardClass}
              title="Season rows"
              subtitle="How updates apply."
              icon={<Layers className="h-4 w-4" strokeWidth={2} aria-hidden />}
            >
              <p className="text-xs leading-relaxed text-textGrey sm:text-sm">
                Profile fields and RealGM ID sync to every Firestore row for this
                player. Per-game stats on each season row are unchanged.
              </p>
            </SectionCard>
          </div>

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
                    <label className={labelClass}>Seasons (read-only)</label>
                    <div className={readOnlyFieldClass}>
                      {seasonsSummary ?? "—"}
                    </div>
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

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-white/10 pt-4 shadow-[inset_0_1px_0_0_rgba(176,55,255,0.1)]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-purpleFill/35 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={saving ? undefined : handleSave}
            disabled={saving}
            className="rounded-xl border border-purpleFill/50 bg-purplish/45 px-6 py-2.5 text-sm font-medium text-white shadow-[0_0_20px_rgba(176,55,255,0.12)] transition-colors hover:bg-purplish/65 hover:border-purpleFill disabled:opacity-45 disabled:pointer-events-none"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
