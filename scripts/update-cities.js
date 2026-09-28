import { execSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ADMIN_URL =
  "http://download.geonames.org/export/dump/admin1CodesASCII.txt";
const CITIES_ZIP_URL =
  "http://download.geonames.org/export/dump/cities15000.zip";
const OUTPUT_FILE = path.resolve(__dirname, "../src/data/cities.json");
const COUNTRIES_FILE = path.resolve(__dirname, "../src/data/countries.json");

// NYC Boroughs to exclude in US (since New York City covers them)
const NYC_BOROUGHS = new Set([
  "brooklyn",
  "queens",
  "manhattan",
  "the bronx",
  "staten island",
]);

// Supplemental settlements for small dependencies / territories
const SUPPLEMENTAL_CITIES = {
  TK: [
    {
      name: "Fakaofo",
      population: 490,
      adminName: "Fakaofo",
      isCapital: true,
      latitude: -9.3803,
      longitude: -171.2188,
    },
    {
      name: "Atafu",
      population: 541,
      adminName: "Atafu",
      isCapital: false,
      latitude: -8.5333,
      longitude: -172.5167,
    },
    {
      name: "Nukunonu",
      population: 452,
      adminName: "Nukunonu",
      isCapital: false,
      latitude: -9.2008,
      longitude: -171.8481,
    },
  ],
  IO: [
    {
      name: "Diego Garcia",
      population: 3000,
      adminName: "British Indian Ocean Territory",
      isCapital: true,
      latitude: -7.3195,
      longitude: 72.4229,
    },
  ],
  AQ: [
    {
      name: "McMurdo Station",
      population: 1000,
      adminName: "Ross Dependency (Research)",
      isCapital: false,
      latitude: -77.8463,
      longitude: 166.6682,
    },
    {
      name: "Amundsen-Scott South Pole Station",
      population: 150,
      adminName: "South Pole (Research)",
      isCapital: false,
      latitude: -90.0,
      longitude: 0.0,
    },
  ],
};

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(destPath);
    protocol
      .get(url, (res) => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          file.close();
          return resolve(downloadFile(res.headers.location, destPath));
        }
        if (res.statusCode !== 200) {
          file.close();
          return reject(
            new Error(`Failed to download ${url}: status ${res.statusCode}`),
          );
        }
        res.pipe(file);
        file.on("finish", () => {
          file.close(resolve);
        });
      })
      .on("error", (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
  });
}

