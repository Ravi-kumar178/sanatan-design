import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  setTheme?: (theme: Theme) => void;
  /** True while the theme is following the OS rather than an explicit choice. */
  followsSystem: boolean;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "theme";

function systemTheme(): Theme {
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function storedTheme(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    // Private mode / blocked storage — fall back to the system preference.
    return null;
  }
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme,
  switchable = false,
}: ThemeProviderProps) {
  const [explicit, setExplicit] = useState<Theme | null>(() =>
    switchable ? storedTheme() : null,
  );
  const [system, setSystem] = useState<Theme>(() =>
    switchable ? systemTheme() : "light",
  );

  const theme: Theme = switchable ? (explicit ?? system) : (defaultTheme ?? "light");

  // Follow the OS until the visitor makes an explicit choice.
  useEffect(() => {
    if (!switchable) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => setSystem(e.matches ? "dark" : "light");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [switchable]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    // Keeps form controls, scrollbars and the browser UI in step.
    root.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    if (!switchable) return;
    try {
      if (explicit) localStorage.setItem(STORAGE_KEY, explicit);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable — the theme still applies for this session */
    }
  }, [explicit, switchable]);

  const setTheme = switchable ? (next: Theme) => setExplicit(next) : undefined;
  const toggleTheme = switchable
    ? () => setExplicit(theme === "light" ? "dark" : "light")
    : undefined;

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, setTheme, followsSystem: explicit === null, switchable }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
