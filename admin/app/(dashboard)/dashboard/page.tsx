"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Alert01Icon,
  ArrowDataTransferHorizontalIcon,
  ArrowDown02Icon,
  ArrowRight02Icon,
  ArrowUp02Icon,
  ArrowUpDownIcon,
  ArrowUpRight01Icon,
  MoneyBag01Icon,
  PercentIcon,
  PieChartIcon,
  PiggyBankIcon,
  Wallet03Icon,
} from "@hugeicons/core-free-icons";
import {
  useAdminFundsBreakdown,
  useAdminOverviewMetrics,
  useAdminSettleTransaction,
  useAdminSystemFunds,
  useTransactions,
} from "@/api";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Dropdown } from "@/components/ui/dropdown";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import {
  ChartLegend,
  FundsBreakdownChart,
  SeriesChart,
  SERIES_COLORS,
} from "@/components/dashboard/charts";
import { OwnerCell } from "@/components/dashboard/owner-cell";
import { Panel } from "@/components/dashboard/panel";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  healthTone,
  HeroStat,
  HeroStatBanner,
  StatCard,
} from "@/components/dashboard/stat-card";
import { DataTable, type Column } from "@/components/ui/table";
import { TabPanel, Tabs, type TabItem } from "@/components/ui/tabs";
import { Can } from "@/components/auth/can";
import { useDateRange } from "@/hooks/use-date-range";
import { useDisclosure } from "@/hooks/use-disclosure";
import { ROUTES } from "@/constants/routes";
import {
  formatAbsoluteChange,
  formatChange,
  formatCompactMoney,
  formatCount,
  formatDate,
  formatEnum,
  formatMoney,
  formatMultiple,
  formatName,
  formatTimestamp,
} from "@/lib/format";
import {
  BreakdownMode,
  CancellationReason,
  Currency,
  TransactionCategory,
  TransactionStatus,
} from "@/types/enum";
import { SYSTEM_DONUT_KEYS } from "@/types/metrics";
import { Permission } from "@/types/permission";
import type { Transaction } from "@/types/transaction";
import { formatTime } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";

const DONUT_COLORS: Record<string, string> = {
  TOTAL_FLEXI_BALANCE: SERIES_COLORS.flexi,
  TOTAL_FIXED_BALANCE: SERIES_COLORS.savings,
  TOTAL_TARGET_BALANCE: "#3fc75a",
  TOTAL_SAVINGS_BALANCE: SERIES_COLORS.savings,
  TOTAL_ROI_LIABILITY: "#cc45cf",
  PENDING_WITHDRAWALS: "#4aa8a5",
  TOTAL_CAPITAL_OUTFLOW: "#8257e6",
};

const DONUT_PALETTE = [
  SERIES_COLORS.flexi,
  SERIES_COLORS.savings,
  SERIES_COLORS.roi,
  "#7b3fe4",
  "#e5484d",
];

const BREAKDOWN_TABS: TabItem[] = [
  { value: BreakdownMode.Savings, label: "Savings" },
  { value: BreakdownMode.System, label: "System" },
  { value: BreakdownMode.Currency, label: "Currency" },
];

const BREAKDOWN_NOTE: Record<BreakdownMode, string> = {
  [BreakdownMode.Savings]:
    "Principal only — interest is reported as ROI, not as savings.",
  [BreakdownMode.System]:
    "Pending withdrawals are a claim on balances already counted here, and capital outflow is a cumulative total rather than money held.",
  [BreakdownMode.Currency]:
    "Slices are sized in one currency so they can be compared; each amount is shown in its own.",
};

const AS_OF_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "month", label: "End of last month" },
  { value: "year", label: "End of last year" },
];

function asOfDate(value: string) {
  const now = new Date();

  if (value === "month")
    return new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();
  if (value === "year")
    return new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59).toISOString();

  return undefined;
}

const RECENT_TABS: TabItem[] = [
  { value: TransactionCategory.Deposit, label: "Deposits" },
  { value: TransactionCategory.Withdrawal, label: "Withdrawals" },
  { value: TransactionCategory.Transfer, label: "Transfers" },
];

