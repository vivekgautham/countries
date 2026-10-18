import creditRatingsRaw from "../data/creditRatings.json";
import { CreditGrade, SovereignCreditRatings } from "../types/country";

const creditRatingsData = creditRatingsRaw as Record<
  string,
  SovereignCreditRatings
>;

/**
 * Look up sovereign credit ratings for a country code.
 */
export function getCreditRatings(
  code?: string,
): SovereignCreditRatings | undefined {
  if (!code) return undefined;
  return creditRatingsData[code.toUpperCase()];
}

export interface GradeBadgeConfig {
  label: string;
  shortLabel: string;
  color: string;
  bg: string;
  border: string;
  icon: string;
  description: string;
}

export function getGradeBadgeConfig(
  grade?: CreditGrade,
  isInvestment?: boolean,
): GradeBadgeConfig {
  if (isInvestment || grade === "investment") {
    return {
      label: "Investment Grade",
      shortLabel: "Investment Grade",
      color: "#34d399",
      bg: "rgba(16, 185, 129, 0.15)",
      border: "rgba(16, 185, 129, 0.35)",
      icon: "🛡️",
      description:
        "High to prime creditworthiness with exceptionally low or moderate risk of default.",
    };
  }

  if (grade === "default") {
    return {
      label: "Default / Near Default",
      shortLabel: "Default",
      color: "#f87171",
      bg: "rgba(239, 68, 68, 0.15)",
      border: "rgba(239, 68, 68, 0.35)",
      icon: "⛔",
      description:
        "Sovereign issuer in payment arrears, debt restructuring, or selective default.",
    };
  }

  if (grade === "speculative") {
    return {
      label: "Speculative / High Yield",
      shortLabel: "Speculative",
      color: "#fbbf24",
      bg: "rgba(245, 158, 11, 0.15)",
      border: "rgba(245, 158, 11, 0.35)",
      icon: "⚠️",
      description:
        "Non-investment grade credit with notable vulnerability to economic shocks.",
    };
  }

  return {
    label: "Unrated Sovereign",
    shortLabel: "Unrated",
    color: "#94a3b8",
    bg: "rgba(148, 163, 184, 0.12)",
    border: "rgba(148, 163, 184, 0.25)",
    icon: "ℹ️",
    description:
      "No public long-term sovereign foreign currency credit rating assigned by major agencies.",
  };
}

export interface OutlookBadgeConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: string;
}

export function getOutlookBadgeConfig(outlook?: string): OutlookBadgeConfig {
  const norm = (outlook || "").toLowerCase();

  if (norm.includes("pos")) {
    return {
      label: outlook || "Positive",
      color: "#34d399",
      bg: "rgba(16, 185, 129, 0.12)",
      border: "rgba(16, 185, 129, 0.3)",
      icon: "📈",
    };
  }

  if (norm.includes("neg") || norm.includes("watch")) {
    return {
      label: outlook || "Negative",
      color: "#f87171",
      bg: "rgba(239, 68, 68, 0.12)",
      border: "rgba(239, 68, 68, 0.3)",
      icon: "📉",
    };
  }

  return {
    label: outlook || "Stable",
    color: "#38bdf8",
    bg: "rgba(14, 165, 233, 0.12)",
    border: "rgba(14, 165, 233, 0.3)",
    icon: "⚖️",
  };
}

/**
 * Return human-friendly description of rating tier.
 */
export function getRatingTierDescription(
  rating: string,
  agency: "sp" | "moodys" | "fitch" = "sp",
): string {
  const clean = rating.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

  if (agency === "moodys") {
    if (clean === "AAA")
      return "Prime quality with the smallest degree of investment risk.";
    if (clean.startsWith("AA"))
      return "High quality by all standards; superior creditworthiness.";
    if (clean.startsWith("A"))
      return "Upper-medium-grade with many favorable investment attributes.";
    if (clean.startsWith("BAA"))
      return "Medium-grade obligations; neither highly protected nor poorly secured.";
    if (clean.startsWith("BA"))
      return "Judged to have speculative elements; subject to substantial credit risk.";
    if (clean.startsWith("B"))
      return "Generally lack characteristics of the desirable investment.";
    if (clean.startsWith("CAA"))
      return "Poor standing; subject to very high credit risk.";
    if (clean === "CA")
      return "Highly speculative and likely in, or very near, default.";
    if (clean === "C")
      return "Lowest-rated class; typically in default with little prospect of recovery.";
  } else {
    // S&P / Fitch
    if (clean === "AAA")
      return "Extremely strong capacity to meet financial commitments (Prime).";
    if (clean.startsWith("AA"))
      return "Very strong capacity to meet financial commitments (High Grade).";
    if (clean.startsWith("A"))
      return "Strong capacity to meet financial commitments (Upper Medium Grade).";
    if (clean.startsWith("BBB"))
      return "Adequate capacity to meet commitments; subject to adverse conditions (Lower Medium Grade).";
    if (clean.startsWith("BB"))
      return "Less vulnerable in the near-term but faces major ongoing uncertainties (Speculative).";
    if (clean.startsWith("B"))
      return "More vulnerable to adverse conditions but currently has capacity to meet commitments.";
    if (clean.startsWith("CCC"))
      return "Currently vulnerable and dependent on favorable business conditions.";
    if (clean === "CC")
      return "Highly vulnerable; default has not yet occurred but is a virtual certainty.";
    if (clean === "C")
      return "Subordinated debt or currently highly vulnerable to nonpayment.";
    if (["SD", "RD", "D"].includes(clean))
      return "Default or selective default on one or more financial obligations.";
  }

  return "Sovereign foreign currency credit rating.";
}
