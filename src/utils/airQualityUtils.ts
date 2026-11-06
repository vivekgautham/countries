import airQualityRaw from "../data/airQuality.json";
import {
  AirQualityInfo,
  AqiCategory,
  WhoAirQualityTier,
} from "../types/country";

const airQualityData = airQualityRaw as Record<string, AirQualityInfo>;

/**
 * Look up air quality information for a given country code (2-letter ISO).
 */
export function getAirQuality(code?: string): AirQualityInfo | undefined {
  if (!code) return undefined;
  return airQualityData[code.toUpperCase()];
}

export function formatPm25(val?: number | null): string {
  if (typeof val !== "number" || isNaN(val)) return "—";
  return `${val.toFixed(1)} µg/m³`;
}

export function formatAqi(val?: number | null): string {
  if (typeof val !== "number" || isNaN(val)) return "—";
  return `${Math.round(val)}`;
}

export interface AqiBadgeConfig {
  label: string;
  category: AqiCategory;
  color: string;
  bg: string;
  border: string;
  icon: string;
  description: string;
}

export function getAqiBadgeConfig(
  category?: AqiCategory,
  aqi?: number,
): AqiBadgeConfig {
  if (!category && typeof aqi === "number") {
    if (aqi <= 50) category = "Good";
    else if (aqi <= 100) category = "Moderate";
    else if (aqi <= 150) category = "Sensitive";
    else if (aqi <= 200) category = "Unhealthy";
    else if (aqi <= 300) category = "Very Unhealthy";
    else category = "Hazardous";
  }

  switch (category) {
    case "Good":
      return {
        label: "Good Air (AQI 0–50)",
        category: "Good",
        color: "#34d399",
        bg: "rgba(16, 185, 129, 0.15)",
        border: "rgba(16, 185, 129, 0.35)",
        icon: "🟢",
        description:
          "Air quality is satisfactory, and air pollution poses little or no risk.",
      };
    case "Moderate":
      return {
        label: "Moderate (AQI 51–100)",
        category: "Moderate",
        color: "#fbbf24",
        bg: "rgba(245, 158, 11, 0.15)",
        border: "rgba(245, 158, 11, 0.35)",
        icon: "🟡",
        description:
          "Air quality is acceptable; however, some pollutants may pose a moderate health concern for a very small number of sensitive individuals.",
      };
    case "Sensitive":
      return {
        label: "Unhealthy for Sensitive Groups (AQI 101–150)",
        category: "Sensitive",
        color: "#fb923c",
        bg: "rgba(251, 146, 60, 0.15)",
        border: "rgba(251, 146, 60, 0.35)",
        icon: "🟠",
        description:
          "Members of sensitive groups may experience health effects. The general public is less likely to be affected.",
      };
    case "Unhealthy":
      return {
        label: "Unhealthy (AQI 151–200)",
        category: "Unhealthy",
        color: "#f87171",
        bg: "rgba(239, 68, 68, 0.15)",
        border: "rgba(239, 68, 68, 0.35)",
        icon: "🔴",
        description:
          "Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.",
      };
    case "Very Unhealthy":
      return {
        label: "Very Unhealthy (AQI 201–300)",
        category: "Very Unhealthy",
        color: "#c084fc",
        bg: "rgba(192, 132, 252, 0.15)",
        border: "rgba(192, 132, 252, 0.35)",
        icon: "🟣",
        description:
          "Health alert: The risk of health effects is increased for everyone.",
      };
    case "Hazardous":
      return {
        label: "Hazardous (AQI 301+)",
        category: "Hazardous",
        color: "#e879f9",
        bg: "rgba(232, 121, 249, 0.15)",
        border: "rgba(232, 121, 249, 0.35)",
        icon: "☣️",
        description:
          "Health warning of emergency conditions: everyone is more likely to be affected.",
      };
    default:
      return {
        label: "Unknown / Not Reported",
        category: "Good",
        color: "#94a3b8",
        bg: "rgba(148, 163, 184, 0.15)",
        border: "rgba(148, 163, 184, 0.35)",
        icon: "⚪",
        description: "No verified particulate matter measurements available.",
      };
  }
}

export interface WhoTierConfig {
  label: string;
  tier: WhoAirQualityTier;
  color: string;
  bg: string;
  border: string;
  icon: string;
  targetMax: number;
  description: string;
}

export function getWhoTierConfig(tier?: WhoAirQualityTier): WhoTierConfig {
  switch (tier) {
    case "WHO Guideline":
      return {
        label: "Meets WHO Guideline (≤ 5 µg/m³)",
        tier: "WHO Guideline",
        color: "#34d399",
        bg: "rgba(16, 185, 129, 0.15)",
        border: "rgba(16, 185, 129, 0.35)",
        icon: "🌿",
        targetMax: 5.0,
        description:
          "Achieves the 2021 WHO annual air quality guideline — the cleanest air target associated with minimal health risks.",
      };
    case "Interim Target 4":
      return {
        label: "WHO Interim Target 4 (≤ 10 µg/m³)",
        tier: "Interim Target 4",
        color: "#6ee7b7",
        bg: "rgba(110, 231, 183, 0.15)",
        border: "rgba(110, 231, 183, 0.35)",
        icon: "🍃",
        targetMax: 10.0,
        description:
          "Within 1–2x WHO Guideline. High air cleanliness with low long-term health burdens.",
      };
    case "Interim Target 3":
      return {
        label: "WHO Interim Target 3 (≤ 15 µg/m³)",
        tier: "Interim Target 3",
        color: "#fbbf24",
        bg: "rgba(245, 158, 11, 0.15)",
        border: "rgba(245, 158, 11, 0.35)",
        icon: "🟡",
        targetMax: 15.0,
        description:
          "Within 2–3x WHO Guideline. Moderate particulate exposure requiring ongoing emission reduction.",
      };
    case "Interim Target 2":
      return {
        label: "WHO Interim Target 2 (≤ 25 µg/m³)",
        tier: "Interim Target 2",
        color: "#fb923c",
        bg: "rgba(251, 146, 60, 0.15)",
        border: "rgba(251, 146, 60, 0.35)",
        icon: "🟠",
        targetMax: 25.0,
        description:
          "Within 3–5x WHO Guideline. Elevated particulate matter exposure.",
      };
    case "Interim Target 1":
      return {
        label: "WHO Interim Target 1 (≤ 35 µg/m³)",
        tier: "Interim Target 1",
        color: "#f87171",
        bg: "rgba(239, 68, 68, 0.15)",
        border: "rgba(239, 68, 68, 0.35)",
        icon: "⚠️",
        targetMax: 35.0,
        description:
          "Within 5–7x WHO Guideline. Associated with significant excess mortality and respiratory morbidity.",
      };
    case "Exceeds Targets":
    default:
      return {
        label: "Exceeds All WHO Targets (> 35 µg/m³)",
        tier: "Exceeds Targets",
        color: "#e879f9",
        bg: "rgba(232, 121, 249, 0.15)",
        border: "rgba(232, 121, 249, 0.35)",
        icon: "⛔",
        targetMax: Infinity,
        description:
          "More than 7x higher than WHO recommendation. Critical air pollution hotspot with severe public health risks.",
      };
  }
}
