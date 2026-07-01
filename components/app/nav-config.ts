import type { LucideIcon } from "lucide-react";
import {
  Landmark,
  List,
  Settings,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  mobileShortLabel?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Everyday",
    items: [
      { href: "/dashboard", label: "Spending", icon: Wallet, mobileShortLabel: "Spending" },
      { href: "/budget", label: "Budget", icon: Target, mobileShortLabel: "Budget" },
      { href: "/transactions", label: "Transactions", icon: List, mobileShortLabel: "Txns" },
    ],
  },
  {
    label: "Wealth",
    items: [
      { href: "/net-worth", label: "Net worth", icon: Landmark },
      { href: "/investments", label: "Investments", icon: TrendingUp },
    ],
  },
];

export const SETTINGS_ITEM: NavItem = {
  href: "/settings",
  label: "Settings",
  icon: Settings,
};

export const MOBILE_TABS: NavItem[] = NAV_GROUPS[0].items;

export const MOBILE_MORE_ITEMS: NavItem[] = [
  ...NAV_GROUPS[1].items,
  SETTINGS_ITEM,
];

export function isNavActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getNavItemClassName(active: boolean): string {
  return active
    ? "bg-sidebar-accent text-sidebar-accent-foreground"
    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground";
}
