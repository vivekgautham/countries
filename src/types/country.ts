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

export type TaxSystemType =
  "zero_tax" | "territorial" | "non_dom" | "worldwide";

export interface TaxInfo {
  systemType: TaxSystemType;
  systemLabel: string;
  headlineRate: string; // e.g. "0%" or "0% - 37%"
  foreignIncomeTaxRate: string; // e.g. "0% (Tax-Free)"
  personalIncomeTaxRate: string; // e.g. "0%" or "0% - 37%"
  capitalGainsTaxRate?: string;
  corporateTaxRate?: string;
  residencyRule?: string;
  summary?: string;
  notes?: string;
  isZeroGlobalTax: boolean;
}

export interface EconomicBlocs {
  isG7: boolean;
  isG20: boolean;
  isG20Guest?: boolean;
  g20Status: "member" | "permanent_guest" | "non_member";
  isGCC?: boolean;
  isEU?: boolean;
  isSchengen?: boolean;
  isEurozone?: boolean;
  isNATO?: boolean;
  isBRICS?: boolean;
  statusLabel?: string;
}

export interface SectorComposition {
  services?: number;
  servicesYear?: number;
  industry?: number;
  industryYear?: number;
  agriculture?: number;
  agricultureYear?: number;
}

export interface TradeExposure {
  exports?: number;
  exportsYear?: number;
  imports?: number;
  importsYear?: number;
}

export interface GdpInfo {
  nominal: number; // Raw nominal GDP in current US$
  year: number; // Reporting year for nominal GDP (e.g. 2025)
  source: string; // e.g. "World Bank (WDI)"
  perCapita?: number; // GDP per capita in current US$
  perCapitaYear?: number; // Reporting year for GDP per capita
  population?: number; // Total population from World Bank
  populationYear?: number; // Reporting year for population
  populationSource?: string; // Data source for population (e.g. "World Bank (WDI)")
  formattedNominal?: string; // e.g. "$27.36T"
  formattedPerCapita?: string; // e.g. "$81,695"
  growth?: number; // Annual GDP growth rate in %
  growthYear?: number;
  inflation?: number; // Annual inflation rate (CPI) in %
  inflationYear?: number;
  lifeExpectancy?: number; // Life expectancy at birth in years
  lifeExpectancyYear?: number;
  internetUsers?: number; // Individuals using the Internet (% of population)
  internetUsersYear?: number;
  formattedGrowth?: string; // e.g. "+2.16%"
  formattedInflation?: string; // e.g. "2.95%"
  formattedLifeExpectancy?: string; // e.g. "78.9 yrs"
  formattedInternetUsers?: string; // e.g. "94.7%"
  ppp?: number; // GDP in PPP (current international $)
  pppYear?: number;
  pppPerCapita?: number; // GDP per capita in PPP (current international $)
  pppPerCapitaYear?: number;
  formattedPpp?: string; // e.g. "$30.77T"
  formattedPppPerCapita?: string; // e.g. "$90,027"
  sectors?: SectorComposition;
  trade?: TradeExposure;
  renewableEnergy?: number; // Renewable energy consumption (% of total final energy consumption)
  renewableEnergyYear?: number;
  co2Emissions?: number; // Total CO2 emissions in Mt CO2e
  co2EmissionsYear?: number;
  co2PerCapita?: number; // CO2 emissions per capita in metric tons
  co2PerCapitaYear?: number;
  ghgPerCapita?: number; // Total greenhouse gas emissions per capita (t CO2e/capita)
  ghgPerCapitaYear?: number;
  formattedRenewableEnergy?: string; // e.g. "61.4%"
  formattedCo2PerCapita?: string; // e.g. "13.6 t"
  forestCover?: number; // % of total land area covered by forests
  forestCoverYear?: number;
  formattedForestCover?: string; // e.g. "64.1%"
  electricPowerConsumption?: number; // kWh consumed per person annually
  electricPowerConsumptionYear?: number;
  formattedElectricPowerConsumption?: string; // e.g. "11,350 kWh"
  electricityAccess?: number; // % of population with electricity access
  electricityAccessYear?: number;
  formattedElectricityAccess?: string; // e.g. "100.0%"
  unemployment?: number; // Total unemployment rate (% of labor force)
  unemploymentYear?: number;
  formattedUnemployment?: string; // e.g. "3.8%"
  fertilityRate?: number; // Average births per woman
  fertilityRateYear?: number;
  formattedFertilityRate?: string; // e.g. "1.61"
  urbanPopulation?: number; // % of population living in urban centers
  urbanPopulationYear?: number;
  formattedUrbanPopulation?: string; // e.g. "81.2%"
  gini?: number; // Income inequality Gini index (0-100)
  giniYear?: number;
  formattedGini?: string; // e.g. "41.8"
  mobileSubscriptions?: number; // Mobile subscriptions per 100 people
  mobileSubscriptionsYear?: number;
  formattedMobileSubscriptions?: string; // e.g. "134.2 / 100"
  governmentDebt?: number; // Central government debt (% of GDP)
  governmentDebtYear?: number;
  formattedGovernmentDebt?: string; // e.g. "115.8% of GDP"
  fdiInflows?: number; // Foreign direct investment, net inflows (% of GDP)
  fdiInflowsYear?: number;
  formattedFdiInflows?: string; // e.g. "1.3% of GDP"
  literacyRate?: number; // Adult literacy rate (% of people ages 15+)
  literacyRateYear?: number;
  formattedLiteracyRate?: string; // e.g. "99.0%"
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
  tax?: TaxInfo;
  blocs?: EconomicBlocs;
  gdp?: GdpInfo;
}
