import { Icons } from '@/components/shared/Icons';

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends NavItemWithChildren {}

export type TransactionType = 'income' | 'expense';
export type TimeFrame = 'month' | 'year';
export type Period = { year: number; month: number };
