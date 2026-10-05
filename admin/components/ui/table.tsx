"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import { Dropdown } from "@/components/ui/dropdown";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import {
  DEFAULT_PAGE_SIZE,
  PAGE_ELLIPSIS,
  PAGE_SIZE_OPTIONS,
  usePagination,
} from "@/hooks/use-pagination";
import { cn } from "@/lib/cn";

export type Column<T> = {
  id: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";

  className?: string;

  width?: string;
};

export type ServerPagination = {
  mode: "server";
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  getRowId: (row: T) => string;

  pagination?: false | ServerPagination;
  initialPageSize?: number;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;

  emptyState?: React.ReactNode;

  minWidth?: string;
  className?: string;
};

const alignments = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const;

export function DataTable<T>({
  data,
  columns,
  getRowId,
  pagination,
  initialPageSize = DEFAULT_PAGE_SIZE,
  onRowClick,
  isLoading = false,
  emptyState,
  minWidth = "min-w-3xl",
  className,
}: DataTableProps<T>) {
  const isServer = typeof pagination === "object";
  const isPaged = pagination !== false;

  const client = usePagination({
    totalItems: isServer ? 0 : data.length,
    initialPageSize,
  });

  const rows = useMemo(() => {
    if (!isPaged || isServer) return data;
    return data.slice(client.range[0], client.range[1]);
  }, [data, isPaged, isServer, client.range]);

  const scroller = useRef<HTMLDivElement>(null);
  const scroll = useHorizontalScroll(scroller, rows.length);

  if (isLoading) {
    return (
      <div className="grid place-items-center py-20">
        <Spinner size={28} className="text-primary" />
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className={cn("flex flex-col", className)}>

      <div ref={scroller} className="overflow-x-auto">
        <table className={cn("w-full border-collapse text-sm", minWidth)}>
          <thead>
            <tr className="border-b border-grey-50">
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={cn(
                    "px-3 py-3 text-sm font-medium whitespace-nowrap text-grey-400",
                    alignments[column.align ?? "left"],
                    column.width,
                    column.className,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={getRowId(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  "border-b border-grey-50 last:border-b-0",
                  onRowClick && "cursor-pointer transition-colors hover:bg-grey-25",
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cn(
                      "px-3 py-4 align-middle text-grey-900",
                      alignments[column.align ?? "left"],
                      column.className,
                    )}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {scroll.scrollable ? (
        <div
          aria-hidden
          className="mx-auto mt-4 h-1 w-64 overflow-hidden rounded-full bg-grey-50"
        >
          <div
            className="h-full rounded-full bg-primary transition-[margin] duration-75"
            style={{
              width: `${scroll.ratio * 100}%`,
              marginLeft: `${scroll.offset * (100 - scroll.ratio * 100)}%`,
            }}
          />
        </div>
      ) : null}

      {isPaged ? (
        <Pagination
          page={isServer ? pagination.page : client.page}
          pageSize={isServer ? pagination.pageSize : client.pageSize}
          totalItems={isServer ? pagination.totalItems : data.length}
          onPageChange={isServer ? pagination.onPageChange : client.setPage}
          onPageSizeChange={
            isServer ? pagination.onPageSizeChange : client.setPageSize
          }
        />
      ) : null}
    </div>
  );
}

function useHorizontalScroll(
  ref: React.RefObject<HTMLDivElement | null>,
  rowCount: number,
) {
  const [scroll, setScroll] = useState({ ratio: 1, offset: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = element;
      const overflow = scrollWidth - clientWidth;

      setScroll({
        ratio: scrollWidth > 0 ? Math.min(1, clientWidth / scrollWidth) : 1,
        offset: overflow > 0 ? scrollLeft / overflow : 0,
      });
    };

    update();
    element.addEventListener("scroll", update, { passive: true });

    const observer = new ResizeObserver(update);
    observer.observe(element);

    return () => {
      element.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [ref, rowCount]);

  return { ...scroll, scrollable: scroll.ratio < 0.999 };
}

type PaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
};

export function Pagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const numbers = useMemo(
    () => buildPageNumbers(page, totalPages),
    [page, totalPages],
  );

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col items-center gap-4 pt-6 sm:flex-row sm:justify-center">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={arrowClass}
      >
        <Icon icon={ArrowLeft02Icon} size={18} />
      </button>

      {onPageSizeChange ? (
        <div className="flex items-center gap-2 text-sm text-grey-500">
          <span>Showing</span>
          <Dropdown
            options={PAGE_SIZE_OPTIONS.map((size) => ({
              value: String(size),
              label: String(size),
            }))}
            value={String(pageSize)}
            onChange={(next) => onPageSizeChange(Number(next))}
            className="h-9 px-3"
          />
          <span className="font-semibold text-grey-900">per page</span>
        </div>
      ) : null}

      <ul className="flex items-center gap-2">
        {numbers.map((number, index) =>
          number === PAGE_ELLIPSIS ? (
            <li key={`gap-${index}`} className="px-1 text-grey-400">
              &hellip;
            </li>
          ) : (
            <li key={number}>
              <button
                type="button"
                onClick={() => onPageChange(number)}
                aria-current={number === page ? "page" : undefined}
                className={cn(
                  "grid size-9 place-items-center rounded-full text-sm font-semibold transition-colors",
                  number === page
                    ? "bg-primary text-white"
                    : "border border-grey-100 text-grey-900 hover:bg-grey-25",
                )}
              >
                {number}
              </button>
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={cn(arrowClass, "bg-surd-blue-50 text-primary")}
      >
        <Icon icon={ArrowRight02Icon} size={18} />
      </button>
    </div>
  );
}

const arrowClass = cn(
  "grid size-9 shrink-0 place-items-center rounded-full bg-grey-25 text-grey-500",
  "transition-colors hover:bg-grey-50 hover:text-grey-900",
  "disabled:pointer-events-none disabled:opacity-40",
);

function buildPageNumbers(page: number, totalPages: number): number[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  if (page <= 3) {
    return [1, 2, 3, PAGE_ELLIPSIS, totalPages - 1, totalPages];
  }
  if (page >= totalPages - 2) {
    return [1, 2, PAGE_ELLIPSIS, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, PAGE_ELLIPSIS, page - 1, page, page + 1, PAGE_ELLIPSIS, totalPages];
}