const PENDING_LIMIT = 5;
const RECENT_LIMIT = 6;

export default function DashboardPage() {
  const [currency, setCurrency] = useState<Currency>(Currency.NGN);
  const { key, setKey, range, options } = useDateRange();

  const { data: metrics, isLoading: loadingMetrics } = useAdminOverviewMetrics({
    currency,
  });

  const cards =
    metrics?.data?.find((row) => row.currency === currency) ?? metrics?.data?.[0];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Dashboard"
        description="Platform overview and financial metrics"
      />

      <HeroStatBanner>
        <HeroStat
          icon={Wallet03Icon}
          label="Total Funds in System"
          value={loadingMetrics ? "…" : formatCompactMoney(cards?.total_funds, currency)}
          delta={formatChange(
            cards?.total_funds_change_pct_vs_last_month,
            "from last month",
          )}
        />
        <HeroStat
          icon={Wallet03Icon}
          label="Total Flexi Wallet balance"
          value={
            loadingMetrics ? "…" : formatCompactMoney(cards?.total_flexi_balance, currency)
          }
          delta={formatChange(
            cards?.total_flexi_balance_change_pct_vs_yesterday,
            "vs yesterday",
          )}
        />
        <HeroStat
          icon={PiggyBankIcon}
          label="Total Savings Balance"
          value={
            loadingMetrics
              ? "…"
              : formatCompactMoney(cards?.total_savings_balance, currency)
          }
          delta={formatChange(
            cards?.total_savings_balance_change_pct_vs_last_month,
            "from last month",
          )}
        />
        <HeroStat
          icon={PiggyBankIcon}
          label="Total ROI Liability"
          value={
            loadingMetrics ? "…" : formatCompactMoney(cards?.total_roi_liability, currency)
          }
          delta={formatAbsoluteChange(cards?.total_roi_liability_change_today, currency)}
        />
      </HeroStatBanner>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Daily Deposits"
          value={loadingMetrics ? "…" : formatCompactMoney(cards?.daily_deposits, currency)}
          icon={ArrowDown02Icon}
          delta={formatChange(
            cards?.daily_deposits_change_pct_vs_yesterday,
            "vs yesterday",
          )}
          hint="Total deposits received today, Africa/Lagos"
        />
        <StatCard
          label="Daily Withdrawals"
          value={
            loadingMetrics ? "…" : formatCompactMoney(cards?.daily_withdrawals, currency)
          }
          icon={ArrowUp02Icon}
          delta={formatChange(
            cards?.daily_withdrawals_change_pct_vs_yesterday,
            "vs yesterday",
          )}
          hint="Total withdrawals paid out today, Africa/Lagos"
        />
        <StatCard
          label="Net Capital Position"
          value={
            loadingMetrics
              ? "…"
              : formatCompactMoney(cards?.net_capital_position, currency)
          }
          icon={ArrowUpRight01Icon}
          note={formatEnum(cards?.net_capital_position_status)}
          noteTone={healthTone(cards?.net_capital_position_status)}
          hint="Capital drawn out of the platform, net of refunds"
        />
        <StatCard
          label="Liquidity Ratio"
          value={loadingMetrics ? "…" : formatMultiple(cards?.liquidity_ratio)}
          icon={PercentIcon}
          note={formatEnum(cards?.liquidity_status)}
          noteTone={healthTone(cards?.liquidity_status)}
          hint="Safe deployable capital against ROI liability plus pending withdrawals"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="flex flex-col gap-4 xl:col-span-8">
          <SystemFundsPanel
            currency={currency}
            range={range}
            rangeKey={key}
            onRangeChange={setKey}
            options={options}
          />
          <FundsBreakdownPanel currency={currency} />
        </div>
        <div className="col-span-4">
          <PendingWithdrawalsPanel
            currency={currency}
            count={cards?.pending_withdrawals_count}
            total={cards?.pending_withdrawals}
          />
        </div>

      </div>

      <RecentTransactionsPanel currency={currency} />
    </div>
  );
}

