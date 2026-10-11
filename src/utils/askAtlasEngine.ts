import { UnifiedCountry, TaxSystemType, EconomicBlocs } from "../types/country";

export interface SemanticCriteria {
  regions?: string[];
  subregions?: string[];
  taxTypes?: TaxSystemType[];
  zeroTaxOnly?: boolean;
  blocs?: (keyof EconomicBlocs)[];
  negatedBlocs?: (keyof EconomicBlocs)[];
  landlocked?: boolean;
  coastalOrIsland?: boolean;
  minPopulation?: number;
  maxPopulation?: number;
  minGdpPerCapita?: number;
  minInternetUsers?: number;
  minLifeExpectancy?: number;
  hasMajorAirports?: boolean;
  languages?: string[];
  unMember?: boolean;
}

export interface AskAtlasResult {
  isNaturalLanguage: boolean;
  criteria: SemanticCriteria;
  badges: string[];
  interpretation: string;
  matchedCountries: UnifiedCountry[];
}

const LANGUAGE_MAP: Record<string, string> = {
  english: "English",
  spanish: "Spanish",
  french: "French",
  arabic: "Arabic",
  portuguese: "Portuguese",
  german: "German",
  italian: "Italian",
  japanese: "Japanese",
  chinese: "Chinese",
  russian: "Russian",
  dutch: "Dutch",
};

