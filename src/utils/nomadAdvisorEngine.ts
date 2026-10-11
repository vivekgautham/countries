import { UnifiedCountry } from "../types/country";

export type NomadPersonaId =
  | "remote_tech"
  | "zero_tax"
  | "european_schengen"
  | "tropical_low_cost"
  | "entrepreneur"
  | "custom";

export interface NomadPersona {
  id: NomadPersonaId;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  weights: {
    tax: number;
    internet: number;
    airports: number;
    qualityOfLife: number;
    mobility: number;
  };
  preferredRegions?: string[];
  requireTerritorialOrZero?: boolean;
  requireSchengenOrEU?: boolean;
}

export const NOMAD_PERSONAS: Record<NomadPersonaId, NomadPersona> = {
  remote_tech: {
    id: "remote_tech",
    name: "Remote Tech Nomad",
    icon: "💻",
    tagline: "High internet, territorial/0% foreign tax, travel hubs",
    description:
      "Prioritizes fast broadband, 0% tax on remote foreign income, modern infrastructure, and international flight connectivity.",
    weights: {
      tax: 30,
      internet: 30,
      airports: 20,
      qualityOfLife: 10,
      mobility: 10,
    },
    requireTerritorialOrZero: true,
  },
  zero_tax: {
    id: "zero_tax",
    name: "Zero-Tax Wealth Haven",
    icon: "🏝️",
    tagline: "0% personal tax, banking hubs, maximum asset retention",
    description:
      "Focuses on states with absolute 0% personal income tax, territorial tax systems, high safety, and strong wealth preservation.",
    weights: {
      tax: 50,
      internet: 10,
      airports: 15,
      qualityOfLife: 15,
      mobility: 10,
    },
    requireTerritorialOrZero: true,
  },
  european_schengen: {
    id: "european_schengen",
    name: "European & Schengen Mobility",
    icon: "🇪🇺",
    tagline: "Schengen travel freedom, healthcare, cultural density",
    description:
      "Emphasizes European Union and Schengen treaty benefits, high life expectancy, public infrastructure, and nomad visas.",
    weights: {
      tax: 15,
      internet: 20,
      airports: 15,
      qualityOfLife: 25,
      mobility: 25,
    },
    requireSchengenOrEU: true,
  },
  tropical_low_cost: {
    id: "tropical_low_cost",
    name: "Tropical Beach & Island Living",
    icon: "🌴",
    tagline: "Warm climate, coastal vibes, low foreign income tax",
    description:
      "Looks for coastal or island destinations with territorial tax rules, welcoming expats, and warm weather.",
    weights: {
      tax: 35,
      internet: 20,
      airports: 15,
      qualityOfLife: 15,
      mobility: 15,
    },
    preferredRegions: ["Americas", "Asia", "Oceania", "Africa"],
  },
  entrepreneur: {
    id: "entrepreneur",
    name: "Global Business Founder",
    icon: "💼",
    tagline: "Low corporate tax, airport hubs, trade bloc access",
    description:
      "Geared toward company founders seeking low corporate tax, global trade blocs (GCC, EU, G20), and global flight hubs.",
    weights: {
      tax: 35,
      internet: 15,
      airports: 25,
      qualityOfLife: 10,
      mobility: 15,
    },
  },
  custom: {
    id: "custom",
    name: "Custom Nomad Profile",
    icon: "✨",
    tagline: "AI customized based on your personal criteria",
    description:
      "Evaluates your free-form lifestyle and tax requirements across all countries.",
    weights: {
      tax: 25,
      internet: 25,
      airports: 15,
      qualityOfLife: 20,
      mobility: 15,
    },
  },
};

export interface CountryMatchScore {
  country: UnifiedCountry;
  score: number;
  matchReasons: string[];
  keyHighlights: string[];
  taxSummary: string;
  nomadFit: string;
}

