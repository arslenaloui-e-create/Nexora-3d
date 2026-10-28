"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("nexora-theme") as Theme | null;

    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      document.documentElement.dataset.theme = saved;
    } else {
      const prefersLight = window.matchMedia(
        "(prefers-color-scheme: light)"
      ).matches;

      const initialTheme: Theme = prefersLight ? "light" : "dark";

      setTheme(initialTheme);
      document.documentElement.dataset.theme = initialTheme;
    }

    setMounted(true);
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    localStorage.setItem("nexora-theme", nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }

  if (!mounted) {
    return (
      <button
        type="button"
        className="theme-toggle"
        aria-label="Changer de thème"
        title="Changer de thème"
      >
        ◐
      </button>
    );
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={
        theme === "dark"
          ? "Activer le mode clair"
          : "Activer le mode sombre"
      }
      title={
        theme === "dark"
          ? "Activer le mode clair"
          : "Activer le mode sombre"
      }
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}