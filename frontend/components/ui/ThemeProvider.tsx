// components/ui/ThemeProvider.tsx
// Extracted from layout.tsx because useStore (Zustand) requires a Client Component.
// The theme class is applied to <html> here, keeping layout.tsx as a Server Component.

"use client";
import { useEffect } from "react";
import { useStore } from "@/store/useStore";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Apply initial class synchronously to prevent flash
  return (
    <div className={theme === "dark" ? "dark" : ""} style={{ display: "contents" }}>
      {children}
    </div>
  );
}