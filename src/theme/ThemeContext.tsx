import React, { createContext, useContext, useState, useMemo } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import {
  getTheme,
  ThemeColorId,
  COLOR_THEMES,
  ColorThemeDefinition,
  THEME_COLOR_LIST,
} from "./theme";

interface ThemeContextType {
  colorId: ThemeColorId;
  currentColorTheme: ColorThemeDefinition;
  availableThemes: ColorThemeDefinition[];
  setColorId: (colorId: ThemeColorId) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      "useThemeContext must be used within a ThemeContextProvider",
    );
  }
  return context;
}

export function ThemeContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [colorId, setColorIdState] = useState<ThemeColorId>(() => {
    const saved = localStorage.getItem("app-theme-color");
    if (saved && saved in COLOR_THEMES) {
      return saved as ThemeColorId;
    }
    return "ocean";
  });

  const setColorId = (newColorId: ThemeColorId) => {
    setColorIdState(newColorId);
    localStorage.setItem("app-theme-color", newColorId);
  };

  const currentColorTheme = COLOR_THEMES[colorId] || COLOR_THEMES.ocean;

  const theme = useMemo(() => getTheme(colorId), [colorId]);

  return (
    <ThemeContext.Provider
      value={{
        colorId,
        currentColorTheme,
        availableThemes: THEME_COLOR_LIST,
        setColorId,
      }}
    >
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
