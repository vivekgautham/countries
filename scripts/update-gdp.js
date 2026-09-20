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
  GDP_GROWTH: "NY.GDP.MKTP.KD.ZG", // Annual GDP growth (%)
  INFLATION: "FP.CPI.TOTL.ZG", // Inflation, consumer prices (annual %)
  LIFE_EXPECTANCY: "SP.DYN.LE00.IN", // Life expectancy at birth, total (years)
  INTERNET_USERS: "IT.NET.USER.ZS", // Individuals using the Internet (% of population)
  GDP_PPP: "NY.GDP.MKTP.PP.CD", // GDP, PPP (current international $)
  GDP_PPP_PER_CAPITA: "NY.GDP.PCAP.PP.CD", // GDP per capita, PPP (current international $)
  AGRICULTURE_GDP: "NV.AGR.TOTL.ZS", // Agriculture, forestry, and fishing (% of GDP)
  INDUSTRY_GDP: "NV.IND.TOTL.ZS", // Industry, value added (% of GDP)
  SERVICES_GDP: "NV.SRV.TOTL.ZS", // Services, value added (% of GDP)
  EXPORTS_GDP: "NE.EXP.GNFS.ZS", // Exports of goods and services (% of GDP)
  IMPORTS_GDP: "NE.IMP.GNFS.ZS", // Imports of goods and services (% of GDP)
  RENEWABLE_ENERGY: "EG.FEC.RNEW.ZS", // Renewable energy consumption (% of total final energy consumption)
  CO2_EMISSIONS: "EN.GHG.CO2.MT.CE.AR5", // Carbon dioxide (CO2) emissions (total) excluding LULUCF (Mt CO2e) [Source 75]
  CO2_PER_CAPITA: "EN.GHG.CO2.PC.CE.AR5", // Carbon dioxide (CO2) emissions excluding LULUCF per capita (t CO2e/capita)
  GHG_PER_CAPITA: "EN.GHG.ALL.PC.CE.AR5", // Total greenhouse gas emissions excluding LULUCF per capita (t CO2e/capita) [Source 75]
  FOREST_COVER: "AG.LND.FRST.ZS", // Forest area (% of land area)
  ELECTRIC_POWER_CONSUMPTION: "EG.USE.ELEC.KH.PC", // Electric power consumption (kWh per capita)
  ELECTRICITY_ACCESS: "EG.ELC.ACCS.ZS", // Access to electricity (% of population)
  UNEMPLOYMENT: "SL.UEM.TOTL.ZS", // Unemployment, total (% of total labor force) (modeled ILO estimate)
  FERTILITY_RATE: "SP.DYN.TFRT.IN", // Fertility rate, total (births per woman)
  URBAN_POPULATION: "SP.URB.TOTL.IN.ZS", // Urban population (% of total population)
  GINI_INDEX: "SI.POV.GINI", // Gini index (World Bank estimate)
  MOBILE_SUBSCRIPTIONS: "IT.CEL.SETS.P2", // Mobile cellular subscriptions (per 100 people)
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
    growth: 3.1,
    growthYear: 2024,
    inflation: 2.1,
    inflationYear: 2024,
    lifeExpectancy: 80.8,
    lifeExpectancyYear: 2023,
    internetUsers: 91.8,
    internetUsersYear: 2024,
    ppp: 1780000000000,
    pppYear: 2024,
    pppPerCapita: 76000,
    pppPerCapitaYear: 2024,
    agricultureGdp: 1.6,
    agricultureGdpYear: 2024,
    industryGdp: 37.4,
    industryGdpYear: 2024,
    servicesGdp: 61.0,
    servicesGdpYear: 2024,
    exportsGdp: 58.2,
    exportsGdpYear: 2024,
    importsGdp: 49.5,
    importsGdpYear: 2024,
    renewableEnergy: 9.5,
    renewableEnergyYear: 2023,
    co2Emissions: 270.5,
    co2EmissionsYear: 2023,
    co2PerCapita: 11.6,
    co2PerCapitaYear: 2023,
    ghgPerCapita: 12.2,
    ghgPerCapitaYear: 2023,
    forestCover: 60.7,
    forestCoverYear: 2023,
    electricPowerConsumption: 12200,
    electricPowerConsumptionYear: 2023,
    electricityAccess: 100.0,
    electricityAccessYear: 2024,
    unemployment: 3.4,
    unemploymentYear: 2024,
    fertilityRate: 0.87,
    fertilityRateYear: 2024,
    urbanPopulation: 78.9,
    urbanPopulationYear: 2024,
    gini: 34.2,
    giniYear: 2023,
    mobileSubscriptions: 132.5,
    mobileSubscriptionsYear: 2024,
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

