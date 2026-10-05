"use client";

import { useState } from "react";
import {
  ArrowDataTransferVerticalIcon,
  ArrowDown02Icon,
  ArrowUp02Icon,
  Calendar03Icon,
  MoneyBag01Icon,
  PieChartIcon,
  PiggyBankIcon,
  SquareLock02Icon,
  Target02Icon,
} from "@hugeicons/core-free-icons";
import {
  useAdminSavingsByType,
  useAdminSavingsMaturityTimeline,
  useAdminSavingsOverview,
  useSavings,
} from "@/api";
import { Dropdown } from "@/components/ui/dropdown";
import { EmptyState } from "@/components/ui/empty-state";
import {
  EMPTY_RANGE,
  dateFilterGroup,
  maturityBounds,
} from "@/components/ui/filter-presets";
import { Flag } from "@/components/ui/flag";
import {
  TableFilter,
  type FilterGroup,
  type FilterOption,
} from "@/components/ui/table-controls";
import { CURRENCIES } from "@/constants/currency";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { SAVINGS_PLAN_COLUMNS } from "@/components/savings/plan-columns";
import { SearchInput } from "@/components/ui/search-input";
import { Spinner } from "@/components/ui/spinner";
import {
  BarSeriesChart,
  FundsBreakdownChart,
  SERIES_COLORS,
} from "@/components/dashboard/charts";
import { Panel } from "@/components/dashboard/panel";
import { StatCard } from "@/components/dashboard/stat-card";
import { DataTable } from "@/components/ui/table";
import { ROUTES } from "@/constants/routes";
import { useDateRange } from "@/hooks/use-date-range";
import { useTablePage } from "@/hooks/use-pagination";
import { useDebounced } from "@/hooks/use-debounced";
import {
  formatChange,
  formatCompactMoney,
  formatCount,
  formatMoney,
} from "@/lib/format";
import {
  Currency,
  RecordStatus,
  SavingsTemplate,
  type SavingStatus,
} from "@/types/enum";
import { useCurrency } from "@/contexts/currency";

const STATUS_OPTIONS: FilterOption[] = [
  { value: "", label: "All statuses" },
  { value: RecordStatus.Active, label: "Active" },
  { value: RecordStatus.Completed, label: "Completed" },
  { value: RecordStatus.Broken, label: "Broken" },
];

const TEMPLATE_OPTIONS: FilterOption[] = [
  { value: "", label: "All types" },
  { value: SavingsTemplate.FixedSave, label: "Fixed Deposit" },
  { value: SavingsTemplate.TargetSave, label: "Target Savings" },
];

const CURRENCY_OPTIONS: FilterOption[] = [
  { value: "", label: "All currencies" },
  ...CURRENCIES.map((entry) => ({
    value: entry.value,
    label: entry.label,
    adornment: <Flag code={entry.country} size="sm" />,
  })),
];

const TYPE_COLORS: Record<string, string> = {
  FIXED_SAVE: SERIES_COLORS.flexi,
  TARGET_SAVE: "#3fc75a",
};

const TYPE_FALLBACK = [SERIES_COLORS.savings, SERIES_COLORS.roi];

