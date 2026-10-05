"use client";

import { createMutation, createQuery } from "@/api/factory";
import {
  ADMIN_CONFIRM_CAPITAL_OUTFLOW_MUTATION,
  ADMIN_CONFIRM_CAPITAL_REFUND_MUTATION,
  ADMIN_INITIATE_CAPITAL_OUTFLOW_MUTATION,
  ADMIN_INITIATE_CAPITAL_REFUND_MUTATION,
  ADMIN_TREASURY_OVERVIEW_QUERY,
  ADMIN_TREASURY_SERIES_QUERY,
} from "@/api/treasury/document";
import type { AdminCurrencyInput, AdminSeriesInput } from "@/types/filters";
import type {
  AdminTreasuryOverview,
  AdminTreasuryPoint,
} from "@/types/metrics";
import type {
  AdminConfirmCapitalTransactionInput,
  AdminInitiateCapitalRefundInput,
  AdminInitiateCapitalOutflowInput,
  CapitalTransactionChallenge,
} from "@/types/treasury";
import type { Transaction } from "@/types/transaction";

export const useAdminTreasuryOverview = createQuery<
  AdminTreasuryOverview[],
  AdminCurrencyInput
>({
  resolver: "adminTreasuryOverview",
  document: ADMIN_TREASURY_OVERVIEW_QUERY,
  scope: "treasury",
});

export const useAdminTreasurySeries = createQuery<
  AdminTreasuryPoint[],
  AdminSeriesInput
>({
  resolver: "adminTreasurySeries",
  document: ADMIN_TREASURY_SERIES_QUERY,
  scope: "treasury",
  staleTime: 60_000,
});

export const useInitiateCapitalOutflow = createMutation<
  CapitalTransactionChallenge,
  AdminInitiateCapitalOutflowInput
>({
  resolver: "adminInitiateCapitalOutflow",
  document: ADMIN_INITIATE_CAPITAL_OUTFLOW_MUTATION,
  success: false,
});

export const useConfirmCapitalOutflow = createMutation<
  Transaction,
  AdminConfirmCapitalTransactionInput
>({
  resolver: "adminConfirmCapitalOutflow",
  document: ADMIN_CONFIRM_CAPITAL_OUTFLOW_MUTATION,
  success: "Capital outflow confirmed.",
  invalidates: ["treasury", "transactions", "wallets", "metrics"],
});

export const useInitiateCapitalRefund = createMutation<
  CapitalTransactionChallenge,
  AdminInitiateCapitalRefundInput
>({
  resolver: "adminInitiateCapitalRefund",
  document: ADMIN_INITIATE_CAPITAL_REFUND_MUTATION,
  success: false,
});

export const useConfirmCapitalRefund = createMutation<
  Transaction,
  AdminConfirmCapitalTransactionInput
>({
  resolver: "adminConfirmCapitalRefund",
  document: ADMIN_CONFIRM_CAPITAL_REFUND_MUTATION,
  success: "Capital refund confirmed.",
  invalidates: ["treasury", "transactions", "wallets", "metrics"],
});
