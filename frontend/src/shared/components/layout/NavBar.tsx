import { Link, useLocation } from "react-router-dom";

import { MessagesSquare, Phone, Settings } from "lucide-react";

import { cn } from "@/shared/lib/utils";

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
  navClassName?: string;
};

export const NavBar = ({ navClassName }: NavBarProps) => {
  const location = useLocation();

  return (
    <nav className={cn("w-full border-t-1 chat-footer items-center mb-0", navClassName)}>
      <ul className="flex w-full h-full">
        {navItems.map(({ href, image: Icon }) => (
          <li key={href} className="flex-1">
            <Link
              to={href}
              className={cn("center-children h-full", location.pathname === href && "text-primary")}
            >
              <Icon className="size-6" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
