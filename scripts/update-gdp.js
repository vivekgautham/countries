import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WORLD_BANK_GDP_URL =
  "https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.CD?mrnev=1&format=json&per_page=350";

const OUTPUT_FILE = path.resolve(__dirname, "../src/data/gdp.json");
const COUNTRIES_FILE = path.resolve(__dirname, "../src/data/countries.json");

/**
 * Supplemental GDP entries for countries/territories not directly covered
 * in World Bank's NY.GDP.MKTP.CD indicator (e.g. Taiwan, North Korea, Channel Islands).
 * Sources: IMF World Economic Outlook, UN Statistics Division, local statistical offices.
 */
const SUPPLEMENTAL_GDP = {
  TW: {
    nominal: 790728000000,
    year: 2024,
    source: "IMF World Economic Outlook",
  },
  KP: {
    nominal: 29500000000,
    year: 2023,
    source: "Bank of Korea / UN Stats",
  },
  JE: {
    nominal: 6800000000,
    year: 2023,
    source: "Statistics Jersey / UN",
  },
  GG: {
    nominal: 4300000000,
    year: 2023,
    source: "States of Guernsey / UN",
  },
  GI: {
    nominal: 3100000000,
    year: 2023,
    source: "HM Government of Gibraltar",
  },
  VG: {
    nominal: 1450000000,
    year: 2023,
    source: "UN Statistics Division",
  },
  AI: {
    nominal: 380000000,
    year: 2023,
    source: "UN Statistics Division / ECCB",
  },
  BL: {
    nominal: 420000000,
    year: 2022,
    source: "CEROM / INSEE",
  },
  MS: {
    nominal: 75000000,
    year: 2023,
    source: "UN Statistics Division",
  },
  PM: {
    nominal: 280000000,
    year: 2022,
    source: "INSEE / IEDOM",
  },
  CK: {
    nominal: 320000000,
    year: 2023,
    source: "Cook Islands Ministry of Finance",
  },
  FK: {
    nominal: 300000000,
    year: 2023,
    source: "Falkland Islands Government",
  },
  AX: {
    nominal: 1600000000,
    year: 2023,
    source: "ÅSUB Statistics Åland",
  },
  VA: {
    nominal: 25000000,
    year: 2023,
    source: "Prefecture for Economic Affairs",
  },
  SH: {
    nominal: 40000000,
    year: 2023,
    source: "St Helena Statistics Office",
  },
  NU: {
    nominal: 35000000,
    year: 2023,
    source: "Statistics Niue / UN",
  },
  TK: {
    nominal: 15000000,
    year: 2023,
    source: "UN Statistics Division",
  },
  WF: {
    nominal: 200000000,
    year: 2023,
    source: "IEOM / INSEE",
  },
};

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          return resolve(fetchJson(res.headers.location));
        }
        if (res.statusCode !== 200) {
          return reject(
            new Error(`Failed to fetch URL, HTTP status ${res.statusCode}`),
          );
        }

        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(Buffer.concat(chunks).toString("utf-8"));
            resolve(parsed);
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
  console.log(`Fetching latest GDP dataset from World Bank (${WORLD_BANK_GDP_URL})...`);
  const response = await fetchJson(WORLD_BANK_GDP_URL);

  if (!Array.isArray(response) || response.length < 2 || !Array.isArray(response[1])) {
    throw new Error("Invalid response format from World Bank API");
  }

  const rawEntries = response[1];
  console.log(`Received ${rawEntries.length} entries from World Bank.`);

  // Load existing countries to build code2/code3 lookup
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

  const gdpByCountry = {};

  for (const item of rawEntries) {
    if (item.value === null || item.value === undefined) continue;

    const code2 = (item.country?.id || "").toUpperCase();
    const code3 = (item.countryiso3code || "").toUpperCase();
    const year = parseInt(item.date, 10);
    const nominal = Math.round(item.value);

    // Prefer 2-letter ISO code
    let primaryCode = code2;
    if ((!primaryCode || primaryCode.length !== 2) && code3 && code3ToCode2[code3]) {
      primaryCode = code3ToCode2[code3];
    }

    if (primaryCode && primaryCode.length === 2) {
      gdpByCountry[primaryCode] = {
        nominal,
        year,
        source: "World Bank (WDI)",
      };
    }
  }

  // Merge supplemental data
  for (const [code, supp] of Object.entries(SUPPLEMENTAL_GDP)) {
    if (!gdpByCountry[code]) {
      gdpByCountry[code] = supp;
    }
  }

  // Sort keys alphabetically
  const sortedGdp = Object.keys(gdpByCountry)
    .sort()
    .reduce((acc, key) => {
      acc[key] = gdpByCountry[key];
      return acc;
    }, {});

  const totalCount = Object.keys(sortedGdp).length;
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(sortedGdp, null, 2), "utf-8");
  console.log(`Successfully saved GDP data for ${totalCount} countries to ${OUTPUT_FILE}`);
}

run().catch((err) => {
  console.error("Error updating GDP data:", err);
  process.exit(1);
});
