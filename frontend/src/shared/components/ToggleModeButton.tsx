import { useThemeStore } from "@/stores/themeStore";
import { Button } from "@/shared/components/ui/button";
import { Sun, Moon } from "lucide-react";

export const ToggleModeButton = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <Button
      area-label="toggle theme"
      onClick={toggleTheme}
      variant="ghost"
      className="w-9 h-9 p-0 rounded-full"
    >
      {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  );
};
