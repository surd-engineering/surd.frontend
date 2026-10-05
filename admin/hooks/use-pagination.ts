"use client";

import { useMemo, useState } from "react";

export const DEFAULT_PAGE_SIZE = 5;

export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

export type PaginationState = {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;

  range: [number, number];

  pageNumbers: number[];
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  next: () => void;
  previous: () => void;
  canPrevious: boolean;
  canNext: boolean;
};

export function usePagination({
  totalItems,
  initialPageSize = DEFAULT_PAGE_SIZE,
  siblings = 1,
}: {
  totalItems: number;
  initialPageSize?: number;

  siblings?: number;
}): PaginationState {
  const [page, setPageState] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);

  const setPage = (next: number) =>
    setPageState(Math.max(1, Math.min(next, totalPages)));

  const setPageSize = (size: number) => {
    setPageSizeState(size);
    setPageState(1);
  };

  const pageNumbers = useMemo(
    () => buildPageNumbers(safePage, totalPages, siblings),
    [safePage, totalPages, siblings],
  );

  return {
    page: safePage,
    pageSize,
    totalPages,
    totalItems,
    range: [(safePage - 1) * pageSize, safePage * pageSize],
    pageNumbers,
    setPage,
    setPageSize,
    next: () => setPage(safePage + 1),
    previous: () => setPage(safePage - 1),
    canPrevious: safePage > 1,
    canNext: safePage < totalPages,
  };
}

export const PAGE_ELLIPSIS = -1;

function buildPageNumbers(
  page: number,
  totalPages: number,
  siblings: number,
): number[] {
  const maxVisible = siblings * 2 + 5;
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const left = Math.max(page - siblings, 1);
  const right = Math.min(page + siblings, totalPages);
  const showLeftGap = left > 3;
  const showRightGap = right < totalPages - 2;

  if (!showLeftGap && showRightGap) {
    const head = Array.from(
      { length: 3 + siblings * 2 },
      (_, index) => index + 1,
    );
    return [...head, PAGE_ELLIPSIS, totalPages - 1, totalPages];
  }

  if (showLeftGap && !showRightGap) {
    const tailLength = 3 + siblings * 2;
    const tail = Array.from(
      { length: tailLength },
      (_, index) => totalPages - tailLength + index + 1,
    );
    return [1, PAGE_ELLIPSIS, ...tail];
  }

  const middle = Array.from(
    { length: right - left + 1 },
    (_, index) => left + index,
  );
  return [1, PAGE_ELLIPSIS, ...middle, PAGE_ELLIPSIS, totalPages];
}

export function useTablePage(initialPageSize: number = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(1);
  const [pageSize, setSize] = useState(initialPageSize);

  const setPageSize = (size: number) => {
    setSize(size);
    setPage(1);
  };

  return { page, setPage, pageSize, setPageSize };
}
