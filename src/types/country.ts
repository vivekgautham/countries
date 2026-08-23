export interface CountryName {
  common: string;
  official: string;
}

export interface CurrencyInfo {
  name: string;
  symbol?: string;
}

export interface IddInfo {
  root?: string;
  suffixes?: string[];
}

export interface CountryDetail {
  name: CountryName;
  cca2: string;
  cca3: string;
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  area?: number;
  currencies?: Record<string, CurrencyInfo>;
  languages?: Record<string, string>;
  idd?: IddInfo;
  timezones?: string[];
  borders?: string[];
  unMember?: boolean;
  landlocked?: boolean;
  coatOfArms?: {
    png?: string;
    svg?: string;
  };
  flags?: {
    png?: string;
    svg?: string;
    alt?: string;
  };
}

export interface MajorAirport {
  name: string;
  iata?: string;
  icao?: string;
  municipality?: string;
  type: string;
}

export interface AirportStats {
  total: number;
  active: number;
  large: number;
  medium: number;
  small: number;
  heliport: number;
  seaplane: number;
  balloonport: number;
  closed: number;
  scheduled: number;
  majorAirports: MajorAirport[];
}

export type NptStatus =
  | "nuclear_weapon_state"
  | "non_nuclear_weapon_state"
  | "non_party"
  | "withdrawn"
  | "abiding_state"
  | "dependent_territory";

export interface NptInfo {
  status: NptStatus;
  statusLabel: string;
  isParty: boolean;
  signedDate?: string;
  depositedDate?: string;
  depositaryLocation?: string;
  method?: string;
  sovereignState?: string;
  notes?: string;
}

export type TerritoryType =
  | "autonomous_region"
  | "constituent_country"
  | "special_administrative_region"
  | "overseas_territory"
  | "crown_dependency"
  | "overseas_collectivity"
  | "overseas_department"
  | "associated_state"
  | "external_territory"
  | "unincorporated_territory"
  | "special_municipality"
  | "disputed_territory";

export interface SovereignInfo {
  sovereignCode: string; // e.g. "DK"
  sovereignName: string; // e.g. "Denmark"
  territoryType: TerritoryType;
  typeLabel: string; // e.g. "Autonomous Constituent Country"
  notes?: string;
}

export interface AutonomousRegionInfo {
  code: string; // e.g. "GL"
  name: string; // e.g. "Greenland"
  officialName?: string;
  territoryType: TerritoryType;
  typeLabel: string;
  capital?: string;
  population?: number;
}

export interface UnifiedCountry {
  code: string; // ISO 2-letter (e.g. US)
  code3?: string; // ISO 3-letter (e.g. USA)
  name: string;
  officialName?: string;
  capital?: string;
  region: string;
  subregion?: string;
  population: number;
  area?: number;
  currencies?: string[];
  languages?: string[];
  phoneCode?: string;
  timezones?: string[];
  borders?: string[];
  unMember?: boolean;
  landlocked?: boolean;
  coatOfArms?: string;
  airports?: AirportStats;
  npt?: NptInfo;
  sovereignty?: SovereignInfo;
  autonomousRegions?: AutonomousRegionInfo[];
}
