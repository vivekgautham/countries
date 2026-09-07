import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import airportsDataRaw from "../data/airports.json";
import rawCountriesData from "../data/countries.json";
import { AirportStats, CountryDetail, UnifiedCountry } from "../types/country";
import { getNptInfo } from "../utils/nptUtils";
import {
  getAutonomousRegionsForCountry,
  getSovereigntyInfo,
} from "../utils/sovereigntyUtils";
import { getTaxInfo } from "../utils/taxUtils";
import { getEconomicBlocInfo } from "../utils/blocUtils";
import { getGdpInfo } from "../utils/gdpUtils";

const airportsData = airportsDataRaw as Record<string, AirportStats>;

const COUNTRIES_DATA_URL =
  "https://raw.githubusercontent.com/mledoze/countries/master/dist/countries.json";

const populationByCode: Record<string, number> = {};
const areaByCode: Record<string, number> = {};
const timezonesByCode: Record<string, string[]> = {};

(rawCountriesData as unknown as UnifiedCountry[]).forEach((c) => {
  if (c.code) {
    const code = c.code.toUpperCase();
    if (c.population) populationByCode[code] = c.population;
    if (c.area) areaByCode[code] = c.area;
    if (c.timezones && c.timezones.length > 0)
      timezonesByCode[code] = c.timezones;
  }
});

function formatPhoneCode(idd?: {
  root?: string;
  suffixes?: string[];
}): string | undefined {
  if (!idd || !idd.root) return undefined;
  if (!idd.suffixes || idd.suffixes.length === 0) return idd.root;
  if (idd.suffixes.length === 1) return `${idd.root}${idd.suffixes[0]}`;
  return `${idd.root} (${idd.suffixes.length} zones)`;
}

export function transformCountryDetails(
  rawList: CountryDetail[],
): UnifiedCountry[] {
  const baseList: UnifiedCountry[] = rawList.map((item) => {
    const currenciesList = item.currencies
      ? Object.values(item.currencies).map(
          (c) => `${c.name}${c.symbol ? ` (${c.symbol})` : ""}`,
        )
      : [];

    const languagesList = item.languages ? Object.values(item.languages) : [];
    const code = item.cca2.toUpperCase();
    const fallbackPopulation = item.population || populationByCode[code] || 0;
    const gdp = getGdpInfo(code, fallbackPopulation);
    const population = gdp?.population || fallbackPopulation;
    const area = item.area || areaByCode[code] || 0;
    const timezones =
      item.timezones && item.timezones.length > 0
        ? item.timezones
        : timezonesByCode[code] || [];

    return {
      code,
      code3: item.cca3 ? item.cca3.toUpperCase() : undefined,
      name: item.name.common,
      officialName: item.name.official,
      capital:
        item.capital && item.capital.length > 0
          ? item.capital.join(", ")
          : "N/A",
      region: item.region || "Unknown",
      subregion: item.subregion || "",
      population,
      area,
      currencies: currenciesList,
      languages: languagesList,
      phoneCode: formatPhoneCode(item.idd),
      timezones,
      borders: item.borders || [],
      unMember: item.unMember ?? false,
      landlocked: item.landlocked ?? false,
      coatOfArms: item.coatOfArms?.png || item.coatOfArms?.svg,
      airports: airportsData[code],
      npt: getNptInfo(code),
      sovereignty: getSovereigntyInfo(code),
      tax: getTaxInfo(code),
      blocs: getEconomicBlocInfo(code),
      gdp,
    };
  });

  return baseList.map((c) => ({
    ...c,
    autonomousRegions: getAutonomousRegionsForCountry(c.code, baseList),
  }));
}

function getFallbackCountries(): UnifiedCountry[] {
  const baseList: UnifiedCountry[] = (
    rawCountriesData as unknown as UnifiedCountry[]
  ).map((c) => {
    const code = c.code.toUpperCase();
    const gdp = getGdpInfo(code, c.population);
    const population = gdp?.population || c.population || 0;

    return {
      ...c,
      population,
      airports: airportsData[code],
      npt: getNptInfo(c.code),
      sovereignty: getSovereigntyInfo(c.code),
      tax: getTaxInfo(c.code),
      blocs: getEconomicBlocInfo(c.code),
      gdp,
    };
  });

  return baseList.map((c) => ({
    ...c,
    autonomousRegions: getAutonomousRegionsForCountry(c.code, baseList),
  }));
}

export function useCountriesData() {
  return useQuery<UnifiedCountry[]>({
    queryKey: ["countries-full-data"],
    queryFn: async () => {
      try {
        const response = await axios.get<CountryDetail[]>(COUNTRIES_DATA_URL, {
          timeout: 8000,
        });
        return transformCountryDetails(response.data);
      } catch (err) {
        console.warn(
          "Failed to fetch fresh country data from CDN, using bundled dataset:",
          err,
        );
        return getFallbackCountries();
      }
    },
    initialData: () => {
      return getFallbackCountries();
    },
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
  });
}
