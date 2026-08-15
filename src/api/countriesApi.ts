import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getData } from "country-list";
import { CountryDetail, UnifiedCountry } from "../types/country";

const COUNTRIES_DATA_URL =
  "https://raw.githubusercontent.com/mledoze/countries/master/dist/countries.json";

function formatPhoneCode(idd?: {
  root?: string;
  suffixes?: string[];
}): string | undefined {
  if (!idd || !idd.root) return undefined;
  if (!idd.suffixes || idd.suffixes.length === 0) return idd.root;
  if (idd.suffixes.length === 1) return `${idd.root}${idd.suffixes[0]}`;
  return `${idd.root} (${idd.suffixes.length} zones)`;
}

export function useCountriesData() {
  return useQuery<UnifiedCountry[]>({
    queryKey: ["countries-full-data"],
    queryFn: async () => {
      const response = await axios.get<CountryDetail[]>(COUNTRIES_DATA_URL, {
        timeout: 10000,
      });

      return response.data.map((item) => {
        const currenciesList = item.currencies
          ? Object.values(item.currencies).map(
              (c) => `${c.name}${c.symbol ? ` (${c.symbol})` : ""}`,
            )
          : [];

        const languagesList = item.languages
          ? Object.values(item.languages)
          : [];

        return {
          code: item.cca2.toUpperCase(),
          code3: item.cca3.toUpperCase(),
          name: item.name.common,
          officialName: item.name.official,
          capital:
            item.capital && item.capital.length > 0
              ? item.capital.join(", ")
              : "N/A",
          region: item.region || "Unknown",
          subregion: item.subregion || "",
          population: item.population || 0,
          area: item.area || 0,
          currencies: currenciesList,
          languages: languagesList,
          phoneCode: formatPhoneCode(item.idd),
          timezones: item.timezones || [],
          borders: item.borders || [],
          unMember: item.unMember ?? false,
          coatOfArms: item.coatOfArms?.png || item.coatOfArms?.svg,
        };
      });
    },
    // Fallback to local country-list data while loading or if offline
    initialData: () => {
      const fallbackList = getData();
      return fallbackList.map((item) => ({
        code: item.code.toUpperCase(),
        name: item.name,
        region: "Unknown",
        population: 0,
      }));
    },
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
  });
}