function fetchIndicator(indicator, source) {
  const url = `https://api.worldbank.org/v2/country/all/indicator/${indicator}?${source ? `source=${source}&` : ""}mrnev=1&format=json&per_page=350`;
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          return resolve(fetchIndicator(indicator, source));
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
  console.log(
    "Fetching World Bank data for GDP, Population, Per Capita, Growth, Inflation, Life Expectancy, Internet, PPP, Sectors, Trade, Climate, Energy, Demographics, and Labor in parallel...",
  );
  const [
    gdpList,
    popList,
    pcapList,
    growthList,
    inflationList,
    lifeList,
    internetList,
    pppList,
    pppCapList,
    agrList,
    indList,
    srvList,
    expList,
    impList,
    renewList,
    co2List,
    co2PerCapList,
    ghgList,
    forestList,
    elecConsumptionList,
    elecAccessList,
    unemploymentList,
    fertilityList,
    urbanList,
    giniList,
    mobileList,
  ] = await Promise.all([
    fetchIndicator(INDICATORS.GDP_NOMINAL),
    fetchIndicator(INDICATORS.POPULATION),
    fetchIndicator(INDICATORS.GDP_PER_CAPITA),
    fetchIndicator(INDICATORS.GDP_GROWTH),
    fetchIndicator(INDICATORS.INFLATION),
    fetchIndicator(INDICATORS.LIFE_EXPECTANCY),
    fetchIndicator(INDICATORS.INTERNET_USERS),
    fetchIndicator(INDICATORS.GDP_PPP),
    fetchIndicator(INDICATORS.GDP_PPP_PER_CAPITA),
    fetchIndicator(INDICATORS.AGRICULTURE_GDP),
    fetchIndicator(INDICATORS.INDUSTRY_GDP),
    fetchIndicator(INDICATORS.SERVICES_GDP),
    fetchIndicator(INDICATORS.EXPORTS_GDP),
    fetchIndicator(INDICATORS.IMPORTS_GDP),
    fetchIndicator(INDICATORS.RENEWABLE_ENERGY),
    fetchIndicator(INDICATORS.CO2_EMISSIONS, 75),
    fetchIndicator(INDICATORS.CO2_PER_CAPITA),
    fetchIndicator(INDICATORS.GHG_PER_CAPITA, 75),
    fetchIndicator(INDICATORS.FOREST_COVER),
    fetchIndicator(INDICATORS.ELECTRIC_POWER_CONSUMPTION),
    fetchIndicator(INDICATORS.ELECTRICITY_ACCESS),
    fetchIndicator(INDICATORS.UNEMPLOYMENT),
    fetchIndicator(INDICATORS.FERTILITY_RATE),
    fetchIndicator(INDICATORS.URBAN_POPULATION),
    fetchIndicator(INDICATORS.GINI_INDEX),
    fetchIndicator(INDICATORS.MOBILE_SUBSCRIPTIONS),
  ]);

  console.log(
    `Received records from World Bank: GDP (${gdpList.length}), Pop (${popList.length}), Per-Capita (${pcapList.length}), Growth (${growthList.length}), Inflation (${inflationList.length}), Life Expectancy (${lifeList.length}), Internet (${internetList.length}), PPP (${pppList.length}), Renewables (${renewList.length}), Forest (${forestList.length}), Electricity (${elecConsumptionList.length}), Access (${elecAccessList.length}), Unemployment (${unemploymentList.length}), Fertility (${fertilityList.length}), Urban (${urbanList.length}), Gini (${giniList.length}), Mobile (${mobileList.length})`,
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

  // 4. Process GDP Growth
  for (const item of growthList) {
    if (item.value === null || item.value === undefined) continue;
    const code = resolveCode(item);
    if (!code) continue;

    if (!resultByCountry[code]) {
      resultByCountry[code] = { source: "World Bank (WDI)" };
    }
    resultByCountry[code].growth = Math.round(item.value * 100) / 100;
    resultByCountry[code].growthYear = parseInt(item.date, 10);
  }

  // 5. Process Inflation
  for (const item of inflationList) {
    if (item.value === null || item.value === undefined) continue;
    const code = resolveCode(item);
    if (!code) continue;

    if (!resultByCountry[code]) {
      resultByCountry[code] = { source: "World Bank (WDI)" };
    }
    resultByCountry[code].inflation = Math.round(item.value * 100) / 100;
    resultByCountry[code].inflationYear = parseInt(item.date, 10);
  }

  // 6. Process Life Expectancy
  for (const item of lifeList) {
    if (item.value === null || item.value === undefined) continue;
    const code = resolveCode(item);
    if (!code) continue;

    if (!resultByCountry[code]) {
      resultByCountry[code] = { source: "World Bank (WDI)" };
    }
    resultByCountry[code].lifeExpectancy = Math.round(item.value * 10) / 10;
    resultByCountry[code].lifeExpectancyYear = parseInt(item.date, 10);
  }

  // 7. Process Internet Users (% of population)
  for (const item of internetList) {
    if (item.value === null || item.value === undefined) continue;
    const code = resolveCode(item);
    if (!code) continue;

    if (!resultByCountry[code]) {
      resultByCountry[code] = { source: "World Bank (WDI)" };
    }
    resultByCountry[code].internetUsers = Math.round(item.value * 10) / 10;
    resultByCountry[code].internetUsersYear = parseInt(item.date, 10);
  }

  // 8. Process GDP (PPP)
  for (const item of pppList) {
    if (item.value === null || item.value === undefined) continue;
    const code = resolveCode(item);
    if (!code) continue;

    if (!resultByCountry[code]) {
      resultByCountry[code] = { source: "World Bank (WDI)" };
    }
    resultByCountry[code].ppp = Math.round(item.value);
    resultByCountry[code].pppYear = parseInt(item.date, 10);
  }

  // 9. Process GDP per Capita (PPP)
  for (const item of pppCapList) {
    if (item.value === null || item.value === undefined) continue;
    const code = resolveCode(item);
    if (!code) continue;

    if (!resultByCountry[code]) {
      resultByCountry[code] = { source: "World Bank (WDI)" };
    }
    resultByCountry[code].pppPerCapita = Math.round(item.value);
    resultByCountry[code].pppPerCapitaYear = parseInt(item.date, 10);
  }

  // 10. Process Agriculture (% of GDP)
  for (const item of agrList) {
    if (item.value === null || item.value === undefined) continue;
    const code = resolveCode(item);
    if (!code) continue;

    if (!resultByCountry[code]) {
      resultByCountry[code] = { source: "World Bank (WDI)" };
    }
    resultByCountry[code].agricultureGdp = Math.round(item.value * 10) / 10;
    resultByCountry[code].agricultureGdpYear = parseInt(item.date, 10);
  }

  // 11. Process Industry (% of GDP)
  for (const item of indList) {
    if (item.value === null || item.value === undefined) continue;
    const code = resolveCode(item);
    if (!code) continue;

    if (!resultByCountry[code]) {
      resultByCountry[code] = { source: "World Bank (WDI)" };
    }
    resultByCountry[code].industryGdp = Math.round(item.value * 10) / 10;
    resultByCountry[code].industryGdpYear = parseInt(item.date, 10);
  }

  // 12. Process Services (% of GDP)
  for (const item of srvList) {
    if (item.value === null || item.value === undefined) continue;
    const code = resolveCode(item);
    if (!code) continue;

    if (!resultByCountry[code]) {
      resultByCountry[code] = { source: "World Bank (WDI)" };
    }
    resultByCountry[code].servicesGdp = Math.round(item.value * 10) / 10;
    resultByCountry[code].servicesGdpYear = parseInt(item.date, 10);
  }

  // 13. Process Exports (% of GDP)
  for (const item of expList) {
    if (item.value === null || item.value === undefined) continue;
    const code = resolveCode(item);
    if (!code) continue;

    if (!resultByCountry[code]) {
      resultByCountry[code] = { source: "World Bank (WDI)" };
    }
    resultByCountry[code].exportsGdp = Math.round(item.value * 10) / 10;
    resultByCountry[code].exportsGdpYear = parseInt(item.date, 10);
  }

  // 14. Process Imports (% of GDP)
  for (const item of impList) {
    if (item.value === null || item.value === undefined) continue;
    const code = resolveCode(item);
    if (!code) continue;

    if (!resultByCountry[code]) {
      resultByCountry[code] = { source: "World Bank (WDI)" };
    }
    resultByCountry[code].importsGdp = Math.round(item.value * 10) / 10;
    resultByCountry[code].importsGdpYear = parseInt(item.date, 10);
  }

  // 15. Process Renewable Energy (% of total final energy consumption)
  for (const item of renewList) {
    if (item.value === null || item.value === undefined) continue;
    const code = resolveCode(item);
    if (!code) continue;

    if (!resultByCountry[code]) {
      resultByCountry[code] = { source: "World Bank (WDI)" };
    }
    resultByCountry[code].renewableEnergy = Math.round(item.value * 10) / 10;
    resultByCountry[code].renewableEnergyYear = parseInt(item.date, 10);
  }

  // 16. Process CO2 Emissions (total Mt)
  for (const item of co2List) {
    if (item.value === null || item.value === undefined) continue;
    const code = resolveCode(item);
    if (!code) continue;

    if (!resultByCountry[code]) {
      resultByCountry[code] = { source: "World Bank (WDI)" };
    }
    resultByCountry[code].co2Emissions = Math.round(item.value * 100) / 100;
    resultByCountry[code].co2EmissionsYear = parseInt(item.date, 10);
  }

  // 17. Process Total GHG Per Capita (t CO2e/capita)
  for (const item of ghgList) {
    if (item.value === null || item.value === undefined) continue;
    const code = resolveCode(item);
    if (!code) continue;

    if (!resultByCountry[code]) {
      resultByCountry[code] = { source: "World Bank (WDI)" };
    }
    resultByCountry[code].ghgPerCapita = Math.round(item.value * 10) / 10;
    resultByCountry[code].ghgPerCapitaYear = parseInt(item.date, 10);
  }

  // 18. Process Direct CO2 Emissions Per Capita (t CO2e/capita)
  for (const item of co2PerCapList) {
    if (item.value === null || item.value === undefined) continue;
    const code = resolveCode(item);
    if (!code) continue;

    if (!resultByCountry[code]) {
      resultByCountry[code] = { source: "World Bank (WDI)" };
    }
    resultByCountry[code].co2PerCapita = Math.round(item.value * 10) / 10;
    resultByCountry[code].co2PerCapitaYear = parseInt(item.date, 10);
  }

  // 19. Process Forest Cover (% of land area)
  for (const item of forestList) {
    if (item.value === null || item.value === undefined) continue;
    const code = resolveCode(item);
    if (!code) continue;

    if (!resultByCountry[code]) {
      resultByCountry[code] = { source: "World Bank (WDI)" };
    }
    resultByCountry[code].forestCover = Math.round(item.value * 10) / 10;
    resultByCountry[code].forestCoverYear = parseInt(item.date, 10);
  }

  // 20. Process Electric Power Consumption (kWh per capita)
  for (const item of elecConsumptionList) {
    if (item.value === null || item.value === undefined) continue;
    const code = resolveCode(item);
    if (!code) continue;

    if (!resultByCountry[code]) {
      resultByCountry[code] = { source: "World Bank (WDI)" };
    }
    resultByCountry[code].electricPowerConsumption = Math.round(item.value);
    resultByCountry[code].electricPowerConsumptionYear = parseInt(item.date, 10);
  }

  // 21. Process Access to Electricity (% of population)
  for (const item of elecAccessList) {
    if (item.value === null || item.value === undefined) continue;
    const code = resolveCode(item);
    if (!code) continue;

    if (!resultByCountry[code]) {
      resultByCountry[code] = { source: "World Bank (WDI)" };
    }
    resultByCountry[code].electricityAccess = Math.round(item.value * 10) / 10;
    resultByCountry[code].electricityAccessYear = parseInt(item.date, 10);
  }

  // 22. Process Unemployment Rate (% of labor force)
  for (const item of unemploymentList) {
    if (item.value === null || item.value === undefined) continue;
    const code = resolveCode(item);
    if (!code) continue;

    if (!resultByCountry[code]) {
      resultByCountry[code] = { source: "World Bank (WDI)" };
    }
    resultByCountry[code].unemployment = Math.round(item.value * 10) / 10;
    resultByCountry[code].unemploymentYear = parseInt(item.date, 10);
  }

  // 23. Process Fertility Rate (births per woman)
  for (const item of fertilityList) {
    if (item.value === null || item.value === undefined) continue;
    const code = resolveCode(item);
    if (!code) continue;

    if (!resultByCountry[code]) {
      resultByCountry[code] = { source: "World Bank (WDI)" };
    }
    resultByCountry[code].fertilityRate = Math.round(item.value * 100) / 100;
    resultByCountry[code].fertilityRateYear = parseInt(item.date, 10);
  }

  // 24. Process Urban Population (% of total population)
  for (const item of urbanList) {
    if (item.value === null || item.value === undefined) continue;
    const code = resolveCode(item);
    if (!code) continue;

    if (!resultByCountry[code]) {
      resultByCountry[code] = { source: "World Bank (WDI)" };
    }
    resultByCountry[code].urbanPopulation = Math.round(item.value * 10) / 10;
    resultByCountry[code].urbanPopulationYear = parseInt(item.date, 10);
  }

  // 25. Process Gini Index (Income Inequality)
  for (const item of giniList) {
    if (item.value === null || item.value === undefined) continue;
    const code = resolveCode(item);
    if (!code) continue;

    if (!resultByCountry[code]) {
      resultByCountry[code] = { source: "World Bank (WDI)" };
    }
    resultByCountry[code].gini = Math.round(item.value * 10) / 10;
    resultByCountry[code].giniYear = parseInt(item.date, 10);
  }

  // 26. Process Mobile Subscriptions (per 100 people)
  for (const item of mobileList) {
    if (item.value === null || item.value === undefined) continue;
    const code = resolveCode(item);
    if (!code) continue;

    if (!resultByCountry[code]) {
      resultByCountry[code] = { source: "World Bank (WDI)" };
    }
    resultByCountry[code].mobileSubscriptions = Math.round(item.value * 10) / 10;
    resultByCountry[code].mobileSubscriptionsYear = parseInt(item.date, 10);
  }

  // 27. Fallback CO2 per capita calculation if not directly reported
  for (const entry of Object.values(resultByCountry)) {
    if (
      entry.co2PerCapita === undefined &&
      entry.co2Emissions !== undefined &&
      entry.population &&
      entry.population > 0
    ) {
      entry.co2PerCapita =
        Math.round(((entry.co2Emissions * 1e6) / entry.population) * 10) / 10;
      entry.co2PerCapitaYear = entry.co2EmissionsYear;
    }
  }

  // 19. Fill in calculated per-capita fallback if perCapita is missing but nominal & pop are available
  for (const entry of Object.values(resultByCountry)) {
    if (!entry.perCapita && entry.nominal && entry.population && entry.population > 0) {
      entry.perCapita = Math.round(entry.nominal / entry.population);
      entry.perCapitaYear = entry.year || entry.populationYear;
    }
    if (!entry.pppPerCapita && entry.ppp && entry.population && entry.population > 0) {
      entry.pppPerCapita = Math.round(entry.ppp / entry.population);
      entry.pppPerCapitaYear = entry.pppYear || entry.populationYear;
    }
  }

  // 16. Merge supplemental data for entities not covered by World Bank
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
      if (resultByCountry[code].growth === undefined && supp.growth !== undefined) {
        resultByCountry[code].growth = supp.growth;
        resultByCountry[code].growthYear = supp.growthYear;
      }
      if (resultByCountry[code].inflation === undefined && supp.inflation !== undefined) {
        resultByCountry[code].inflation = supp.inflation;
        resultByCountry[code].inflationYear = supp.inflationYear;
      }
      if (resultByCountry[code].lifeExpectancy === undefined && supp.lifeExpectancy !== undefined) {
        resultByCountry[code].lifeExpectancy = supp.lifeExpectancy;
        resultByCountry[code].lifeExpectancyYear = supp.lifeExpectancyYear;
      }
      if (resultByCountry[code].internetUsers === undefined && supp.internetUsers !== undefined) {
        resultByCountry[code].internetUsers = supp.internetUsers;
        resultByCountry[code].internetUsersYear = supp.internetUsersYear;
      }
      if (!resultByCountry[code].ppp && supp.ppp) {
        resultByCountry[code].ppp = supp.ppp;
        resultByCountry[code].pppYear = supp.pppYear;
      }
      if (!resultByCountry[code].pppPerCapita && supp.pppPerCapita) {
        resultByCountry[code].pppPerCapita = supp.pppPerCapita;
        resultByCountry[code].pppPerCapitaYear = supp.pppPerCapitaYear;
      }
      if (resultByCountry[code].agricultureGdp === undefined && supp.agricultureGdp !== undefined) {
        resultByCountry[code].agricultureGdp = supp.agricultureGdp;
        resultByCountry[code].agricultureGdpYear = supp.agricultureGdpYear;
      }
      if (resultByCountry[code].industryGdp === undefined && supp.industryGdp !== undefined) {
        resultByCountry[code].industryGdp = supp.industryGdp;
        resultByCountry[code].industryGdpYear = supp.industryGdpYear;
      }
      if (resultByCountry[code].servicesGdp === undefined && supp.servicesGdp !== undefined) {
        resultByCountry[code].servicesGdp = supp.servicesGdp;
        resultByCountry[code].servicesGdpYear = supp.servicesGdpYear;
      }
      if (resultByCountry[code].exportsGdp === undefined && supp.exportsGdp !== undefined) {
        resultByCountry[code].exportsGdp = supp.exportsGdp;
        resultByCountry[code].exportsGdpYear = supp.exportsGdpYear;
      }
      if (resultByCountry[code].importsGdp === undefined && supp.importsGdp !== undefined) {
        resultByCountry[code].importsGdp = supp.importsGdp;
        resultByCountry[code].importsGdpYear = supp.importsGdpYear;
      }
      if (resultByCountry[code].renewableEnergy === undefined && supp.renewableEnergy !== undefined) {
        resultByCountry[code].renewableEnergy = supp.renewableEnergy;
        resultByCountry[code].renewableEnergyYear = supp.renewableEnergyYear;
      }
      if (resultByCountry[code].co2Emissions === undefined && supp.co2Emissions !== undefined) {
        resultByCountry[code].co2Emissions = supp.co2Emissions;
        resultByCountry[code].co2EmissionsYear = supp.co2EmissionsYear;
      }
      if (resultByCountry[code].co2PerCapita === undefined && supp.co2PerCapita !== undefined) {
        resultByCountry[code].co2PerCapita = supp.co2PerCapita;
        resultByCountry[code].co2PerCapitaYear = supp.co2PerCapitaYear;
      }
      if (resultByCountry[code].ghgPerCapita === undefined && supp.ghgPerCapita !== undefined) {
        resultByCountry[code].ghgPerCapita = supp.ghgPerCapita;
        resultByCountry[code].ghgPerCapitaYear = supp.ghgPerCapitaYear;
      }
      if (resultByCountry[code].forestCover === undefined && supp.forestCover !== undefined) {
        resultByCountry[code].forestCover = supp.forestCover;
        resultByCountry[code].forestCoverYear = supp.forestCoverYear;
      }
      if (resultByCountry[code].electricPowerConsumption === undefined && supp.electricPowerConsumption !== undefined) {
        resultByCountry[code].electricPowerConsumption = supp.electricPowerConsumption;
        resultByCountry[code].electricPowerConsumptionYear = supp.electricPowerConsumptionYear;
      }
      if (resultByCountry[code].electricityAccess === undefined && supp.electricityAccess !== undefined) {
        resultByCountry[code].electricityAccess = supp.electricityAccess;
        resultByCountry[code].electricityAccessYear = supp.electricityAccessYear;
      }
      if (resultByCountry[code].unemployment === undefined && supp.unemployment !== undefined) {
        resultByCountry[code].unemployment = supp.unemployment;
        resultByCountry[code].unemploymentYear = supp.unemploymentYear;
      }
      if (resultByCountry[code].fertilityRate === undefined && supp.fertilityRate !== undefined) {
        resultByCountry[code].fertilityRate = supp.fertilityRate;
        resultByCountry[code].fertilityRateYear = supp.fertilityRateYear;
      }
      if (resultByCountry[code].urbanPopulation === undefined && supp.urbanPopulation !== undefined) {
        resultByCountry[code].urbanPopulation = supp.urbanPopulation;
        resultByCountry[code].urbanPopulationYear = supp.urbanPopulationYear;
      }
      if (resultByCountry[code].gini === undefined && supp.gini !== undefined) {
        resultByCountry[code].gini = supp.gini;
        resultByCountry[code].giniYear = supp.giniYear;
      }
      if (resultByCountry[code].mobileSubscriptions === undefined && supp.mobileSubscriptions !== undefined) {
        resultByCountry[code].mobileSubscriptions = supp.mobileSubscriptions;
        resultByCountry[code].mobileSubscriptionsYear = supp.mobileSubscriptionsYear;
      }
    }
  }

  // 10. Fallback to existing country record population if World Bank does not cover the entity (e.g. overseas territories)
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
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(sortedData, null, 2) + "\n", "utf-8");
  console.log(`Successfully saved World Bank dataset for ${totalCount} countries to ${OUTPUT_FILE}`);
}

run().catch((err) => {
  console.error("Error updating World Bank data:", err);
  process.exit(1);
});
