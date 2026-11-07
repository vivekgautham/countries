import { TAX_DATA } from "../data/taxData";
import { TaxInfo, TaxSystemType, UnifiedCountry } from "../types/country";

/**
 * Fallback Tax information when a country has no customized tax record.
 * Assumes a standard worldwide tax framework with informative guidance.
 */
export function getTaxInfo(countryCode?: string): TaxInfo {
  if (!countryCode) {
    return {
      systemType: "worldwide",
      systemLabel: "Worldwide Taxation",
      headlineRate: "Standard Progressive",
      foreignIncomeTaxRate: "Subject to Worldwide Taxation",
      personalIncomeTaxRate: "Standard progressive rates",
      residencyRule: "Typically 183 days or center of vital interests",
      summary:
        "Standard tax system where tax residents are generally taxed on their worldwide income from all sources.",
      isZeroGlobalTax: false,
    };
  }

  const code = countryCode.toUpperCase();
  if (TAX_DATA[code]) {
    return TAX_DATA[code];
  }

  return {
    systemType: "worldwide",
    systemLabel: "Worldwide Taxation",
    headlineRate: "Standard Progressive",
    foreignIncomeTaxRate: "Subject to Worldwide Taxation",
    personalIncomeTaxRate: "Standard progressive rates",
    residencyRule: "Typically 183 days or center of vital interests",
    summary:
      "Standard tax system where tax residents are generally taxed on their worldwide income from all sources.",
    isZeroGlobalTax: false,
  };
}

export interface TaxBadgeConfig {
  label: string;
  shortLabel: string;
  icon: string;
  color:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "default";
  tooltip: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}

export function getTaxBadgeConfig(tax?: TaxInfo): TaxBadgeConfig {
  if (!tax) {
    return {
      label: "Tax Regime Unknown",
      shortLabel: "Unknown",
      icon: "🌐",
      color: "default",
      tooltip: "Tax regime information not available",
      backgroundColor: "rgba(148, 163, 184, 0.12)",
      borderColor: "rgba(148, 163, 184, 0.25)",
      textColor: "text.secondary",
    };
  }

  switch (tax.systemType) {
    case "zero_tax":
      return {
        label: "0% Personal Income Tax",
        shortLabel: "0% Tax",
        icon: "🟢",
        color: "success",
        tooltip:
          "Zero personal income tax on global and domestic income (Tax Haven / Pure 0% PIT)",
        backgroundColor: "rgba(16, 185, 129, 0.18)",
        borderColor: "rgba(16, 185, 129, 0.45)",
        textColor: "#6ee7b7",
      };

    case "territorial":
      return {
        label: "Territorial (0% Foreign Income)",
        shortLabel: "Territorial",
        icon: "🔵",
        color: "info",
        tooltip:
          "Territorial tax system: 0% tax on foreign-sourced and global income",
        backgroundColor: "rgba(14, 165, 233, 0.18)",
        borderColor: "rgba(14, 165, 233, 0.45)",
        textColor: "#38bdf8",
      };

    case "non_dom":
      return {
        label: "Non-Dom / Special Regime",
        shortLabel: "Non-Dom",
        icon: "🟣",
        color: "secondary",
        tooltip:
          "Special expat / non-domiciled / lump-sum regime offering substantial foreign tax exemptions",
        backgroundColor: "rgba(168, 85, 247, 0.18)",
        borderColor: "rgba(168, 85, 247, 0.45)",
        textColor: "#c084fc",
      };

    case "worldwide":
    default:
      return {
        label: "Worldwide Taxation",
        shortLabel: "Worldwide",
        icon: "⚪",
        color: "default",
        tooltip:
          "Tax residents are subject to domestic and worldwide income taxation",
        backgroundColor: "rgba(148, 163, 184, 0.12)",
        borderColor: "rgba(148, 163, 184, 0.25)",
        textColor: "#cbd5e1",
      };
  }
}

