import type { IconSvgElement } from "@hugeicons/react";
import {
  CheckmarkBadge01Icon,
  SecurityLockIcon,
  SquareLock01Icon,
  Target01Icon,
  Wallet03Icon,
} from "@hugeicons/core-free-icons";

export type NavChild = {
  label: string;
  href: string;
  description: string;
  icon: IconSvgElement;
};

export type NavLink = {
  label: string;
  href: string;
  children?: NavChild[];
};

export const PRIMARY_NAV: NavLink[] = [
  {
    label: "Products",
    href: "/#products",
    children: [
      {
        label: "Target Saving",
        href: "/#products",
        description: "Create a free USD account in minutes.",
        icon: Target01Icon,
      },
      {
        label: "Fixed Deposit",
        href: "/#products",
        description: "Pay for anything, anywhere. Instantly.",
        icon: SquareLock01Icon,
      },
      {
        label: "Flexi Wallet",
        href: "/#products",
        description: "Create professional invoices. Get paid faster.",
        icon: Wallet03Icon,
      },
    ],
  },
  { label: "About Us", href: "/about-us" },
  { label: "FAQs", href: "/faqs" },
  { label: "Resources", href: "/blog" },
];

export type FooterColumn = {
  title: string;
  links: NavLink[];
};

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Careers", href: "/careers" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Security", href: "/privacy-policy#security" },
      { label: "Terms of Service", href: "/terms-of-service" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "Flexi Wallet", href: "/#products" },
      { label: "Target Savings", href: "/#products" },
      { label: "Fixed Deposit", href: "/#products" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Calculator", href: "/#calculator" },
    ],
  },
];

export type SocialLink = NavLink & {
  icon: string;
};

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Instagram", href: "https://instagram.com", icon: "/icons/instagram.svg" },
  { label: "X", href: "https://x.com", icon: "/icons/x.svg" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "/icons/linkedin.svg" },
];

export const SUPPORT_EMAIL = "support@surd.finance";

export const FOOTER_CTA = {
  title: "Your future savings won't build themselves.",
  body: "Every big financial milestone begins with one small decision. Start today. Keep going tomorrow. We'll help with the rest.",
  action: "Start saving today",
} as const;
