"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Crown02Icon,
  UnavailableIcon,
  UserCheck01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { useAdminUsers, useAdminUsersOverview } from "@/api";
import { TableEmptyState } from "@/components/ui/empty-state";
import {
  AMOUNT_OPTIONS,
  EMPTY_RANGE,
  balanceBounds,
  dateFilterGroup,
  joinedBounds,
} from "@/components/ui/filter-presets";
import {
  TableFilter,
  TableSort,
  type FilterGroup,
  type FilterOption,
} from "@/components/ui/table-controls";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { PersonCell } from "@/components/dashboard/person-cell";
import { Panel } from "@/components/dashboard/panel";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { DataTable, type Column } from "@/components/ui/table";
import { ROUTES } from "@/constants/routes";
import { useDebounced } from "@/hooks/use-debounced";
import { useTablePage } from "@/hooks/use-pagination";
import {
  formatChange,
  formatCount,
  formatEnum,
  formatMoney,
  formatName,
  formatTimestamp,
} from "@/lib/format";
import { Currency, SortDirection, UserStatus, UserTier } from "@/types/enum";
import type { AdminUserSummary } from "@/types/user";
import { useCurrency } from "@/contexts/currency";

const STATUS_OPTIONS: FilterOption[] = [
  { value: "", label: "All users" },
  { value: UserStatus.Active, label: "Active" },
  { value: UserStatus.Suspended, label: "Suspended" },
  { value: UserStatus.Closed, label: "Closed" },
];

const TIER_OPTIONS: FilterOption[] = [
  { value: "", label: "All levels" },
  ...Object.values(UserTier).map((tier, index) => ({
    value: tier,
    label: `Level ${index}`,
  })),
];

function MoneyCell({ ngn, usd }: { ngn: number; usd: number }) {
  return (
    <span className="flex flex-col tabular-nums">
      <span className="font-semibold text-grey-900">
        {formatMoney(ngn, Currency.NGN)}
      </span>
      <span className="font-semibold text-grey-500">
        {formatMoney(usd, Currency.USD)}
      </span>
    </span>
  );
}

export default function UsersPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string | undefined>>({});
  const [customRange, setCustomRange] = useState(EMPTY_RANGE);
  const [sort, setSort] = useState<SortDirection>(SortDirection.Desc);
  const { page, setPage, pageSize, setPageSize } = useTablePage();

  const { currency } = useCurrency();
  const search = useDebounced(query);

  const filterGroups: FilterGroup[] = [
    { id: "status", label: "Status", options: STATUS_OPTIONS },
    { id: "tier", label: "KYC Level", options: TIER_OPTIONS },
    { id: "balance", label: "Total Balance", options: AMOUNT_OPTIONS },
    dateFilterGroup({
      id: "joined",
      label: "Date joined",
      selected: filters.joined,
      range: customRange,
      onRangeChange: setCustomRange,
    }),
  ];

  const { data: overview, isLoading: loadingCards } = useAdminUsersOverview();

  const { data, isLoading } = useAdminUsers({
    search: search || undefined,
    ...(filters.status ? { status: filters.status as UserStatus } : {}),
    ...(filters.tier ? { tier: filters.tier } : {}),
    balance_currency: currency,
    ...balanceBounds(filters.balance),
    ...joinedBounds(filters.joined, customRange),
    sort,
    page,
    limit: pageSize,
    paginate: true,
  });

  const cards = overview?.data;

  const reset = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  const columns: Column<AdminUserSummary>[] = [
    {
      id: "name",
      header: "Name",
      cell: (user) => (
        <PersonCell
          name={formatName(user)}
          email={user.email}
          avatar={user.avatar}
        />
      ),
      width: "min-w-56",
    },
    {
      id: "status",
      header: "Status",
      cell: (user) => <StatusBadge  status={formatEnum(user.status)} />,
    },
    {
      id: "balance",
      header: "Total Balance",
      cell: (user) => (
        <MoneyCell ngn={user.total_balance_ngn} usd={user.total_balance_usd} />
      ),
      width: "min-w-44",
    },
    {
      id: "fixed",
      header: "Fixed Deposits",
      cell: (user) => (
        <MoneyCell ngn={user.fixed_deposits_ngn} usd={user.fixed_deposits_usd} />
      ),
      width: "min-w-44",
    },
    {
      id: "target",
      header: "Saved towards targets",
      cell: (user) => (
        <MoneyCell ngn={user.target_savings_ngn} usd={user.target_savings_usd} />
      ),
      width: "min-w-48",
    },
    {
      id: "joined",
      header: "Joined",
      cell: (user) => formatTimestamp(user.joined_at),
      width: "min-w-32",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Users" description="Manage all platform users" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Users"
          value={loadingCards ? "…" : formatCount(cards?.total_users)}
          icon={UserGroupIcon}
          delta={formatChange(
            cards?.total_users_change_pct_vs_last_month,
            "from last month",
          )}
          hint="Every registered customer account"
        />
        <StatCard
          label="Active Users"
          value={loadingCards ? "…" : formatCount(cards?.active_users)}
          icon={UserCheck01Icon}
          delta={formatChange(
            cards?.active_users_change_pct_vs_last_month,
            "from last month",
          )}
          hint="Accounts in good standing"
        />
        <StatCard
          label="Suspended"
          value={loadingCards ? "…" : formatCount(cards?.suspended_users)}
          icon={UnavailableIcon}
          hint="Accounts an admin has suspended"
        />
        <StatCard
          label="HNIs"
          value={loadingCards ? "…" : formatCount(cards?.hnis)}
          icon={Crown02Icon}
          delta={formatChange(cards?.hnis_change_pct_vs_yesterday, "from yesterday")}
          hint="Accounts above the HNI threshold in Platform Configuration"
        />
      </div>

      <Panel
        title="All users"
        icon={UserGroupIcon}
        actions={
          <>
            <SearchInput
              value={query}
              onChange={reset(setQuery)}
              placeholder="Search..."
              className="w-full sm:w-72"
            />
            <TableFilter
              groups={filterGroups}
              value={filters}
              onChange={reset(setFilters)}
            />
            <TableSort value={sort} onChange={reset(setSort)} />
          </>
        }
        bleed
      >
        <div className="px-4 pb-5 sm:px-5">
          <DataTable
            data={data?.data ?? []}
            columns={columns}
            getRowId={(user) => user.id}
            isLoading={isLoading}
            onRowClick={(user) => router.push(ROUTES.users.detail(user.id))}
            minWidth="min-w-5xl"
            pagination={{
              mode: "server",
              page,
              pageSize,
              totalItems: data?.pagination?.total ?? 0,
              onPageChange: setPage,
              onPageSizeChange: setPageSize,
            }}
            emptyState={
              <TableEmptyState
                query={search}
                onClearSearch={() => reset(setQuery)("")}
                title="No User Record Yet"
                description="No record for a user yet. When a new user has been onboarded, they will automatically appear here."
              />
            }
          />
        </div>
      </Panel>
    </div>
  );
}
