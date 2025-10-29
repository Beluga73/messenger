import Link from "next/link";
import { MessagesSquare, Phone, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    name: "/calls",
    href: "/calls",
    image: Phone,
  },
  {
    name: "/chats",
    href: "/chats",
    image: MessagesSquare,
  },
  {
    name: "/settings",
    href: "/settings",
    image: Settings,
  },
] as const;

type NavBarProps = {
  activePath: (typeof navItems)[number]["href"];
};

export const NavBar = ({ activePath }: NavBarProps) => {
  const activeClass = "text-blue-600 dark:text-blue-400";

  return (
    <nav className="h-20 py-2 w-full">
      <ul className="grid grid-cols-3 h-full">
        {navItems.map(({ href, image: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                "center-children w-full h-full p-2",
                activePath === href && "text-primary"
              )}
            >
              <Icon className="size-6" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
