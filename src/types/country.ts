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
  coatOfArms?: string;
  airports?: AirportStats;
}
