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

/**
 * GCC (Gulf Cooperation Council) Sovereign Member States:
 * Bahrain, Kuwait, Oman, Qatar, Saudi Arabia, United Arab Emirates.
 */
export const GCC_COUNTRY_CODES = new Set<string>([
  "BH", // Bahrain
  "KW", // Kuwait
  "OM", // Oman
  "QA", // Qatar
  "SA", // Saudi Arabia (also G20)
  "AE", // United Arab Emirates
]);

/**
 * European Union (EU) - 27 Sovereign Member States
 */
export const EU_COUNTRY_CODES = new Set<string>([
  "AT", // Austria
  "BE", // Belgium
  "BG", // Bulgaria
  "HR", // Croatia
  "CY", // Cyprus
  "CZ", // Czechia
  "DK", // Denmark
  "EE", // Estonia
  "FI", // Finland
  "FR", // France
  "DE", // Germany
  "GR", // Greece
  "HU", // Hungary
  "IE", // Ireland
  "IT", // Italy
  "LV", // Latvia
  "LT", // Lithuania
  "LU", // Luxembourg
  "MT", // Malta
  "NL", // Netherlands
  "PL", // Poland
  "PT", // Portugal
  "RO", // Romania
  "SK", // Slovakia
  "SI", // Slovenia
  "ES", // Spain
  "SE", // Sweden
]);

/**
 * Schengen Area - 29 European States (25 EU members + 4 non-EU EFTA members)
 */
export const SCHENGEN_COUNTRY_CODES = new Set<string>([
  // 25 EU Member States:
  "AT",
  "BE",
  "BG",
  "HR",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  // 4 Non-EU Associated States:
  "IS", // Iceland
  "LI", // Liechtenstein
  "NO", // Norway
  "CH", // Switzerland
]);

/**
 * Eurozone (Euro Area) - 20 EU Member States using the Euro (€)
 */
export const EUROZONE_COUNTRY_CODES = new Set<string>([
  "AT", // Austria
  "BE", // Belgium
  "HR", // Croatia (joined 2023)
  "CY", // Cyprus
  "EE", // Estonia
  "FI", // Finland
  "FR", // France
  "DE", // Germany
  "GR", // Greece
  "IE", // Ireland
  "IT", // Italy
  "LV", // Latvia
  "LT", // Lithuania
  "LU", // Luxembourg
  "MT", // Malta
  "NL", // Netherlands
  "PT", // Portugal
  "SK", // Slovakia
  "SI", // Slovenia
  "ES", // Spain
]);

/**
 * NATO (North Atlantic Treaty Organization) - 32 Allied Nations
 */
export const NATO_COUNTRY_CODES = new Set<string>([
  "AL", // Albania
  "BE", // Belgium
  "BG", // Bulgaria
  "CA", // Canada
  "HR", // Croatia
  "CZ", // Czechia
  "DK", // Denmark
  "EE", // Estonia
  "FI", // Finland (joined 2023)
  "FR", // France
  "DE", // Germany
  "GR", // Greece
  "HU", // Hungary
  "IS", // Iceland
  "IT", // Italy
  "LV", // Latvia
  "LT", // Lithuania
  "LU", // Luxembourg
  "ME", // Montenegro
  "NL", // Netherlands
  "MK", // North Macedonia
  "NO", // Norway
  "PL", // Poland
  "PT", // Portugal
  "RO", // Romania
  "SK", // Slovakia
  "SI", // Slovenia
  "ES", // Spain
  "SE", // Sweden (joined 2024)
  "TR", // Turkey
  "GB", // United Kingdom
  "US", // United States
]);

/**
 * BRICS / BRICS+ - 10 Core & Expanded Member States
 */
export const BRICS_COUNTRY_CODES = new Set<string>([
  "BR", // Brazil (Founding)
  "RU", // Russia (Founding)
  "IN", // India (Founding)
  "CN", // China (Founding)
  "ZA", // South Africa (Joined 2010)
  "EG", // Egypt (Joined 2024)
  "ET", // Ethiopia (Joined 2024)
  "IR", // Iran (Joined 2024)
  "AE", // United Arab Emirates (Joined 2024)
  "SA", // Saudi Arabia (Joined 2024)
]);

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

export function isGCCMember(countryCode?: string): boolean {
  if (!countryCode) return false;
  return GCC_COUNTRY_CODES.has(countryCode.toUpperCase());
}

export function isEUMember(countryCode?: string): boolean {
  if (!countryCode) return false;
  return EU_COUNTRY_CODES.has(countryCode.toUpperCase());
}

export function isSchengenMember(countryCode?: string): boolean {
  if (!countryCode) return false;
  return SCHENGEN_COUNTRY_CODES.has(countryCode.toUpperCase());
}

export function isEurozoneMember(countryCode?: string): boolean {
  if (!countryCode) return false;
  return EUROZONE_COUNTRY_CODES.has(countryCode.toUpperCase());
}

