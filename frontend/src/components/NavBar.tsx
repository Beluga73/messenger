"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

export const NavBar = () => {
  const currentPathname = usePathname();

  return (
    <nav className="absolute bottom-0 z-10 left-0 h-12 w-full border-t-1">
      <ul className="grid grid-cols-3 h-full">
        {navItems.map(({ href, image: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                "center-children w-full h-full",
                currentPathname === href && "text-primary"
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
