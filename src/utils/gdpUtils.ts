import gdpDataRaw from "../data/gdp.json";
import { GdpInfo, UnifiedCountry } from "../types/country";

const gdpDataset = gdpDataRaw as Record<
  string,
  {
    nominal?: number;
    year?: number;
    population?: number;
    populationYear?: number;
    populationSource?: string;
    perCapita?: number;
    perCapitaYear?: number;
    source?: string;
    growth?: number;
    growthYear?: number;
    inflation?: number;
    inflationYear?: number;
    lifeExpectancy?: number;
    lifeExpectancyYear?: number;
    internetUsers?: number;
    internetUsersYear?: number;
    ppp?: number;
    pppYear?: number;
    pppPerCapita?: number;
    pppPerCapitaYear?: number;
    agricultureGdp?: number;
    agricultureGdpYear?: number;
    industryGdp?: number;
    industryGdpYear?: number;
    servicesGdp?: number;
    servicesGdpYear?: number;
    exportsGdp?: number;
    exportsGdpYear?: number;
    importsGdp?: number;
    importsGdpYear?: number;
    renewableEnergy?: number;
    renewableEnergyYear?: number;
    co2Emissions?: number;
    co2EmissionsYear?: number;
    co2PerCapita?: number;
    co2PerCapitaYear?: number;
    ghgPerCapita?: number;
    ghgPerCapitaYear?: number;
  }
>;

/**
 * Formats nominal GDP into human-readable compact notation:
 * >= 1 Trillion: $27.36T
 * >= 1 Billion:  $450.2B
 * >= 1 Million:  $850.5M
 * < 1 Million:   $500K
 */
export function formatGdp(nominal?: number): string {
  if (nominal === undefined || nominal === null || isNaN(nominal)) {
    return "N/A";
  }

  if (nominal >= 1e12) {
    return `$${(nominal / 1e12).toFixed(2)}T`;
  }
  if (nominal >= 1e9) {
    return `$${(nominal / 1e9).toFixed(1)}B`;
  }
  if (nominal >= 1e6) {
    return `$${(nominal / 1e6).toFixed(1)}M`;
  }
  if (nominal >= 1e3) {
    return `$${(nominal / 1e3).toFixed(0)}K`;
  }
  return `$${nominal.toLocaleString()}`;
}

/**
 * Formats nominal GDP in full notation with word units:
 * e.g. "$27.36 Trillion" or "$450.2 Billion"
 */
export function formatGdpFull(nominal?: number): string {
  if (nominal === undefined || nominal === null || isNaN(nominal)) {
    return "N/A";
  }

  if (nominal >= 1e12) {
    return `$${(nominal / 1e12).toFixed(2)} Trillion`;
  }
  if (nominal >= 1e9) {
    return `$${(nominal / 1e9).toFixed(2)} Billion`;
  }
  if (nominal >= 1e6) {
    return `$${(nominal / 1e6).toFixed(2)} Million`;
  }
  return `$${nominal.toLocaleString()}`;
}

/**
 * Formats GDP per capita:
 * e.g. "$81,695"
 */
export function formatGdpPerCapita(perCapita?: number): string {
  if (perCapita === undefined || perCapita === null || isNaN(perCapita)) {
    return "N/A";
  }
  return `$${Math.round(perCapita).toLocaleString()}`;
}

/**
 * Formats annual GDP growth rate with +/- prefix:
 * e.g. "+2.2%" or "-1.5%"
 */
export function formatGdpGrowth(growth?: number): string {
  if (growth === undefined || growth === null || isNaN(growth)) {
    return "N/A";
  }
  const prefix = growth > 0 ? "+" : "";
  return `${prefix}${growth.toFixed(1)}%`;
}

/**
 * Formats annual inflation rate (CPI):
 * e.g. "2.9%"
 */
export function formatInflation(inflation?: number): string {
  if (inflation === undefined || inflation === null || isNaN(inflation)) {
    return "N/A";
  }
  return `${inflation.toFixed(1)}%`;
}

/**
 * Formats life expectancy:
 * e.g. "78.9 yrs"
 */
export function formatLifeExpectancy(lifeExpectancy?: number): string {
  if (
    lifeExpectancy === undefined ||
    lifeExpectancy === null ||
    isNaN(lifeExpectancy)
  ) {
    return "N/A";
  }
  return `${lifeExpectancy.toFixed(1)} yrs`;
}

