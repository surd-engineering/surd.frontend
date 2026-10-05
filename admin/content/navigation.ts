import {
  ArrowDataTransferHorizontalIcon,
  BankIcon,
  CodeIcon,
  DashboardSquare02Icon,
  DocumentValidationIcon,
  MoneyBag02Icon,
  News01Icon,
  PercentIcon,
  PiggyBankIcon,
  SecurityLockIcon,
  Settings02Icon,
  Task01Icon,
  UserGroupIcon,
  UserSettings01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@/components/ui/icon";
import { ROUTES } from "@/constants/routes";
import { Permission } from "@/types/permission";

export type NavItem = {
  label: string;
  href: string;
  icon: IconSvgElement;

  badge?: number;

  permission?: Permission;
};

export type NavGroup = {
  id: string;
  title?: string;
  items: NavItem[];
};

export const SIDEBAR_GROUPS: NavGroup[] = [
  {
    id: "overview",
    items: [
      {
        label: "Dashboard",
        href: ROUTES.dashboard,
        permission: Permission.DashboardView,
        icon: DashboardSquare02Icon,
      },
    ],
  },
  {
    id: "finance",
    title: "Finance",
    items: [
      {
        label: "Flexi Wallet",
        href: ROUTES.finance.flexiWallet,
        permission: Permission.FinanceView,
        icon: Wallet01Icon,
      },
      {
        label: "Savings",
        href: ROUTES.finance.savings,
        permission: Permission.FinanceView,
        icon: PiggyBankIcon,
      },
      {
        label: "ROI",
        href: ROUTES.finance.roi,
        permission: Permission.FinanceView,
        icon: MoneyBag02Icon,
      },
      {
        label: "Treasury",
        href: ROUTES.finance.treasury,
        permission: Permission.TreasuryMove,
        icon: BankIcon,
      },
      {
        label: "Transaction history",
        href: ROUTES.finance.transactions,
        permission: Permission.FinanceView,
        icon: ArrowDataTransferHorizontalIcon,
      },
    ],
  },
  {
    id: "users",
    title: "Users",
    items: [
      {
        label: "User List",
        href: ROUTES.users.list,
        permission: Permission.UsersView,
        icon: UserGroupIcon,
      },
      {
        label: "KYC & Compliance",
        href: ROUTES.users.kyc,
        permission: Permission.KycView,
        icon: DocumentValidationIcon,
      },
    ],
  },
  {
    id: "configurations",
    title: "Configurations",
    items: [
      {
        label: "Rates",
        href: ROUTES.configurations.rates,
        permission: Permission.ConfigView,
        icon: PercentIcon,
      },
      {
        label: "Product Configuration",
        href: ROUTES.configurations.products,
        permission: Permission.ConfigView,
        icon: Settings02Icon,
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    items: [
      {
        label: "Admin accounts",
        href: ROUTES.settings.admins,
        permission: Permission.AdminsManage,
        icon: UserSettings01Icon,
      },
      {
        label: "Content & Marketing",
        href: ROUTES.settings.content,
        permission: Permission.ContentManage,
        icon: News01Icon,
      },
      {
        label: "Platform Configuration",
        href: ROUTES.settings.platform,
        permission: Permission.PlatformManage,
        icon: CodeIcon,
      },
      {
        label: "Audit Logs",
        href: ROUTES.settings.auditLogs,
        permission: Permission.AuditView,
        icon: Task01Icon,
      },
    ],
  },
];