function SystemFundsPanel({
  currency,
  range,
  rangeKey,
  onRangeChange,
  options,
}: {
  currency: Currency;
  range: ReturnType<typeof useDateRange>["range"];
  rangeKey: ReturnType<typeof useDateRange>["key"];
  onRangeChange: ReturnType<typeof useDateRange>["setKey"];
  options: ReturnType<typeof useDateRange>["options"];
}) {
  const { data, isLoading } = useAdminSystemFunds({ ...range, currency });

  return (
    <Panel
      title="System Funds"
      icon={MoneyBag01Icon}
      hint="Balances across all wallets over time"
      actions={
        <Dropdown
          options={options}
          value={rangeKey}
          onChange={(next) => onRangeChange(next as typeof rangeKey)}
          className="w-34 rounded-lg border-grey-50"
        />
      }
    >
      {isLoading ? (
        <div className="grid h-72 place-items-center">
          <Spinner size={28} className="text-primary" />
        </div>
      ) : (
        <>
          <SeriesChart
            data={data?.data ?? []}
            currency={currency}
            series={[
              { key: "flexi_balance", name: "Flexi Wallet", color: SERIES_COLORS.flexi },
              { key: "savings_balance", name: "Savings Wallet (Fixed + Target)", color: SERIES_COLORS.savings },
              { key: "roi_liability", name: "ROI Liability", color: SERIES_COLORS.roi },
            ]}
          />
          <ChartLegend
            items={[
              { label: "Flexi Wallet", color: SERIES_COLORS.flexi },
              { label: "Savings Wallet (Fixed + Target)", color: SERIES_COLORS.savings },
              { label: "ROI Liability", color: SERIES_COLORS.roi },
            ]}
          />
        </>
      )}
    </Panel>
  );
}

function FundsBreakdownPanel({ currency }: { currency: Currency }) {
  const [mode, setMode] = useState<BreakdownMode>(BreakdownMode.Savings);
  const [asOf, setAsOf] = useState("today");

  const { data, isLoading } = useAdminFundsBreakdown({
    mode,
    currency,
    end_date: asOfDate(asOf),
  });

  const group = data?.data?.find((entry) => entry.mode === mode) ?? data?.data?.[0];

  const order = SYSTEM_DONUT_KEYS as readonly string[];

  const items =
    mode === BreakdownMode.System
      ? (group?.items ?? [])
        .filter((item) => order.includes(item.key))
        .sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key))
      : (group?.items ?? []);

  const slices = items.map((item, index) => ({
    name: item.label,
    value: item.amount,
    color: DONUT_COLORS[item.key] ?? DONUT_PALETTE[index % DONUT_PALETTE.length],

    label:
      mode === BreakdownMode.Currency && item.native_amount != null
        ? formatMoney(item.native_amount, item.key)
        : formatMoney(item.amount, currency),
  }));

  const empty = slices.length === 0 || slices.every((slice) => slice.value === 0);

  return (
    <Panel
      title="Funds Breakdown"
      icon={PieChartIcon}
      hint="Where the money sits, as of the selected date"
      actions={
        <Dropdown
          options={AS_OF_OPTIONS}
          value={asOf}
          onChange={setAsOf}
          className="w-34 rounded-lg border-grey-50"

        />
      }
    >
      <div className="grid items-center gap-6 sm:grid-cols-2">
        {isLoading ? (
          <div className="grid h-56 place-items-center">
            <Spinner size={28} className="text-primary" />
          </div>
        ) : empty ? (
          <div className="grid h-56 place-items-center">
            <EmptyState
              icon={PieChartIcon}
              title="Nothing to break down"
              description="No balances were held on this date."
            />
          </div>
        ) : (
          <FundsBreakdownChart data={slices} currency={currency} />
        )}

        <Tabs
          items={BREAKDOWN_TABS}
          value={mode}
          onValueChange={(next) => setMode(next as BreakdownMode)}
        >
          {BREAKDOWN_TABS.map((tab) => (
            <TabPanel key={tab.value} value={tab.value}>
              <ul className="flex flex-col gap-3.5 pt-12">
                {slices.map((slice) => (
                  <li
                    key={slice.name}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="flex items-center gap-2.5 text-md font-medium text-grey-500">
                      <span
                        aria-hidden
                        className="h-3.5 w-1 shrink-0 rounded-full"
                        style={{ backgroundColor: slice.color }}
                      />
                      {slice.name}
                    </span>
                    <span className="text-md font-semibold text-grey-900 tabular-nums">
                      {slice.label}
                    </span>
                  </li>
                ))}
              </ul>
            </TabPanel>
          ))}
        </Tabs>
      </div>

      <p className="text-xs text-grey-400">{BREAKDOWN_NOTE[mode]}</p>
    </Panel>
  );
}

