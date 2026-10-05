"use client";

import { useState } from "react";
import {
  ArrowDown02Icon,
  ArrowUp02Icon,
  ArrowUpDownIcon,
  BankIcon,
  CheckmarkCircle02Icon,
  PercentIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import {
  useAdminTreasuryOverview,
  useAdminTreasurySeries,
  useTransactions,
} from "@/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CapitalDialog } from "@/components/treasury/capital-dialog";
import { Dropdown } from "@/components/ui/dropdown";
import { TableEmptyState } from "@/components/ui/empty-state";
import {
  AMOUNT_OPTIONS,
  EMPTY_RANGE,
  amountBounds,
  dateFilterGroup,
  dateBounds,
} from "@/components/ui/filter-presets";
import {
  TableFilter,
  TableSort,
  type FilterGroup,
  type FilterOption,
} from "@/components/ui/table-controls";
import { Flag } from "@/components/ui/flag";
import { CURRENCIES as PLATFORM_CURRENCIES } from "@/constants/currency";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { Spinner } from "@/components/ui/spinner";
import { Can } from "@/components/auth/can";
import { ChartLegend, SeriesChart, SERIES_COLORS } from "@/components/dashboard/charts";
import { CurrencyChip } from "@/components/dashboard/editor-cell";
import { OwnerCell } from "@/components/dashboard/owner-cell";
import { Panel } from "@/components/dashboard/panel";
import { healthTone, StatCard } from "@/components/dashboard/stat-card";
import { DataTable, type Column } from "@/components/ui/table";
import { useAuthorizedByFilter } from "@/hooks/use-admin-filter";
import { useDateRange } from "@/hooks/use-date-range";
import { useTablePage } from "@/hooks/use-pagination";
import { useDebounced } from "@/hooks/use-debounced";
import { useDisclosure } from "@/hooks/use-disclosure";
import {
  formatAbsoluteChange,
  formatCompactMoney,
  formatEnum,
  formatMoney,
  formatMultiple,
  formatName,
  formatPercent,
  formatTimestamp,
} from "@/lib/format";
import {
  Currency,
  SortDirection,
  TransactionType,
} from "@/types/enum";
import { Permission } from "@/types/permission";
import type { Transaction } from "@/types/transaction";
import { useCurrency } from "@/contexts/currency";

const STATUS_OPTIONS: FilterOption[] = [
  { value: "", label: "All transactions" },
  { value: TransactionType.CapitalOutflow, label: "Outflow" },
  { value: TransactionType.CapitalRefund, label: "Refund" },
];

const CURRENCY_OPTIONS: FilterOption[] = PLATFORM_CURRENCIES.map((entry) => ({
  value: entry.value,
  label: entry.label,
  adornment: <Flag code={entry.country} size="sm" />,
}));

export default function TreasuryPage() {
  const { currency } = useCurrency();
  const [filters, setFilters] = useState<Record<string, string | undefined>>({});
  const [customRange, setCustomRange] = useState(EMPTY_RANGE);
  const [sort, setSort] = useState<SortDirection>(SortDirection.Desc);
  const [query, setQuery] = useState("");
  const { page, setPage, pageSize, setPageSize } = useTablePage();

  const { key, setKey, range, options } = useDateRange();
  const search = useDebounced(query);

  const outflow = useDisclosure<void>();
  const refund = useDisclosure<void>();

  const { data: overview, isLoading: loadingCards } = useAdminTreasuryOverview({
    currency,
  });

  const { data: series, isLoading: loadingChart } = useAdminTreasurySeries({
    ...range,
    currency,
  });

  const authorizedBy = useAuthorizedByFilter();

  const filterGroups: FilterGroup[] = [
    { id: "type", label: "Status", options: STATUS_OPTIONS },
    { id: "currency", label: "Currency", options: CURRENCY_OPTIONS },
    { id: "amount", label: "Amount", options: AMOUNT_OPTIONS },
    authorizedBy,
    dateFilterGroup({
      selected: filters.date,
      range: customRange,
      onRangeChange: setCustomRange,
    }),
  ];

  const { data: rows, isLoading: loadingRows } = useTransactions({
    capital_transaction: true,

    currency: (filters.currency as Currency) ?? currency,
    search: search || undefined,
    ...(filters.type ? { type: filters.type } : {}),
    ...(filters.author ? { user_id: filters.author } : {}),
    ...amountBounds(filters.amount),
    ...dateBounds(filters.date, customRange),
    sort,
    page,
    limit: pageSize,
    paginate: true,
  });

  const cards =
    overview?.data?.find((row) => row.currency === currency) ?? overview?.data?.[0];

  const columns: Column<Transaction>[] = [
    {
      id: "currency",
      header: "Currency",
      cell: (row) => <CurrencyChip currency={row.currency as never} />,
    },
    {
      id: "amount",
      header: "Amount",
      cell: (row) => (
        <span className="font-semibold tabular-nums">
          {formatMoney(row.amount, row.currency)}
        </span>
      ),
      align: "right",
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge
          tone={row.type === TransactionType.CapitalOutflow ? "danger" : "success"}
          variant="outline"
          size="sm"
        >
          {row.type === TransactionType.CapitalOutflow ? "Outflow" : "Refund"}
        </Badge>
      ),
    },
    {
      id: "author",
      header: "Authorized by",
      cell: (row) =>
        row.user ? (
          <OwnerCell name={formatName(row.user)} email={row.user.email} />
        ) : (
          <span className="text-grey-400">—</span>
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
        title="Treasury"
        description="Deployable capital, what is deployed out, and every movement"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Can do={Permission.TreasuryMove}>
              <Button
                variant="soft"
                size="md"
                shape="pill"
                leadingIcon={PlusSignIcon}
                onClick={() => outflow.open()}
              >
                Add Capital Outflow
              </Button>
              <Button
                tone="primary"
                size="md"
                shape="pill"
                leadingIcon={PlusSignIcon}
                onClick={() => refund.open()}
              >
                Add Refund
              </Button>
            </Can>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Safe Deployable Capital"
          value={
            loadingCards
              ? "…"
              : formatCompactMoney(cards?.safe_deployable_capital, currency)
          }
          icon={CheckmarkCircle02Icon}
          hint="Total funds less ROI owed, pending withdrawals, locked principal and the operating buffer"
        />
        <StatCard
          label="Total Capital Outflow"
          value={
            loadingCards ? "…" : formatCompactMoney(cards?.total_capital_outflow, currency)
          }
          icon={ArrowUp02Icon}
          hint="All-time — not scoped by any date filter"
        />
        <StatCard
          label="Total Capital Refund"
          value={
            loadingCards ? "…" : formatCompactMoney(cards?.total_capital_refund, currency)
          }
          icon={ArrowDown02Icon}
          hint="All-time capital returned"
        />
        <StatCard
          label="Net Capital Position"
          value={
            loadingCards ? "…" : formatCompactMoney(cards?.net_capital_position, currency)
          }
          icon={BankIcon}
          delta={formatAbsoluteChange(cards?.net_capital_position_change_today, currency)}
          hint="Outflow minus refund: what is currently deployed out"
        />
        <StatCard
          label="Liquidity Ratio"
          value={
            loadingCards
              ? "…"
              : cards?.liquidity_ratio == null
                ? "—"
                : formatMultiple(cards.liquidity_ratio)
          }
          icon={PercentIcon}
          note={formatEnum(cards?.liquidity_status)}
          noteTone={healthTone(cards?.liquidity_status)}
          hint="Safe deployable capital against obligations. HEALTHY at 1.0× or above."
        />
        <StatCard
          label="Treasury Exposure"
          value={
            loadingCards
              ? "…"
              : cards?.treasury_exposure_pct == null
                ? "—"
                : formatPercent(cards.treasury_exposure_pct)
          }
          icon={PercentIcon}
          note={formatEnum(cards?.treasury_exposure_status)}
          noteTone={healthTone(cards?.treasury_exposure_status)}
          hint="Net position as a share of total system funds"
        />
      </div>

      <Panel
        title="Liquidity Ratio Over Time"
        icon={PercentIcon}
        hint="Both series are shares of total system funds, so they share one axis"
        actions={
          <Dropdown
            options={options}
            value={key}
            onChange={(next) => setKey(next as typeof key)}
                      className="w-34 rounded-lg border-grey-50"

          />
        }
      >
        {loadingChart ? (
          <div className="grid h-72 place-items-center">
            <Spinner size={28} className="text-primary" />
          </div>
        ) : (
          <>
            <SeriesChart
              data={series?.data ?? []}
              unit="percent"
              series={[
                {
                  key: "safe_deployable_capital_pct",
                  name: "Safe deployable",
                  color: SERIES_COLORS.roi,
                },
                { key: "obligations_pct", name: "Obligations", color: "#e5484d" },
              ]}
            />
            <ChartLegend
              items={[
                { label: "Safe deployable", color: SERIES_COLORS.roi },
                { label: "Obligations", color: "#e5484d" },
              ]}
            />
          </>
        )}
      </Panel>

      <Panel
        title="Capital Transactions"
        icon={ArrowUpDownIcon}
        actions={
          <>
            <SearchInput
              value={query}
              onChange={(next) => {
                setQuery(next);
                setPage(1);
              }}
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
            <TableSort
              value={sort}
              onChange={(next) => {
                setSort(next);
                setPage(1);
              }}
            />
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
            minWidth="min-w-4xl"
            pagination={{
              mode: "server",
              page,
              pageSize,
              totalItems: rows?.pagination?.total ?? 0,
              onPageChange: setPage,
              onPageSizeChange: setPageSize,
            }}
            emptyState={
              <TableEmptyState
                query={search}
                onClearSearch={() => {
                  setQuery("");
                  setPage(1);
                }}
                title="No Capital Transactions Record Yet"
                description="No record for capital inflow or outflow has been added yet. When they are added, your treasury balances would be updated."
                action={
                  <Can do={Permission.TreasuryMove}>
                    <Button
                      tone="primary"
                      size="xl"
                      shape="pill"
                      leadingIcon={PlusSignIcon}
                      onClick={() => outflow.open()}
                    >
                      Add a Capital Record
                    </Button>
                  </Can>
                }
              />
            }
          />
        </div>
      </Panel>

      {outflow.isOpen ? (
        <CapitalDialog control={outflow} kind="outflow" currency={currency} />
      ) : null}
      {refund.isOpen ? (
        <CapitalDialog control={refund} kind="refund" currency={currency} />
      ) : null}
    </div>
  );
}
