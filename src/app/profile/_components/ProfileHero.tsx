import Image from "next/image";
import { FaSpinner } from "react-icons/fa";
import { Pencil, Check, X, ShieldCheck, User, Mail } from "lucide-react";
import type { ProfileHeroProps } from "../_types";

export function ProfileHero({
  displayName,
  email,
  role,
  editingName,
  nameInput,
  onNameInputChange,
  onSaveName,
  onCancelName,
  onStartEditName,
  savingName,
  nameError,
  nameSaved,
}: ProfileHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-purplish/15 via-white/[0.04] to-transparent p-6 backdrop-blur-[12px] sm:p-8 lg:p-10">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-purpleFill/10 blur-3xl"
        aria-hidden
      />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8 lg:gap-10">
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-full bg-purpleFill/20 blur-xl" aria-hidden />
          <Image
            src="/icons/avatar.png"
            alt=""
            width={96}
            height={96}
            className="relative h-[88px] w-[88px] rounded-full border-2 border-purpleFill/30 object-cover sm:h-[96px] sm:w-[96px]"
          />
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {editingName ? (
              <div className="flex flex-wrap items-center gap-2">
                <input
                  autoFocus
                  value={nameInput}
                  onChange={(e) => onNameInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSaveName();
                    if (e.key === "Escape") onCancelName();
                  }}
                  className="min-w-[12rem] max-w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-base font-semibold text-white focus:border-purplish focus:outline-none focus:ring-2 focus:ring-purplish/30 sm:text-lg"
                  placeholder="Your name"
                />
                <button
                  type="button"
                  onClick={onSaveName}
                  disabled={savingName}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-purplish/25 text-purpleFill transition-colors hover:bg-purplish/35 disabled:opacity-50"
                  aria-label="Save name"
                >
                  {savingName ? (
                    <FaSpinner className="animate-spin" size={14} />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={onCancelName}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-textGrey transition-colors hover:bg-white/10"
                  aria-label="Cancel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {displayName || "No name set"}
                </h3>
                <button
                  type="button"
                  onClick={onStartEditName}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-textGrey transition-colors hover:bg-purplish/15 hover:text-purpleFill"
                  aria-label="Edit display name"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          {nameError && <p className="text-sm text-red-400">{nameError}</p>}
          {nameSaved && <p className="text-sm text-green-400">Name updated!</p>}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="inline-flex items-center gap-2 text-sm text-textGrey">
              <Mail className="h-4 w-4 shrink-0 text-purpleFill/80" aria-hidden />
              {email}
            </span>
            {role === "admin" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purpleFill/35 bg-purplish/20 px-3 py-1 text-xs font-semibold text-purpleFill">
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-medium text-textGrey">
                <User className="h-3.5 w-3.5" />
                Member
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
