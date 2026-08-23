import { NPT_DATA } from "../data/nptData";
import { NptInfo, NptStatus } from "../types/country";

export function getNptInfo(countryCode?: string): NptInfo {
  if (!countryCode) {
    return {
      status: "non_party",
      statusLabel: "Unknown Status",
      isParty: false,
    };
  }
  const code = countryCode.toUpperCase();
  if (NPT_DATA[code]) {
    return NPT_DATA[code];
  }
  return {
    status: "non_party",
    statusLabel: "Non-Party / Unknown",
    isParty: false,
  };
}

export function getNptStatusIcon(status?: NptStatus): string {
  switch (status) {
    case "nuclear_weapon_state":
      return "☢️";
    case "non_nuclear_weapon_state":
      return "⚛️";
    case "withdrawn":
      return "⛔";
    case "non_party":
      return "⚠️";
    case "abiding_state":
      return "🌐";
    case "dependent_territory":
      return "🏛️";
    default:
      return "⚛️";
  }
}

export interface NptBadgeConfig {
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

export function getNptBadgeConfig(npt?: NptInfo): NptBadgeConfig {
  if (!npt) {
    return {
      label: "NPT Status Unknown",
      shortLabel: "Unknown",
      icon: "⚛️",
      color: "default",
      tooltip: "NPT information not available",
      backgroundColor: "rgba(148, 163, 184, 0.12)",
      borderColor: "rgba(148, 163, 184, 0.25)",
      textColor: "text.secondary",
    };
  }

  switch (npt.status) {
    case "nuclear_weapon_state":
      return {
        label: "NPT Nuclear-Weapon State",
        shortLabel: "NWS ☢️",
        icon: "☢️",
        color: "secondary",
        tooltip:
          "Recognized Nuclear-Weapon State (NWS) under Article IX.3 of the NPT (tested prior to 1 Jan 1967)",
        backgroundColor: "rgba(236, 72, 153, 0.15)",
        borderColor: "rgba(236, 72, 153, 0.4)",
        textColor: "#f472b6",
      };

    case "non_nuclear_weapon_state":
      return {
        label: "NPT Non-Nuclear-Weapon State Party",
        shortLabel: "NPT Party",
        icon: "⚛️",
        color: "success",
        tooltip:
          "State Party to the Treaty on the Non-Proliferation of Nuclear Weapons (NNWS)",
        backgroundColor: "rgba(16, 185, 129, 0.12)",
        borderColor: "rgba(16, 185, 129, 0.35)",
        textColor: "#6ee7b7",
      };

    case "abiding_state":
      return {
        label: "NPT Abiding State",
        shortLabel: "NPT Abiding",
        icon: "🌐",
        color: "info",
        tooltip:
          "Abiding by NPT provisions and adhering to IAEA comprehensive safeguards (Taiwan)",
        backgroundColor: "rgba(14, 165, 233, 0.15)",
        borderColor: "rgba(14, 165, 233, 0.4)",
        textColor: "#38bdf8",
      };

    case "withdrawn":
      return {
        label: "Withdrawn from NPT",
        shortLabel: "Withdrawn ⛔",
        icon: "⛔",
        color: "error",
        tooltip: "Announced withdrawal from the NPT in 2003 (North Korea)",
        backgroundColor: "rgba(239, 68, 68, 0.18)",
        borderColor: "rgba(239, 68, 68, 0.45)",
        textColor: "#f87171",
      };

    case "non_party":
      return {
        label: "NPT Non-Party (Never Signed)",
        shortLabel: "Non-Party ⚠️",
        icon: "⚠️",
        color: "warning",
        tooltip:
          "Has not signed or acceded to the Nuclear Non-Proliferation Treaty",
        backgroundColor: "rgba(245, 158, 11, 0.15)",
        borderColor: "rgba(245, 158, 11, 0.4)",
        textColor: "#fbbf24",
      };

    case "dependent_territory":
      return {
        label: npt.sovereignState
          ? `Covered via ${npt.sovereignState}`
          : "Territory / Special Status",
        shortLabel: "Territory",
        icon: "🏛️",
        color: "default",
        tooltip: npt.sovereignState
          ? `Treaty obligations administered by ${npt.sovereignState}`
          : "Dependent territory or special legal status",
        backgroundColor: "rgba(148, 163, 184, 0.1)",
        borderColor: "rgba(148, 163, 184, 0.2)",
        textColor: "#94a3b8",
      };

    default:
      return {
        label: npt.statusLabel,
        shortLabel: "NPT",
        icon: "⚛️",
        color: "default",
        tooltip: npt.notes || "NPT treaty status",
        backgroundColor: "rgba(148, 163, 184, 0.1)",
        borderColor: "rgba(148, 163, 184, 0.2)",
        textColor: "text.secondary",
      };
  }
}
