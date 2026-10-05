"use client";

import { createQuery } from "@/api/factory";
import {
  ADMIN_FUNDS_BREAKDOWN_QUERY,
  ADMIN_OVERVIEW_METRICS_QUERY,
  ADMIN_SYSTEM_FUNDS_QUERY,
} from "@/api/dashboard/document";
import type {
  AdminBreakdownInput,
  AdminCurrencyInput,
  AdminSeriesInput,
} from "@/types/filters";
import type {
  AdminBreakdownGroup,
  AdminOverviewMetrics,
  AdminSystemFundsPoint,
} from "@/types/metrics";

export const useAdminOverviewMetrics = createQuery<
  AdminOverviewMetrics[],
  AdminCurrencyInput
>({
  resolver: "adminOverviewMetrics",
  document: ADMIN_OVERVIEW_METRICS_QUERY,
  scope: "metrics",
  staleTime: 30_000,
});

export const useAdminSystemFunds = createQuery<
  AdminSystemFundsPoint[],
  AdminSeriesInput
>({
  resolver: "adminSystemFunds",
  document: ADMIN_SYSTEM_FUNDS_QUERY,
  scope: "metrics",
  staleTime: 60_000,
});

export const useAdminFundsBreakdown = createQuery<
  AdminBreakdownGroup[],
  AdminBreakdownInput
>({
  resolver: "adminFundsBreakdown",
  document: ADMIN_FUNDS_BREAKDOWN_QUERY,
  scope: "metrics",
  staleTime: 60_000,
});
