import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WIKI_API_URL =
  "https://en.wikipedia.org/api/rest_v1/page/html/List_of_countries_by_credit_rating";
const COUNTRIES_FILE = path.resolve(__dirname, "../src/data/countries.json");
const OUTPUT_FILE = path.resolve(__dirname, "../src/data/creditRatings.json");

// 21-point numerical scale mapping
const SP_FITCH_SCALE = {
  AAA: 21,
  "AA+": 20,
  AA: 19,
  "AA-": 18,
  "A+": 17,
  A: 16,
  "A-": 15,
  "BBB+": 14,
  BBB: 13,
  "BBB-": 12,
  "BB+": 11,
  BB: 10,
  "BB-": 9,
  "B+": 8,
  B: 7,
  "B-": 6,
  "CCC+": 5,
  CCC: 4,
  "CCC-": 3,
  CC: 2,
  C: 2,
  SD: 1,
  RD: 1,
  D: 1,
};

const MOODYS_SCALE = {
  Aaa: 21,
  Aa1: 20,
  Aa2: 19,
  Aa3: 18,
  A1: 17,
  A2: 16,
  A3: 15,
  Baa1: 14,
  Baa2: 13,
  Baa3: 12,
  Ba1: 11,
  Ba2: 10,
  Ba3: 9,
  B1: 8,
  B2: 7,
  B3: 6,
  Caa1: 5,
  Caa2: 4,
  Caa3: 3,
  Ca: 2,
  C: 1,
  WR: 1,
};

function getSpFitchScore(rating) {
  const clean = rating
    .replace(/[\u2212]/g, "-")
    .replace(/[^A-Za-z0-9+-]/g, "")
    .trim();
  return SP_FITCH_SCALE[clean] || 0;
}

function getMoodysScore(rating) {
  const clean = rating.replace(/[^A-Za-z0-9]/g, "").trim();
  return MOODYS_SCALE[clean] || 0;
}

function cleanString(str) {
  return str
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\[\d+\]/g, "")
    .replace(/[\u2212]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            "User-Agent":
              "CountriesAtlas/1.0 (https://github.com/vivekgautham/countries; data-pipeline)",
            Accept: "text/html,application/xhtml+xml",
          },
        },
        (res) => {
          if (
            res.statusCode >= 300 &&
            res.statusCode < 400 &&
            res.headers.location
          ) {
            return resolve(fetchHTML(res.headers.location));
          }
          if (res.statusCode !== 200) {
            return reject(
              new Error(
                `Failed to fetch Wikipedia page, HTTP status ${res.statusCode}`,
              ),
            );
          }

          const chunks = [];
          res.on("data", (chunk) => chunks.push(chunk));
          res.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
          res.on("error", reject);
        },
      )
      .on("error", reject);
  });
}

function buildNameToCodeMap() {
  const countries = JSON.parse(fs.readFileSync(COUNTRIES_FILE, "utf-8"));
  const nameToCode = {};

  countries.forEach((c) => {
    nameToCode[c.name.toLowerCase().trim()] = c.code.toUpperCase();
    if (c.officialName) {
      nameToCode[c.officialName.toLowerCase().trim()] = c.code.toUpperCase();
    }
  });

  const aliases = {
    "united states": "US",
    "united kingdom": "GB",
    "south korea": "KR",
    "korea, south": "KR",
    russia: "RU",
    taiwan: "TW",
    vietnam: "VN",
    "czech republic": "CZ",
    czechia: "CZ",
    "cape verde": "CV",
    "cabo verde": "CV",
    "ivory coast": "CI",
    "côte d'ivoire": "CI",
    "cote d'ivoire": "CI",
    "congo, democratic republic of the": "CD",
    "democratic republic of the congo": "CD",
    "dr congo": "CD",
    "congo, republic of the": "CG",
    "republic of the congo": "CG",
    turkey: "TR",
    türkiye: "TR",
    syria: "SY",
    iran: "IR",
    venezuela: "VE",
    bolivia: "BO",
    laos: "LA",
    micronesia: "FM",
    curacao: "CW",
    curaçao: "CW",
    "saint helena": "SH",
    "saint helena, ascension and tristan da cunha": "SH",
    pakistan: "PK",
    eswatini: "SZ",
    swaziland: "SZ",
    "north macedonia": "MK",
    macedonia: "MK",
    tanzania: "TZ",
    moldova: "MD",
    brunei: "BN",
    macau: "MO",
    macao: "MO",
    "hong kong": "HK",
    bermuda: "BM",
    "cayman islands": "KY",
    "turks and caicos islands": "TC",
    "isle of man": "IM",
    guernsey: "GG",
    jersey: "JE",
    aruba: "AW",
    bahamas: "BS",
    "the bahamas": "BS",
    gambia: "GM",
    "the gambia": "GM",
  };

  Object.entries(aliases).forEach(([alias, code]) => {
    nameToCode[alias.toLowerCase()] = code.toUpperCase();
  });

  return nameToCode;
}

