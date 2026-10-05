"use client";

import { useState } from "react";
import {
  ArrowDataTransferHorizontalIcon,
  ArrowDown02Icon,
  ArrowRight02Icon,
  ArrowUp02Icon,
  ArrowUpDownIcon,
  Download04Icon,
  ExchangeIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import {
  useAdminTransactionOverview,
  useTransaction,
  useTransactionReceipt,
  useTransactions,
} from "@/api";
import { Button } from "@/components/ui/button";
import { Can } from "@/components/auth/can";
import { Flag } from "@/components/ui/flag";
import { CapitalDialog } from "@/components/treasury/capital-dialog";
import { CURRENCIES } from "@/constants/currency";
import { Drawer } from "@/components/ui/drawer";
import { ReceiptIllustration } from "@/components/ui/illustrations";
import { Dropdown } from "@/components/ui/dropdown";
import { TableEmptyState } from "@/components/ui/empty-state";
import {
  AMOUNT_OPTIONS,
  DATE_WINDOW_OPTIONS,
  amountBounds,
  dateBounds,
} from "@/components/ui/filter-presets";
import { Icon } from "@/components/ui/icon";
import {
  TableFilter,
  TableSort,
  type FilterGroup,
  type FilterOption,
} from "@/components/ui/table-controls";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { Spinner } from "@/components/ui/spinner";
import { OwnerCell } from "@/components/dashboard/owner-cell";
import { Panel } from "@/components/dashboard/panel";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { DataTable, type Column } from "@/components/ui/table";
import { useDateRange } from "@/hooks/use-date-range";
import { useTablePage } from "@/hooks/use-pagination";
import { useDebounced } from "@/hooks/use-debounced";
import { useDisclosure } from "@/hooks/use-disclosure";
import {
  formatChange,
  formatCompactMoney,
  formatEnum,
  formatMoney,
  formatName,
  formatTimestamp,
} from "@/lib/format";
import {
  Currency,
  SortDirection,
  TransactionCategory,
  TransactionStatus,
} from "@/types/enum";
import { Permission } from "@/types/permission";
import type { Transaction } from "@/types/transaction";
import { useCurrency } from "@/contexts/currency";

const CATEGORY_OPTIONS = [
  { value: TransactionCategory.Deposit, label: "Deposit" },
  { value: TransactionCategory.Withdrawal, label: "Withdrawal" },
  { value: TransactionCategory.Transfer, label: "Transfer" },
  { value: TransactionCategory.RoiPayout, label: "ROI payout" },
  { value: TransactionCategory.RoiClawback, label: "ROI clawback" },
  { value: TransactionCategory.Conversion, label: "Conversion" },
  { value: TransactionCategory.Other, label: "Other" },
];

const STATUS_OPTIONS: FilterOption[] = [
  { value: "", label: "All statuses" },
  ...Object.values(TransactionStatus).map((status) => ({
    value: status,
    label: formatEnum(status),
  })),
];

const CURRENCY_OPTIONS: FilterOption[] = CURRENCIES.map((entry) => ({
  value: entry.value,
  label: entry.label,
  adornment: <Flag code={entry.country} size="sm" />,
}));

const TX_FILTERS: FilterGroup[] = [
  { id: "status", label: "Status", options: STATUS_OPTIONS },
  { id: "currency", label: "Currency", options: CURRENCY_OPTIONS },
  {
    id: "category",
    label: "Type",
    options: [{ value: "", label: "All types" }, ...CATEGORY_OPTIONS],
  },
  { id: "amount", label: "Amount", options: AMOUNT_OPTIONS },
  { id: "date", label: "Date", options: DATE_WINDOW_OPTIONS },
];

export default function TransactionsPage() {
  const { currency } = useCurrency();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string | undefined>>({});
  const [sort, setSort] = useState<SortDirection>(SortDirection.Desc);
  const { page, setPage, pageSize, setPageSize } = useTablePage();

  const detail = useDisclosure<Transaction>();
  const capital = useDisclosure<void>();
  const { key, setKey, range, options } = useDateRange();
  const search = useDebounced(query);

  const { data: overview, isLoading: loadingCards } = useAdminTransactionOverview({
    currency,
    start_date: range.start_date,
  });

  const { data, isLoading } = useTransactions({
    currency: (filters.currency as Currency) ?? currency,
    search: search || undefined,
    ...(filters.category
      ? { category: filters.category as TransactionCategory }
      : {}),
    ...(filters.status ? { statuses: [filters.status as TransactionStatus] } : {}),
    ...amountBounds(filters.amount),
    sort,
    ...(filters.date ? dateBounds(filters.date) : { start_date: range.start_date }),
    page,
    limit: pageSize,
    paginate: true,
  });

  const cards =
    overview?.data?.find((row) => row.currency === currency) ?? overview?.data?.[0];

  const reset = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  const columns: Column<Transaction>[] = [
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
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={formatEnum(row.status)} />,
    },
    {
      id: "category",
      header: "Type",
      cell: (row) => formatEnum(row.category),
    },
    {
      id: "amount",
      header: "Amount",
      cell: (row) => (
        <span className="font-semibold tabular-nums">
          {formatMoney(row.amount, row.currency)}
        </span>
      ),
    },
    {
      id: "flow",
      header: "Flow",
      cell: (row) =>
        row.flow ? (
          <span className="flex items-center gap-2">
            <span className="flex-1">{row.flow.source}</span>
            <Icon icon={ArrowRight02Icon} size={16} className="shrink-0 text-grey-300" />
            <span className="flex-1">{row.flow.destination}</span>
          </span>
        ) : (
          "—"
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
        title="Transactions"
        description="Complete system transaction ledger"
        actions={
          <div className="flex items-center gap-2">
            <Dropdown
              options={options}
              value={key}
              onChange={(next) => setKey(next as typeof key)}
              className="w-34 rounded-lg border-grey-50"
            />

            <Can do={Permission.TreasuryMove}>
              <Button
                tone="primary"
                size="md"
                shape="pill"
                leadingIcon={PlusSignIcon}
                onClick={() => capital.open()}
              >
                Add a Capital Record
              </Button>
            </Can>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total TXs Volume"
          value={
            loadingCards
              ? "…"
              : formatCompactMoney(cards?.total_transaction_volume, currency)
          }
          icon={ArrowUpDownIcon}
          note={
            loadingCards
              ? undefined
              : `${formatCompactMoney(cards?.average_daily_transaction_volume, currency)} Daily Average`
          }
          noteTone="neutral"
          hint="Every posting except conversions, which write one row per side"
        />
        <StatCard
          label="Total Deposits"
          value={loadingCards ? "…" : formatCompactMoney(cards?.total_deposits, currency)}
          icon={ArrowDown02Icon}
          delta={formatChange(
            cards?.total_deposits_change_pct_vs_previous_period,
            "vs previous period",
          )}
        />
        <StatCard
          label="Total Withdrawals"
          value={loadingCards ? "…" : formatCompactMoney(cards?.total_withdrawals, currency)}
          icon={ArrowUp02Icon}
          delta={formatChange(
            cards?.total_withdrawals_change_pct_vs_previous_period,
            "vs previous period",
          )}
        />
        <StatCard
          label="Net Flow"
          value={loadingCards ? "…" : formatCompactMoney(cards?.net_flow, currency)}
          icon={ExchangeIcon}
          note={
            cards && cards.net_flow < 0 ? "Paid out more than taken in" : undefined
          }
          noteTone="warning"
          hint="Deposits minus withdrawals over the selected period"
        />
      </div>

      <Panel
        title="Transactions History"
        icon={ArrowUpDownIcon}
        actions={
          <>
            <SearchInput
              value={query}
              onChange={reset(setQuery)}
              className="w-full sm:w-72"
            />
            <TableFilter
              groups={TX_FILTERS}
              value={filters}
              onChange={(next) => {
                setFilters(next);
                setPage(1);
              }}
            />
            <TableSort value={sort} onChange={(next) => { setSort(next); setPage(1); }} />
          </>
        }
        bleed
      >
        <div className="px-4 pb-5 sm:px-5">
          <DataTable
            data={data?.data ?? []}
            columns={columns}
            getRowId={(row) => row.id}
            isLoading={isLoading}
            onRowClick={detail.open}
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
                title="No Transactions Record Yet"
                description="No transaction has been recorded yet. When customers deposit, withdraw or transfer, the ledger will fill in here."
              />
            }
          />
        </div>
      </Panel>

      {detail.isOpen && detail.data ? (
        <TransactionDrawer control={detail} row={detail.data} />
      ) : null}
      {capital.isOpen ? (
        <CapitalDialog control={capital} kind="outflow" currency={currency} />
      ) : null}
    </div>
  );
}

function TransactionDrawer({
  control,
  row,
}: {
  control: ReturnType<typeof useDisclosure<Transaction>>;
  row: Transaction;
}) {
  const { data, isLoading } = useTransaction({ transaction_id: row.id });
  const entry = data?.data ?? row;

  return (
    <Drawer
      control={control}
      title="Transaction Detail"
      icon={ArrowDataTransferHorizontalIcon}
      width="md"
    >
      {isLoading ? (
        <div className="grid py-16 place-items-center">
          <Spinner size={28} className="text-primary" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <ReceiptIllustration />
            <StatusBadge status={formatEnum(entry.status)} size="md" />
            <p className="text-heading-sm font-bold text-grey-900">
              {formatMoney(entry.amount, entry.currency)}
            </p>
            <p className="text-sm text-grey-400">
              {formatEnum(entry.category)} · {formatTimestamp(entry.created_at)}
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-grey-50">
            <p className="border-b border-grey-50 px-4 py-3 text-md font-semibold text-grey-900">
              Payment Details
            </p>

            <dl className="flex flex-col divide-y divide-grey-50 px-4">
              <Row label="Transaction ID" value={entry.reference || entry.id} />
              <Row label="Type" value={formatEnum(entry.category)} />
              {entry.flow ? (
                <>
                  <Row label="Source" value={entry.flow.source} />
                  <Row label="Destination" value={entry.flow.destination} />
                </>
              ) : null}
              <Row
                label="User"
                value={
                  entry.user ? (
                    <OwnerCell
                      name={formatName(entry.user)}
                      email={entry.user.email}
                      userId={entry.user.id}
                    />
                  ) : (
                    "Unknown user"
                  )
                }
              />
              <Row label="Amount" value={formatMoney(entry.amount, entry.currency)} />
              <Row label="Fee" value={formatMoney(entry.fees, entry.currency)} />
              <Row
                label="Total"
                value={formatMoney(entry.total, entry.currency)}
                strong
              />
              {entry.roi_clawback_amount > 0 ? (
                <Row
                  label="Interest recovered"
                  value={formatMoney(entry.roi_clawback_amount, entry.currency)}
                />
              ) : null}
              {entry.savings_template ? (
                <Row label="Plan type" value={formatEnum(entry.savings_template)} />
              ) : null}
              <Row label="Narration" value={entry.remark || "—"} />
              <Row label="Method" value={formatEnum(entry.method)} />
              <Row
                label="Balance before"
                value={formatMoney(entry.pre_balance, entry.currency)}
              />
              <Row
                label="Balance after"
                value={formatMoney(entry.post_balance, entry.currency)}
              />
              <Row label="Completed" value={formatTimestamp(entry.completed_at)} />
            </dl>
          </div>

          {entry.invoice ? (
            <div className="rounded-2xl bg-grey-25 p-4">
              <p className="mb-2 text-sm font-semibold text-grey-900">Breakdown</p>
              <dl className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-grey-500">{entry.invoice.name ?? "Item"}</dt>
                  <dd className="font-semibold text-grey-900">
                    {formatMoney(entry.invoice.amount, entry.currency)}
                  </dd>
                </div>
              </dl>
            </div>
          ) : null}

          <ReceiptButton transaction={entry} />
        </div>
      )}
    </Drawer>
  );
}

function ReceiptButton({ transaction }: { transaction: Transaction }) {
  const [requested, setRequested] = useState(false);

  const { data, isLoading } = useTransactionReceipt(
    requested ? { transaction_id: transaction.id } : undefined,
  );

  if (transaction.status !== TransactionStatus.Completed) return null;

  if (data?.url) {
    return (
      <Button tone="primary" size="xl" block leadingIcon={Download04Icon} asChild>
        <a href={data.url} target="_blank" rel="noopener noreferrer">
          Download receipt
        </a>
      </Button>
    );
  }

  return (
    <Button
      tone="primary"
      size="xl"
      block
      leadingIcon={Download04Icon}
      disabled={isLoading}
      onClick={() => setRequested(true)}
    >
      {isLoading ? "Preparing receipt…" : "Download receipt"}
    </Button>
  );
}

function Row({
  label,
  value,
  strong = false,
}: {
  label: string;

  value: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-sm text-grey-400">{label}</dt>
      <dd
        className={
          strong
            ? "text-sm font-semibold text-grey-900 truncate"
            : "text-sm font-medium text-grey-900 truncate"
        }
      >
        {value}
      </dd>
    </div>
  );
}