/**
 * Formats internet adoption / usage rate:
 * e.g. "94.7%"
 */
export function formatInternetUsage(usage?: number): string {
  if (usage === undefined || usage === null || isNaN(usage)) {
    return "N/A";
  }
  return `${usage.toFixed(1)}%`;
}

/**
 * Formats percentage value:
 * e.g. "76.3%"
 */
export function formatPercent(val?: number): string {
  if (val === undefined || val === null || isNaN(val)) {
    return "N/A";
  }
  return `${val.toFixed(1)}%`;
}

/**
 * Formats GDP (PPP) in compact notation:
 * e.g. "$30.77T"
 */
export function formatPpp(ppp?: number): string {
  if (ppp === undefined || ppp === null || isNaN(ppp)) {
    return "N/A";
  }
  return formatGdp(ppp);
}

/**
 * Formats GDP (PPP) in full word notation:
 * e.g. "$30.77 Trillion (PPP)"
 */
export function formatPppFull(ppp?: number): string {
  if (ppp === undefined || ppp === null || isNaN(ppp)) {
    return "N/A";
  }
  return `${formatGdpFull(ppp)} (PPP)`;
}

/**
 * Formats GDP per capita (PPP):
 * e.g. "$90,027"
 */
export function formatPppPerCapita(pppPerCapita?: number): string {
  if (
    pppPerCapita === undefined ||
    pppPerCapita === null ||
    isNaN(pppPerCapita)
  ) {
    return "N/A";
  }
  return `$${Math.round(pppPerCapita).toLocaleString()}`;
}

/**
 * Formats renewable energy consumption percentage:
 * e.g. "61.4%"
 */
export function formatRenewableEnergy(val?: number): string {
  if (val === undefined || val === null || isNaN(val)) {
    return "N/A";
  }
  return `${val.toFixed(1)}%`;
}

/**
 * Formats CO2 emissions per capita in metric tons:
 * e.g. "13.6 t"
 */
export function formatCo2PerCapita(val?: number): string {
  if (val === undefined || val === null || isNaN(val)) {
    return "N/A";
  }
  return `${val.toFixed(1)} t`;
}

/**
 * Formats total CO2 emissions in Megatons (Mt) or Gigatons (Gt):
 * e.g. "4,632 Mt" or "13.12 Gt"
 */
export function formatCo2Emissions(val?: number): string {
  if (val === undefined || val === null || isNaN(val)) {
    return "N/A";
  }
  if (val >= 1000) {
    return `${(val / 1000).toFixed(2)} Gt`;
  }
  return `${val.toLocaleString(undefined, { maximumFractionDigits: 1 })} Mt`;
}

/**
 * Look up GDP info by 2-letter country code and retrieve official World Bank
 * GDP, population, GDP per capita, growth, inflation, life expectancy, internet usage,
 * PPP, sector composition, and trade indicators.
 */
