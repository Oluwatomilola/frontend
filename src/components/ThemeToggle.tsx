"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

/**
 * ThemeToggle component
 *
 * A theme switcher button that toggles between light and dark mode.
 * Uses the next-themes library to manage the theme state and provides
 * accessibility-friendly theme switching functionality.
 *
 * Features:
 * - Automatic theme detection from system preferences
 * - Smooth transitions between themes
 * - Accessible with proper ARIA labels
 * - Prevents hydration mismatch with mounted state
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage in header
 * <ThemeToggle />
 *
 * // In a settings panel
 * <div className="flex items-center gap-2">
 *   <span className="text-sm">Theme:</span>
 *   <ThemeToggle />
 * </div>
 * ```
 *
 * @returns {JSX.Element} A toggle button with sun/moon icons that switches between light and dark themes
 */

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70"
      >
        <Sun className="w-5 h-5" />
      </button>
    );
  }

  const current = theme === "system" ? systemTheme : theme;
  const isDark = current === "dark";

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 hover:shadow-sm transition"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
