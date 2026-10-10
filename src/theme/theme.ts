import { createTheme } from "@mui/material/styles";

export type ThemeColorId =
  "indigo" | "ocean" | "emerald" | "sunset" | "amethyst" | "rose" | "obsidian";

export interface ColorThemeDefinition {
  id: ThemeColorId;
  name: string;
  previewColor: string;
  secondaryPreview: string;
  primary: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  secondary: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  darkBg: {
    default: string;
    paper: string;
    card: string;
    divider: string;
  };
}

export const COLOR_THEMES: Record<ThemeColorId, ColorThemeDefinition> = {
  indigo: {
    id: "indigo",
    name: "Indigo Slate",
    previewColor: "#6366f1",
    secondaryPreview: "#a855f7",
    primary: {
      main: "#6366f1",
      light: "#818cf8",
      dark: "#4f46e5",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#a855f7",
      light: "#c084fc",
      dark: "#7e22ce",
      contrastText: "#ffffff",
    },
    darkBg: {
      default: "#0f172a",
      paper: "#1e293b",
      card: "rgba(30, 41, 59, 0.65)",
      divider: "rgba(255, 255, 255, 0.08)",
    },
  },
  ocean: {
    id: "ocean",
    name: "Ocean Azure",
    previewColor: "#0ea5e9",
    secondaryPreview: "#06b6d4",
    primary: {
      main: "#0ea5e9",
      light: "#38bdf8",
      dark: "#0284c7",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#06b6d4",
      light: "#22d3ee",
      dark: "#0891b2",
      contrastText: "#ffffff",
    },
    darkBg: {
      default: "#081d33",
      paper: "#0e2e50",
      card: "rgba(14, 46, 80, 0.65)",
      divider: "rgba(255, 255, 255, 0.09)",
    },
  },
  emerald: {
    id: "emerald",
    name: "Forest Emerald",
    previewColor: "#10b981",
    secondaryPreview: "#14b8a6",
    primary: {
      main: "#10b981",
      light: "#34d399",
      dark: "#059669",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#14b8a6",
      light: "#2dd4bf",
      dark: "#0d9488",
      contrastText: "#ffffff",
    },
    darkBg: {
      default: "#062117",
      paper: "#0d3526",
      card: "rgba(13, 53, 38, 0.65)",
      divider: "rgba(255, 255, 255, 0.09)",
    },
  },
  sunset: {
    id: "sunset",
    name: "Sunset Amber",
    previewColor: "#f59e0b",
    secondaryPreview: "#f97316",
    primary: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#d97706",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f97316",
      light: "#fb923c",
      dark: "#ea580c",
      contrastText: "#ffffff",
    },
    darkBg: {
      default: "#20140a",
      paper: "#331f10",
      card: "rgba(51, 31, 16, 0.65)",
      divider: "rgba(255, 255, 255, 0.09)",
    },
  },
  amethyst: {
    id: "amethyst",
    name: "Royal Amethyst",
    previewColor: "#a855f7",
    secondaryPreview: "#d946ef",
    primary: {
      main: "#a855f7",
      light: "#c084fc",
      dark: "#9333ea",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#d946ef",
      light: "#e879f9",
      dark: "#c026d3",
      contrastText: "#ffffff",
    },
    darkBg: {
      default: "#1b0d2e",
      paper: "#2b1448",
      card: "rgba(43, 20, 72, 0.65)",
      divider: "rgba(255, 255, 255, 0.09)",
    },
  },
  rose: {
    id: "rose",
    name: "Rose Crimson",
    previewColor: "#f43f5e",
    secondaryPreview: "#fb7185",
    primary: {
      main: "#f43f5e",
      light: "#fb7185",
      dark: "#e11d48",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#fb7185",
      light: "#fda4af",
      dark: "#f43f5e",
      contrastText: "#ffffff",
    },
    darkBg: {
      default: "#240c16",
      paper: "#381423",
      card: "rgba(56, 20, 35, 0.65)",
      divider: "rgba(255, 255, 255, 0.09)",
    },
  },
  obsidian: {
    id: "obsidian",
    name: "Midnight Obsidian",
    previewColor: "#38bdf8",
    secondaryPreview: "#818cf8",
    primary: {
      main: "#38bdf8",
      light: "#7dd3fc",
      dark: "#0284c7",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#818cf8",
      light: "#a5b4fc",
      dark: "#6366f1",
      contrastText: "#ffffff",
    },
    darkBg: {
      default: "#000000",
      paper: "#121212",
      card: "rgba(18, 18, 18, 0.85)",
      divider: "rgba(255, 255, 255, 0.12)",
    },
  },
};

export const THEME_COLOR_LIST = Object.values(COLOR_THEMES);

export const getTheme = (colorId: ThemeColorId = "indigo") => {
  const def = COLOR_THEMES[colorId] || COLOR_THEMES.indigo;
  const bg = def.darkBg;

  return createTheme({
    palette: {
      mode: "dark",
      primary: def.primary,
      secondary: def.secondary,
      background: {
        default: bg.default,
        paper: bg.paper,
      },
      text: {
        primary: "#f8fafc",
        secondary: "#94a3b8",
      },
      divider: bg.divider,
    },
    typography: {
      fontFamily:
        '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      h1: { fontWeight: 800 },
      h2: { fontWeight: 800 },
      h3: { fontWeight: 800 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: bg.default,
            color: "#f8fafc",
            minHeight: "100vh",
            margin: 0,
            transition: "background-color 0.3s ease, color 0.3s ease",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            fontFamily: "inherit",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontFamily: "inherit",
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: bg.card,
            backdropFilter: "blur(12px)",
            border: `1px solid ${bg.divider}`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  });
};
