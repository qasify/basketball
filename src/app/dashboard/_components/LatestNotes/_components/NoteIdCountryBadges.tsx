import React from "react";
import Image from "next/image";
import { countryFlagSrc } from "@/utils/countryFlag";

type Props = {
  playerId: number;
  /** Raw country string from roster (may include “ / league” segments). */
  countryRaw?: string;
  flagWidth: number;
  flagHeight: number;
  /** Extra classes for the flag+country pill (e.g. max-width). */
  countryPillClassName?: string;
  idBadgeClassName?: string;
};

/**
 * Shared “ID” chip + optional country flag pill for note list rows.
 */
export default function NoteIdCountryBadges({
  playerId,
  countryRaw,
  flagWidth,
  flagHeight,
  countryPillClassName = "max-w-[min(100%,14rem)]",
  idBadgeClassName = "shrink-0",
}: Props) {
  const countryLabel = countryRaw?.split("/")[0]?.trim();
  const flagSrc = countryFlagSrc(countryRaw, flagWidth);

  return (
    <>
      <span
        className={`inline-flex items-center rounded-md border border-purpleFill/35 bg-purpleFill/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-purpleFill tabular-nums ${idBadgeClassName}`}
      >
        ID {playerId}
      </span>
      {flagSrc && countryLabel ? (
        <span
          className={`inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] pl-1 pr-2 py-0.5 text-xs text-textGrey ${countryPillClassName}`}
        >
          <Image
            src={flagSrc}
            alt={countryLabel ? `${countryLabel} flag` : "Country flag"}
            width={flagWidth}
            height={flagHeight}
            className="rounded-sm object-cover shrink-0"
          />
          <span className="truncate" title={countryRaw}>
            {countryLabel}
          </span>
        </span>
      ) : null}
    </>
  );
}
