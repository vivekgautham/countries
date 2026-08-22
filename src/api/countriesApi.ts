import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import airportsDataRaw from "../data/airports.json";
import rawCountriesData from "../data/countries.json";
import { AirportStats, CountryDetail, UnifiedCountry } from "../types/country";

const airportsData = airportsDataRaw as Record<string, AirportStats>;

const COUNTRIES_DATA_URL =
  "https://raw.githubusercontent.com/mledoze/countries/master/dist/countries.json";

const populationByCode: Record<string, number> = {};
const areaByCode: Record<string, number> = {};

(rawCountriesData as unknown as UnifiedCountry[]).forEach((c) => {
  if (c.code) {
    const code = c.code.toUpperCase();
    if (c.population) populationByCode[code] = c.population;
    if (c.area) areaByCode[code] = c.area;
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
  return rawList.map((item) => {
    const currenciesList = item.currencies
      ? Object.values(item.currencies).map(
          (c) => `${c.name}${c.symbol ? ` (${c.symbol})` : ""}`,
        )
      : [];

    const languagesList = item.languages ? Object.values(item.languages) : [];
    const code = item.cca2.toUpperCase();
    const population = item.population || populationByCode[code] || 0;
    const area = item.area || areaByCode[code] || 0;

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
      timezones: item.timezones || [],
      borders: item.borders || [],
      unMember: item.unMember ?? false,
      landlocked: item.landlocked ?? false,
      coatOfArms: item.coatOfArms?.png || item.coatOfArms?.svg,
      airports: airportsData[code],
    };
  });
}

function getFallbackCountries(): UnifiedCountry[] {
  return (rawCountriesData as unknown as UnifiedCountry[]).map((c) => ({
    ...c,
    airports: airportsData[c.code.toUpperCase()],
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