function PendingWithdrawalsPanel({
  currency,
  count,
  total,
}: {
  currency: Currency;
  count?: number;
  total?: number;
}) {
  const settle = useDisclosure<{ transaction: Transaction; approve: boolean }>();

  const { data, isLoading } = useTransactions({
    pending_approval: true,
    currency,
    limit: PENDING_LIMIT,
    paginate: true,
  });

  const rows = data?.data ?? [];

  return (
    <Panel
      title="Pending Withdrawals"
      icon={Alert01Icon}
      iconClass="text-orange-500!"
      hint="Withdrawals held for admin approval"
      actions={
        <span className="text-md font-bold text-primary">
          {formatCount(count ?? rows.length)}
        </span>
      }
      className="h-fit"
    >
      <hr />
      {total ? (
        <p className="text-sm text-grey-500">
          {formatMoney(total, currency)} awaiting a decision
        </p>
      ) : null}

      {isLoading ? (
        <div className="grid py-10 place-items-center">
          <Spinner size={24} className="text-primary" />
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={Alert01Icon}
          title="Nothing awaiting approval"
          description="Withdrawals will queue here for review."
        />
      ) : (
        <ul className="flex flex-col divide-y divide-grey-50">
          {rows.slice(0, 3).map((item) => (
            <li key={item.id} className="flex flex-col gap-5 py-4 first:pt-0">
              <div className="flex items-start justify-between gap-3">
                <p className="text-base font-semibold text-grey-700">
                  {formatMoney(item.amount, item.currency)}
                </p>
                <Badge tone="warning" variant="outline" size="sm">
                  {formatEnum(item.category)}
                </Badge>
              </div>

              <dl className="flex flex-col gap-2.5 text-sm font-medium">
                <div className="flex items-center gap-10">
                  <dt className="w-10 shrink-0 text-grey-400 font-medium">By:</dt>
                  <dd className="flex min-w-0 items-center gap-2">
                    <Avatar
                      name={item.user ? formatName(item.user) : "Unknown"}
                      src={item.user?.avatar ?? undefined}
                      size="xs"
                    />
                    <span className="truncate text-grey-700">
                      {item.user ? formatName(item.user) : "Unknown user"}
                    </span>
                  </dd>
                </div>
                <div className="flex items-center gap-10">
                  <dt className="w-10 shrink-0 text-grey-400">Date:</dt>
                  <dd className="text-grey-700">
                    {formatDate(item.created_at)}
                  </dd>
                </div>

                <div className="flex items-center gap-10">
                  <dt className="w-10 shrink-0 text-grey-400 ">Time:</dt>
                  <dd className="text-grey-700">
                    {formatTime(item.created_at)}
                  </dd>
                </div>
              </dl>

              <Can do={Permission.TransactionsSettle}>
                <div className="flex gap-2">
                  <Button
                    tone="primary"
                    variant="soft"
                    size="lg"
                    shape="pill"
                    block
                    className="flex-1"
                    onClick={() => settle.open({ transaction: item, approve: true })}
                  >
                    Approve
                  </Button>
                  <Button
                    tone="danger"
                    variant="soft"
                    size="lg"
                    shape="pill"
                    block
                    className="w-24"
                    onClick={() => settle.open({ transaction: item, approve: false })}
                  >
                    Reject
                  </Button>
                </div>
              </Can>
            </li>
          ))}
        </ul>
      )}

      <Button trailingIcon={ArrowRight02Icon} variant="soft" size="lg" block className="mt-4 rounded-full" asChild>
        <Link href={ROUTES.finance.transactions}>View all</Link>
      </Button>

      {settle.isOpen && settle.data ? (
        <SettleDialog control={settle} {...settle.data} />
      ) : null}
    </Panel>
  );
}