async function run() {
  console.log("=== Updating World Cities Dataset ===");
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "countries-cities-"));

  try {
    const adminPath = path.join(tempDir, "admin1CodesASCII.txt");
    const zipPath = path.join(tempDir, "cities15000.zip");
    const txtPath = path.join(tempDir, "cities15000.txt");

    console.log(`Downloading admin regions from ${ADMIN_URL}...`);
    await downloadFile(ADMIN_URL, adminPath);

    console.log(`Downloading cities archive from ${CITIES_ZIP_URL}...`);
    await downloadFile(CITIES_ZIP_URL, zipPath);

    console.log("Extracting cities15000.zip...");
    execSync(`unzip -o "${zipPath}" -d "${tempDir}"`, { stdio: "ignore" });

    // Load admin division names
    console.log("Parsing admin codes...");
    const adminMap = new Map();
    const adminLines = fs.readFileSync(adminPath, "utf-8").split(/\r?\n/);
    for (const line of adminLines) {
      const parts = line.split("\t");
      if (parts.length >= 2) {
        adminMap.set(parts[0].trim(), parts[1].trim());
      }
    }

    // Load existing country info for capitals & verification
    const rawCountries = JSON.parse(fs.readFileSync(COUNTRIES_FILE, "utf-8"));
    const countryCapitals = new Map();
    for (const c of rawCountries) {
      if (c.code && c.capital) {
        countryCapitals.set(c.code.toUpperCase(), c.capital.toLowerCase());
      }
    }

    // Parse cities
    console.log("Parsing cities...");
    const citiesLines = fs.readFileSync(txtPath, "utf-8").split(/\r?\n/);
    const citiesByCountry = {};

    for (const line of citiesLines) {
      if (!line) continue;
      const parts = line.split("\t");
      if (parts.length <= 14) continue;

      const cc = (parts[8] || "").trim().toUpperCase();
      if (!cc) continue;

      const fcode = (parts[7] || "").trim();
      // Skip PPLX (subdivisions/neighborhoods like boroughs or city quarters)
      if (fcode === "PPLX") continue;

      const name = (parts[1] || "").trim();
      if (!name) continue;

      const admin1Code = (parts[10] || "").trim();
      // Skip NYC boroughs in US
      if (
        cc === "US" &&
        NYC_BOROUGHS.has(name.toLowerCase()) &&
        admin1Code === "NY"
      ) {
        continue;
      }

      const pop = parseInt(parts[14], 10) || 0;
      const lat = parts[4] ? Math.round(parseFloat(parts[4]) * 10000) / 10000 : undefined;
      const lng = parts[5] ? Math.round(parseFloat(parts[5]) * 10000) / 10000 : undefined;

      const adminKey = `${cc}.${admin1Code}`;
      const adminName = adminMap.get(adminKey) || undefined;

      const capitalTarget = countryCapitals.get(cc) || "";
      const isCapital =
        fcode === "PPLC" ||
        (capitalTarget &&
          (capitalTarget.toLowerCase() === name.toLowerCase() ||
            capitalTarget.toLowerCase().includes(name.toLowerCase())));

      if (!citiesByCountry[cc]) {
        citiesByCountry[cc] = [];
      }

      citiesByCountry[cc].push({
        name,
        population: pop,
        adminName,
        isCapital: Boolean(isCapital),
        latitude: lat,
        longitude: lng,
      });
    }

    // Merge supplemental data
    for (const [cc, supList] of Object.entries(SUPPLEMENTAL_CITIES)) {
      if (!citiesByCountry[cc] || citiesByCountry[cc].length === 0) {
        citiesByCountry[cc] = supList;
      }
    }

    // Deduplicate and select top cities per country
    const finalResult = {};
    const TOP_LIMIT = 10;

    for (const [cc, list] of Object.entries(citiesByCountry)) {
      // Deduplicate by city name (case-insensitive)
      const nameMap = new Map();
      for (const item of list) {
        const key = item.name.toLowerCase();
        const existing = nameMap.get(key);
        if (!existing || item.population > existing.population) {
          nameMap.set(key, item);
        }
      }

      const uniqueCities = Array.from(nameMap.values());
      uniqueCities.sort((a, b) => b.population - a.population);

      // Select top cities
      let selected = uniqueCities.slice(0, TOP_LIMIT);

      // Ensure national capital is included if present in the country
      const capitalInSelected = selected.some((c) => c.isCapital);
      if (!capitalInSelected) {
        const cap = uniqueCities.slice(TOP_LIMIT).find((c) => c.isCapital);
        if (cap) {
          selected.push(cap);
        }
      }

      // Sort alphabetically by city name
      selected.sort((a, b) => a.name.localeCompare(b.name));
      const formatted = selected.map((city) => ({
        name: city.name,
        adminName: city.adminName,
        isCapital: city.isCapital,
      }));

      finalResult[cc] = formatted;
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalResult, null, 2), "utf-8");
    const stats = fs.statSync(OUTPUT_FILE);
    console.log(`Saved cities dataset to ${OUTPUT_FILE}`);
    console.log(
      `Dataset size: ${(stats.size / 1024).toFixed(1)} KB across ${Object.keys(finalResult).length} countries.`,
    );
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

run().catch((err) => {
  console.error("Error updating cities dataset:", err);
  process.exit(1);
});
