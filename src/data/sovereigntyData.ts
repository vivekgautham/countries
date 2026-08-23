import { SovereignInfo } from "../types/country";

/**
 * Sovereign relationships and autonomous territory mappings for entities across the globe.
 */
export const SOVEREIGNTY_DATA: Record<string, SovereignInfo> = {
  GL: {
    sovereignCode: "DK",
    sovereignName: "Denmark",
    territoryType: "constituent_country",
    typeLabel: "Autonomous Constituent Country",
    notes:
      "Self-governing autonomous territory within the Kingdom of Denmark since 1979 (expanded self-rule in 2009).",
  },
  FO: {
    sovereignCode: "DK",
    sovereignName: "Denmark",
    territoryType: "constituent_country",
    typeLabel: "Autonomous Constituent Country",
    notes:
      "Self-governing autonomous territory within the Kingdom of Denmark since 1948.",
  },
  HK: {
    sovereignCode: "CN",
    sovereignName: "China",
    territoryType: "special_administrative_region",
    typeLabel: "Special Administrative Region (SAR)",
    notes:
      'Governed under the "One Country, Two Systems" framework with a high degree of autonomy.',
  },
  MO: {
    sovereignCode: "CN",
    sovereignName: "China",
    territoryType: "special_administrative_region",
    typeLabel: "Special Administrative Region (SAR)",
    notes:
      'Governed under the "One Country, Two Systems" framework with a high degree of autonomy.',
  },
  AX: {
    sovereignCode: "FI",
    sovereignName: "Finland",
    territoryType: "autonomous_region",
    typeLabel: "Autonomous Region",
    notes:
      "Demilitarized, Swedish-speaking autonomous region of Finland guaranteed by international treaty.",
  },
  AW: {
    sovereignCode: "NL",
    sovereignName: "Netherlands",
    territoryType: "constituent_country",
    typeLabel: "Autonomous Constituent Country",
    notes: "Autonomous constituent country of the Kingdom of the Netherlands.",
  },
  CW: {
    sovereignCode: "NL",
    sovereignName: "Netherlands",
    territoryType: "constituent_country",
    typeLabel: "Autonomous Constituent Country",
    notes: "Autonomous constituent country of the Kingdom of the Netherlands.",
  },
  SX: {
    sovereignCode: "NL",
    sovereignName: "Netherlands",
    territoryType: "constituent_country",
    typeLabel: "Autonomous Constituent Country",
    notes: "Autonomous constituent country of the Kingdom of the Netherlands.",
  },
  BQ: {
    sovereignCode: "NL",
    sovereignName: "Netherlands",
    territoryType: "special_municipality",
    typeLabel: "Special Municipalities (BES Islands)",
    notes:
      "Comprises Bonaire, Sint Eustatius, and Saba as special public bodies of the Netherlands.",
  },
  PR: {
    sovereignCode: "US",
    sovereignName: "United States",
    territoryType: "unincorporated_territory",
    typeLabel: "Unincorporated Territory (Commonwealth)",
    notes:
      "Self-governing organized commonwealth territory under United States sovereignty.",
  },
  GU: {
    sovereignCode: "US",
    sovereignName: "United States",
    territoryType: "unincorporated_territory",
    typeLabel: "Unincorporated Organized Territory",
    notes: "Organized territory of the United States in the western Pacific.",
  },
  VI: {
    sovereignCode: "US",
    sovereignName: "United States",
    territoryType: "unincorporated_territory",
    typeLabel: "Unincorporated Organized Territory",
    notes: "Organized territory of the United States in the Caribbean.",
  },
  MP: {
    sovereignCode: "US",
    sovereignName: "United States",
    territoryType: "unincorporated_territory",
    typeLabel: "Unincorporated Territory (Commonwealth)",
    notes:
      "Self-governing commonwealth in political union with the United States.",
  },
  AS: {
    sovereignCode: "US",
    sovereignName: "United States",
    territoryType: "unincorporated_territory",
    typeLabel: "Unincorporated Unorganized Territory",
    notes:
      "Self-governing unincorporated territory of the United States in the South Pacific.",
  },
  UM: {
    sovereignCode: "US",
    sovereignName: "United States",
    territoryType: "unincorporated_territory",
    typeLabel: "Unincorporated Unorganized Territory",
    notes:
      "Nine insular areas in the Pacific and Caribbean under US sovereignty.",
  },
  BM: {
    sovereignCode: "GB",
    sovereignName: "United Kingdom",
    territoryType: "overseas_territory",
    typeLabel: "British Overseas Territory",
    notes:
      "Oldest self-governing British Overseas Territory with its own internal constitution.",
  },
  KY: {
    sovereignCode: "GB",
    sovereignName: "United Kingdom",
    territoryType: "overseas_territory",
    typeLabel: "British Overseas Territory",
    notes:
      "Self-governing British Overseas Territory in the western Caribbean.",
  },
  VG: {
    sovereignCode: "GB",
    sovereignName: "United Kingdom",
    territoryType: "overseas_territory",
    typeLabel: "British Overseas Territory",
    notes: "Self-governing British Overseas Territory in the Caribbean.",
  },
  GI: {
    sovereignCode: "GB",
    sovereignName: "United Kingdom",
    territoryType: "overseas_territory",
    typeLabel: "British Overseas Territory",
    notes:
      "Self-governing British Overseas Territory on the southern tip of the Iberian Peninsula.",
  },
  FK: {
    sovereignCode: "GB",
    sovereignName: "United Kingdom",
    territoryType: "overseas_territory",
    typeLabel: "British Overseas Territory",
    notes: "Self-governing British Overseas Territory in the South Atlantic.",
  },
  TC: {
    sovereignCode: "GB",
    sovereignName: "United Kingdom",
    territoryType: "overseas_territory",
    typeLabel: "British Overseas Territory",
    notes: "British Overseas Territory in the Lucayan Archipelago.",
  },
  AI: {
    sovereignCode: "GB",
    sovereignName: "United Kingdom",
    territoryType: "overseas_territory",
    typeLabel: "British Overseas Territory",
    notes: "British Overseas Territory in the Eastern Caribbean.",
  },
  MS: {
    sovereignCode: "GB",
    sovereignName: "United Kingdom",
    territoryType: "overseas_territory",
    typeLabel: "British Overseas Territory",
    notes: "British Overseas Territory in the Leeward Islands.",
  },
  SH: {
    sovereignCode: "GB",
    sovereignName: "United Kingdom",
    territoryType: "overseas_territory",
    typeLabel: "British Overseas Territory",
    notes:
      "British Overseas Territory comprising Saint Helena, Ascension Island, and Tristan da Cunha.",
  },
  PN: {
    sovereignCode: "GB",
    sovereignName: "United Kingdom",
    territoryType: "overseas_territory",
    typeLabel: "British Overseas Territory",
    notes: "British Overseas Territory in the southern Pacific Ocean.",
  },
  IO: {
    sovereignCode: "GB",
    sovereignName: "United Kingdom",
    territoryType: "overseas_territory",
    typeLabel: "British Overseas Territory",
    notes:
      "Overseas territory of the United Kingdom situated in the Indian Ocean.",
  },
  GS: {
    sovereignCode: "GB",
    sovereignName: "United Kingdom",
    territoryType: "overseas_territory",
    typeLabel: "British Overseas Territory",
    notes: "British Overseas Territory in the southern Atlantic Ocean.",
  },
  IM: {
    sovereignCode: "GB",
    sovereignName: "United Kingdom",
    territoryType: "crown_dependency",
    typeLabel: "Crown Dependency",
    notes:
      "Self-governing British Crown Dependency with its own parliament (Tynwald).",
  },
  JE: {
    sovereignCode: "GB",
    sovereignName: "United Kingdom",
    territoryType: "crown_dependency",
    typeLabel: "Crown Dependency",
    notes: "Self-governing British Crown Dependency in the Channel Islands.",
  },
  GG: {
    sovereignCode: "GB",
    sovereignName: "United Kingdom",
    territoryType: "crown_dependency",
    typeLabel: "Crown Dependency",
    notes:
      "Self-governing British Crown Dependency in the Channel Islands (Bailiwick of Guernsey).",
  },
  PF: {
    sovereignCode: "FR",
    sovereignName: "France",
    territoryType: "overseas_collectivity",
    typeLabel: "Overseas Country / Collectivity (POM)",
    notes: "Overseas collectivity of France with broad political autonomy.",
  },
  NC: {
    sovereignCode: "FR",
    sovereignName: "France",
    territoryType: "overseas_collectivity",
    typeLabel: "Sui Generis Collectivity",
    notes:
      "Special status collectivity of France with devolved legislative powers under the Nouméa Accord.",
  },
  BL: {
    sovereignCode: "FR",
    sovereignName: "France",
    territoryType: "overseas_collectivity",
    typeLabel: "Overseas Collectivity (COM)",
    notes: "Overseas collectivity of France in the Caribbean.",
  },
  MF: {
    sovereignCode: "FR",
    sovereignName: "France",
    territoryType: "overseas_collectivity",
    typeLabel: "Overseas Collectivity (COM)",
    notes:
      "Overseas collectivity of France on the northern part of Saint Martin island.",
  },
  PM: {
    sovereignCode: "FR",
    sovereignName: "France",
    territoryType: "overseas_collectivity",
    typeLabel: "Overseas Collectivity (COM)",
    notes:
      "Overseas collectivity of France off the coast of Newfoundland, Canada.",
  },
  WF: {
    sovereignCode: "FR",
    sovereignName: "France",
    territoryType: "overseas_collectivity",
    typeLabel: "Overseas Collectivity (COM)",
    notes: "Overseas collectivity of France in the South Pacific.",
  },
  TF: {
    sovereignCode: "FR",
    sovereignName: "France",
    territoryType: "overseas_territory",
    typeLabel: "Overseas Territory (TOM)",
    notes:
      "Overseas territory of France comprising volcanic islands and Antarctic claims.",
  },
  GP: {
    sovereignCode: "FR",
    sovereignName: "France",
    territoryType: "overseas_department",
    typeLabel: "Overseas Department and Region (DOM/ROM)",
    notes:
      "Integral part of the French Republic and an outermost region of the European Union.",
  },
  MQ: {
    sovereignCode: "FR",
    sovereignName: "France",
    territoryType: "overseas_department",
    typeLabel: "Overseas Department and Region (DOM/ROM)",
    notes:
      "Integral part of the French Republic and an outermost region of the European Union.",
  },
  GF: {
    sovereignCode: "FR",
    sovereignName: "France",
    territoryType: "overseas_department",
    typeLabel: "Overseas Department and Region (DOM/ROM)",
    notes:
      "Integral part of the French Republic in South America, home to Guiana Space Centre.",
  },
  RE: {
    sovereignCode: "FR",
    sovereignName: "France",
    territoryType: "overseas_department",
    typeLabel: "Overseas Department and Region (DOM/ROM)",
    notes: "Integral part of the French Republic in the Indian Ocean.",
  },
  YT: {
    sovereignCode: "FR",
    sovereignName: "France",
    territoryType: "overseas_department",
    typeLabel: "Overseas Department and Region (DOM/ROM)",
    notes: "Integral part of the French Republic in the Mozambique Channel.",
  },
  CK: {
    sovereignCode: "NZ",
    sovereignName: "New Zealand",
    territoryType: "associated_state",
    typeLabel: "Associated State (Free Association)",
    notes:
      "Self-governing democracy in free association with New Zealand; citizens hold NZ citizenship.",
  },
  NU: {
    sovereignCode: "NZ",
    sovereignName: "New Zealand",
    territoryType: "associated_state",
    typeLabel: "Associated State (Free Association)",
    notes:
      "Self-governing democracy in free association with New Zealand; citizens hold NZ citizenship.",
  },
  TK: {
    sovereignCode: "NZ",
    sovereignName: "New Zealand",
    territoryType: "external_territory",
    typeLabel: "Dependent Territory",
    notes: "Non-self-governing territory of New Zealand in the South Pacific.",
  },
  CX: {
    sovereignCode: "AU",
    sovereignName: "Australia",
    territoryType: "external_territory",
    typeLabel: "External Territory",
    notes:
      "Non-self-governing external territory of Australia in the Indian Ocean.",
  },
  CC: {
    sovereignCode: "AU",
    sovereignName: "Australia",
    territoryType: "external_territory",
    typeLabel: "External Territory",
    notes:
      "Non-self-governing external territory of Australia in the Indian Ocean.",
  },
  NF: {
    sovereignCode: "AU",
    sovereignName: "Australia",
    territoryType: "external_territory",
    typeLabel: "External Territory",
    notes: "External territory of Australia in the Pacific Ocean.",
  },
  HM: {
    sovereignCode: "AU",
    sovereignName: "Australia",
    territoryType: "external_territory",
    typeLabel: "External Territory",
    notes: "Subantarctic external territory of Australia.",
  },
  SJ: {
    sovereignCode: "NO",
    sovereignName: "Norway",
    territoryType: "autonomous_region",
    typeLabel: "Unincorporated Territory (Svalbard Treaty)",
    notes:
      "Governed under the international Svalbard Treaty of 1920 recognizing Norwegian sovereignty with special rights.",
  },
  BV: {
    sovereignCode: "NO",
    sovereignName: "Norway",
    territoryType: "external_territory",
    typeLabel: "Dependent Territory",
    notes: "Uninhabited volcanic subantarctic dependency of Norway.",
  },
};
