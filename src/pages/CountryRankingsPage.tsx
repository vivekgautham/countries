import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FlightIcon from "@mui/icons-material/Flight";
import GroupsIcon from "@mui/icons-material/Groups";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PublicIcon from "@mui/icons-material/Public";
import SearchIcon from "@mui/icons-material/Search";
import SecurityIcon from "@mui/icons-material/Security";
import ShareIcon from "@mui/icons-material/Share";
import TerrainIcon from "@mui/icons-material/Terrain";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WaterIcon from "@mui/icons-material/Water";
import WavesIcon from "@mui/icons-material/Waves";
import WifiIcon from "@mui/icons-material/Wifi";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import {
  Link as RouterLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useCountriesData } from "../api/countriesApi";
import AppVersionBadge from "../components/layout/AppVersionBadge";
import { UnifiedCountry } from "../types/country";
import { calculateDensity, formatNumber } from "../utils/comparisonUtils";
import { getCountryEmoji } from "../utils/countryUtils";
import { useDocumentTitle } from "../utils/useDocumentTitle";
import {
  formatFdiInflows,
  formatTaxRevenue,
  formatGdp,
  formatGdpGrowth,
  formatGdpPerCapita,
  formatInternetUsage,
  formatLiteracyRate,
  formatPpp,
  formatPppPerCapita,
} from "../utils/gdpUtils";

export interface RankingMetricConfig {
  id: string;
  category:
    | "economy"
    | "credit"
    | "demographics"
    | "geography"
    | "growth"
    | "digital"
    | "aviation";
  label: string;
  shortLabel: string;
  unit: string;
  description: string;
  source: string;
  sortDirection: "desc" | "asc";
  icon: React.ReactNode;
  includeUnrated?: boolean;
  getValue: (country: UnifiedCountry) => number | undefined | null;
  formatValue: (val: number, country: UnifiedCountry) => string;
  getSecondaryValue?: (country: UnifiedCountry, globalSum?: number) => string;
}

export const RANKING_CATEGORIES = [
  {
    id: "economy",
    label: "Economic Powerhouses",
    shortLabel: "Economy",
    icon: <EmojiEventsIcon sx={{ fontSize: 18 }} />,
    emoji: "🥇",
    description:
      "Global leaders ranked by nominal output, purchasing power parity (PPP), and living standards.",
  },
  {
    id: "credit",
    label: "Sovereign Credit Ratings",
    shortLabel: "Credit Ratings",
    icon: <SecurityIcon sx={{ fontSize: 18 }} />,
    emoji: "🏛️",
    description:
      "Global sovereign debt creditworthiness, investment grade stability, and default risk benchmarks across S&P, Moody's, and Fitch.",
  },
  {
    id: "demographics",
    label: "Demographics & Population",
    shortLabel: "Demographics",
    icon: <GroupsIcon sx={{ fontSize: 18 }} />,
    emoji: "👥",
    description:
      "Global leaders ranked by resident population size and population density.",
  },
  {
    id: "geography",
    label: "Coastlines & Maritime",
    shortLabel: "Coastlines",
    icon: <WavesIcon sx={{ fontSize: 18 }} />,
    emoji: "🌊",
    description:
      "Global leaders ranked by total coastline length, maritime shoreline exposure, and coast-to-area density.",
  },
  {
    id: "growth",
    label: "Fastest Growing",
    shortLabel: "Growth",
    icon: <TrendingUpIcon sx={{ fontSize: 18 }} />,
    emoji: "🚀",
    description:
      "Highest real GDP growth rates and international investment attractiveness (FDI).",
  },
  {
    id: "digital",
    label: "Digital Penetration",
    shortLabel: "Digital & Tech",
    icon: <WifiIcon sx={{ fontSize: 18 }} />,
    emoji: "🌐",
    description:
      "Global leaders in internet connectivity, mobile infrastructure, and human capital.",
  },
  {
    id: "aviation",
    label: "Aviation Hubs",
    shortLabel: "Aviation",
    icon: <FlightIcon sx={{ fontSize: 18 }} />,
    emoji: "✈️",
    description:
      "Countries with the most extensive airport infrastructure and commercial flight networks.",
  },
] as const;