const REASONS = Object.values(CancellationReason).map((reason) => ({
  value: reason,
  label: formatEnum(reason),
}));

function SettleDialog({
  control,
  transaction,
  approve,
}: {
  control: ReturnType<typeof useDisclosure<{ transaction: Transaction; approve: boolean }>>;
  transaction: Transaction;
  approve: boolean;
}) {
  const [reason, setReason] = useState<CancellationReason>(
    CancellationReason.SuspectedFraud,
  );
  const [note, setNote] = useState("");

  const settle = useAdminSettleTransaction({ onSuccess: control.close });

  const amount = formatMoney(transaction.amount, transaction.currency);

  return (
    <Dialog
      control={control}
      tone={approve ? "warning" : "danger"}
      title={approve ? `Approve this ${amount} withdrawal?` : `Cancel this ${amount} withdrawal?`}
      description={
        approve
          ? "The funds are released to the customer. This cannot be undone."
          : "The request is cancelled and the customer is not paid."
      }
      confirmLabel={approve ? "Approve withdrawal" : "Cancel withdrawal"}
      cancelLabel="Go back"
      isSubmitting={settle.isPending}
      onConfirm={() =>
        settle.mutate({
          transaction_id: transaction.id,
          status: approve ? TransactionStatus.Completed : TransactionStatus.Cancelled,
          ...(approve ? {} : { reason, note: note.trim() || undefined }),
        })
      }
    >
      {approve ? null : (
        <div className="mt-6 flex w-full flex-col gap-4 text-left">
          <Field label="Reason" htmlFor="settle-reason">
            <Dropdown
              options={REASONS}
              value={reason}
              onChange={(next) => setReason(next as CancellationReason)}
              className="h-12 w-full rounded-xl border-transparent bg-grey-25"
            />
          </Field>

          <Field label="Note" htmlFor="settle-note">
            <textarea
              id="settle-note"
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Anything the audit trail should record"
              className="w-full resize-y rounded-xl bg-grey-25 px-4 py-3 text-sm text-grey-900 outline-none placeholder:text-grey-300 focus:shadow-ring-gray"
            />
          </Field>
        </div>
      )}
    </Dialog>
  );
}

function RecentTransactionsPanel({ currency }: { currency: Currency }) {
  const [tab, setTab] = useState<string>(TransactionCategory.Deposit);

  const { data, isLoading } = useTransactions({
    category: tab as TransactionCategory,
    currency,
    limit: RECENT_LIMIT,
    page: 1,
  });

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
      header: "To",
      cell: (row) =>
        row.flow ? (
          <span title={`${row.flow.source} → ${row.flow.destination}`}>
            {row.flow.destination}
          </span>
        ) : (
          "—"
        ),
      width: "min-w-48",
    },
    {
      id: "created",
      header: "Date & Time",
      cell: (row) => formatTimestamp(row.created_at),
    },
  ];

  return (
    <Panel title="Recent Transactions" icon={ArrowUpDownIcon} bleed>
      <div className="px-4 py-5 sm:px-5 ">
        <Tabs items={RECENT_TABS} value={tab} onValueChange={setTab}>
          {RECENT_TABS.map((item) => (
            <TabPanel key={item.value} value={item.value} className="mt-5">
              <DataTable
                data={data?.data ?? []}
                columns={columns}
                getRowId={(row) => row.id}
                isLoading={isLoading}
                pagination={false}
                minWidth="min-w-3xl"
                emptyState={
                  <EmptyState
                    icon={ArrowDataTransferHorizontalIcon}
                    title={`No ${item.label.toLowerCase()} yet`}
                    description="Activity will appear here as it happens."
                  />
                }
              />
            </TabPanel>
          ))}
        </Tabs>

        <Button variant="soft" size="lg" block className="mt-4" asChild>
          <Link href={`${ROUTES.finance.transactions}?category=${tab}`}>
            View all
            <Icon icon={ArrowUpRight01Icon} size={16} />
          </Link>
        </Button>
      </div>
    </Panel>
  );
}
