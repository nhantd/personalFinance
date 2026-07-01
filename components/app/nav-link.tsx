"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/components/app/nav-config";
import { getNavItemClassName, isNavActive } from "@/components/app/nav-config";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  item: NavItem;
  onClick?: () => void;
  className?: string;
  showIcon?: boolean;
}

export function NavLink({ item, onClick, className, showIcon = true }: NavLinkProps) {
  const pathname = usePathname();
  const active = isNavActive(pathname, item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        getNavItemClassName(active),
        className
      )}
    >
      {showIcon && <Icon className="h-4 w-4 shrink-0" />}
      {item.label}
    </Link>
  );
}
