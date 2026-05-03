import iso3166 from "iso-3166-1";

/** flagcdn.com only serves a fixed set of widths; arbitrary values (e.g. w24) return 404. */
const FLAGCDN_WIDTHS = [
  20, 40, 80, 120, 160, 240, 320, 440, 640, 1280, 2560,
] as const;

function resolveFlagcdnWidth(requested: number): number {
  const r = Number.isFinite(requested) ? requested : 20;
  const clamped = Math.max(16, Math.min(r, 2560));
  const hit = FLAGCDN_WIDTHS.find((w) => w >= clamped);
  return hit ?? 20;
}

/** First segment when country is "A / B" (matches player DB convention). */
function firstCountrySegment(country: string | undefined): string | undefined {
  if (!country?.trim()) return undefined;
  return country.split("/")[0].trim();
}

/**
 * Names/parts not resolved by iso-3166-1 or that need a specific flag file on flagcdn.
 * UK nations use ISO 3166-2 style codes that flagcdn exposes as gb-eng, gb-sct, etc.
 */
const FLAG_CODE_OVERRIDES: Record<string, string> = {
  england: "gb-eng",
  scotland: "gb-sct",
  wales: "gb-wls",
  "northern ireland": "gb-nir",
  "great britain": "gb",
  uk: "gb",
  "united kingdom": "gb",
};

/** Lowercase flagcdn path segment (e.g. `us`, `gb-eng`), or null if unknown. */
export function countryToFlagCode(country: string | undefined): string | null {
  const c = firstCountrySegment(country);
  if (!c) return null;

  const lower = c.toLowerCase();
  if (lower === "usa" || lower === "united states") return "us";

  const manual = FLAG_CODE_OVERRIDES[lower];
  if (manual) return manual.toLowerCase();

  const r = iso3166.whereCountry(c);
  return r ? r.alpha2.toLowerCase() : null;
}

export function countryFlagSrc(
  country: string | undefined,
  width = 20
): string | null {
  const code = countryToFlagCode(country);
  if (!code) return null;
  const w = resolveFlagcdnWidth(width);
  return `https://flagcdn.com/w${w}/${code}.png`;
}
