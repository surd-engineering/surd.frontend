"use client";

import { useState } from "react";
import {
  AnalyticsUpIcon,
  ArrowDataTransferVerticalIcon,
  Calendar03Icon,
  PieChartIcon,
} from "@hugeicons/core-free-icons";
import {
  useAdminRoiByProduct,
  useAdminRoiFlowSeries,
  useAdminRoiOverview,
  useTransactions,
} from "@/api";
import { Badge } from "@/components/ui/badge";
import { Dropdown } from "@/components/ui/dropdown";
import { EmptyState } from "@/components/ui/empty-state";
import {
  AMOUNT_OPTIONS,
  DATE_WINDOW_OPTIONS,
  amountBounds,
  dateBounds,
} from "@/components/ui/filter-presets";
import { Flag } from "@/components/ui/flag";
import {
  TableFilter,
  TableSort,
  type FilterGroup,
  type FilterOption,
} from "@/components/ui/table-controls";
import { CURRENCIES } from "@/constants/currency";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { Spinner } from "@/components/ui/spinner";
import {
  ChartLegend,
  FundsBreakdownChart,
  SeriesChart,
  SERIES_COLORS,
} from "@/components/dashboard/charts";
import { OwnerCell } from "@/components/dashboard/owner-cell";
import { Panel } from "@/components/dashboard/panel";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { DataTable, type Column } from "@/components/ui/table";
import { useDateRange } from "@/hooks/use-date-range";
import { useTablePage } from "@/hooks/use-pagination";
import { useDebounced } from "@/hooks/use-debounced";
import {
  formatAbsoluteChange,
  formatChange,
  formatCompactMoney,
  formatEnum,
  formatMoney,
  formatName,
  formatTimestamp,
} from "@/lib/format";
import {
  Currency,
  RoiActivityType,
  SortDirection,
  TransactionStatus,
} from "@/types/enum";
import type { Transaction } from "@/types/transaction";
import { useCurrency } from "@/contexts/currency";
import { toTitleCase } from "@/lib/utils";

const PRODUCT_COLORS: Record<string, string> = {
  FIXED_SAVE: SERIES_COLORS.flexi,
  TARGET_SAVE: "#3fc75a",
  FLEX_SAVE: SERIES_COLORS.savings,
};

const PRODUCT_FALLBACK = [SERIES_COLORS.flexi, "#3fc75a", SERIES_COLORS.savings];

const STATUS_OPTIONS: FilterOption[] = [
  { value: "", label: "All statuses" },
  ...Object.values(TransactionStatus).map((status) => ({
    value: status,
    label: formatEnum(status),
  })),
];

const CURRENCY_OPTIONS: FilterOption[] = [
  { value: "", label: "All currencies" },
  ...CURRENCIES.map((entry) => ({
    value: entry.value,
    label: entry.label,
    adornment: <Flag code={entry.country} size="sm" />,
  })),
];

const ROI_FILTERS: FilterGroup[] = [
  { id: "status", label: "Status", options: STATUS_OPTIONS },
  { id: "currency", label: "Currency", options: CURRENCY_OPTIONS },
  { id: "amount", label: "Amount", options: AMOUNT_OPTIONS },
  { id: "date", label: "Date", options: DATE_WINDOW_OPTIONS },
];

