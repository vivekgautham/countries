import { CityInfo } from "../types/country";

/**
 * Format population in human-friendly compact form (e.g. "8.80M", "689K", "490")
 */
export function formatCityPopulation(pop?: number | null): string {
  if (pop === undefined || pop === null || isNaN(pop)) return "N/A";
  if (pop >= 1_000_000_000) {
    return `${(pop / 1_000_000_000).toFixed(2)}B`;
  }
  if (pop >= 1_000_000) {
    return `${(pop / 1_000_000).toFixed(2)}M`;
  }
  if (pop >= 10_000) {
    return `${(pop / 1_000).toFixed(0)}K`;
  }
  if (pop >= 1_000) {
    return `${(pop / 1_000).toFixed(1)}K`;
  }
  return pop.toLocaleString();
}

/**
 * Format exact population with commas (e.g. "8,804,190")
 */
export function formatCityPopulationExact(pop?: number | null): string {
  if (pop === undefined || pop === null || isNaN(pop)) return "N/A";
  return pop.toLocaleString();
}

/**
 * Calculate the percentage share of a city's population relative to the country
 */
export function calculateCityShare(
  cityPop: number,
  countryPop?: number | null,
): number {
  if (!countryPop || countryPop <= 0 || !cityPop || cityPop <= 0) return 0;
  return Math.min(100, (cityPop / countryPop) * 100);
}

/**
 * Format the city's percentage share of national population
 */
export function formatCityShare(
  cityPop: number,
  countryPop?: number | null,
): string {
  const share = calculateCityShare(cityPop, countryPop);
  if (share <= 0) return "0%";
  if (share < 0.1) return "<0.1%";
  if (share >= 10) return `${share.toFixed(1)}%`;
  return `${share.toFixed(1)}%`;
}

/**
 * Get the primate / largest city from a list
 */
export function getPrimateCity(cities?: CityInfo[]): CityInfo | undefined {
  if (!cities || cities.length === 0) return undefined;
  return [...cities].sort((a, b) => b.population - a.population)[0];
}

/**
 * Get the capital city from a list if present
 */
export function getCapitalCityFromList(
  cities?: CityInfo[],
): CityInfo | undefined {
  if (!cities || cities.length === 0) return undefined;
  return cities.find((c) => c.isCapital);
}

/**
 * Calculate total population of all cities in the list
 */
export function getCombinedCitiesPopulation(cities?: CityInfo[]): number {
  if (!cities || cities.length === 0) return 0;
  return cities.reduce((sum, c) => sum + (c.population || 0), 0);
}

/**
 * Build external Google Maps search URL
 */
export function getCityGoogleMapsUrl(
  cityName: string,
  countryName: string,
): string {
  const q = encodeURIComponent(`${cityName}, ${countryName}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

/**
 * Build external Wikipedia URL
 */
export function getCityWikipediaUrl(cityName: string): string {
  const q = encodeURIComponent(cityName.replace(/ /g, "_"));
  return `https://en.wikipedia.org/wiki/${q}`;
}