export function parseNaturalLanguageQuery(
  rawQuery: string,
  allCountries: UnifiedCountry[],
): AskAtlasResult | null {
  const query = rawQuery.trim().toLowerCase();
  if (!query || query.length < 3) return null;

  const criteria: SemanticCriteria = {};
  const badges: string[] = [];
  let signalsCount = 0;

  // 1. Tax System Detection
  if (
    query.includes("zero tax") ||
    query.includes("0% tax") ||
    query.includes("no tax") ||
    query.includes("tax free") ||
    query.includes("tax haven") ||
    query.includes("no income tax")
  ) {
    criteria.taxTypes = ["zero_tax"];
    criteria.zeroTaxOnly = true;
    badges.push("🏝️ 0% / Zero Tax");
    signalsCount += 2;
  } else if (
    query.includes("territorial tax") ||
    query.includes("territorial") ||
    query.includes("foreign income") ||
    query.includes("tax on foreign") ||
    query.includes("non-dom") ||
    query.includes("non dom")
  ) {
    criteria.taxTypes = ["territorial", "non_dom", "zero_tax"];
    badges.push("🏖️ Territorial / Foreign Tax-Free");
    signalsCount += 2;
  }

  // 2. Economic Blocs & Alliances
  const checkBloc = (key: keyof EconomicBlocs, term: string, label: string) => {
    // Check for negative first: e.g. "not in eu", "outside nato", "not schengen"
    if (
      query.includes(`not in ${term}`) ||
      query.includes(`outside ${term}`) ||
      query.includes(`not ${term}`) ||
      query.includes(`non ${term}`)
    ) {
      criteria.negatedBlocs = criteria.negatedBlocs || [];
      criteria.negatedBlocs.push(key);
      badges.push(`🚫 Not in ${label}`);
      signalsCount += 2;
    } else if (
      query.includes(term) ||
      query.includes(`${term} members`) ||
      query.includes(`${term} countries`)
    ) {
      criteria.blocs = criteria.blocs || [];
      criteria.blocs.push(key);
      badges.push(`🛡️ ${label}`);
      signalsCount += 2;
    }
  };

  checkBloc("isNATO", "nato", "NATO");
  checkBloc("isEU", "eu", "EU");
  checkBloc("isSchengen", "schengen", "Schengen Area");
  checkBloc("isEurozone", "eurozone", "Eurozone");
  checkBloc("isBRICS", "brics", "BRICS");
  checkBloc("isG7", "g7", "G7");
  checkBloc("isG20", "g20", "G20");
  checkBloc("isGCC", "gcc", "GCC (Gulf)");

  // 3. Regions and Geographic groupings
  const checkRegion = (term: string, regionName: string, icon = "🌍") => {
    if (query.includes(term)) {
      criteria.regions = criteria.regions || [];
      if (!criteria.regions.includes(regionName)) {
        criteria.regions.push(regionName);
        badges.push(`${icon} ${regionName}`);
        signalsCount += 1;
      }
    }
  };

  checkRegion("europe", "Europe", "🇪🇺");
  checkRegion("european", "Europe", "🇪🇺");
  checkRegion("asia", "Asia", "🌏");
  checkRegion("asian", "Asia", "🌏");
  checkRegion("africa", "Africa", "🌍");
  checkRegion("african", "Africa", "🌍");
  checkRegion("americas", "Americas", "🌎");
  checkRegion("latin america", "Americas", "🌎");
  checkRegion("south america", "Americas", "🌎");
  checkRegion("north america", "Americas", "🌎");
  checkRegion("oceania", "Oceania", "🏝️");

  // 4. Landlocked vs Coastal vs Islands
  if (query.includes("landlocked")) {
    criteria.landlocked = true;
    badges.push("🏔️ Landlocked");
    signalsCount += 2;
  } else if (
    query.includes("coastal") ||
    query.includes("beach") ||
    query.includes("island") ||
    query.includes("islands")
  ) {
    criteria.landlocked = false;
    criteria.coastalOrIsland = true;
    badges.push("🏖️ Coastal / Island");
    signalsCount += 1;
  }

  // 5. Languages
  for (const [key, langName] of Object.entries(LANGUAGE_MAP)) {
    if (
      query.includes(`${key} speaking`) ||
      query.includes(`speaks ${key}`) ||
      query.includes(`${key}-speaking`) ||
      query.includes(`language ${key}`) ||
      query.includes(`${key} language`)
    ) {
      criteria.languages = criteria.languages || [];
      criteria.languages.push(langName);
      badges.push(`🗣️ Speaks ${langName}`);
      signalsCount += 2;
    }
  }

  // 6. Population conditions
  const popOverMatch = query.match(
    /population (?:over|>|greater than|more than)\s*(\d+)\s*(m|million|k|thousand)?/,
  );
  if (popOverMatch) {
    let num = parseFloat(popOverMatch[1]);
    const unit = popOverMatch[2]?.toLowerCase();
    if (unit?.startsWith("m")) num *= 1_000_000;
    else if (unit?.startsWith("k")) num *= 1_000;
    else if (num < 1000) num *= 1_000_000; // E.g. "population over 20" means 20M
    criteria.minPopulation = num;
    badges.push(`👥 Pop > ${(num / 1_000_000).toFixed(0)}M`);
    signalsCount += 2;
  }

  const popUnderMatch = query.match(
    /population (?:under|<|less than)\s*(\d+)\s*(m|million|k|thousand)?/,
  );
  if (popUnderMatch) {
    let num = parseFloat(popUnderMatch[1]);
    const unit = popUnderMatch[2]?.toLowerCase();
    if (unit?.startsWith("m")) num *= 1_000_000;
    else if (unit?.startsWith("k")) num *= 1_000;
    else if (num < 1000) num *= 1_000_000;
    criteria.maxPopulation = num;
    badges.push(`👥 Pop < ${(num / 1_000_000).toFixed(0)}M`);
    signalsCount += 2;
  }

  // 7. Quality of Life & Economy
  if (
    query.includes("fast internet") ||
    query.includes("high internet") ||
    query.includes("tech friendly") ||
    query.includes("digital nomad")
  ) {
    criteria.minInternetUsers = 80;
    badges.push("💻 Fast Internet (>80%)");
    signalsCount += 1;
  }

  if (
    query.includes("wealthy") ||
    query.includes("high gdp") ||
    query.includes("rich countries") ||
    query.includes("developed")
  ) {
    criteria.minGdpPerCapita = 30000;
    badges.push("💰 High GDP / Capita (>$30k)");
    signalsCount += 1;
  }

  if (
    query.includes("high life expectancy") ||
    query.includes("long life") ||
    query.includes("healthy")
  ) {
    criteria.minLifeExpectancy = 78;
    badges.push("🏥 High Life Expectancy (>78y)");
    signalsCount += 1;
  }

  if (
    query.includes("airports") ||
    query.includes("airport hub") ||
    query.includes("flight hub") ||
    query.includes("connected")
  ) {
    criteria.hasMajorAirports = true;
    badges.push("✈️ International Airport Hub");
    signalsCount += 1;
  }

  // If query is just a single country name, it is NOT a natural language semantic query
  const isDirectCountryName = allCountries.some(
    (c) =>
      c.name.toLowerCase() === query ||
      c.code.toLowerCase() === query ||
      c.capital?.toLowerCase() === query,
  );

  if (isDirectCountryName || signalsCount < 2) {
    return null;
  }

  // Execute Semantic Filtering
  const matchedCountries = allCountries.filter((c) => {
    // 1. Region
    if (criteria.regions && criteria.regions.length > 0) {
      if (
        !criteria.regions.some(
          (r) => c.region.toLowerCase() === r.toLowerCase(),
        )
      ) {
        return false;
      }
    }

    // 2. Tax types
    if (criteria.taxTypes && criteria.taxTypes.length > 0) {
      const countryTaxType = c.tax?.systemType;
      if (!countryTaxType || !criteria.taxTypes.includes(countryTaxType)) {
        return false;
      }
    }

    // 3. Positive Blocs
    if (criteria.blocs && criteria.blocs.length > 0) {
      for (const blocKey of criteria.blocs) {
        if (!c.blocs?.[blocKey]) return false;
      }
    }

    // 4. Negated Blocs
    if (criteria.negatedBlocs && criteria.negatedBlocs.length > 0) {
      for (const blocKey of criteria.negatedBlocs) {
        if (c.blocs?.[blocKey]) return false;
      }
    }

    // 5. Landlocked
    if (criteria.landlocked !== undefined) {
      if (c.landlocked !== criteria.landlocked) return false;
    }

    // 6. Coastal / Island
    if (criteria.coastalOrIsland) {
      if (c.landlocked) return false;
    }

    // 7. Population
    if (criteria.minPopulation !== undefined) {
      if ((c.population || 0) < criteria.minPopulation) return false;
    }
    if (criteria.maxPopulation !== undefined) {
      if ((c.population || 0) > criteria.maxPopulation) return false;
    }

    // 8. GDP Per Capita
    if (criteria.minGdpPerCapita !== undefined) {
      if ((c.gdp?.perCapita || 0) < criteria.minGdpPerCapita) return false;
    }

    // 9. Internet Users
    if (criteria.minInternetUsers !== undefined) {
      if ((c.gdp?.internetUsers || 0) < criteria.minInternetUsers) return false;
    }

    // 10. Life Expectancy
    if (criteria.minLifeExpectancy !== undefined) {
      if ((c.gdp?.lifeExpectancy || 0) < criteria.minLifeExpectancy)
        return false;
    }

    // 11. Major Airports
    if (criteria.hasMajorAirports) {
      const airportsCount =
        (c.airports?.large || 0) + (c.airports?.medium || 0);
      if (airportsCount === 0) return false;
    }

    // 12. Languages
    if (criteria.languages && criteria.languages.length > 0) {
      const speaksRequired = criteria.languages.some((targetLang) => {
        if (!c.languages || c.languages.length === 0) return false;
        return c.languages.some((l) =>
          l.toLowerCase().includes(targetLang.toLowerCase()),
        );
      });
      if (!speaksRequired) return false;
    }

    return true;
  });

  return {
    isNaturalLanguage: true,
    criteria,
    badges,
    interpretation: `Ask Atlas parsed ${badges.length} criteria from your query`,
    matchedCountries,
  };
}