export default function SavingsPage() {
  const { currency } = useCurrency();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string | undefined>>({});
  const [customRange, setCustomRange] = useState(EMPTY_RANGE);
  const { page, setPage, pageSize, setPageSize } = useTablePage();

  const { key, setKey, range, options } = useDateRange();
  const typeRange = useDateRange("12m");
  const maturityRange = useDateRange("12m");
  const search = useDebounced(query);

  const { data: overview, isLoading: loadingCards } = useAdminSavingsOverview({
    currency,
    start_date: range.start_date,
  });

  const { data: byType, isLoading: loadingDonut } = useAdminSavingsByType({
    currency,
    start_date: typeRange.range.start_date,
  });

  const { data: timeline, isLoading: loadingChart } =
    useAdminSavingsMaturityTimeline({ ...maturityRange.range, currency });

  const filterGroups: FilterGroup[] = [
    { id: "status", label: "Status", options: STATUS_OPTIONS },
    { id: "template", label: "Type", options: TEMPLATE_OPTIONS },
    { id: "currency", label: "Currency", options: CURRENCY_OPTIONS },
    dateFilterGroup({
      id: "maturity",
      label: "Maturity",
      selected: filters.maturity,
      range: customRange,
      onRangeChange: setCustomRange,
    }),
  ];

  const { data: plans, isLoading: loadingRows } = useSavings({
    currency: (filters.currency as Currency) ?? currency,
    search: search || undefined,
    ...(filters.status ? { statuses: [filters.status as SavingStatus] } : {}),
    ...(filters.template ? { templates: [filters.template] } : {}),
    ...maturityBounds(filters.maturity, customRange),
    page,
    limit: pageSize,
    paginate: true,
  });

  const cards =
    overview?.data?.find((row) => row.currency === currency) ?? overview?.data?.[0];

  const slices = (byType?.data ?? []).map((item, index) => ({
    name: item.label,
    value: item.amount,
    color: TYPE_COLORS[item.key] ?? TYPE_FALLBACK[index % TYPE_FALLBACK.length],
  }));

  const table = (
    <DataTable
      data={plans?.data ?? []}
      columns={SAVINGS_PLAN_COLUMNS}
      getRowId={(row) => row.id}
      isLoading={loadingRows}
      minWidth="min-w-5xl"
      pagination={{
        mode: "server",
        page,
        pageSize,
        totalItems: plans?.pagination?.total ?? 0,
        onPageChange: setPage,
        onPageSizeChange: setPageSize,
      }}
      emptyState={
        <EmptyState
          icon={PiggyBankIcon}
          title="No savings plans"
          description="Plans are created by customers and will appear here."
        />
      }
    />
  );

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Savings"
        description="Principal locked in savings products, and when it comes due"
        actions={
          <div className="flex items-center gap-2">
            <Dropdown
              options={options}
              value={key}
              onChange={(next) => setKey(next as typeof key)}
              className="w-34 rounded-lg border-grey-50"

            />
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total Savings Balance"
          value={loadingCards ? "…" : formatCompactMoney(cards?.total_savings_balance, currency)}
          icon={PiggyBankIcon}
          delta={formatChange(
            cards?.total_savings_balance_change_pct_vs_yesterday,
            "vs yesterday",
          )}
          hint="Principal only — interest is reported under ROI"
        />
        <StatCard
          label="Fixed Deposits Balance"
          value={
            loadingCards
              ? "…"
              : formatCompactMoney(cards?.total_fixed_deposit_balance, currency)
          }
          icon={SquareLock02Icon}
          delta={formatChange(
            cards?.total_fixed_deposit_balance_change_pct_vs_last_month,
            "from last month",
          )}
        />
        <StatCard
          label="Target Savings Balance"
          value={
            loadingCards
              ? "…"
              : formatCompactMoney(cards?.total_target_savings_balance, currency)
          }
          icon={Target02Icon}
          delta={formatChange(
            cards?.total_target_savings_balance_change_pct_vs_last_month,
            "from last month",
          )}
        />
        <StatCard
          label="Total Locked Savings"
          value={loadingCards ? "…" : formatCompactMoney(cards?.total_locked_savings, currency)}
          icon={ArrowDown02Icon}
          delta={formatChange(
            cards?.total_locked_savings_change_pct_vs_last_month,
            "from last month",
          )}
          hint="Fixed deposits plus locked-mode target savings. Flexible plans excluded."
        />
        <StatCard
          label="Average Plan Size"
          value={loadingCards ? "…" : formatCompactMoney(cards?.average_plan_size, currency)}
          icon={ArrowUp02Icon}
          delta={formatChange(
            cards?.average_plan_size_change_pct_vs_yesterday,
            "vs yesterday",
          )}
          hint={`Across ${formatCount(cards?.active_savings_plans_count)} active plans`}
        />
        <StatCard
          label="Upcoming Maturities (30d)"
          value={
            loadingCards
              ? "…"
              : formatCompactMoney(cards?.upcoming_maturities_30d_amount, currency)
          }
          suffix={
            loadingCards ? undefined : `(${formatCount(cards?.upcoming_maturities_30d_count)})`
          }
          icon={MoneyBag01Icon}
          hint="Fixed deposit principal falling due in the next 30 days"
          footer={
            <Link
              href={ROUTES.finance.savingsMaturities}
              className="w-fit text-sm font-semibold text-grey-600 underline underline-offset-4 hover:text-primary"
            >
              View all
            </Link>
          }
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel
          title="Savings by Type"
          icon={PieChartIcon}
          hint="Fixed against target, as principal"
          actions={
            <Dropdown
              options={typeRange.options}
              value={typeRange.key}
              onChange={(next) => typeRange.setKey(next as typeof typeRange.key)}
                className="w-34 rounded-lg border-grey-50"
            />
          }
        >
          {loadingDonut ? (
            <div className="grid h-56 place-items-center">
              <Spinner size={28} className="text-primary" />
            </div>
          ) : (
            <div className="grid items-center gap-6 sm:grid-cols-2">
              <FundsBreakdownChart data={slices} currency={currency} />

              <ul className="flex flex-col gap-6">
                {slices.map((slice) => (
                  <li key={slice.name} className="flex flex-col gap-2">
                    <span className="flex items-center gap-2.5 text-md font-medium text-grey-500">
                      <span
                        aria-hidden
                        className="h-3.5 w-1 shrink-0 rounded-full"
                        style={{ backgroundColor: slice.color }}
                      />
                      {slice.name}
                    </span>
                    <span className="text-lg font-semibold text-grey-900 tabular-nums">
                      {formatMoney(slice.value, currency)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Panel>

        <Panel
          title="Fixed Deposit Maturity Timeline"
          icon={Calendar03Icon}
          hint="Fixed deposit principal maturing per bucket, forward-looking only"
          actions={
            <Dropdown
              options={maturityRange.options}
              value={maturityRange.key}
              onChange={(next) =>
                maturityRange.setKey(next as typeof maturityRange.key)
              }
                className="w-34 rounded-lg border-grey-50"
            />
          }
        >
          {loadingChart ? (
            <div className="grid h-72 place-items-center">
              <Spinner size={28} className="text-primary" />
            </div>
          ) : (
            <BarSeriesChart
              data={timeline?.data ?? []}
              currency={currency}
              dataKey="amount"
              name="Maturing"
            />
          )}
        </Panel>
      </div>

      <Panel
        title="All Savings Plans"
        icon={ArrowDataTransferVerticalIcon}
        actions={
          <>
            <SearchInput
              value={query}
              onChange={(next) => {
                setQuery(next);
                setPage(1);
              }}
              placeholder="Search..."
              className="w-full sm:w-64"
            />
            <TableFilter
              groups={filterGroups}
              value={filters}
              onChange={(next) => {
                setFilters(next);
                setPage(1);
              }}
            />
          </>
        }
        bleed
      >
        <div className="px-4 pb-5 sm:px-5">{table}</div>
      </Panel>

    </div>
  );
}