export function isNATOMember(countryCode?: string): boolean {
  if (!countryCode) return false;
  return NATO_COUNTRY_CODES.has(countryCode.toUpperCase());
}

export function isBRICSMember(countryCode?: string): boolean {
  if (!countryCode) return false;
  return BRICS_COUNTRY_CODES.has(countryCode.toUpperCase());
}

export function getEconomicBlocInfo(countryCode?: string): EconomicBlocs {
  if (!countryCode) {
    return {
      isG7: false,
      isG20: false,
      isGCC: false,
      isEU: false,
      isSchengen: false,
      isEurozone: false,
      isNATO: false,
      isBRICS: false,
      g20Status: "non_member",
    };
  }

  const code = countryCode.toUpperCase();
  const isG7 = G7_COUNTRY_CODES.has(code);
  const isG20 = G20_COUNTRY_CODES.has(code);
  const isGuest = G20_GUEST_CODES.has(code);
  const isGCC = GCC_COUNTRY_CODES.has(code);
  const isEU = EU_COUNTRY_CODES.has(code);
  const isSchengen = SCHENGEN_COUNTRY_CODES.has(code);
  const isEurozone = EUROZONE_COUNTRY_CODES.has(code);
  const isNATO = NATO_COUNTRY_CODES.has(code);
  const isBRICS = BRICS_COUNTRY_CODES.has(code);

  let g20Status: "member" | "permanent_guest" | "non_member" = "non_member";
  if (isG20) {
    g20Status = "member";
  } else if (isGuest) {
    g20Status = "permanent_guest";
  }

  const statusLabels: string[] = [];
  if (isG7) statusLabels.push("G7");
  if (isG20) statusLabels.push("G20");
  else if (isGuest) statusLabels.push("G20 Guest");
  if (isEU) statusLabels.push("EU");
  if (isNATO) statusLabels.push("NATO");
  if (isBRICS) statusLabels.push("BRICS+");
  if (isGCC) statusLabels.push("GCC");

  const statusLabel =
    statusLabels.length > 0 ? statusLabels.join(" • ") : undefined;

  return {
    isG7,
    isG20,
    isG20Guest: isGuest,
    isGCC,
    isEU,
    isSchengen,
    isEurozone,
    isNATO,
    isBRICS,
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

export function getGCCBadgeConfig(): BlocBadgeConfig {
  return {
    label: "GCC Member",
    shortLabel: "GCC",
    icon: "🤝",
    tooltip:
      "Gulf Cooperation Council (GCC) Member State: Regional political and economic union of Arab states of the Persian Gulf",
    backgroundColor: "rgba(16, 185, 129, 0.18)",
    borderColor: "rgba(16, 185, 129, 0.45)",
    textColor: "#6ee7b7",
  };
}

export function getEUBadgeConfig(): BlocBadgeConfig {
  return {
    label: "EU Member",
    shortLabel: "EU",
    icon: "🇪🇺",
    tooltip:
      "European Union (EU) Member State: Political and economic union of 27 European nations",
    backgroundColor: "rgba(59, 130, 246, 0.18)",
    borderColor: "rgba(59, 130, 246, 0.45)",
    textColor: "#93c5fd",
  };
}

export function getSchengenBadgeConfig(): BlocBadgeConfig {
  return {
    label: "Schengen Area",
    shortLabel: "Schengen",
    icon: "🛂",
    tooltip:
      "Schengen Area Member: Border-free free-movement zone of 29 European countries",
    backgroundColor: "rgba(6, 182, 212, 0.18)",
    borderColor: "rgba(6, 182, 212, 0.45)",
    textColor: "#67e8f9",
  };
}

export function getEurozoneBadgeConfig(): BlocBadgeConfig {
  return {
    label: "Eurozone",
    shortLabel: "Eurozone",
    icon: "💶",
    tooltip:
      "Eurozone Member: European monetary union using the Euro (€) as legal currency",
    backgroundColor: "rgba(16, 185, 129, 0.18)",
    borderColor: "rgba(16, 185, 129, 0.45)",
    textColor: "#6ee7b7",
  };
}

export function getNATOBadgeConfig(): BlocBadgeConfig {
  return {
    label: "NATO Ally",
    shortLabel: "NATO",
    icon: "🛡️",
    tooltip:
      "North Atlantic Treaty Organization (NATO) Member State: Mutual defense alliance of 32 nations",
    backgroundColor: "rgba(99, 102, 241, 0.18)",
    borderColor: "rgba(99, 102, 241, 0.45)",
    textColor: "#a5b4fc",
  };
}

export function getBRICSBadgeConfig(): BlocBadgeConfig {
  return {
    label: "BRICS+ Member",
    shortLabel: "BRICS+",
    icon: "🪙",
    tooltip:
      "BRICS+ Intergovernmental Organization: Coalition of major emerging world economies",
    backgroundColor: "rgba(245, 158, 11, 0.18)",
    borderColor: "rgba(245, 158, 11, 0.45)",
    textColor: "#fcd34d",
  };
}

/**
 * Checks if search query contains G7/G20/GCC/EU/Schengen/Eurozone/NATO/BRICS search terms.
 */
export function matchesBlocQuery(
  country: UnifiedCountry,
  query: string,
): boolean {
  const q = query.toLowerCase().trim();
  const blocs = country.blocs;
  if (!blocs) return false;

  const isG7Search =
    /\bg-?7\b/i.test(q) ||
    q.includes("group of seven") ||
    q.includes("group of 7");
  if (isG7Search && blocs.isG7) {
    return true;
  }

  const isG20Search =
    /\bg-?20\b/i.test(q) ||
    q.includes("group of twenty") ||
    q.includes("group of 20");
  if (isG20Search && (blocs.isG20 || blocs.isG20Guest)) {
    return true;
  }

  const isGCCSearch =
    /\bg\.?c\.?c\.?\b/i.test(q) ||
    q.includes("gulf cooperation council") ||
    q.includes("gulf countries") ||
    q.includes("gulf states");
  if (isGCCSearch && blocs.isGCC) {
    return true;
  }

  const isEUSearch =
    /\b(eu|e\.u\.)\b/i.test(q) ||
    q.includes("european union") ||
    q.includes("eu member") ||
    q.includes("eu countries");
  if (isEUSearch && blocs.isEU) {
    return true;
  }

  const isSchengenSearch =
    q.includes("schengen") ||
    q.includes("schengen area") ||
    q.includes("schengen zone");
  if (isSchengenSearch && blocs.isSchengen) {
    return true;
  }

  const isEurozoneSearch =
    q.includes("eurozone") ||
    q.includes("euro zone") ||
    q.includes("euro area");
  if (isEurozoneSearch && blocs.isEurozone) {
    return true;
  }

  const isNATOSearch =
    /\bn\.?a\.?t\.?o\.?\b/i.test(q) || q.includes("north atlantic treaty");
  if (isNATOSearch && blocs.isNATO) {
    return true;
  }

  const isBRICSSearch =
    /\bbrics?\+?\b/i.test(q) || q.includes("brics") || q.includes("brics+");
  if (isBRICSSearch && blocs.isBRICS) {
    return true;
  }

  return false;
}

export interface BlocFilterOption {
  id: string;
  label: string;
  icon: string;
  tooltip: string;
}

export const BLOC_FILTER_OPTIONS: BlocFilterOption[] = [
  {
    id: "all",
    label: "All Blocs",
    icon: "🌐",
    tooltip: "All countries (no regional bloc filter)",
  },
  {
    id: "g7",
    label: "G7",
    icon: "🏛️",
    tooltip: "Group of Seven (7 major advanced economies)",
  },
  {
    id: "g20",
    label: "G20",
    icon: "🌐",
    tooltip: "Group of Twenty (19 leading economies + permanent guest)",
  },
  {
    id: "brics",
    label: "BRICS+",
    icon: "🪙",
    tooltip: "BRICS+ coalition of emerging global economies (10 member states)",
  },
  {
    id: "eu",
    label: "EU",
    icon: "🇪🇺",
    tooltip: "European Union (27 sovereign member states)",
  },
  {
    id: "nato",
    label: "NATO",
    icon: "🛡️",
    tooltip: "North Atlantic Treaty Organization (32 allied nations)",
  },
  {
    id: "gcc",
    label: "GCC",
    icon: "🤝",
    tooltip: "Gulf Cooperation Council (6 Arabian Gulf member states)",
  },
  {
    id: "schengen",
    label: "Schengen",
    icon: "🛂",
    tooltip: "Schengen Area border-free travel zone (29 European states)",
  },
  {
    id: "eurozone",
    label: "Eurozone",
    icon: "💶",
    tooltip: "Eurozone monetary union (20 EU member states using the Euro)",
  },
];

export function matchesBlocFilter(
  country: UnifiedCountry,
  filterId: string,
): boolean {
  if (filterId === "all") return true;
  const blocs = country.blocs;
  if (!blocs) return false;

  switch (filterId) {
    case "g7":
      return Boolean(blocs.isG7);
    case "g20":
      return Boolean(blocs.isG20 || blocs.isG20Guest);
    case "brics":
      return Boolean(blocs.isBRICS);
    case "eu":
      return Boolean(blocs.isEU);
    case "nato":
      return Boolean(blocs.isNATO);
    case "gcc":
      return Boolean(blocs.isGCC);
    case "schengen":
      return Boolean(blocs.isSchengen);
    case "eurozone":
      return Boolean(blocs.isEurozone);
    default:
      return true;
  }
}
