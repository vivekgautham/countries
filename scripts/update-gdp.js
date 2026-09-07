import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INDICATORS = {
  GDP_NOMINAL: "NY.GDP.MKTP.CD", // GDP in current USD
  POPULATION: "SP.POP.TOTL", // Total population
  GDP_PER_CAPITA: "NY.GDP.PCAP.CD", // GDP per capita in current USD
};

const OUTPUT_FILE = path.resolve(__dirname, "../src/data/gdp.json");
const COUNTRIES_FILE = path.resolve(__dirname, "../src/data/countries.json");

/**
 * Supplemental entries for countries/territories not directly reported
 * in World Bank indicators (e.g. Taiwan, North Korea, Channel Islands, Vatican).
 * Sources: IMF World Economic Outlook, UN Population Division & Statistics Division, local statistical offices.
 */
const SUPPLEMENTAL_DATA = {
  TW: {
    nominal: 790728000000,
    year: 2024,
    population: 23420000,
    populationYear: 2024,
    perCapita: 33763,
    perCapitaYear: 2024,
    source: "IMF World Economic Outlook / DGBAS",
  },
  KP: {
    nominal: 29500000000,
    year: 2023,
    population: 26160000,
    populationYear: 2023,
    perCapita: 1128,
    perCapitaYear: 2023,
    source: "Bank of Korea / UN Stats",
  },
  JE: {
    nominal: 6800000000,
    year: 2023,
    population: 103267,
    populationYear: 2023,
    perCapita: 65849,
    perCapitaYear: 2023,
    source: "Statistics Jersey / UN",
  },
  GG: {
    nominal: 4300000000,
    year: 2023,
    population: 63950,
    populationYear: 2023,
    perCapita: 67240,
    perCapitaYear: 2023,
    source: "States of Guernsey / UN",
  },
  GI: {
    nominal: 3100000000,
    year: 2023,
    population: 34000,
    populationYear: 2023,
    perCapita: 91176,
    perCapitaYear: 2023,
    source: "HM Government of Gibraltar",
  },
  VG: {
    nominal: 1450000000,
    year: 2023,
    population: 31305,
    populationYear: 2023,
    perCapita: 46318,
    perCapitaYear: 2023,
    source: "UN Statistics Division",
  },
  AI: {
    nominal: 380000000,
    year: 2023,
    population: 15753,
    populationYear: 2023,
    perCapita: 24122,
    perCapitaYear: 2023,
    source: "UN Statistics Division / ECCB",
  },
  BL: {
    nominal: 420000000,
    year: 2022,
    population: 10289,
    populationYear: 2022,
    perCapita: 40820,
    perCapitaYear: 2022,
    source: "CEROM / INSEE",
  },
  MS: {
    nominal: 75000000,
    year: 2023,
    population: 4433,
    populationYear: 2023,
    perCapita: 16918,
    perCapitaYear: 2023,
    source: "UN Statistics Division",
  },
  PM: {
    nominal: 280000000,
    year: 2022,
    population: 5888,
    populationYear: 2022,
    perCapita: 47554,
    perCapitaYear: 2022,
    source: "INSEE / IEDOM",
  },
  CK: {
    nominal: 320000000,
    year: 2023,
    population: 17564,
    populationYear: 2023,
    perCapita: 18219,
    perCapitaYear: 2023,
    source: "Ministry of Finance Cook Islands",
  },
  FK: {
    nominal: 300000000,
    year: 2023,
    population: 3791,
    populationYear: 2023,
    perCapita: 79135,
    perCapitaYear: 2023,
    source: "Falkland Islands Government",
  },
  AX: {
    nominal: 1600000000,
    year: 2023,
    population: 30500,
    populationYear: 2023,
    perCapita: 52459,
    perCapitaYear: 2023,
    source: "ÅSUB Statistics Åland",
  },
  VA: {
    nominal: 25000000,
    year: 2023,
    population: 800,
    populationYear: 2023,
    perCapita: 31250,
    perCapitaYear: 2023,
    source: "Prefecture for Economic Affairs",
  },
  SH: {
    nominal: 40000000,
    year: 2023,
    population: 4439,
    populationYear: 2023,
    perCapita: 9011,
    perCapitaYear: 2023,
    source: "St Helena Statistics Office",
  },
  NU: {
    nominal: 35000000,
    year: 2023,
    population: 1935,
    populationYear: 2023,
    perCapita: 18088,
    perCapitaYear: 2023,
    source: "Statistics Niue / UN",
  },
  TK: {
    nominal: 15000000,
    year: 2023,
    population: 1499,
    populationYear: 2023,
    perCapita: 10007,
    perCapitaYear: 2023,
    source: "UN Statistics Division",
  },
  WF: {
    nominal: 200000000,
    year: 2023,
    population: 11558,
    populationYear: 2023,
    perCapita: 17304,
    perCapitaYear: 2023,
    source: "IEOM / INSEE",
  },
};

function fetchIndicator(indicator) {
  const url = `https://api.worldbank.org/v2/country/all/indicator/${indicator}?mrnev=1&format=json&per_page=350`;
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          return resolve(fetchIndicator(indicator));
        }
        if (res.statusCode !== 200) {
          return reject(
            new Error(
              `Failed to fetch ${indicator}, HTTP status ${res.statusCode}`,
            ),
          );
        }

        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(Buffer.concat(chunks).toString("utf-8"));
            resolve(Array.isArray(parsed) && parsed[1] ? parsed[1] : []);
          } catch (e) {
            reject(e);
          }
        });
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