export const RANKING_METRICS: RankingMetricConfig[] = [
  // 1. Economy
  {
    id: "gdp_nominal",
    category: "economy",
    label: "Nominal GDP (US$)",
    shortLabel: "Nominal GDP (% of World)",
    unit: "USD",
    description:
      "Gross Domestic Product at current market exchange rates in US dollars, with each country's percentage share of total global economic output.",
    source: "World Bank (WDI)",
    sortDirection: "desc",
    icon: <AccountBalanceIcon sx={{ fontSize: 18 }} />,
    getValue: (c) => c.gdp?.nominal,
    formatValue: (val) => formatGdp(val),
    getSecondaryValue: (c, globalSum) => {
      const gdpVal = c.gdp?.nominal;
      const perCap = c.gdp?.perCapita
        ? `${formatGdpPerCapita(c.gdp.perCapita)}/capita`
        : "";
      if (typeof gdpVal === "number" && globalSum && globalSum > 0) {
        const share = (gdpVal / globalSum) * 100;
        const shareStr = `${share >= 1 ? share.toFixed(1) : share.toFixed(2)}% of World GDP`;
        return perCap ? `${shareStr} • ${perCap}` : shareStr;
      }
      return perCap || "—";
    },
  },
  {
    id: "gdp_ppp",
    category: "economy",
    label: "GDP at Purchasing Power Parity (PPP)",
    shortLabel: "GDP PPP (% of World)",
    unit: "Intl $",
    description:
      "GDP converted to international dollars using purchasing power parity rates, showing each country's share of total world purchasing power output.",
    source: "World Bank (WDI)",
    sortDirection: "desc",
    icon: <PublicIcon sx={{ fontSize: 18 }} />,
    getValue: (c) => c.gdp?.ppp,
    formatValue: (val) => formatPpp(val),
    getSecondaryValue: (c, globalSum) => {
      const pppVal = c.gdp?.ppp;
      const perCap = c.gdp?.pppPerCapita
        ? `${formatPppPerCapita(c.gdp.pppPerCapita)} PPP/capita`
        : "";
      if (typeof pppVal === "number" && globalSum && globalSum > 0) {
        const share = (pppVal / globalSum) * 100;
        const shareStr = `${share >= 1 ? share.toFixed(1) : share.toFixed(2)}% of World PPP`;
        return perCap ? `${shareStr} • ${perCap}` : shareStr;
      }
      return perCap || "—";
    },
  },
  {
    id: "gdp_per_capita",
    category: "economy",
    label: "GDP per Capita (Nominal)",
    shortLabel: "GDP/Capita (Nominal)",
    unit: "USD / person",
    description:
      "Nominal gross domestic product divided by midyear total population.",
    source: "World Bank (WDI)",
    sortDirection: "desc",
    icon: <EmojiEventsIcon sx={{ fontSize: 18 }} />,
    getValue: (c) => c.gdp?.perCapita,
    formatValue: (val) => formatGdpPerCapita(val),
    getSecondaryValue: (c) =>
      c.population ? `Pop: ${formatNumber(c.population)}` : "—",
  },
  {
    id: "gdp_ppp_per_capita",
    category: "economy",
    label: "GDP per Capita (PPP)",
    shortLabel: "GDP/Capita (PPP)",
    unit: "Intl $ / person",
    description:
      "Purchasing power adjusted GDP per citizen, reflecting true domestic living standards.",
    source: "World Bank (WDI)",
    sortDirection: "desc",
    icon: <PublicIcon sx={{ fontSize: 18 }} />,
    getValue: (c) => c.gdp?.pppPerCapita,
    formatValue: (val) => formatPppPerCapita(val),
    getSecondaryValue: (c) =>
      c.population ? `Pop: ${formatNumber(c.population)}` : "—",
  },
  // Sovereign Credit Ratings
  {
    id: "credit_rating",
    category: "credit",
    label: "Sovereign Credit Rating (Composite Benchmark)",
    shortLabel: "Composite Credit Score",
    unit: "/ 21 scale",
    description:
      "Composite sovereign creditworthiness score (1-21) benchmarked across Standard & Poor's, Moody's, and Fitch foreign-currency debt ratings.",
    source: "S&P / Moody's / Fitch",
    sortDirection: "desc",
    icon: <SecurityIcon sx={{ fontSize: 18 }} />,
    includeUnrated: true,
    getValue: (c) => c.creditRatings?.averageScore,
    formatValue: (val, c) => {
      if (val === null) return "Unrated";
      const top =
        c.creditRatings?.sp?.rating ||
        c.creditRatings?.moodys?.rating ||
        c.creditRatings?.fitch?.rating;
      return top ? `${top} (${val}/21)` : `${val}/21`;
    },
    getSecondaryValue: (c) => {
      const parts: string[] = [];
      if (c.creditRatings?.sp) parts.push(`S&P: ${c.creditRatings.sp.rating}`);
      if (c.creditRatings?.moodys)
        parts.push(`Moody's: ${c.creditRatings.moodys.rating}`);
      if (c.creditRatings?.fitch)
        parts.push(`Fitch: ${c.creditRatings.fitch.rating}`);
      return parts.join(" • ") || "Unrated by S&P, Moody's & Fitch";
    },
  },
  {
    id: "credit_sp",
    category: "credit",
    label: "Standard & Poor's (S&P) Sovereign Rating",
    shortLabel: "S&P Global Rating",
    unit: "grade scale",
    description:
      "Foreign-currency long-term sovereign debt issuer rating evaluated by Standard & Poor's Global Ratings.",
    source: "Standard & Poor's (S&P)",
    sortDirection: "desc",
    icon: <SecurityIcon sx={{ fontSize: 18 }} />,
    includeUnrated: true,
    getValue: (c) => c.creditRatings?.sp?.score,
    formatValue: (val, c) => {
      if (val === null || !c.creditRatings?.sp) return "Unrated";
      return `${c.creditRatings.sp.rating} (${val}/21)`;
    },
    getSecondaryValue: (c) => {
      if (!c.creditRatings?.sp) return "Not rated by Standard & Poor's";
      const out = c.creditRatings.sp.outlook;
      const date = c.creditRatings.sp.date;
      return `Outlook: ${out}${date ? ` • ${date}` : ""}`;
    },
  },
  {
    id: "credit_moodys",
    category: "credit",
    label: "Moody's Sovereign Rating",
    shortLabel: "Moody's Rating",
    unit: "grade scale",
    description:
      "Long-term sovereign government debt obligation rating assessed by Moody's Investors Service.",
    source: "Moody's",
    sortDirection: "desc",
    icon: <SecurityIcon sx={{ fontSize: 18 }} />,
    includeUnrated: true,
    getValue: (c) => c.creditRatings?.moodys?.score,
    formatValue: (val, c) => {
      if (val === null || !c.creditRatings?.moodys) return "Unrated";
      return `${c.creditRatings.moodys.rating} (${val}/21)`;
    },
    getSecondaryValue: (c) => {
      if (!c.creditRatings?.moodys) return "Not rated by Moody's";
      const out = c.creditRatings.moodys.outlook;
      const date = c.creditRatings.moodys.date;
      return `Outlook: ${out}${date ? ` • ${date}` : ""}`;
    },
  },
  {
    id: "credit_fitch",
    category: "credit",
    label: "Fitch Sovereign Rating",
    shortLabel: "Fitch Rating",
    unit: "grade scale",
    description:
      "Foreign-currency long-term sovereign default rating evaluated by Fitch Ratings.",
    source: "Fitch Ratings",
    sortDirection: "desc",
    icon: <SecurityIcon sx={{ fontSize: 18 }} />,
    includeUnrated: true,
    getValue: (c) => c.creditRatings?.fitch?.score,
    formatValue: (val, c) => {
      if (val === null || !c.creditRatings?.fitch) return "Unrated";
      return `${c.creditRatings.fitch.rating} (${val}/21)`;
    },
    getSecondaryValue: (c) => {
      if (!c.creditRatings?.fitch) return "Not rated by Fitch Ratings";
      const out = c.creditRatings.fitch.outlook;
      const date = c.creditRatings.fitch.date;
      return `Outlook: ${out}${date ? ` • ${date}` : ""}`;
    },
  },

  // 2. Demographics & Population
  {
    id: "population",
    category: "demographics",
    label: "Total Population",
    shortLabel: "Population (% of World)",
    unit: "people",
    description:
      "Total resident human population based on latest censuses, national estimates, and United Nations / World Bank demographic figures.",
    source: "RestCountries / UN / World Bank",
    sortDirection: "desc",
    icon: <GroupsIcon sx={{ fontSize: 18 }} />,
    getValue: (c) => (c.population > 0 ? c.population : undefined),
    formatValue: (val) => formatNumber(val),
    getSecondaryValue: (c, globalSum) => {
      const pop = c.population;
      const density = calculateDensity(c.population, c.area);
      const densityStr =
        density !== null ? `${formatNumber(density)} / km²` : "";
      if (typeof pop === "number" && globalSum && globalSum > 0) {
        const share = (pop / globalSum) * 100;
        const shareStr = `${share >= 1 ? share.toFixed(1) : share.toFixed(2)}% of World Pop`;
        return densityStr ? `${shareStr} • ${densityStr}` : shareStr;
      }
      return densityStr || (c.area ? `${formatNumber(c.area)} km²` : "—");
    },
  },
  {
    id: "population_density",
    category: "demographics",
    label: "Population Density (people / km²)",
    shortLabel: "Population Density",
    unit: "people / km²",
    description:
      "Number of human inhabitants per square kilometer of sovereign land area, highlighting demographic concentration and urbanization.",
    source: "RestCountries / World Bank",
    sortDirection: "desc",
    icon: <LocationCityIcon sx={{ fontSize: 18 }} />,
    getValue: (c) => calculateDensity(c.population, c.area),
    formatValue: (val) => `${formatNumber(val)} / km²`,
    getSecondaryValue: (c) => {
      const sqMiles = (c.area || 0) * 0.386102;
      const densitySqMi =
        sqMiles > 0 ? Math.round(c.population / sqMiles) : null;
      const imperialStr = densitySqMi
        ? `${formatNumber(densitySqMi)} / sq mi`
        : "";
      const areaStr = c.area ? `Area: ${formatNumber(c.area)} km²` : "";
      return [imperialStr, areaStr].filter(Boolean).join(" • ") || "—";
    },
  },
  // 3. Coastlines & Maritime
  {
    id: "coastline",
    category: "geography",
    label: "Total Coastline Length (km)",
    shortLabel: "Coastline (% of World)",
    unit: "km",
    description:
      "Total length of sovereign maritime shoreline in kilometers according to the CIA World Factbook, with percentage share of global coastlines.",
    source: "CIA World Factbook",
    sortDirection: "desc",
    icon: <WavesIcon sx={{ fontSize: 18 }} />,
    getValue: (c) => c.coastline,
    formatValue: (val) => `${formatNumber(val)} km`,
    getSecondaryValue: (c, globalSum) => {
      if (c.coastline === undefined || c.coastline === null) return "—";
      if (c.coastline === 0) return "Landlocked state (0 km)";
      const mi = Math.round(c.coastline * 0.621371);
      if (globalSum && globalSum > 0) {
        const share = (c.coastline / globalSum) * 100;
        const shareStr = `${share >= 1 ? share.toFixed(1) : share.toFixed(2)}% of World Coastline`;
        return `${shareStr} • ${formatNumber(mi)} mi`;
      }
      return `${formatNumber(mi)} mi${c.area ? ` • Area: ${formatNumber(c.area)} km²` : ""}`;
    },
  },
  {
    id: "coast_to_area_ratio",
    category: "geography",
    label: "Coastline-to-Area Ratio (m / km²)",
    shortLabel: "Coast/Area Ratio",
    unit: "m / km²",
    description:
      "Meters of maritime coastline per square kilometer of sovereign land area, highlighting island archipelago nations and maritime exposure.",
    source: "CIA World Factbook / Calculation",
    sortDirection: "desc",
    icon: <WaterIcon sx={{ fontSize: 18 }} />,
    getValue: (c) => {
      if (
        typeof c.coastline === "number" &&
        typeof c.area === "number" &&
        c.area > 0
      ) {
        return Math.round(((c.coastline * 1000) / c.area) * 10) / 10;
      }
      return undefined;
    },
    formatValue: (val) => `${val.toLocaleString()} m/km²`,
    getSecondaryValue: (c) => {
      if (c.coastline === undefined || c.coastline === null) return "—";
      if (c.coastline === 0) return "Landlocked (0 m/km²)";
      return `${formatNumber(c.coastline)} km coast • ${c.area ? `${formatNumber(c.area)} km² area` : ""}`;
    },
  },

  // 4. Growth
  {
    id: "gdp_growth",
    category: "growth",
    label: "Real GDP Growth Rate (%)",
    shortLabel: "GDP Growth",
    unit: "% annual",
    description:
      "Annual percentage growth rate of real GDP at constant market prices.",
    source: "World Bank (WDI)",
    sortDirection: "desc",
    icon: <TrendingUpIcon sx={{ fontSize: 18 }} />,
    getValue: (c) => c.gdp?.growth,
    formatValue: (val) => formatGdpGrowth(val),
    getSecondaryValue: (c) =>
      c.gdp?.nominal ? `GDP: ${formatGdp(c.gdp.nominal)}` : "—",
  },
  {
    id: "fdi_inflows",
    category: "growth",
    label: "Foreign Direct Investment (FDI) Inflows (% of GDP)",
    shortLabel: "FDI Inflows",
    unit: "% of GDP",
    description:
      "Net inflows of foreign direct investment as a share of national gross domestic product.",
    source: "World Bank (WDI)",
    sortDirection: "desc",
    icon: <ElectricBoltIcon sx={{ fontSize: 18 }} />,
    getValue: (c) => c.gdp?.fdiInflows,
    formatValue: (val) => formatFdiInflows(val),
    getSecondaryValue: (c) =>
      c.gdp?.growth ? `Growth: ${formatGdpGrowth(c.gdp.growth)}` : "—",
  },
  {
    id: "tax_revenue",
    category: "growth",
    label: "Tax Revenue (% of GDP)",
    shortLabel: "Tax / GDP",
    unit: "% of GDP",
    description:
      "Compulsory transfers to the central government for public purposes as a percentage of gross domestic product.",
    source: "World Bank (WDI)",
    sortDirection: "desc",
    icon: <AccountBalanceIcon sx={{ fontSize: 18 }} />,
    getValue: (c) => c.gdp?.taxRevenue,
    formatValue: (val) => formatTaxRevenue(val),
    getSecondaryValue: (c) =>
      c.gdp?.taxRevenueYear ? `Reporting Year: ${c.gdp.taxRevenueYear}` : "—",
  },

  // 3. Digital Penetration
  {
    id: "internet_users",
    category: "digital",
    label: "Internet Adoption Rate (%)",
    shortLabel: "Internet Adoption",
    unit: "% of population",
    description:
      "Percentage of individuals in the population who regularly access the internet.",
    source: "World Bank (WDI)",
    sortDirection: "desc",
    icon: <WifiIcon sx={{ fontSize: 18 }} />,
    getValue: (c) => c.gdp?.internetUsers,
    formatValue: (val) => formatInternetUsage(val),
    getSecondaryValue: (c) =>
      c.gdp?.mobileSubscriptions
        ? `Mobile: ${c.gdp.mobileSubscriptions.toFixed(1)}/100`
        : "—",
  },
  {
    id: "mobile_subscriptions",
    category: "digital",
    label: "Mobile Cellular Subscriptions (per 100 people)",
    shortLabel: "Mobile Subscriptions",
    unit: "subs / 100 people",
    description:
      "Active subscriptions to a public mobile telephone service providing cellular communications.",
    source: "World Bank (WDI)",
    sortDirection: "desc",
    icon: <WifiIcon sx={{ fontSize: 18 }} />,
    getValue: (c) => c.gdp?.mobileSubscriptions,
    formatValue: (val) => `${val.toFixed(1)} / 100`,
    getSecondaryValue: (c) =>
      c.gdp?.internetUsers
        ? `Internet: ${formatInternetUsage(c.gdp.internetUsers)}`
        : "—",
  },
  {
    id: "literacy_rate",
    category: "digital",
    label: "Adult Literacy Rate (%)",
    shortLabel: "Literacy Rate",
    unit: "% ages 15+",
    description:
      "Percentage of the population aged 15 and older who can understand, read, and write a short statement.",
    source: "World Bank (WDI)",
    sortDirection: "desc",
    icon: <AccountBalanceIcon sx={{ fontSize: 18 }} />,
    getValue: (c) => c.gdp?.literacyRate,
    formatValue: (val) => formatLiteracyRate(val),
    getSecondaryValue: (c) =>
      c.population ? `Pop: ${formatNumber(c.population)}` : "—",
  },

  // 5. Aviation Hubs
  {
    id: "airports_active",
    category: "aviation",
    label: "Active Airports & Airfields",
    shortLabel: "Active Airports",
    unit: "airports",
    description:
      "Total operational civil and commercial airfields, aerodromes, and airports.",
    source: "OurAirports",
    sortDirection: "desc",
    icon: <FlightIcon sx={{ fontSize: 18 }} />,
    getValue: (c) => c.airports?.active,
    formatValue: (val) => formatNumber(val),
    getSecondaryValue: (c) =>
      c.airports?.large ? `${c.airports.large} large hubs` : "—",
  },
  {
    id: "airports_large",
    category: "aviation",
    label: "Large International Airport Hubs",
    shortLabel: "Large Hubs",
    unit: "major hubs",
    description:
      "Primary international gateway airports handling extensive commercial traffic.",
    source: "OurAirports",
    sortDirection: "desc",
    icon: <FlightIcon sx={{ fontSize: 18 }} />,
    getValue: (c) => c.airports?.large,
    formatValue: (val) => formatNumber(val),
    getSecondaryValue: (c) =>
      c.airports?.scheduled
        ? `${formatNumber(c.airports.scheduled)} scheduled airports`
        : "—",
  },
  {
    id: "airports_scheduled",
    category: "aviation",
    label: "Scheduled Commercial Service Airports",
    shortLabel: "Scheduled Service",
    unit: "commercial airports",
    description:
      "Airports with scheduled commercial airline passenger departures.",
    source: "OurAirports",
    sortDirection: "desc",
    icon: <FlightIcon sx={{ fontSize: 18 }} />,
    getValue: (c) => c.airports?.scheduled,
    formatValue: (val) => formatNumber(val),
    getSecondaryValue: (c) =>
      c.airports?.active
        ? `${formatNumber(c.airports.active)} total active`
        : "—",
  },
  {
    id: "airports_highest",
    category: "aviation",
    label: "Highest Airport Elevation",
    shortLabel: "Highest Elevation",
    unit: "ft",
    description: "Highest elevation airfield or aerodrome in the country.",
    source: "OurAirports",
    sortDirection: "desc",
    icon: <TerrainIcon sx={{ fontSize: 18 }} />,
    getValue: (c) => c.airports?.highestAirport?.elevationFt,
    formatValue: (val) =>
      `${formatNumber(val)} ft (${Math.round(val * 0.3048).toLocaleString()} m)`,
    getSecondaryValue: (c) =>
      c.airports?.highestAirport
        ? `${c.airports.highestAirport.name}${c.airports.highestAirport.iata ? ` (${c.airports.highestAirport.iata})` : ""}`
        : "—",
  },
];