function parseAgencyTable(tableHtml, scoreFn) {
  const nameToCode = buildNameToCodeMap();
  const rows = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
  const result = {};

  rows.slice(1).forEach((r) => {
    const cells = [...r[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((m) =>
      cleanString(m[1]),
    );

    if (cells.length >= 3) {
      const rawCountry = cells[0];
      const rawRating = cells[1];
      const outlook = cells[2] || "Stable";
      const date = cells[3] || "";

      // Extract rating token (e.g. "AAA", "AA-", "Baa1", "BB+")
      const match = rawRating.match(/([A-D][a-z0-9+−-]*)/i);
      if (!match) return;

      const rating = match[1].replace(/[\u2212]/g, "-").trim();
      const code = nameToCode[rawCountry.toLowerCase()];

      if (code && rating) {
        const score = scoreFn(rating);
        const grade =
          score >= 12
            ? "investment"
            : score > 1
              ? "speculative"
              : score === 1
                ? "default"
                : "unrated";

        result[code] = {
          rating,
          outlook,
          date,
          grade,
          score,
        };
      }
    }
  });

  return result;
}

async function updateRatings() {
  console.log("Fetching sovereign credit ratings from Wikipedia...");
  const html = await fetchHTML(WIKI_API_URL);

  const tables = html.match(/<table[^>]*>[\s\S]*?<\/table>/gi) || [];
  if (tables.length < 3) {
    throw new Error(
      `Expected at least 3 tables for S&P, Fitch, Moody's, found ${tables.length}`,
    );
  }

  console.log("Parsing S&P ratings (Table 0)...");
  const spRatings = parseAgencyTable(tables[0], getSpFitchScore);

  console.log("Parsing Fitch ratings (Table 1)...");
  const fitchRatings = parseAgencyTable(tables[1], getSpFitchScore);

  console.log("Parsing Moody's ratings (Table 2)...");
  const moodysRatings = parseAgencyTable(tables[2], getMoodysScore);

  const allCodes = new Set([
    ...Object.keys(spRatings),
    ...Object.keys(fitchRatings),
    ...Object.keys(moodysRatings),
  ]);

  console.log(`Matched ratings for ${allCodes.size} sovereign entities.`);

  const merged = {};
  // Sort alphabetically by country code
  const sortedCodes = Array.from(allCodes).sort();

  sortedCodes.forEach((code) => {
    const entry = {};
    if (spRatings[code]) entry.sp = spRatings[code];
    if (moodysRatings[code]) entry.moodys = moodysRatings[code];
    if (fitchRatings[code]) entry.fitch = fitchRatings[code];

    const scores = [
      spRatings[code]?.score,
      moodysRatings[code]?.score,
      fitchRatings[code]?.score,
    ].filter((s) => typeof s === "number" && s > 0);

    if (scores.length > 0) {
      const avg =
        Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) /
        10;
      entry.averageScore = avg;
      entry.overallGrade =
        avg >= 12 ? "investment" : avg > 1 ? "speculative" : "default";
      entry.isInvestmentGrade = avg >= 12;
    }

    merged[code] = entry;
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(merged, null, 2), "utf-8");
  console.log(`Successfully wrote ratings to ${OUTPUT_FILE}`);
}

updateRatings().catch((err) => {
  console.error("Error updating credit ratings:", err);
  process.exit(1);
});