export default function RoiPage() {
  const { currency } = useCurrency();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string | undefined>>({});
  const [sort, setSort] = useState<SortDirection>(SortDirection.Desc);
  const { page, setPage, pageSize, setPageSize } = useTablePage();

  const { key, setKey, range, options } = useDateRange();
  const productRange = useDateRange("12m");
  const search = useDebounced(query);

  const { data: overview, isLoading: loadingCards } = useAdminRoiOverview({
    currency,
    start_date: range.start_date,
  });

  const { data: byProduct, isLoading: loadingDonut } = useAdminRoiByProduct({
    currency,
    start_date: productRange.range.start_date,
  });

  const { data: flow, isLoading: loadingChart } = useAdminRoiFlowSeries({
    ...range,
    currency,
  });

  const { data: rows, isLoading: loadingRows } = useTransactions({
    roi_activity: true,
    currency: (filters.currency as Currency) ?? currency,
    search: search || undefined,
    ...(filters.status ? { statuses: [filters.status as TransactionStatus] } : {}),
    ...amountBounds(filters.amount),
    sort,
    ...(filters.date ? dateBounds(filters.date) : { start_date: range.start_date }),
    page,
    limit: pageSize,
    paginate: true,
  });

  const reset = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  const cards =
    overview?.data?.find((row) => row.currency === currency) ?? overview?.data?.[0];

  const slices = (byProduct?.data ?? []).map((item, index) => ({
    name: item.label,
    value: item.amount,
    color:
      PRODUCT_COLORS[item.key] ?? PRODUCT_FALLBACK[index % PRODUCT_FALLBACK.length],
  }));

  const columns: Column<Transaction>[] = [
    {
      id: "amount",
      header: "Amount",
      cell: (row) => (
        <span className="flex flex-col">
          <span className="font-semibold tabular-nums">
            {formatMoney(row.amount, row.currency)}
          </span>
          {row.roi_clawback_amount > 0 ? (
            <span className="text-xs text-grey-400">
              {formatMoney(row.roi_clawback_amount, row.currency)} recovered
            </span>
          ) : null}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={formatEnum(row.status)} />,
    },
    {
      id: "type",
      header: "Type",
      cell: (row) =>
        toTitleCase(row.roi_activity_type || "-"),
    },
    {
      id: "plan",
      header: "Plan",
      cell: (row) =>
        row.savings_template ? formatEnum(row.savings_template) : "—",
    },
    {
      id: "user",
      header: "User",
      cell: (row) =>
        row.user ? (
          <OwnerCell
            name={formatName(row.user)}
            email={row.user.email}
            userId={row.user.id}
          />
        ) : (
          <span className="text-grey-400">Unknown user</span>
        ),
      width: "min-w-56",
    },
    {
      id: "created",
      header: "Date & Time",
      cell: (row) => formatTimestamp(row.created_at),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="ROI"
        description="Interest owed, generated, withdrawn and clawed back"
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total ROI Liability"
          value={loadingCards ? "…" : formatCompactMoney(cards?.total_roi_liability, currency)}
          icon={AnalyticsUpIcon}
          delta={formatAbsoluteChange(cards?.total_roi_liability_change_today, currency)}
          hint="Every credited, unwithdrawn earnings balance. Point-in-time."
        />
        <StatCard
          label="ROI Generated Today"
          value={
            loadingCards
              ? "…"
              : cards?.roi_generated_today == null
                ? "—"
                : formatCompactMoney(cards.roi_generated_today, currency)
          }
          icon={AnalyticsUpIcon}
          delta={formatChange(
            cards?.roi_generated_today_change_pct_vs_yesterday,
            "vs yesterday",
          )}
          hint="Interest credited to any earnings balance today"
        />
        <StatCard
          label="ROI Withdrawn Today"
          value={loadingCards ? "…" : formatCompactMoney(cards?.roi_withdrawn_today, currency)}
          icon={AnalyticsUpIcon}
          delta={formatChange(
            cards?.roi_withdrawn_today_change_pct_vs_yesterday,
            "vs yesterday",
          )}
          hint="Interest moved out of earnings balances today"
        />
        <StatCard
          label="ROI Clawed Back"
          value={loadingCards ? "…" : formatCompactMoney(cards?.roi_clawed_back, currency)}
          icon={AnalyticsUpIcon}
          delta={formatChange(
            cards?.roi_clawed_back_change_pct_vs_previous_period,
            "vs previous period",
          )}
          hint="Interest reversed by early plan breaks, over the selected period"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel
          title="ROI by Product"
          icon={PieChartIcon}
          hint="Point-in-time — the date range does not apply to liability"
          actions={
            <Dropdown
              options={productRange.options}
              value={productRange.key}
              onChange={(next) =>
                productRange.setKey(next as typeof productRange.key)
              }
                className="w-34 rounded-lg border-grey-50"
            />
          }
        >
          {loadingDonut ? (
            <div className="grid h-56 place-items-center">
              <Spinner size={28} className="text-primary" />
            </div>
          ) : (
            <>
              <FundsBreakdownChart data={slices} currency={currency} badges="all" />

              <ul className="grid gap-4 sm:grid-cols-3">
                {slices.map((slice) => (
                  <li key={slice.name} className="flex flex-col gap-2">
                    <span className="flex items-center gap-2 text-sm font-medium text-grey-500">
                      <span
                        aria-hidden
                        className="h-3.5 w-1 shrink-0 rounded-full"
                        style={{ backgroundColor: slice.color }}
                      />
                      {slice.name}
                    </span>
                    <span className="text-md font-semibold text-grey-900 tabular-nums">
                      {formatMoney(slice.value, currency)}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Panel>

        <Panel
          title="Daily ROI Flow"
          icon={Calendar03Icon}
          hint="The gap between the lines is liability growing or shrinking"
        >
          {loadingChart ? (
            <div className="grid h-72 place-items-center">
              <Spinner size={28} className="text-primary" />
            </div>
          ) : (
            <>
              <SeriesChart
                data={flow?.data ?? []}
                currency={currency}
                series={[
                  { key: "roi_generated", name: "Generated", color: SERIES_COLORS.roi },
                  { key: "roi_withdrawn", name: "Withdrawn", color: "#e5484d" },
                ]}
              />
              <ChartLegend
                items={[
                  { label: "ROI Generated", color: SERIES_COLORS.roi },
                  { label: "ROI Withdrawn", color: "#e5484d" },
                ]}
              />
            </>
          )}
        </Panel>
      </div>

      <Panel
        title="ROI Activity"
        icon={ArrowDataTransferVerticalIcon}
        actions={
          <>
            <SearchInput
              value={query}
              onChange={reset(setQuery)}
              placeholder="Search..."
              className="w-full sm:w-64"
            />
            <TableFilter
              groups={ROI_FILTERS}
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
            data={rows?.data ?? []}
            columns={columns}
            getRowId={(row) => row.id}
            isLoading={loadingRows}
            minWidth="min-w-5xl"
            pagination={{
              mode: "server",
              page,
              pageSize,
              totalItems: rows?.pagination?.total ?? 0,
              onPageChange: setPage,
              onPageSizeChange: setPageSize,
            }}
            emptyState={
              <EmptyState
                icon={AnalyticsUpIcon}
                title="No ROI activity"
                description="Interest credited, withdrawn or reversed will appear here."
              />
            }
          />
        </div>
      </Panel>
    </div>
  );
}
