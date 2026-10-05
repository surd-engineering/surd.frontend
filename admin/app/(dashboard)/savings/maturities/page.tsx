"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft02Icon,
  Calendar03Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { useSavings } from "@/api";
import { TableEmptyState } from "@/components/ui/empty-state";
import { Flag } from "@/components/ui/flag";
import { Icon } from "@/components/ui/icon";
import { SearchInput } from "@/components/ui/search-input";
import {
  TableFilter,
  type FilterGroup,
  type FilterOption,
} from "@/components/ui/table-controls";
import { Panel } from "@/components/dashboard/panel";
import { SAVINGS_PLAN_COLUMNS } from "@/components/savings/plan-columns";
import { DataTable } from "@/components/ui/table";
import { CURRENCIES } from "@/constants/currency";
import { ROUTES } from "@/constants/routes";
import { useDebounced } from "@/hooks/use-debounced";
import { useTablePage } from "@/hooks/use-pagination";
import {
  Currency,
  RecordStatus,
  SavingsTemplate,
  type SavingStatus,
} from "@/types/enum";
import { useCurrency } from "@/contexts/currency";

const DEFAULT_WINDOW = "30";

const WINDOW_OPTIONS: FilterOption[] = [
  { value: "", label: "All upcoming" },
  { value: "30", label: "Next 30 days" },
  { value: "60", label: "Next 60 days" },
  { value: "90", label: "Next 90 days" },
];

const CURRENCY_OPTIONS: FilterOption[] = [
  { value: "", label: "All currencies" },
  ...CURRENCIES.map((entry) => ({
    value: entry.value,
    label: entry.label,
    adornment: <Flag code={entry.country} size="sm" />,
  })),
];

const FILTER_GROUPS: FilterGroup[] = [
  { id: "currency", label: "Currency", options: CURRENCY_OPTIONS },
  { id: "window", label: "Maturity window", options: WINDOW_OPTIONS },
];

export default function SavingsMaturitiesPage() {
  const { currency } = useCurrency();
  const [query, setQuery] = useState("");

  const [filters, setFilters] = useState<Record<string, string | undefined>>({
    window: DEFAULT_WINDOW,
  });
  const { page, setPage, pageSize, setPageSize } = useTablePage();

  const search = useDebounced(query);
  const days = filters.window ? Number(filters.window) : null;

  const range = useMemo(() => {
    const now = new Date();

    if (days == null) return { ending_after: now.toISOString() };

    const end = new Date(now);
    end.setDate(end.getDate() + days);

    return {
      ending_after: now.toISOString(),
      ending_before: end.toISOString(),
    };
  }, [days]);

  const { data, isLoading } = useSavings({
    currency: (filters.currency as Currency) ?? currency,
    search: search || undefined,
    templates: [SavingsTemplate.FixedSave],
    statuses: [RecordStatus.Active as SavingStatus],
    ...range,
    page,
    limit: pageSize,
    paginate: true,
  });

  const reset = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  const setWindow = (value?: string) =>
    reset(setFilters)({ ...filters, window: value });

  return (
    <div className="flex flex-col gap-5">
      <Link
        href={ROUTES.finance.savings}
        className="flex w-fit items-center gap-2 text-md font-semibold text-grey-900 hover:text-primary"
      >
        <Icon icon={ArrowLeft02Icon} size={20} />
        Back
      </Link>

      <Panel
        title="Upcoming Maturities"
        icon={Calendar03Icon}
        hint="Fixed deposit principal falling due, soonest first"
        actions={
          <>
            <SearchInput
              value={query}
              onChange={reset(setQuery)}
              placeholder="Search..."
              className="w-full sm:w-64"
            />
            <TableFilter
              groups={FILTER_GROUPS}
              value={filters}
              onChange={reset(setFilters)}
            />
          </>
        }
        bleed
      >
        <div className="flex flex-col gap-4 px-4 pb-5 sm:px-5">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-primary">Filter:</span>
            {days == null ? (
              <button
                type="button"
                onClick={() => setWindow(DEFAULT_WINDOW)}
                className="text-sm font-medium text-grey-400 underline underline-offset-4 hover:text-primary"
              >
                All upcoming — back to {DEFAULT_WINDOW} days
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setWindow(undefined)}
                className="inline-flex items-center gap-2 rounded-full border border-grey-50 px-3 py-1.5 text-sm font-medium text-grey-600 hover:bg-grey-25"
              >
                {days} days
                <Icon icon={Cancel01Icon} size={14} className="text-grey-400" />
              </button>
            )}
          </div>

          <DataTable
            data={data?.data ?? []}
            columns={SAVINGS_PLAN_COLUMNS}
            getRowId={(row) => row.id}
            isLoading={isLoading}
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
                title="Nothing Maturing Yet"
                description={
                  days == null
                    ? "No fixed deposits are scheduled to mature."
                    : `No fixed deposits fall due in the next ${days} days.`
                }
              />
            }
          />
        </div>
      </Panel>
    </div>
  );
}
