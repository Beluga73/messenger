"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export const ToggleModeButton = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      area-label="toggle theme"
      onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
      variant="ghost"
      className="w-9 h-9 p-0 rounded-full"
    >
      {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  );
};