export const TAX_FILTER_OPTIONS: {
  id: string;
  label: string;
  icon: string;
  type?: TaxSystemType | "zero_global" | "zero_cgt";
}[] = [
  { id: "all", label: "All Tax Regimes", icon: "🌐" },
  {
    id: "zero_tax",
    label: "0% Income Tax",
    icon: "🟢",
    type: "zero_tax",
  },
  {
    id: "zero_cgt",
    label: "0% Capital Gains",
    icon: "📈",
    type: "zero_cgt",
  },
  {
    id: "territorial",
    label: "Territorial (0% Foreign)",
    icon: "🔵",
    type: "territorial",
  },
  {
    id: "zero_global",
    label: "All 0% Global Tax (Pure + Territorial)",
    icon: "✨",
    type: "zero_global",
  },
  {
    id: "non_dom",
    label: "Non-Dom / Special",
    icon: "🟣",
    type: "non_dom",
  },
  {
    id: "worldwide",
    label: "Worldwide Tax",
    icon: "⚪",
    type: "worldwide",
  },
];

/**
 * Checks if a jurisdiction offers 0% capital gains tax
 * (either complete 0% CGT, 0% on private movable assets/shares/crypto, or 0% on foreign investment gains).
 */
export function isZeroCapitalGainsTax(tax?: TaxInfo): boolean {
  if (!tax) return false;
  if (tax.systemType === "zero_tax") return true;
  if (!tax.capitalGainsTaxRate) return false;

  const s = tax.capitalGainsTaxRate.trim().toLowerCase();

  // Exclude progressive scales that start with 0% (e.g. US 0%, 15%, 20%)
  if (
    s.startsWith("0%,") ||
    s.startsWith("0% to") ||
    s.startsWith("0% -") ||
    s.startsWith("0% or")
  ) {
    return false;
  }

  return (
    s.startsWith("0%") ||
    s.includes("no capital gains") ||
    s.includes("0% on private") ||
    s.includes("0% general") ||
    s.includes("0% on securities") ||
    s.includes("0% on sale of shares") ||
    s.includes("0% on foreign")
  );
}

/**
 * Filter matcher for tax filter chip selection.
 */
export function matchesTaxFilter(
  country: UnifiedCountry,
  filterId: string,
): boolean {
  if (filterId === "all") return true;

  const tax = country.tax;
  if (!tax) return filterId === "worldwide";

  if (filterId === "zero_global") {
    return tax.isZeroGlobalTax;
  }

  if (filterId === "zero_cgt") {
    return isZeroCapitalGainsTax(tax);
  }

  return tax.systemType === filterId;
}

/**
 * Checks if search query contains tax-related search intents.
 */
export function matchesTaxQuery(
  country: UnifiedCountry,
  query: string,
): boolean {
  const q = query.toLowerCase().trim();
  const tax = country.tax;
  if (!tax) return false;

  const zeroTaxKeywords = [
    "zero tax",
    "0% tax",
    "0 tax",
    "no tax",
    "no income tax",
    "tax free",
    "tax-free",
    "tax haven",
    "zero income tax",
    "0% income tax",
  ];

  if (zeroTaxKeywords.some((k) => q.includes(k) || k.includes(q))) {
    return tax.isZeroGlobalTax || tax.systemType === "zero_tax";
  }

  const cgtKeywords = [
    "capital gains",
    "cgt",
    "0% capital gains",
    "zero capital gains",
    "no cgt",
    "no capital gains",
    "zero cgt",
    "0% cgt",
  ];

  if (cgtKeywords.some((k) => q.includes(k) || k.includes(q))) {
    return isZeroCapitalGainsTax(tax);
  }

  if (q.includes("territorial")) {
    return tax.systemType === "territorial";
  }

  if (
    q.includes("non-dom") ||
    q.includes("non dom") ||
    q.includes("nondom") ||
    q.includes("remittance") ||
    q.includes("beckham") ||
    q.includes("lump sum") ||
    q.includes("forfait")
  ) {
    return tax.systemType === "non_dom";
  }

  if (q.includes("worldwide")) {
    return tax.systemType === "worldwide";
  }

  // Also check if text matches within summary, headline, or notes
  if (tax.summary && tax.summary.toLowerCase().includes(q)) return true;
  if (tax.systemLabel && tax.systemLabel.toLowerCase().includes(q)) return true;
  if (tax.headlineRate && tax.headlineRate.toLowerCase().includes(q))
    return true;
  if (
    tax.foreignIncomeTaxRate &&
    tax.foreignIncomeTaxRate.toLowerCase().includes(q)
  )
    return true;
  if (
    tax.capitalGainsTaxRate &&
    tax.capitalGainsTaxRate.toLowerCase().includes(q)
  )
    return true;
  if (tax.notes && tax.notes.toLowerCase().includes(q)) return true;

  return false;
}
