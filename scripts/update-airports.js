import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_URL = "https://davidmegginson.github.io/ourairports-data/airports.csv";
const OUTPUT_FILE = path.resolve(__dirname, "../src/data/airports.json");

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          return resolve(fetchCSV(res.headers.location));
        }
        if (res.statusCode !== 200) {
          return reject(
            new Error(`Failed to fetch CSV, HTTP status ${res.statusCode}`),
          );
        }

        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

async function run() {
  console.log(`Downloading airports dataset from ${CSV_URL}...`);
  const rawCsv = await fetchCSV(CSV_URL);
  console.log(
    `Downloaded ${(rawCsv.length / (1024 * 1024)).toFixed(2)} MB of CSV data.`,
  );

  const lines = rawCsv.split(/\r?\n/);
  if (lines.length === 0) {
    throw new Error("CSV file is empty");
  }

  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine).map((h) =>
    h.trim().replace(/^"|"$/g, ""),
  );

  const isoCountryIdx = headers.indexOf("iso_country");
  const typeIdx = headers.indexOf("type");
  const nameIdx = headers.indexOf("name");
  const iataIdx = headers.indexOf("iata_code");
  const icaoIdx = headers.indexOf("icao_code");
  const municipalityIdx = headers.indexOf("municipality");
  const scheduledIdx = headers.indexOf("scheduled_service");

  if (isoCountryIdx === -1 || typeIdx === -1) {
    throw new Error("Missing required columns in CSV header");
  }

  const airportsByCountry = {};

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = parseCSVLine(line);
    const country = (cols[isoCountryIdx] || "").trim().toUpperCase();
    if (!country) continue;

    const type = (cols[typeIdx] || "").trim();
    const name = (cols[nameIdx] || "").trim();
    const iata = (cols[iataIdx] || "").trim();
    const icao = (cols[icaoIdx] || "").trim();
    const municipality = (cols[municipalityIdx] || "").trim();
    const scheduled = (cols[scheduledIdx] || "").trim().toLowerCase() === "yes";

    if (!airportsByCountry[country]) {
      airportsByCountry[country] = {
        total: 0,
        active: 0,
        large: 0,
        medium: 0,
        small: 0,
        heliport: 0,
        seaplane: 0,
        balloonport: 0,
        closed: 0,
        scheduled: 0,
        majorAirports: [],
      };
    }

    const cData = airportsByCountry[country];
    cData.total += 1;

    if (type === "closed") {
      cData.closed += 1;
    } else {
      cData.active += 1;
      if (type === "large_airport") {
        cData.large += 1;
        cData.majorAirports.push({
          name,
          iata: iata || undefined,
          icao: icao || undefined,
          municipality: municipality || undefined,
          type,
        });
      } else if (type === "medium_airport") {
        cData.medium += 1;
        // If the country has fewer than 15 major airports recorded, include medium airports that have IATA codes
        if (cData.majorAirports.length < 15 && iata) {
          cData.majorAirports.push({
            name,
            iata,
            icao: icao || undefined,
            municipality: municipality || undefined,
            type,
          });
        }
      } else if (type === "small_airport") {
        cData.small += 1;
      } else if (type === "heliport") {
        cData.heliport += 1;
      } else if (type === "seaplane_base") {
        cData.seaplane += 1;
      } else if (type === "balloonport") {
        cData.balloonport += 1;
      }
    }

    if (scheduled) {
      cData.scheduled += 1;
    }
  }

  // Sort major airports for each country: large airports first, then by name
  for (const cData of Object.values(airportsByCountry)) {
    cData.majorAirports.sort((a, b) => {
      if (a.type === "large_airport" && b.type !== "large_airport") return -1;
      if (a.type !== "large_airport" && b.type === "large_airport") return 1;
      return a.name.localeCompare(b.name);
    });
  }

  const jsonStr = JSON.stringify(airportsByCountry, null, 2);
  fs.writeFileSync(OUTPUT_FILE, jsonStr, "utf-8");

  console.log(
    `Successfully generated ${OUTPUT_FILE} (${(Buffer.byteLength(jsonStr, "utf-8") / 1024).toFixed(1)} KB for ${Object.keys(airportsByCountry).length} countries).`,
  );
}

run().catch((err) => {
  console.error("Error processing airports:", err);
  process.exit(1);
});
