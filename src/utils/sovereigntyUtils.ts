import { SOVEREIGNTY_DATA } from "../data/sovereigntyData";
import {
  AutonomousRegionInfo,
  SovereignInfo,
  UnifiedCountry,
} from "../types/country";

/**
 * Get sovereignty information for an autonomous region or dependent territory.
 */
export function getSovereigntyInfo(code?: string): SovereignInfo | undefined {
  if (!code) return undefined;
  return SOVEREIGNTY_DATA[code.toUpperCase()];
}

/**
 * Get all autonomous regions, territories, or dependencies for a given sovereign country code.
 */
export function getAutonomousRegionsForCountry(
  sovereignCode?: string,
  countries?: UnifiedCountry[],
): AutonomousRegionInfo[] {
  if (!sovereignCode) return [];
  const upperCode = sovereignCode.toUpperCase();

  const regions: AutonomousRegionInfo[] = [];

  for (const [territoryCode, info] of Object.entries(SOVEREIGNTY_DATA)) {
    if (info.sovereignCode === upperCode) {
      const countryObj = countries?.find(
        (c) => c.code.toUpperCase() === territoryCode,
      );

      regions.push({
        code: territoryCode,
        name: countryObj?.name || territoryCode,
        officialName: countryObj?.officialName,
        territoryType: info.territoryType,
        typeLabel: info.typeLabel,
        capital: countryObj?.capital,
        population: countryObj?.population,
      });
    }
  }

  // Sort alphabetically by name
  regions.sort((a, b) => a.name.localeCompare(b.name));
  return regions;
}
