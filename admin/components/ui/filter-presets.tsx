"use client";

import type { FilterGroup, FilterOption } from "@/components/ui/table-controls";

export const AMOUNT_OPTIONS: FilterOption[] = [
  { value: "", label: "All" },
  { value: "0-100000", label: "Below ₦100K" },
  { value: "100000-1000000", label: "₦100K – ₦1M" },
  { value: "1000000-10000000", label: "₦1M – ₦10M" },
  { value: "10000000-", label: "Above ₦10M" },
];

function band(value?: string) {
  if (!value) return null;
  const [min, max] = value.split("-");
  return {
    min: min ? Number(min) : undefined,
    max: max ? Number(max) : undefined,
  };
}

export function amountBounds(value?: string) {
  const bounds = band(value);
  if (!bounds) return {};
  return { min_amount: bounds.min, max_amount: bounds.max };
}

export function balanceBounds(value?: string) {
  const bounds = band(value);
  if (!bounds) return {};
  return { min_balance: bounds.min, max_balance: bounds.max };
}

export type CustomRange = { from: string; to: string };

export const EMPTY_RANGE: CustomRange = { from: "", to: "" };

const WINDOWS: FilterOption[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "year", label: "This year" },
];

export const DATE_WINDOW_OPTIONS = WINDOWS;

export const DATE_OPTIONS: FilterOption[] = [
  ...WINDOWS,
  { value: "custom", label: "Custom date range" },
];

function windowBounds(value?: string, custom?: CustomRange) {
  if (!value) return {};

  if (value === "custom") {
    if (!custom?.from || !custom?.to) return {};
    return {
      start: new Date(`${custom.from}T00:00:00`).toISOString(),
      end: new Date(`${custom.to}T23:59:59`).toISOString(),
    };
  }

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  if (value === "week") start.setDate(start.getDate() - start.getDay());
  if (value === "month") start.setDate(1);
  if (value === "year") {
    start.setMonth(0);
    start.setDate(1);
  }

  return { start: start.toISOString() };
}

export function dateBounds(value?: string, custom?: CustomRange) {
  const { start, end } = windowBounds(value, custom);
  return {
    ...(start ? { start_date: start } : {}),
    ...(end ? { end_date: end } : {}),
  };
}

export function joinedBounds(value?: string, custom?: CustomRange) {
  const { start, end } = windowBounds(value, custom);
  return {
    ...(start ? { joined_after: start } : {}),
    ...(end ? { joined_before: end } : {}),
  };
}

export function maturityBounds(value?: string, custom?: CustomRange) {
  const { start, end } = windowBounds(value, custom);
  return {
    ...(start ? { ending_after: start } : {}),
    ...(end ? { ending_before: end } : {}),
  };
}

function CustomRangeFooter({
  value,
  onChange,
}: {
  value: CustomRange;
  onChange: (next: CustomRange) => void;
}) {
  return (
    <div
      className="flex flex-col gap-2 border-t border-grey-50 p-3"
      onKeyDown={(event) => event.stopPropagation()}
    >
      <label className="flex flex-col gap-1 text-xs text-grey-400">
        From
        <input
          type="date"
          value={value.from}
          onChange={(event) => onChange({ ...value, from: event.target.value })}
          className="rounded-lg bg-grey-25 px-3 py-2 text-sm text-grey-900 outline-none"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-grey-400">
        To
        <input
          type="date"
          value={value.to}
          onChange={(event) => onChange({ ...value, to: event.target.value })}
          className="rounded-lg bg-grey-25 px-3 py-2 text-sm text-grey-900 outline-none"
        />
      </label>
    </div>
  );
}

export function dateFilterGroup({
  id = "date",
  label = "Date",
  selected,
  range,
  onRangeChange,
}: {
  id?: string;
  label?: string;

  selected?: string;
  range: CustomRange;
  onRangeChange: (next: CustomRange) => void;
}): FilterGroup {
  return {
    id,
    label,
    options: DATE_OPTIONS,
    footer:
      selected === "custom" ? (
        <CustomRangeFooter value={range} onChange={onRangeChange} />
      ) : null,
  };
}