async function run() {
  console.log("Fetching World Bank data for GDP, Population, and GDP per Capita in parallel...");
  const [gdpList, popList, pcapList] = await Promise.all([
    fetchIndicator(INDICATORS.GDP_NOMINAL),
    fetchIndicator(INDICATORS.POPULATION),
    fetchIndicator(INDICATORS.GDP_PER_CAPITA),
  ]);

  console.log(
    `Received records from World Bank: GDP (${gdpList.length}), Population (${popList.length}), Per-Capita (${pcapList.length})`,
  );

  // Load existing countries to build code3 -> code2 lookup
  let rawCountries = [];
  if (fs.existsSync(COUNTRIES_FILE)) {
    rawCountries = JSON.parse(fs.readFileSync(COUNTRIES_FILE, "utf-8"));
  }

  const code3ToCode2 = {};
  for (const c of rawCountries) {
    if (c.code && c.code3) {
      code3ToCode2[c.code3.toUpperCase()] = c.code.toUpperCase();
    }
  }

  function resolveCode(item) {
    const code2 = (item.country?.id || "").toUpperCase();
    const code3 = (item.countryiso3code || "").toUpperCase();
    if (code2 && code2.length === 2) return code2;
    if (code3 && code3ToCode2[code3]) return code3ToCode2[code3];
    return null;
  }

  const resultByCountry = {};

  // 1. Process Nominal GDP
  for (const item of gdpList) {
    if (item.value === null || item.value === undefined) continue;
    const code = resolveCode(item);
    if (!code) continue;

    if (!resultByCountry[code]) {
      resultByCountry[code] = { source: "World Bank (WDI)" };
    }
    resultByCountry[code].nominal = Math.round(item.value);
    resultByCountry[code].year = parseInt(item.date, 10);
  }

  // 2. Process Population
  for (const item of popList) {
    if (item.value === null || item.value === undefined) continue;
    const code = resolveCode(item);
    if (!code) continue;

    if (!resultByCountry[code]) {
      resultByCountry[code] = { source: "World Bank (WDI)" };
    }
    resultByCountry[code].population = Math.round(item.value);
    resultByCountry[code].populationYear = parseInt(item.date, 10);
    resultByCountry[code].populationSource = "World Bank (WDI)";
  }

  // 3. Process GDP per Capita
  for (const item of pcapList) {
    if (item.value === null || item.value === undefined) continue;
    const code = resolveCode(item);
    if (!code) continue;

    if (!resultByCountry[code]) {
      resultByCountry[code] = { source: "World Bank (WDI)" };
    }
    resultByCountry[code].perCapita = Math.round(item.value);
    resultByCountry[code].perCapitaYear = parseInt(item.date, 10);
  }

  // 4. Fill in calculated per-capita fallback if perCapita is missing but nominal & pop are available
  for (const entry of Object.values(resultByCountry)) {
    if (!entry.perCapita && entry.nominal && entry.population && entry.population > 0) {
      entry.perCapita = Math.round(entry.nominal / entry.population);
      entry.perCapitaYear = entry.year || entry.populationYear;
    }
  }

  // 5. Merge supplemental data for entities not covered by World Bank
  for (const [code, supp] of Object.entries(SUPPLEMENTAL_DATA)) {
    if (!resultByCountry[code]) {
      resultByCountry[code] = {
        ...supp,
        populationSource: supp.source,
      };
    } else {
      if (!resultByCountry[code].nominal && supp.nominal) {
        resultByCountry[code].nominal = supp.nominal;
        resultByCountry[code].year = supp.year;
      }
      if (!resultByCountry[code].population && supp.population) {
        resultByCountry[code].population = supp.population;
        resultByCountry[code].populationYear = supp.populationYear;
        resultByCountry[code].populationSource = supp.source;
      }
      if (!resultByCountry[code].perCapita && supp.perCapita) {
        resultByCountry[code].perCapita = supp.perCapita;
        resultByCountry[code].perCapitaYear = supp.perCapitaYear;
      }
    }
  }

  // 6. Fallback to existing country record population if World Bank does not cover the entity (e.g. overseas territories)
  for (const c of rawCountries) {
    if (c.code) {
      const code = c.code.toUpperCase();
      if (!resultByCountry[code]) {
        resultByCountry[code] = {
          population: c.population || 0,
          source: "National Census / UN",
          populationSource: "National Census / UN",
        };
      } else if (!resultByCountry[code].population && c.population) {
        resultByCountry[code].population = c.population;
        resultByCountry[code].populationSource = "National Census / UN";
      }
    }
  }


  // Sort keys alphabetically

  const sortedData = Object.keys(resultByCountry)
    .sort()
    .reduce((acc, key) => {
      acc[key] = resultByCountry[key];
      return acc;
    }, {});

  const totalCount = Object.keys(sortedData).length;
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(sortedData, null, 2), "utf-8");
  console.log(`Successfully saved World Bank dataset for ${totalCount} countries to ${OUTPUT_FILE}`);
}

run().catch((err) => {
  console.error("Error updating World Bank data:", err);
  process.exit(1);
});
