import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COUNTRIES_FILE = path.resolve(__dirname, "../src/data/countries.json");
const OUTPUT_FILE = path.resolve(__dirname, "../src/data/airQuality.json");

/**
 * Calculates US EPA Air Quality Index (AQI) from PM2.5 concentration (µg/m³).
 * Standard EPA 24-hr/annual breakpoint equation:
 * I = ((I_high - I_low) / (C_high - C_low)) * (C - C_low) + I_low
 */
function calculateAqi(pm25) {
  if (pm25 <= 0) return 0;

  const breakpoints = [
    { cLow: 0.0, cHigh: 12.0, iLow: 0, iHigh: 50 },
    { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
    { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
    { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
    { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
    { cLow: 250.5, cHigh: 350.4, iLow: 301, iHigh: 400 },
    { cLow: 350.5, cHigh: 500.4, iLow: 401, iHigh: 500 },
  ];

  for (const bp of breakpoints) {
    if (pm25 <= bp.cHigh) {
      const aqi =
        ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (pm25 - bp.cLow) +
        bp.iLow;
      return Math.round(aqi);
    }
  }

  // Beyond 500
  return 500;
}

function getAqiCategory(aqi) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Sensitive";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

function getWhoTier(pm25) {
  if (pm25 <= 5.0) return "WHO Guideline";
  if (pm25 <= 10.0) return "Interim Target 4";
  if (pm25 <= 15.0) return "Interim Target 3";
  if (pm25 <= 25.0) return "Interim Target 2";
  if (pm25 <= 35.0) return "Interim Target 1";
  return "Exceeds Targets";
}

/**
 * Supplemental PM2.5 estimates (annual mean µg/m³) for territories and economies
 * not directly reported by the World Bank aggregate indicator.
 * Sources: IQAir World Air Quality Report, WHO Global Ambient Air Quality Database, local EPAs.
 */
const SUPPLEMENTAL_DATA = {
  TW: { pm25: 13.7, year: 2023, source: "Taiwan MOENV / IQAir" }, // Taiwan
  HK: { pm25: 14.8, year: 2023, source: "HK EPD / IQAir" }, // Hong Kong
  MO: { pm25: 14.2, year: 2023, source: "Macau DSPA / IQAir" }, // Macau
  XK: { pm25: 18.5, year: 2023, source: "EEA / Kosovo EPA" }, // Kosovo
  LI: { pm25: 8.9, year: 2023, source: "Swiss BAFU / EEA" }, // Liechtenstein
  VA: { pm25: 12.1, year: 2023, source: "ARPA Lazio / Rome Regional" }, // Vatican City
  MC: { pm25: 11.5, year: 2023, source: "Monaco Environment Dept" }, // Monaco
  SM: { pm25: 12.8, year: 2023, source: "ARPA Emilia-Romagna" }, // San Marino
  AD: { pm25: 7.6, year: 2023, source: "Andorra Medi Ambient" }, // Andorra
  GI: { pm25: 10.2, year: 2023, source: "Gibraltar Environmental Agency" }, // Gibraltar
  FO: { pm25: 4.8, year: 2023, source: "Danish EPA / EEA" }, // Faroe Islands
  IM: { pm25: 6.2, year: 2023, source: "UK Defra / Isle of Man Gov" }, // Isle of Man
  JE: { pm25: 7.1, year: 2023, source: "UK Defra / States of Jersey" }, // Jersey
  GG: { pm25: 7.0, year: 2023, source: "UK Defra / Guernsey Gov" }, // Guernsey
  GL: { pm25: 3.5, year: 2023, source: "Danish DCE / Greenland Gov" }, // Greenland
  BM: { pm25: 6.8, year: 2023, source: "Bermuda DENR" }, // Bermuda
  KY: { pm25: 8.5, year: 2023, source: "Cayman Dept of Environment" }, // Cayman Islands
  AW: { pm25: 9.8, year: 2023, source: "Dutch Caribbean / RIVM" }, // Aruba
  CW: { pm25: 11.2, year: 2023, source: "Curaçao Meteorological Dept" }, // Curaçao
  SX: { pm25: 9.5, year: 2023, source: "VROMI Sint Maarten" }, // Sint Maarten
  PF: { pm25: 4.6, year: 2023, source: "Météo-France / French Polynesia" }, // French Polynesia
  NC: { pm25: 5.8, year: 2023, source: "Scal-Air Nouvelle-Calédonie" }, // New Caledonia
  GU: { pm25: 5.2, year: 2023, source: "Guam EPA / US EPA" }, // Guam
  VI: { pm25: 6.4, year: 2023, source: "US EPA Region 2" }, // US Virgin Islands
  PR: { pm25: 7.8, year: 2023, source: "US EPA Puerto Rico" }, // Puerto Rico
};

async function fetchWorldBankData(page = 1) {
  const url = `https://api.worldbank.org/v2/country/all/indicator/EN.ATM.PM25.MC.M3?date=2018:2023&format=json&page=${page}&per_page=1000`;
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(raw));
          } catch (e) {
            reject(new Error(`JSON parse error: ${e.message}`));
          }
        });
      })
      .on("error", reject);
  });
}

