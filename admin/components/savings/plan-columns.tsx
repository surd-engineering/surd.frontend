"use client";

import { CurrencyChip } from "@/components/dashboard/editor-cell";
import { OwnerCell } from "@/components/dashboard/owner-cell";
import { StatusBadge } from "@/components/dashboard/status-badge";
import type { Column } from "@/components/ui/table";
import {
  formatDate,
  formatDaysLeft,
  formatEnum,
  formatMoney,
  formatName,
  formatTimestamp,
} from "@/lib/format";
import type { Saving } from "@/types/savings";

export const SAVINGS_PLAN_COLUMNS: Column<Saving>[] = [
  {
    id: "user",
    header: "User",
    cell: (row) =>
      row.user ? (
        <OwnerCell
          name={formatName(row.user)}
          email={row.user.email ?? ""}
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
    id: "template",
    header: "Type",
    cell: (row) => (
      <span >{formatEnum(row.template)}</span>
    ),
  },
  {
    id: "currency",
    header: "Currency",
    cell: (row) => <CurrencyChip currency={row.currency as never} />,
  },
  {
    id: "balance",
    header: "Amount Saved",
    cell: (row) => (
      <span className="font-semibold tabular-nums">
        {formatMoney(row.balance, row.currency)}
      </span>
    ),
  },
  {
    id: "started",
    header: "Started",
    cell: (row) => formatTimestamp(row.created_at),
  },
  {
    id: "maturity",
    header: "Maturity Date",
    cell: (row) => {
      const left = formatDaysLeft(row.ending_at);
      return left ? (
        <span className="flex flex-col">
          <span className="font-medium text-grey-900">{left}</span>
          <span className="text-xs text-grey-400">{formatDate(row.ending_at)}</span>
        </span>
      ) : (
        <span className="text-grey-500">{formatDate(row.ending_at)}</span>
      );
    },
  },
];
