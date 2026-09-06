import gdpDataRaw from "../data/gdp.json";
import { GdpInfo, UnifiedCountry } from "../types/country";

const gdpDataset = gdpDataRaw as Record<
  string,
  { nominal: number; year: number; source: string }
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
 * Look up GDP info by 2-letter country code and compute per-capita metrics.
 */
export function getGdpInfo(
  countryCode?: string,
  population?: number,
): GdpInfo | undefined {
  if (!countryCode) return undefined;
  const code = countryCode.toUpperCase();
  const raw = gdpDataset[code];
  if (!raw || !raw.nominal) return undefined;

  const perCapita =
    population && population > 0
      ? Math.round(raw.nominal / population)
      : undefined;

  return {
    nominal: raw.nominal,
    year: raw.year,
    source: raw.source || "World Bank (WDI)",
    perCapita,
    formattedNominal: formatGdp(raw.nominal),
    formattedPerCapita: perCapita ? formatGdpPerCapita(perCapita) : undefined,
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
