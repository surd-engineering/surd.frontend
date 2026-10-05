"use client";

import Link from "next/link";
import {
  ArrowUpDownIcon,
  ArrowUpRight01Icon,
  PiggyBankIcon,
  Wallet01Icon,
  Wallet03Icon,
} from "@hugeicons/core-free-icons";
import { useAdminWalletBalanceSeries, useAdminWalletOverview, useTransactions } from "@/api";
import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
import { Spinner } from "@/components/ui/spinner";
import { ChartLegend, SeriesChart, SERIES_COLORS } from "@/components/dashboard/charts";
import { OwnerCell } from "@/components/dashboard/owner-cell";
import { Panel } from "@/components/dashboard/panel";
import { HeroStat, HeroStatBanner } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { DataTable, type Column } from "@/components/ui/table";
import { useDateRange } from "@/hooks/use-date-range";
import { ROUTES } from "@/constants/routes";
import {
  formatAbsoluteChange,
  formatChange,
  formatCompactMoney,
  formatEnum,
  formatMoney,
  formatName,
  formatTimestamp,
} from "@/lib/format";
import type { Transaction } from "@/types/transaction";
import { useCurrency } from "@/contexts/currency";

const RECENT_LIMIT = 6;

export default function FlexiWalletPage() {
  const { currency } = useCurrency();
  const { key, setKey, range, options } = useDateRange();

  const recent = useDateRange();

  const { data: overview, isLoading: loadingCards } = useAdminWalletOverview({
    currency,
    start_date: range.start_date,
  });

  const { data: series, isLoading: loadingChart } = useAdminWalletBalanceSeries({
    ...range,
    currency,
  });

  const { data: rows, isLoading: loadingRows } = useTransactions({
    currency,
    start_date: recent.range.start_date,
    limit: RECENT_LIMIT,
    page: 1,
  });

  const cards =
    overview?.data?.find((row) => row.currency === currency) ?? overview?.data?.[0];

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
      id: "type",
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
      header: "To",
      cell: (row) =>
        row.flow ? (
          <span
            title={`${row.flow.source} → ${row.flow.destination}`}
            className="whitespace-nowrap text-grey-600"
          >
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
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Flexi Wallet"
        description="Instant-access balances across the platform"
      />

      <HeroStatBanner>
        <HeroStat
          icon={Wallet03Icon}
          label="Total Flexi Wallet balance"
          value={
            loadingCards ? "…" : formatCompactMoney(cards?.total_flexi_balance, currency)
          }
          delta={formatChange(
            cards?.total_flexi_balance_change_pct_vs_last_month,
            "from last month",
          )}
        />
        <HeroStat
          icon={Wallet03Icon}
          label="Total Flexi Deposits"
          value={
            loadingCards ? "…" : formatCompactMoney(cards?.total_flexi_deposits, currency)
          }
          delta={formatChange(
            cards?.total_flexi_deposits_change_pct_vs_yesterday,
            "vs yesterday",
          )}
        />
        <HeroStat
          icon={PiggyBankIcon}
          label="Total Flexi Withdrawals"
          value={
            loadingCards
              ? "…"
              : formatCompactMoney(cards?.total_flexi_withdrawals, currency)
          }
          delta={formatChange(
            cards?.total_flexi_withdrawals_change_pct_vs_yesterday,
            "vs yesterday",
          )}
        />
        <HeroStat
          icon={PiggyBankIcon}
          label="Flexi ROI Liability"
          value={
            loadingCards ? "…" : formatCompactMoney(cards?.flexi_roi_liability, currency)
          }
          delta={formatAbsoluteChange(cards?.flexi_roi_liability_change_today, currency)}
        />
      </HeroStatBanner>

      <Panel
        title="Flexi Balance Over Time"
        icon={Wallet03Icon}
        hint="Flexi wallet balances across the selected period"
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
              currency={currency}
              series={[
                { key: "flexi_balance", name: "Flexi Wallet", color: SERIES_COLORS.flexi },
              ]}
            />
            <ChartLegend
              items={[{ label: "Flexi Wallet", color: SERIES_COLORS.flexi }]}
            />
          </>
        )}
      </Panel>

      <Panel
        title="Recent Wallet Transactions"
        icon={ArrowUpDownIcon}
        actions={
          <Dropdown
            options={recent.options}
            value={recent.key}
            onChange={(next) => recent.setKey(next as typeof recent.key)}
            className="w-34 rounded-lg border-grey-50"
          />
        }
        bleed
      >
        <div className="px-4 pb-5 sm:px-5">
          <DataTable
            data={rows?.data ?? []}
            columns={columns}
            getRowId={(row) => row.id}
            isLoading={loadingRows}
            pagination={false}
            minWidth="min-w-4xl"
            emptyState={
              <EmptyState
                icon={Wallet01Icon}
                title="No wallet activity yet"
                description="Deposits and withdrawals will appear here as they happen."
              />
            }
          />

          <Button variant="soft" size="lg" block className="mt-4" asChild>
            <Link href={ROUTES.finance.transactions}>
              View all
              <Icon icon={ArrowUpRight01Icon} size={16} />
            </Link>
          </Button>
        </div>
      </Panel>
    </div>
  );
}
