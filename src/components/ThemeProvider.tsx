"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const isTheme = (value: unknown): value is Theme =>
  value === "light" || value === "dark" || value === "system";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "system";
  const savedTheme = localStorage.getItem("taskgh-theme");
  return isTheme(savedTheme) ? savedTheme : "system";
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("taskgh-theme", newTheme);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (t: Theme) => {
      root.classList.remove("light", "dark");
      
      let actualTheme = t;
      if (t === "system") {
        actualTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      
      root.classList.add(actualTheme);
      // Also update style for meta theme-color or body overflow if needed
    };

    applyTheme(theme);

    // If system mode, listen for changes
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
