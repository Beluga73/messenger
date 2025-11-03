import { NavBar } from "@/components/NavBar";
import { ToggleModeButton } from "@/components/ModeToggleButton";

export default function Home() {
  return (
    <div>
      <ToggleModeButton />
      <NavBar />
    </div>
  );
}