async function main() {
  console.log("Fetching PM2.5 air pollution data from World Bank API...");

  const firstPage = await fetchWorldBankData(1);
  const totalPages = firstPage[0]?.pages || 1;
  let allRecords = firstPage[1] || [];

  for (let p = 2; p <= totalPages; p++) {
    console.log(`Fetching page ${p} of ${totalPages}...`);
    const pageData = await fetchWorldBankData(p);
    if (pageData[1]) {
      allRecords = allRecords.concat(pageData[1]);
    }
  }

  // Filter valid values and sort by year descending so most recent observation is chosen
  const validRecords = allRecords.filter(
    (r) => typeof r.value === "number" && !isNaN(r.value),
  );
  validRecords.sort((a, b) => parseInt(b.date, 10) - parseInt(a.date, 10));

  const byIso2 = {};
  const byIso3 = {};

  for (const r of validRecords) {
    const iso2 = r.country?.id?.toUpperCase();
    const iso3 = r.countryiso3code?.toUpperCase();

    if (iso2 && !byIso2[iso2]) {
      byIso2[iso2] = r;
    }
    if (iso3 && !byIso3[iso3]) {
      byIso3[iso3] = r;
    }
  }

  const countries = JSON.parse(fs.readFileSync(COUNTRIES_FILE, "utf-8"));
  const airQualityMap = {};

  let matchedWb = 0;
  let matchedSupp = 0;

  for (const c of countries) {
    const code2 = c.code?.toUpperCase();
    const code3 = c.code3?.toUpperCase();

    const record = byIso2[code2] || byIso3[code3];

    if (record) {
      const pm25 = Math.round(record.value * 10) / 10;
      const year = parseInt(record.date, 10) || 2023;
      const aqi = calculateAqi(pm25);

      airQualityMap[code2] = {
        pm25,
        year,
        aqi,
        category: getAqiCategory(aqi),
        whoTargetMet: pm25 <= 5.0,
        whoTier: getWhoTier(pm25),
        source: "World Bank (WDI)",
      };
      matchedWb++;
    } else if (SUPPLEMENTAL_DATA[code2]) {
      const supp = SUPPLEMENTAL_DATA[code2];
      const aqi = calculateAqi(supp.pm25);

      airQualityMap[code2] = {
        pm25: supp.pm25,
        year: supp.year,
        aqi,
        category: getAqiCategory(aqi),
        whoTargetMet: supp.pm25 <= 5.0,
        whoTier: getWhoTier(supp.pm25),
        source: supp.source,
      };
      matchedSupp++;
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(airQualityMap, null, 2) + "\n");
  console.log(
    `Successfully generated ${OUTPUT_FILE} with ${Object.keys(airQualityMap).length} countries.`,
  );
  console.log(
    `World Bank matches: ${matchedWb}, Supplemental matches: ${matchedSupp}`,
  );
}

main().catch((err) => {
  console.error("Failed to update air quality data:", err);
  process.exit(1);
});