export function calculateNomadMatches(
  personaId: NomadPersonaId,
  allCountries: UnifiedCountry[],
  customRequirements?: {
    prioritizeTax?: boolean;
    prioritizeInternet?: boolean;
    prioritizeSchengen?: boolean;
    prioritizeCoastal?: boolean;
    preferredRegion?: string;
  },
): CountryMatchScore[] {
  const persona = NOMAD_PERSONAS[personaId] || NOMAD_PERSONAS.remote_tech;

  const matches: CountryMatchScore[] = allCountries.map((c) => {
    let score = 0;
    const matchReasons: string[] = [];
    const keyHighlights: string[] = [];

    // 1. Tax Scoring (Weights: up to 35-50 points)
    const taxType = c.tax?.systemType;
    let taxScore = 0;
    if (taxType === "zero_tax") {
      taxScore = 100;
      matchReasons.push("0% Global Income Tax Regime");
      keyHighlights.push("Tax-free income");
    } else if (taxType === "territorial") {
      taxScore = 85;
      matchReasons.push(
        "Territorial Tax: Foreign-sourced income is 100% exempt",
      );
      keyHighlights.push("Territorial exemption");
    } else if (taxType === "non_dom") {
      taxScore = 75;
      matchReasons.push("Special Non-Dom / Digital Nomad tax concessions");
      keyHighlights.push("Special expat tax rules");
    } else {
      // Worldwide tax: score depends on headline/PIT rate
      taxScore = 35;
    }
    score += (taxScore * persona.weights.tax) / 100;

    // 2. Internet Connectivity Scoring
    const internetUsers = c.gdp?.internetUsers || 0;
    const internetScore = Math.min(100, (internetUsers / 95) * 100);
    if (internetUsers >= 88) {
      matchReasons.push(
        `High broadband penetration (${internetUsers.toFixed(0)}%)`,
      );
      keyHighlights.push(`${internetUsers.toFixed(0)}% internet users`);
    }
    score += (internetScore * persona.weights.internet) / 100;

    // 3. Airport & Global Travel Connectivity
    const largeAirports = c.airports?.large || 0;
    const mediumAirports = c.airports?.medium || 0;
    const totalCommercial = largeAirports * 2 + mediumAirports;
    const airportScore = Math.min(100, (totalCommercial / 6) * 100);
    if (largeAirports > 0) {
      matchReasons.push(
        `Major international airport hub (${largeAirports} major hub${largeAirports > 1 ? "s" : ""})`,
      );
      keyHighlights.push("Direct global flights");
    }
    score += (airportScore * persona.weights.airports) / 100;

    // 4. Quality of Life & Economic Stability
    const lifeExp = c.gdp?.lifeExpectancy || 70;
    const gdpPerCapita = c.gdp?.perCapita || 5000;
    let qolScore = 0;
    if (lifeExp >= 80) qolScore += 50;
    else if (lifeExp >= 75) qolScore += 35;
    else qolScore += 20;

    if (gdpPerCapita >= 40000) qolScore += 50;
    else if (gdpPerCapita >= 15000) qolScore += 35;
    else qolScore += 20;
    score += (qolScore * persona.weights.qualityOfLife) / 100;

    // 5. Mobility & Blocs
    let mobilityScore = 40;
    if (c.blocs?.isSchengen) {
      mobilityScore = 100;
      matchReasons.push("Border-free Schengen Area mobility");
      keyHighlights.push("Schengen passport mobility");
    } else if (c.blocs?.isEU) {
      mobilityScore = 90;
      matchReasons.push("European Union member benefits");
      keyHighlights.push("EU single market");
    } else if (c.blocs?.isGCC) {
      mobilityScore = 85;
      matchReasons.push("GCC Gulf financial & travel corridor");
      keyHighlights.push("GCC financial hub");
    }
    score += (mobilityScore * persona.weights.mobility) / 100;

    // Special persona penalties/bonuses
    if (
      persona.requireTerritorialOrZero &&
      taxType !== "zero_tax" &&
      taxType !== "territorial"
    ) {
      score *= 0.55; // Substantial penalty if zero/territorial is strictly requested
    }
    if (persona.requireSchengenOrEU && !c.blocs?.isEU && !c.blocs?.isSchengen) {
      score *= 0.4;
    }
    if (
      persona.preferredRegions &&
      persona.preferredRegions.includes(c.region)
    ) {
      score *= 1.15;
    }

    // Custom Filters
    if (customRequirements?.prioritizeCoastal && c.landlocked) {
      score *= 0.5;
    }
    if (
      customRequirements?.preferredRegion &&
      customRequirements.preferredRegion !== "All"
    ) {
      if (
        c.region.toLowerCase() !==
        customRequirements.preferredRegion.toLowerCase()
      ) {
        score *= 0.35;
      }
    }

    const normalizedScore = Math.min(99, Math.max(35, Math.round(score)));

    const nomadFit =
      normalizedScore >= 90
        ? "Exceptional Expat Match"
        : normalizedScore >= 80
          ? "Strong Contender"
          : normalizedScore >= 70
            ? "Good Potential"
            : "Moderate Option";

    return {
      country: c,
      score: normalizedScore,
      matchReasons: matchReasons.slice(0, 3),
      keyHighlights: keyHighlights.slice(0, 4),
      taxSummary: c.tax?.foreignIncomeTaxRate
        ? `Foreign Income: ${c.tax.foreignIncomeTaxRate}`
        : c.tax?.headlineRate || "Standard Rates",
      nomadFit,
    };
  });

  // Sort descending by score
  matches.sort((a, b) => b.score - a.score);

  return matches.slice(0, 10);
}

export function calculateMatchesFromTextQuery(
  rawQuery: string,
  allCountries: UnifiedCountry[],
): CountryMatchScore[] {
  const query = rawQuery.toLowerCase();

  let personaId: NomadPersonaId = "remote_tech";
  if (
    query.includes("zero tax") ||
    query.includes("no tax") ||
    query.includes("tax free") ||
    query.includes("wealth")
  ) {
    personaId = "zero_tax";
  } else if (
    query.includes("europe") ||
    query.includes("schengen") ||
    query.includes("eu")
  ) {
    personaId = "european_schengen";
  } else if (
    query.includes("beach") ||
    query.includes("tropical") ||
    query.includes("island") ||
    query.includes("coastal") ||
    query.includes("low cost")
  ) {
    personaId = "tropical_low_cost";
  } else if (
    query.includes("business") ||
    query.includes("startup") ||
    query.includes("corporate") ||
    query.includes("founder")
  ) {
    personaId = "entrepreneur";
  }

  let preferredRegion: string | undefined;
  if (query.includes("europe") || query.includes("european"))
    preferredRegion = "Europe";
  else if (query.includes("asia") || query.includes("asian"))
    preferredRegion = "Asia";
  else if (
    query.includes("americas") ||
    query.includes("latin") ||
    query.includes("south america")
  )
    preferredRegion = "Americas";
  else if (query.includes("africa")) preferredRegion = "Africa";

  const prioritizeCoastal =
    query.includes("beach") ||
    query.includes("coastal") ||
    query.includes("island") ||
    query.includes("sea");

  return calculateNomadMatches(personaId, allCountries, {
    preferredRegion,
    prioritizeCoastal,
  });
}