const REGION_OPTIONS = [
  "All",
  "Africa",
  "Americas",
  "Asia",
  "Europe",
  "Oceania",
];

const LIMIT_OPTIONS = [
  { value: 10, label: "Top 10" },
  { value: 25, label: "Top 25" },
  { value: 50, label: "Top 50" },
  { value: 100, label: "Top 100" },
  { value: 0, label: "All Countries" },
];

export default function CountryRankingsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: countries = [], isLoading, isError } = useCountriesData();

  // Active Category from URL or default to "economy"
  const activeCategory =
    searchParams.get("category") || RANKING_CATEGORIES[0].id;

  // Available metrics in this category
  const categoryMetrics = useMemo(() => {
    return RANKING_METRICS.filter((m) => m.category === activeCategory);
  }, [activeCategory]);

  // Active Metric from URL or default to first of category
  const activeMetricId = searchParams.get("metric") || categoryMetrics[0]?.id;
  const currentMetric = useMemo(() => {
    return (
      RANKING_METRICS.find((m) => m.id === activeMetricId) ||
      categoryMetrics[0] ||
      RANKING_METRICS[0]
    );
  }, [activeMetricId, categoryMetrics]);

  useDocumentTitle({
    title: `${currentMetric.label} Rankings – Global Country Leaders`,
    description: `Global ranking of countries by ${currentMetric.label.toLowerCase()} (${currentMetric.unit}). ${currentMetric.description}`,
    keywords: [
      "country rankings",
      currentMetric.label.toLowerCase(),
      "world leaders",
      "GDP per capita",
      "population rankings",
      "population density",
      "coastline rankings",
      "longest coastlines",
      "coastline to area ratio",
      "fastest growing economies",
    ],
    canonicalPath: `/rankings?category=${activeCategory}&metric=${currentMetric.id}`,
  });

  // Filters
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [limitCount, setLimitCount] = useState<number>(25);
  const [copyToast, setCopyToast] = useState<boolean>(false);

  // Switch category
  const handleCategoryChange = (
    _event: React.SyntheticEvent,
    newCategory: string,
  ) => {
    const firstMetric = RANKING_METRICS.find((m) => m.category === newCategory);
    setSearchParams({
      category: newCategory,
      metric: firstMetric ? firstMetric.id : "",
    });
  };

  // Switch metric
  const handleMetricChange = (metricId: string) => {
    setSearchParams({
      category: activeCategory,
      metric: metricId,
    });
  };

  // Copy shareable link
  const handleShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopyToast(true);
    }
  };

  // Credit Ratings Dashboard Statistics
  const creditStats = useMemo(() => {
    let rated = 0;
    let investment = 0;
    let speculative = 0;
    let defaultCount = 0;
    let unrated = 0;

    for (const c of countries) {
      const score = c.creditRatings?.averageScore;
      if (typeof score === "number" && !isNaN(score)) {
        rated++;
        if (score >= 12) {
          investment++;
        } else if (score >= 4) {
          speculative++;
        } else {
          defaultCount++;
        }
      } else {
        unrated++;
      }
    }

    const total = countries.length || 1;
    return {
      total,
      rated,
      unrated,
      investment,
      speculative,
      defaultCount,
      investmentPct: Math.round((investment / (rated || 1)) * 100),
      speculativePct: Math.round((speculative / (rated || 1)) * 100),
      defaultPct: Math.round((defaultCount / (rated || 1)) * 100),
      ratedPct: Math.round((rated / total) * 100),
    };
  }, [countries]);

  // Compute sorted & ranked countries
  const rankedCountries = useMemo(() => {
    if (!countries.length || !currentMetric) return [];

    const isCreditMetric =
      Boolean(currentMetric.includeUnrated) ||
      currentMetric.category === "credit";

    if (isCreditMetric) {
      const rated: { country: UnifiedCountry; value: number }[] = [];
      const unrated: { country: UnifiedCountry; value: null }[] = [];

      for (const c of countries) {
        const val = currentMetric.getValue(c);
        if (typeof val === "number" && !isNaN(val)) {
          rated.push({ country: c, value: val });
        } else {
          unrated.push({ country: c, value: null });
        }
      }

      // Sort rated countries by score
      rated.sort((a, b) => {
        if (currentMetric.sortDirection === "asc") {
          return a.value - b.value;
        }
        return b.value - a.value;
      });

      // Sort unrated countries alphabetically by name
      unrated.sort((a, b) => a.country.name.localeCompare(b.country.name));

      // Map rated with rank 1..N
      const rankedRated = rated.map((item, index) => ({
        country: item.country,
        value: item.value as number | null,
        rank: (index + 1) as number | null,
        isUnrated: false,
      }));

      // Map unrated with rank null (at the bottom)
      const rankedUnrated = unrated.map((item) => ({
        country: item.country,
        value: null as number | null,
        rank: null as number | null,
        isUnrated: true,
      }));

      return [...rankedRated, ...rankedUnrated];
    }

    // Default behavior for other metrics
    const withMetric = countries
      .map((c) => {
        const val = currentMetric.getValue(c);
        return {
          country: c,
          value: typeof val === "number" && !isNaN(val) ? val : null,
        };
      })
      .filter(
        (item): item is { country: UnifiedCountry; value: number } =>
          item.value !== null,
      );

    // Sort according to direction
    withMetric.sort((a, b) => {
      if (currentMetric.sortDirection === "asc") {
        return a.value - b.value;
      }
      return b.value - a.value;
    });

    // Assign true rank (1-based index)
    return withMetric.map((item, index) => ({
      ...item,
      value: item.value as number | null,
      rank: (index + 1) as number | null,
      isUnrated: false,
    }));
  }, [countries, currentMetric]);

  // Apply Region and Search filters
  const filteredRankings = useMemo(() => {
    let result = rankedCountries;

    if (selectedRegion !== "All") {
      result = result.filter((item) => item.country.region === selectedRegion);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.country.name.toLowerCase().includes(q) ||
          item.country.officialName?.toLowerCase().includes(q) ||
          item.country.code.toLowerCase() === q ||
          item.country.capital?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [rankedCountries, selectedRegion, searchTerm]);

  // Slice for limit count
  const displayedRankings = useMemo(() => {
    if (limitCount <= 0) return filteredRankings;
    return filteredRankings.slice(0, limitCount);
  }, [filteredRankings, limitCount]);

  // Top 3 Podium countries from overall unfiltered ranking (so podium always represents true #1, #2, #3)
  const podiumTop3 = useMemo(() => {
    return rankedCountries
      .filter(
        (item): item is typeof item & { value: number; rank: number } =>
          typeof item.value === "number" && typeof item.rank === "number",
      )
      .slice(0, 3);
  }, [rankedCountries]);

  // Total global sum across all ranked countries for aggregate volume metrics (e.g. World GDP)
  const globalSum = useMemo(() => {
    if (!rankedCountries.length) return 0;
    return rankedCountries.reduce(
      (acc, curr) =>
        acc +
        (typeof curr.value === "number" && curr.value > 0 ? curr.value : 0),
      0,
    );
  }, [rankedCountries]);

  // Maximum value for relative progress bar
  const benchmarkValue = useMemo(() => {
    const valid = rankedCountries.filter(
      (item): item is typeof item & { value: number } =>
        typeof item.value === "number",
    );
    if (!valid.length) return 1;
    if (currentMetric.sortDirection === "desc") {
      return valid[0].value || 1;
    } else {
      // For ascending (lowest CO2), worst is last
      return valid[valid.length - 1].value || 1;
    }
  }, [rankedCountries, currentMetric.sortDirection]);

  // Function to calculate bar percentage and contextual badge label
  const getMetricBarInfo = (val: number | null) => {
    if (val === null || val === undefined) {
      return {
        barPercent: 0,
        label: "Unrated",
        tooltip: "No official sovereign credit rating published",
      };
    }
    // 1. Nominal GDP: % Share of Total Global GDP (e.g. US ~26.0%, China ~16.5%, Germany ~4.3%)
    if (currentMetric.id === "gdp_nominal" && globalSum > 0) {
      const share = (val / globalSum) * 100;
      const formattedShare =
        share >= 10
          ? `${share.toFixed(1)}%`
          : share >= 1
            ? `${share.toFixed(1)}%`
            : share >= 0.1
              ? `${share.toFixed(2)}%`
              : `<0.1%`;

      return {
        barPercent: Math.max(1.5, Math.min(100, share)),
        label: `${formattedShare} of World GDP`,
        tooltip: `${share.toFixed(2)}% share of Total World GDP (${formatGdp(globalSum)})`,
      };
    }

    // 2. GDP (PPP): % Share of Total Global PPP Output
    if (currentMetric.id === "gdp_ppp" && globalSum > 0) {
      const share = (val / globalSum) * 100;
      const formattedShare =
        share >= 10
          ? `${share.toFixed(1)}%`
          : share >= 1
            ? `${share.toFixed(1)}%`
            : share >= 0.1
              ? `${share.toFixed(2)}%`
              : `<0.1%`;

      return {
        barPercent: Math.max(1.5, Math.min(100, share)),
        label: `${formattedShare} of World PPP`,
        tooltip: `${share.toFixed(2)}% share of Total World PPP Output (${formatPpp(globalSum)})`,
      };
    }

    // 3. Population: % Share of Total Global Population
    if (currentMetric.id === "population" && globalSum > 0) {
      const share = (val / globalSum) * 100;
      const formattedShare =
        share >= 10
          ? `${share.toFixed(1)}%`
          : share >= 1
            ? `${share.toFixed(1)}%`
            : share >= 0.1
              ? `${share.toFixed(2)}%`
              : `<0.1%`;

      return {
        barPercent: Math.max(1.5, Math.min(100, share)),
        label: `${formattedShare} of World Pop`,
        tooltip: `${share.toFixed(2)}% share of World Population (${formatNumber(globalSum)})`,
      };
    }

    // 4. Coastline: % Share of Total Global Coastline
    if (currentMetric.id === "coastline" && globalSum > 0) {
      const share = (val / globalSum) * 100;
      const formattedShare =
        share >= 10
          ? `${share.toFixed(1)}%`
          : share >= 1
            ? `${share.toFixed(1)}%`
            : share >= 0.1
              ? `${share.toFixed(2)}%`
              : `<0.1%`;

      return {
        barPercent: Math.max(1.5, Math.min(100, share)),
        label: `${formattedShare} of World Coastline`,
        tooltip: `${share.toFixed(2)}% share of World Coastline (${formatNumber(Math.round(globalSum))} km)`,
      };
    }

    // 5. Percentage metrics where value is natively 0-100%
    if (["internet_users", "literacy_rate"].includes(currentMetric.id)) {
      return {
        barPercent: Math.max(2, Math.min(100, val)),
        label: `${val.toFixed(1)}%`,
        tooltip: `${val.toFixed(1)}% national share / coverage`,
      };
    }

    // 6. Credit Rating: Score out of 21
    if (
      currentMetric.category === "credit" ||
      currentMetric.id === "credit_rating" ||
      currentMetric.id.startsWith("credit_")
    ) {
      const pct = Math.max(5, Math.min(100, (val / 21) * 100));
      return {
        barPercent: pct,
        label: val >= 12 ? "Investment Grade" : "Speculative Grade",
        tooltip: `Score: ${val}/21 (${val >= 12 ? "Investment Grade" : "Speculative / High Yield"})`,
      };
    }

    // 4. Default / Relative to #1 Benchmark
    if (currentMetric.sortDirection === "desc") {
      if (benchmarkValue <= 0)
        return { barPercent: 5, label: "5%", tooltip: "Relative score" };
      const pct = Math.max(3, Math.min(100, (val / benchmarkValue) * 100));
      return {
        barPercent: pct,
        label: `${pct.toFixed(0)}% of #1`,
        tooltip: `${pct.toFixed(1)}% relative to global leader (${podiumTop3[0]?.country.name || "leader"})`,
      };
    } else {
      // Ascending (e.g. lowest CO2 emissions)
      const minVal = rankedCountries[0]?.value ?? 0;
      const maxVal = benchmarkValue;
      if (maxVal <= minVal)
        return {
          barPercent: 100,
          label: "100%",
          tooltip: "Cleanest footprint",
        };
      const score = 1 - (val - minVal) / (maxVal - minVal);
      const pct = Math.max(5, Math.min(100, score * 100));
      return {
        barPercent: pct,
        label: `${pct.toFixed(0)}% score`,
        tooltip: `${pct.toFixed(1)}% relative cleanliness score`,
      };
    }
  };

  const getRankBadge = (rank: number | null) => {
    if (rank === null || rank === undefined) {
      return (
        <Chip
          label="Unrated"
          size="small"
          sx={{
            fontWeight: 700,
            fontSize: "0.68rem",
            height: 20,
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            color: "text.secondary",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        />
      );
    }
    if (rank === 1) {
      return (
        <Chip
          label="🥇 #1 Gold"
          size="small"
          sx={{
            fontWeight: 800,
            fontSize: "0.76rem",
            backgroundColor: "rgba(245, 158, 11, 0.2)",
            color: "#fbbf24",
            border: "1px solid rgba(245, 158, 11, 0.45)",
          }}
        />
      );
    }
    if (rank === 2) {
      return (
        <Chip
          label="🥈 #2 Silver"
          size="small"
          sx={{
            fontWeight: 800,
            fontSize: "0.76rem",
            backgroundColor: "rgba(148, 163, 184, 0.2)",
            color: "#cbd5e1",
            border: "1px solid rgba(148, 163, 184, 0.4)",
          }}
        />
      );
    }
    if (rank === 3) {
      return (
        <Chip
          label="🥉 #3 Bronze"
          size="small"
          sx={{
            fontWeight: 800,
            fontSize: "0.76rem",
            backgroundColor: "rgba(180, 83, 9, 0.2)",
            color: "#f59e0b",
            border: "1px solid rgba(180, 83, 9, 0.4)",
          }}
        />
      );
    }
    return (
      <Typography
        variant="body2"
        sx={{
          fontWeight: 700,
          color: "text.secondary",
          fontSize: "0.85rem",
          pl: 1,
        }}
      >
        #{rank}
      </Typography>
    );
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 12, textAlign: "center" }}>
        <CircularProgress size={48} sx={{ color: "primary.light", mb: 2 }} />
        <Typography variant="h6" sx={{ color: "text.secondary" }}>
          Aggregating global datasets and computing rankings...
        </Typography>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load country indicators. Please check your network
          connection or try again later.
        </Alert>
        <Button
          component={RouterLink}
          to="/"
          startIcon={<ArrowBackIcon />}
          variant="outlined"
        >
          Return to Explorer
        </Button>
      </Container>
    );
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth: 1680,
        py: { xs: 2.5, sm: 4 },
        px: { xs: 1.5, sm: 3 },
      }}
    >
      {/* Top Header Bar: Back navigation, version, share */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            component={RouterLink}
            to="/"
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 2.5,
              borderColor: "rgba(255, 255, 255, 0.15)",
              color: "text.secondary",
              "&:hover": {
                borderColor: "primary.light",
                color: "primary.light",
                backgroundColor: "rgba(99, 102, 241, 0.08)",
              },
            }}
          >
            Explorer
          </Button>

          <Button
            component={RouterLink}
            to="/tax-atlas"
            startIcon={<AccountBalanceIcon />}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 2.5,
              borderColor: "rgba(168, 85, 247, 0.35)",
              backgroundColor: "rgba(168, 85, 247, 0.06)",
              color: "#c084fc",
              "&:hover": {
                borderColor: "#c084fc",
                backgroundColor: "rgba(168, 85, 247, 0.15)",
              },
            }}
          >
            Tax Atlas
          </Button>

          <Button
            component={RouterLink}
            to="/compare"
            startIcon={<CompareArrowsIcon />}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 2.5,
              borderColor: "rgba(99, 102, 241, 0.3)",
              backgroundColor: "rgba(99, 102, 241, 0.08)",
              color: "primary.light",
              "&:hover": {
                borderColor: "primary.light",
                backgroundColor: "rgba(99, 102, 241, 0.16)",
              },
            }}
          >
            Compare
          </Button>
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Tooltip title="Copy shareable link to rankings" arrow>
            <IconButton
              onClick={handleShareLink}
              size="small"
              sx={{
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "text.secondary",
                "&:hover": {
                  color: "primary.light",
                  borderColor: "primary.light",
                  backgroundColor: "rgba(99, 102, 241, 0.1)",
                },
              }}
            >
              <ShareIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>

          <AppVersionBadge compact />
        </Stack>
      </Box>

      {/* Hero Title Section */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 800,
            letterSpacing: "-0.03em",
            fontSize: { xs: "1.85rem", sm: "2.6rem" },
            mb: 1.2,
          }}
        >
          <Box component="span" sx={{ mr: 1.2 }}>
            🏆
          </Box>
          <Box
            component="span"
            sx={{
              background:
                "linear-gradient(135deg, #f59e0b 0%, #ec4899 50%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Rankings
          </Box>
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            maxWidth: 780,
            mx: "auto",
            fontSize: { xs: "0.88rem", sm: "1.02rem" },
            lineHeight: 1.5,
          }}
        >
          Discover worldwide economic supremacy, demographics and population
          density, maritime coastline leaders, fastest growing nations, digital
          penetration, and premier aviation hubs.
        </Typography>
      </Box>

      {/* Category Tabs */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3.5,
          backgroundColor: "rgba(30, 41, 59, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(12px)",
          p: 0.8,
          mb: 3,
        }}
      >
        <Tabs
          value={activeCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          textColor="inherit"
          TabIndicatorProps={{ sx: { display: "none" } }}
          sx={{
            "& .MuiTabs-indicator": {
              display: "none",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 700,
              fontSize: { xs: "0.85rem", sm: "0.95rem" },
              minHeight: 46,
              borderRadius: 2.5,
              px: { xs: 1.8, sm: 2.5 },
              transition: "all 0.2s ease",
              color: "text.secondary",
              border: "1px solid transparent",
              "&.Mui-selected": {
                color: "primary.light",
                backgroundColor: "rgba(99, 102, 241, 0.16)",
                borderColor: "rgba(99, 102, 241, 0.35)",
                boxShadow: "0 2px 10px rgba(99, 102, 241, 0.12)",
              },
              "&:hover:not(.Mui-selected)": {
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                color: "text.primary",
              },
            },
          }}
        >
          {RANKING_CATEGORIES.map((cat) => (
            <Tab
              key={cat.id}
              value={cat.id}
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </Stack>
              }
            />
          ))}
        </Tabs>
      </Paper>

      {/* Metric Selector Pills */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.2,
          mb: 3.5,
          alignItems: "center",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            mr: 0.5,
          }}
        >
          Indicator:
        </Typography>
        {categoryMetrics.map((metric) => {
          const isSelected = metric.id === currentMetric.id;
          return (
            <Chip
              key={metric.id}
              label={metric.label}
              icon={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: isSelected ? "primary.light" : "inherit",
                  }}
                >
                  {metric.icon}
                </Box>
              }
              clickable
              onClick={() => handleMetricChange(metric.id)}
              variant={isSelected ? "filled" : "outlined"}
              sx={{
                fontWeight: isSelected ? 700 : 500,
                fontSize: "0.84rem",
                py: 2.2,
                px: 0.8,
                borderRadius: 2.5,
                transition: "all 0.2s ease",
                backgroundColor: isSelected
                  ? "rgba(99, 102, 241, 0.2)"
                  : "rgba(30, 41, 59, 0.25)",
                borderColor: isSelected
                  ? "rgba(99, 102, 241, 0.6)"
                  : "rgba(255, 255, 255, 0.08)",
                color: isSelected ? "white" : "text.secondary",
                "&:hover": {
                  borderColor: "primary.light",
                  backgroundColor: "rgba(99, 102, 241, 0.15)",
                },
              }}
            />
          );
        })}
      </Box>

      {/* Credit Ratings Dashboard Panel */}
      {(activeCategory === "credit" || currentMetric.category === "credit") && (
        <Card
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: 3.5,
            background:
              "linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)",
            border: "1px solid rgba(99, 102, 241, 0.25)",
            p: { xs: 2, sm: 2.5 },
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Stack spacing={2}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              flexWrap="wrap"
              gap={1.5}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    fontSize: "1.15rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <span>🏛️</span> Sovereign Credit Ratings Dashboard
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mt: 0.25 }}
                >
                  Global sovereign creditworthiness benchmarks across Standard
                  &amp; Poor&apos;s, Moody&apos;s, and Fitch Ratings
                </Typography>
              </Box>

              <Chip
                label={`${creditStats.rated} Rated • ${creditStats.unrated} Unrated Nations`}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  backgroundColor: "rgba(99, 102, 241, 0.15)",
                  color: "#a5b4fc",
                  border: "1px solid rgba(99, 102, 241, 0.35)",
                }}
              />
            </Stack>

            {/* 4 Stat Cards Grid */}
            <Grid container spacing={2}>
              {/* Investment Grade */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    backgroundColor: "rgba(16, 185, 129, 0.08)",
                    borderColor: "rgba(16, 185, 129, 0.3)",
                    height: "100%",
                  }}
                >
                  <Stack spacing={0.5}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: "#34d399",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      🛡️ Investment Grade
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 800, color: "#34d399" }}
                    >
                      {creditStats.investment}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {creditStats.investmentPct}% of rated nations (AAA to
                      BBB-) • High safety &amp; fiscal capacity
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>

              {/* Speculative Grade */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    backgroundColor: "rgba(245, 158, 11, 0.08)",
                    borderColor: "rgba(245, 158, 11, 0.3)",
                    height: "100%",
                  }}
                >
                  <Stack spacing={0.5}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: "#fbbf24",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      ⚠️ Speculative Grade
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 800, color: "#fbbf24" }}
                    >
                      {creditStats.speculative}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {creditStats.speculativePct}% of rated nations (BB+ to B-)
                      • High yield &amp; moderate credit risk
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>

              {/* Default / Distressed */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                    borderColor: "rgba(239, 68, 68, 0.3)",
                    height: "100%",
                  }}
                >
                  <Stack spacing={0.5}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: "#f87171",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      🚨 Default / Distressed
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 800, color: "#f87171" }}
                    >
                      {creditStats.defaultCount}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {creditStats.defaultPct}% of rated nations (CCC to D) •
                      Highly vulnerable or in sovereign default
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>

              {/* Unrated Nations */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    height: "100%",
                  }}
                >
                  <Stack spacing={0.5}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: "text.secondary",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      ⚪ Unrated Nations
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 800, color: "text.primary" }}
                    >
                      {creditStats.unrated}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      Nations with no public ratings from Big Three agencies •
                      Positioned at bottom of table
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Stack>
        </Card>
      )}

      {/* Indicator Overview Card */}
      <Card
        elevation={0}
        sx={{
          mb: 4,
          borderRadius: 3,
          backgroundColor: "rgba(30, 41, 59, 0.35)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          p: { xs: 2, sm: 2.5 },
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
        >
          <Box>
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ mb: 0.5 }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, fontSize: "1.15rem" }}
              >
                {currentMetric.label}
              </Typography>
              <Chip
                label={
                  currentMetric.includeUnrated ||
                  currentMetric.category === "credit"
                    ? `${rankedCountries.filter((i) => i.value !== null).length} Rated • ${rankedCountries.filter((i) => i.value === null).length} Unrated Nations`
                    : `Ranked across ${rankedCountries.length} countries`
                }
                size="small"
                sx={{
                  height: 22,
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  backgroundColor: "rgba(99, 102, 241, 0.15)",
                  color: "#a5b4fc",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                }}
              />
              {currentMetric.id === "gdp_nominal" && globalSum > 0 && (
                <Chip
                  label={`Total World GDP: ${formatGdp(globalSum)}`}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    color: "#6ee7b7",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                  }}
                />
              )}
              {currentMetric.id === "gdp_ppp" && globalSum > 0 && (
                <Chip
                  label={`Total World PPP: ${formatPpp(globalSum)}`}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    backgroundColor: "rgba(14, 165, 233, 0.15)",
                    color: "#38bdf8",
                    border: "1px solid rgba(14, 165, 233, 0.3)",
                  }}
                />
              )}
              {currentMetric.id === "population" && globalSum > 0 && (
                <Chip
                  label={`Total World Population: ${formatNumber(globalSum)}`}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    color: "#6ee7b7",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                  }}
                />
              )}
              {currentMetric.id === "coastline" && globalSum > 0 && (
                <Chip
                  label={`Total World Coastline: ${formatNumber(Math.round(globalSum))} km`}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    backgroundColor: "rgba(14, 165, 233, 0.15)",
                    color: "#38bdf8",
                    border: "1px solid rgba(14, 165, 233, 0.3)",
                  }}
                />
              )}
            </Stack>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                maxWidth: 840,
                fontSize: "0.88rem",
              }}
            >
              {currentMetric.description}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Source: <strong>{currentMetric.source}</strong>
            </Typography>
          </Stack>
        </Stack>
      </Card>

      {/* Visual Top 3 Olympic Podium */}
      {podiumTop3.length >= 3 && (
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              mb: 2.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: "1.1rem",
            }}
          >
            <span>👑</span> World Top 3 Podium
          </Typography>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "flex-end" }}
            justifyContent="center"
          >
            {/* 🥈 Rank 2: Silver */}
            {podiumTop3[1] && (
              <Box
                sx={{
                  flex: 1,
                  maxWidth: { md: 360 },
                  order: { xs: 2, md: 1 },
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3.5,
                    border: "1px solid rgba(148, 163, 184, 0.35)",
                    background:
                      "linear-gradient(180deg, rgba(148, 163, 184, 0.12) 0%, rgba(30, 41, 59, 0.5) 100%)",
                    backdropFilter: "blur(12px)",
                    transition: "transform 0.2s ease, border-color 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: "rgba(148, 163, 184, 0.7)",
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() =>
                      navigate(`/country/${podiumTop3[1].country.code}`)
                    }
                    sx={{ p: { xs: 2.5, sm: 3 } }}
                  >
                    <Stack spacing={1.5} alignItems="center" textAlign="center">
                      <Chip
                        label="🥈 #2 Silver"
                        sx={{
                          fontWeight: 800,
                          fontSize: "0.8rem",
                          backgroundColor: "rgba(148, 163, 184, 0.2)",
                          color: "#e2e8f0",
                          border: "1px solid rgba(148, 163, 184, 0.5)",
                        }}
                      />
                      <Box sx={{ fontSize: "2.8rem", lineHeight: 1 }}>
                        {getCountryEmoji(podiumTop3[1].country.code)}
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 800, fontSize: "1.1rem" }}
                        >
                          {podiumTop3[1].country.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {podiumTop3[1].country.region} •{" "}
                          {podiumTop3[1].country.code}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: "rgba(15, 23, 42, 0.5)",
                          border: "1px solid rgba(255, 255, 255, 0.06)",
                          width: "100%",
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 800,
                            color: "#e2e8f0",
                            fontSize: "1.45rem",
                          }}
                        >
                          {currentMetric.formatValue(
                            podiumTop3[1].value,
                            podiumTop3[1].country,
                          )}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {currentMetric.getSecondaryValue?.(
                            podiumTop3[1].country,
                            globalSum,
                          ) || "—"}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardActionArea>
                </Card>
              </Box>
            )}

            {/* 🥇 Rank 1: Gold (Center & Elevated) */}
            {podiumTop3[0] && (
              <Box
                sx={{
                  flex: 1.1,
                  maxWidth: { md: 400 },
                  order: { xs: 1, md: 2 },
                  mb: { md: 2 },
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3.5,
                    border: "2px solid rgba(245, 158, 11, 0.5)",
                    background:
                      "linear-gradient(180deg, rgba(245, 158, 11, 0.18) 0%, rgba(30, 41, 59, 0.6) 100%)",
                    backdropFilter: "blur(14px)",
                    boxShadow: "0 10px 30px -10px rgba(245, 158, 11, 0.25)",
                    transition: "transform 0.2s ease, border-color 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: "rgba(245, 158, 11, 0.8)",
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() =>
                      navigate(`/country/${podiumTop3[0].country.code}`)
                    }
                    sx={{ p: { xs: 3, sm: 3.5 } }}
                  >
                    <Stack spacing={1.5} alignItems="center" textAlign="center">
                      <Chip
                        label="🥇 #1 World Champion"
                        sx={{
                          fontWeight: 800,
                          fontSize: "0.85rem",
                          backgroundColor: "rgba(245, 158, 11, 0.25)",
                          color: "#fef08a",
                          border: "1px solid rgba(245, 158, 11, 0.6)",
                        }}
                      />
                      <Box sx={{ fontSize: "3.6rem", lineHeight: 1 }}>
                        {getCountryEmoji(podiumTop3[0].country.code)}
                      </Box>
                      <Box>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 800,
                            fontSize: "1.35rem",
                            color: "#fef08a",
                          }}
                        >
                          {podiumTop3[0].country.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {podiumTop3[0].country.region} •{" "}
                          {podiumTop3[0].country.code}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 1.8,
                          borderRadius: 2.5,
                          backgroundColor: "rgba(15, 23, 42, 0.65)",
                          border: "1px solid rgba(245, 158, 11, 0.3)",
                          width: "100%",
                        }}
                      >
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 800,
                            color: "#fbbf24",
                            fontSize: "1.85rem",
                          }}
                        >
                          {currentMetric.formatValue(
                            podiumTop3[0].value,
                            podiumTop3[0].country,
                          )}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            mt: 0.5,
                            display: "block",
                          }}
                        >
                          {currentMetric.getSecondaryValue?.(
                            podiumTop3[0].country,
                            globalSum,
                          ) || "—"}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardActionArea>
                </Card>
              </Box>
            )}

            {/* 🥉 Rank 3: Bronze */}
            {podiumTop3[2] && (
              <Box
                sx={{
                  flex: 1,
                  maxWidth: { md: 360 },
                  order: { xs: 3, md: 3 },
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3.5,
                    border: "1px solid rgba(180, 83, 9, 0.35)",
                    background:
                      "linear-gradient(180deg, rgba(180, 83, 9, 0.12) 0%, rgba(30, 41, 59, 0.5) 100%)",
                    backdropFilter: "blur(12px)",
                    transition: "transform 0.2s ease, border-color 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: "rgba(180, 83, 9, 0.7)",
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() =>
                      navigate(`/country/${podiumTop3[2].country.code}`)
                    }
                    sx={{ p: { xs: 2.5, sm: 3 } }}
                  >
                    <Stack spacing={1.5} alignItems="center" textAlign="center">
                      <Chip
                        label="🥉 #3 Bronze"
                        sx={{
                          fontWeight: 800,
                          fontSize: "0.8rem",
                          backgroundColor: "rgba(180, 83, 9, 0.2)",
                          color: "#fdba74",
                          border: "1px solid rgba(180, 83, 9, 0.5)",
                        }}
                      />
                      <Box sx={{ fontSize: "2.8rem", lineHeight: 1 }}>
                        {getCountryEmoji(podiumTop3[2].country.code)}
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 800, fontSize: "1.1rem" }}
                        >
                          {podiumTop3[2].country.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {podiumTop3[2].country.region} •{" "}
                          {podiumTop3[2].country.code}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: "rgba(15, 23, 42, 0.5)",
                          border: "1px solid rgba(255, 255, 255, 0.06)",
                          width: "100%",
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 800,
                            color: "#fdba74",
                            fontSize: "1.45rem",
                          }}
                        >
                          {currentMetric.formatValue(
                            podiumTop3[2].value,
                            podiumTop3[2].country,
                          )}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {currentMetric.getSecondaryValue?.(
                            podiumTop3[2].country,
                            globalSum,
                          ) || "—"}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardActionArea>
                </Card>
              </Box>
            )}
          </Stack>
        </Box>
      )}

      {/* Leaderboard Table Controls & Filtering */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3.5,
          backgroundColor: "rgba(30, 41, 59, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(12px)",
          p: { xs: 2, sm: 2.5 },
          mb: 3,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
          justifyContent="space-between"
        >
          {/* Search Filter */}
          <TextField
            size="small"
            placeholder="Filter countries by name, code, capital..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchTerm("")}
                    sx={{ color: "text.secondary" }}
                  >
                    <ClearIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
            sx={{
              maxWidth: { md: 360 },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
                backgroundColor: "rgba(15, 23, 42, 0.4)",
              },
            }}
          />

          {/* Region and Limit Selectors */}
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            flexWrap="wrap"
            gap={1}
          >
            {/* Region Filter Chips */}
            <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
              {REGION_OPTIONS.map((region) => (
                <Chip
                  key={region}
                  label={region}
                  size="small"
                  clickable
                  onClick={() => setSelectedRegion(region)}
                  variant={selectedRegion === region ? "filled" : "outlined"}
                  sx={{
                    borderRadius: 2,
                    fontWeight: selectedRegion === region ? 700 : 500,
                    fontSize: "0.78rem",
                    backgroundColor:
                      selectedRegion === region
                        ? "primary.main"
                        : "rgba(255, 255, 255, 0.04)",
                    borderColor:
                      selectedRegion === region
                        ? "primary.main"
                        : "rgba(255, 255, 255, 0.1)",
                  }}
                />
              ))}
            </Box>

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                borderColor: "rgba(255, 255, 255, 0.1)",
                display: { xs: "none", sm: "block" },
              }}
            />

            {/* Limit Selector */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={limitCount}
                onChange={(e) => setLimitCount(Number(e.target.value))}
                sx={{
                  borderRadius: 2.5,
                  fontSize: "0.82rem",
                  backgroundColor: "rgba(15, 23, 42, 0.4)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.12)",
                  },
                }}
              >
                {LIMIT_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>

        {/* Live Filter Count */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Showing <strong>{displayedRankings.length}</strong> of{" "}
            <strong>{filteredRankings.length}</strong> matching entries (
            {currentMetric.includeUnrated ||
            currentMetric.category === "credit" ? (
              <>
                <strong>
                  {rankedCountries.filter((i) => i.value !== null).length}
                </strong>{" "}
                rated •{" "}
                <strong>
                  {rankedCountries.filter((i) => i.value === null).length}
                </strong>{" "}
                unrated
              </>
            ) : (
              <>
                Ranked globally from <strong>{rankedCountries.length}</strong>{" "}
                nations
              </>
            )}
            )
          </Typography>

          {(searchTerm || selectedRegion !== "All") && (
            <Button
              size="small"
              onClick={() => {
                setSearchTerm("");
                setSelectedRegion("All");
              }}
              sx={{
                fontSize: "0.74rem",
                textTransform: "none",
                color: "primary.light",
              }}
            >
              Reset filters
            </Button>
          )}
        </Box>
      </Paper>

      {/* Leaderboard Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 3.5,
          backgroundColor: "rgba(30, 41, 59, 0.35)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(12px)",
          mb: 6,
          overflowX: "auto",
        }}
      >
        <Table sx={{ minWidth: 720 }}>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "rgba(15, 23, 42, 0.6)",
                "& th": {
                  fontWeight: 700,
                  color: "text.secondary",
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  py: 1.8,
                },
              }}
            >
              <TableCell sx={{ width: 110 }}>Rank</TableCell>
              <TableCell>Country</TableCell>
              <TableCell sx={{ width: { xs: 200, sm: 280 } }}>
                {currentMetric.shortLabel}
              </TableCell>
              <TableCell sx={{ width: 140 }}>
                {["population", "coastline"].includes(currentMetric.id)
                  ? "Land Area"
                  : currentMetric.id === "coast_to_area_ratio"
                    ? "Coastline Length"
                    : currentMetric.category === "credit" ||
                        currentMetric.includeUnrated
                      ? "Credit Tier"
                      : "Population"}
              </TableCell>
              <TableCell sx={{ width: 160 }}>Secondary Context</TableCell>
              <TableCell align="right" sx={{ width: 110 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {displayedRankings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  sx={{
                    textAlign: "center",
                    py: 8,
                    borderBottom: "none",
                    color: "text.secondary",
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1, fontSize: "1.05rem" }}>
                    No countries match your current search/filter.
                  </Typography>
                  <Typography variant="body2">
                    Try loosening your search query or selecting &quot;All&quot;
                    regions.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              displayedRankings.map((item) => {
                const barInfo = getMetricBarInfo(item.value);
                const isPodium =
                  typeof item.rank === "number" && item.rank <= 3;

                return (
                  <TableRow
                    key={item.country.code}
                    hover
                    sx={{
                      transition: "background-color 0.15s ease",
                      backgroundColor: isPodium
                        ? item.rank === 1
                          ? "rgba(245, 158, 11, 0.04)"
                          : item.rank === 2
                            ? "rgba(148, 163, 184, 0.03)"
                            : "rgba(180, 83, 9, 0.03)"
                        : "inherit",
                      "&:hover": {
                        backgroundColor: "rgba(99, 102, 241, 0.08) !important",
                      },
                      "& td": {
                        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                        py: 1.6,
                      },
                    }}
                  >
                    {/* Rank Column */}
                    <TableCell>{getRankBadge(item.rank)}</TableCell>

                    {/* Country Column */}
                    <TableCell>
                      <RouterLink
                        to={`/country/${item.country.code}`}
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <Box sx={{ fontSize: "1.6rem", lineHeight: 1 }}>
                          {getCountryEmoji(item.country.code)}
                        </Box>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 700,
                              color: "text.primary",
                              "&:hover": { color: "primary.light" },
                            }}
                          >
                            {item.country.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            {item.country.region} • {item.country.code}
                          </Typography>
                        </Box>
                      </RouterLink>
                    </TableCell>

                    {/* Ranked Value + Bar Column */}
                    <TableCell>
                      <Box sx={{ width: "100%" }}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="baseline"
                          sx={{ mb: 0.5 }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 800,
                              fontSize: "0.95rem",
                              color:
                                item.rank === 1
                                  ? "#fbbf24"
                                  : item.rank === 2
                                    ? "#cbd5e1"
                                    : item.rank === 3
                                      ? "#fdba74"
                                      : item.value === null
                                        ? "text.secondary"
                                        : "text.primary",
                            }}
                          >
                            {item.value !== null
                              ? currentMetric.formatValue(
                                  item.value,
                                  item.country,
                                )
                              : "Unrated"}
                          </Typography>

                          <Tooltip title={barInfo.tooltip} arrow>
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: "0.72rem",
                                fontWeight:
                                  currentMetric.id === "gdp_nominal" ||
                                  currentMetric.id === "gdp_ppp" ||
                                  currentMetric.id === "population"
                                    ? 700
                                    : 500,
                                color:
                                  currentMetric.id === "gdp_nominal"
                                    ? "#818cf8"
                                    : currentMetric.id === "gdp_ppp"
                                      ? "#38bdf8"
                                      : currentMetric.id === "population"
                                        ? "#34d399"
                                        : currentMetric.id === "coastline"
                                          ? "#38bdf8"
                                          : "text.secondary",
                                cursor: "help",
                              }}
                            >
                              {barInfo.label}
                            </Typography>
                          </Tooltip>
                        </Stack>

                        <LinearProgress
                          variant="determinate"
                          value={barInfo.barPercent}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 3,
                              background:
                                item.value === null
                                  ? "rgba(255, 255, 255, 0.15)"
                                  : item.rank === 1
                                    ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                                    : item.rank === 2
                                      ? "linear-gradient(90deg, #94a3b8, #cbd5e1)"
                                      : item.rank === 3
                                        ? "linear-gradient(90deg, #b45309, #f59e0b)"
                                        : "linear-gradient(90deg, #6366f1, #a855f7)",
                            },
                          }}
                        />
                      </Box>
                    </TableCell>

                    {/* Population / Land Area / Coastline / Credit Tier Column */}
                    <TableCell>
                      {currentMetric.category === "credit" ||
                      currentMetric.includeUnrated ? (
                        item.value !== null ? (
                          <Chip
                            label={
                              item.value >= 12
                                ? "Investment Grade"
                                : "Speculative Grade"
                            }
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              backgroundColor:
                                item.value >= 12
                                  ? "rgba(16, 185, 129, 0.15)"
                                  : "rgba(245, 158, 11, 0.15)",
                              color: item.value >= 12 ? "#34d399" : "#fbbf24",
                              border: `1px solid ${item.value >= 12 ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
                            }}
                          />
                        ) : (
                          <Chip
                            label="Unrated"
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.68rem",
                              fontWeight: 600,
                              backgroundColor: "rgba(255, 255, 255, 0.04)",
                              color: "text.secondary",
                              border: "1px solid rgba(255, 255, 255, 0.08)",
                            }}
                          />
                        )
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.85rem" }}
                        >
                          {["population", "coastline"].includes(
                            currentMetric.id,
                          )
                            ? item.country.area
                              ? `${formatNumber(item.country.area)} km²`
                              : "—"
                            : currentMetric.id === "coast_to_area_ratio"
                              ? typeof item.country.coastline === "number"
                                ? `${formatNumber(item.country.coastline)} km`
                                : "—"
                              : item.country.population
                                ? formatNumber(item.country.population)
                                : "—"}
                        </Typography>
                      )}
                    </TableCell>

                    {/* Secondary Context Column */}
                    <TableCell>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.8rem",
                          color: "text.secondary",
                          display: "block",
                        }}
                      >
                        {currentMetric.getSecondaryValue?.(
                          item.country,
                          globalSum,
                        ) || "—"}
                      </Typography>
                    </TableCell>

                    {/* Actions Column */}
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="flex-end"
                      >
                        <Tooltip title="Compare this country" arrow>
                          <IconButton
                            component={RouterLink}
                            to={`/compare?c=${item.country.code}`}
                            size="small"
                            sx={{
                              color: "text.secondary",
                              "&:hover": {
                                color: "primary.light",
                                backgroundColor: "rgba(99, 102, 241, 0.1)",
                              },
                            }}
                          >
                            <CompareArrowsIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="View country profile" arrow>
                          <IconButton
                            component={RouterLink}
                            to={`/country/${item.country.code}`}
                            size="small"
                            sx={{
                              color: "text.secondary",
                              "&:hover": {
                                color: "primary.light",
                                backgroundColor: "rgba(99, 102, 241, 0.1)",
                              },
                            }}
                          >
                            <OpenInNewIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Copy link snackbar */}
      <Snackbar
        open={copyToast}
        autoHideDuration={3000}
        onClose={() => setCopyToast(false)}
        message="Rankings link copied to clipboard!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Container>
  );
}