export function getGdpInfo(
  countryCode?: string,
  fallbackPopulation?: number,
): GdpInfo | undefined {
  if (!countryCode) return undefined;
  const code = countryCode.toUpperCase();
  const raw = gdpDataset[code];
  if (!raw) return undefined;

  const nominal = raw.nominal || 0;
  const year = raw.year || new Date().getFullYear();
  const population = raw.population || fallbackPopulation;
  const perCapita =
    raw.perCapita ??
    (population && population > 0 && nominal > 0
      ? Math.round(nominal / population)
      : undefined);

  const hasSectors =
    raw.servicesGdp !== undefined ||
    raw.industryGdp !== undefined ||
    raw.agricultureGdp !== undefined;

  const hasTrade = raw.exportsGdp !== undefined || raw.importsGdp !== undefined;

  return {
    nominal,
    year,
    source: raw.source || "World Bank (WDI)",
    population: raw.population,
    populationYear: raw.populationYear,
    populationSource:
      raw.populationSource ||
      (raw.population
        ? raw.source || "World Bank (WDI)"
        : "National Census / UN"),
    perCapita,
    perCapitaYear: raw.perCapitaYear || year,
    formattedNominal: nominal > 0 ? formatGdp(nominal) : undefined,
    formattedPerCapita: perCapita ? formatGdpPerCapita(perCapita) : undefined,
    growth: raw.growth,
    growthYear: raw.growthYear,
    inflation: raw.inflation,
    inflationYear: raw.inflationYear,
    lifeExpectancy: raw.lifeExpectancy,
    lifeExpectancyYear: raw.lifeExpectancyYear,
    internetUsers: raw.internetUsers,
    internetUsersYear: raw.internetUsersYear,
    formattedGrowth:
      raw.growth !== undefined ? formatGdpGrowth(raw.growth) : undefined,
    formattedInflation:
      raw.inflation !== undefined ? formatInflation(raw.inflation) : undefined,
    formattedLifeExpectancy:
      raw.lifeExpectancy !== undefined
        ? formatLifeExpectancy(raw.lifeExpectancy)
        : undefined,
    formattedInternetUsers:
      raw.internetUsers !== undefined
        ? formatInternetUsage(raw.internetUsers)
        : undefined,
    ppp: raw.ppp,
    pppYear: raw.pppYear,
    pppPerCapita: raw.pppPerCapita,
    pppPerCapitaYear: raw.pppPerCapitaYear,
    formattedPpp: raw.ppp ? formatPpp(raw.ppp) : undefined,
    formattedPppPerCapita: raw.pppPerCapita
      ? formatPppPerCapita(raw.pppPerCapita)
      : undefined,
    sectors: hasSectors
      ? {
          services: raw.servicesGdp,
          servicesYear: raw.servicesGdpYear,
          industry: raw.industryGdp,
          industryYear: raw.industryGdpYear,
          agriculture: raw.agricultureGdp,
          agricultureYear: raw.agricultureGdpYear,
        }
      : undefined,
    trade: hasTrade
      ? {
          exports: raw.exportsGdp,
          exportsYear: raw.exportsGdpYear,
          imports: raw.importsGdp,
          importsYear: raw.importsGdpYear,
        }
      : undefined,
    renewableEnergy: raw.renewableEnergy,
    renewableEnergyYear: raw.renewableEnergyYear,
    co2Emissions: raw.co2Emissions,
    co2EmissionsYear: raw.co2EmissionsYear,
    co2PerCapita: raw.co2PerCapita,
    co2PerCapitaYear: raw.co2PerCapitaYear,
    ghgPerCapita: raw.ghgPerCapita,
    ghgPerCapitaYear: raw.ghgPerCapitaYear,
    formattedRenewableEnergy:
      raw.renewableEnergy !== undefined
        ? formatRenewableEnergy(raw.renewableEnergy)
        : undefined,
    formattedCo2PerCapita:
      raw.co2PerCapita !== undefined
        ? formatCo2PerCapita(raw.co2PerCapita)
        : undefined,
  };
}

/**
 * Calculate global GDP rank and percentile among all countries with reported GDP data.
 */
export function getGdpRank(
  allCountries: UnifiedCountry[],
  targetCode: string,
): { rank: number; total: number; percentile: number } | null {
  if (!allCountries || allCountries.length === 0 || !targetCode) return null;

  const validCountries = allCountries
    .filter((c) => c.gdp?.nominal && c.gdp.nominal > 0)
    .sort((a, b) => (b.gdp?.nominal ?? 0) - (a.gdp?.nominal ?? 0));

  const total = validCountries.length;
  const targetUpper = targetCode.toUpperCase();
  const index = validCountries.findIndex(
    (c) =>
      c.code.toUpperCase() === targetUpper ||
      (c.code3 && c.code3.toUpperCase() === targetUpper),
  );

  if (index === -1) return null;

  const rank = index + 1;
  const percentile = Math.round(((total - rank + 1) / total) * 100);

  return { rank, total, percentile };
}

/**
 * Calculate global GDP (PPP) rank and percentile among all countries with reported PPP data.
 */
export function getPppRank(
  allCountries: UnifiedCountry[],
  targetCode: string,
): { rank: number; total: number; percentile: number } | null {
  if (!allCountries || allCountries.length === 0 || !targetCode) return null;

  const validCountries = allCountries
    .filter((c) => c.gdp?.ppp && c.gdp.ppp > 0)
    .sort((a, b) => (b.gdp?.ppp ?? 0) - (a.gdp?.ppp ?? 0));

  const total = validCountries.length;
  const targetUpper = targetCode.toUpperCase();
  const index = validCountries.findIndex(
    (c) =>
      c.code.toUpperCase() === targetUpper ||
      (c.code3 && c.code3.toUpperCase() === targetUpper),
  );

  if (index === -1) return null;

  const rank = index + 1;
  const percentile = Math.round(((total - rank + 1) / total) * 100);

  return { rank, total, percentile };
}
