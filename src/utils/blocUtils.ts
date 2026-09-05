import { EconomicBlocs, UnifiedCountry } from "../types/country";

/**
 * G7 (Group of Seven) Sovereign Nation Members:
 * Canada, France, Germany, Italy, Japan, United Kingdom, United States.
 */
export const G7_COUNTRY_CODES = new Set<string>([
  "CA",
  "FR",
  "DE",
  "IT",
  "JP",
  "GB",
  "US",
]);

/**
 * G20 (Group of Twenty) Sovereign Nation Members:
 * 19 individual member nations (the EU and AU are organizational members).
 * Every G7 nation is also a member of the G20.
 */
export const G20_COUNTRY_CODES = new Set<string>([
  "AR", // Argentina
  "AU", // Australia
  "BR", // Brazil
  "CA", // Canada (G7)
  "CN", // China
  "FR", // France (G7)
  "DE", // Germany (G7)
  "IN", // India
  "ID", // Indonesia
  "IT", // Italy (G7)
  "JP", // Japan (G7)
  "KR", // South Korea
  "MX", // Mexico
  "RU", // Russia
  "SA", // Saudi Arabia
  "ZA", // South Africa
  "TR", // Turkey
  "GB", // United Kingdom (G7)
  "US", // United States (G7)
]);

/**
 * Permanent Guest Invitees to the G20:
 * Spain has held permanent guest invitee status since 2008.
 */
export const G20_GUEST_CODES = new Set<string>(["ES"]);

export function isG7Member(countryCode?: string): boolean {
  if (!countryCode) return false;
  return G7_COUNTRY_CODES.has(countryCode.toUpperCase());
}

export function isG20Member(countryCode?: string): boolean {
  if (!countryCode) return false;
  return G20_COUNTRY_CODES.has(countryCode.toUpperCase());
}

export function isG20Guest(countryCode?: string): boolean {
  if (!countryCode) return false;
  return G20_GUEST_CODES.has(countryCode.toUpperCase());
}

export function getEconomicBlocInfo(countryCode?: string): EconomicBlocs {
  if (!countryCode) {
    return {
      isG7: false,
      isG20: false,
      g20Status: "non_member",
    };
  }

  const code = countryCode.toUpperCase();
  const isG7 = G7_COUNTRY_CODES.has(code);
  const isG20 = G20_COUNTRY_CODES.has(code);
  const isGuest = G20_GUEST_CODES.has(code);

  let g20Status: "member" | "permanent_guest" | "non_member" = "non_member";
  if (isG20) {
    g20Status = "member";
  } else if (isGuest) {
    g20Status = "permanent_guest";
  }

  let statusLabel: string | undefined;
  if (isG7 && isG20) {
    statusLabel = "G7 & G20 Member";
  } else if (isG20) {
    statusLabel = "G20 Member";
  } else if (isGuest) {
    statusLabel = "G20 Permanent Guest";
  }

  return {
    isG7,
    isG20,
    isG20Guest: isGuest,
    g20Status,
    statusLabel,
  };
}

export interface BlocBadgeConfig {
  label: string;
  shortLabel: string;
  icon: string;
  tooltip: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}

export function getG7BadgeConfig(): BlocBadgeConfig {
  return {
    label: "G7 Member",
    shortLabel: "G7",
    icon: "🏛️",
    tooltip:
      "Group of Seven (G7) Member: One of the world's seven largest advanced economies",
    backgroundColor: "rgba(99, 102, 241, 0.18)",
    borderColor: "rgba(99, 102, 241, 0.45)",
    textColor: "#a5b4fc",
  };
}

export function getG20BadgeConfig(isGuest = false): BlocBadgeConfig {
  if (isGuest) {
    return {
      label: "G20 Permanent Guest",
      shortLabel: "G20 Guest",
      icon: "🌐",
      tooltip:
        "Permanent Guest Invitee to the Group of Twenty (G20) since 2008",
      backgroundColor: "rgba(245, 158, 11, 0.18)",
      borderColor: "rgba(245, 158, 11, 0.45)",
      textColor: "#fcd34d",
    };
  }

  return {
    label: "G20 Member",
    shortLabel: "G20",
    icon: "🌐",
    tooltip:
      "Group of Twenty (G20) Member: Premier forum for international economic cooperation",
    backgroundColor: "rgba(14, 165, 233, 0.18)",
    borderColor: "rgba(14, 165, 233, 0.45)",
    textColor: "#38bdf8",
  };
}

/**
 * Checks if search query contains G7/G20 search terms.
 */
export function matchesBlocQuery(
  country: UnifiedCountry,
  query: string,
): boolean {
  const q = query.toLowerCase().trim();
  const blocs = country.blocs;
  if (!blocs) return false;

  const g7Terms = ["g7", "g-7", "group of seven", "group of 7"];
  const isG7Search = g7Terms.some((term) => q === term || q.includes(term));
  if (isG7Search && blocs.isG7) {
    return true;
  }

  const g20Terms = ["g20", "g-20", "group of twenty", "group of 20"];
  const isG20Search = g20Terms.some((term) => q === term || q.includes(term));
  if (isG20Search && (blocs.isG20 || blocs.isG20Guest)) {
    return true;
  }

  return false;
}
