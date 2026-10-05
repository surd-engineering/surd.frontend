"use client";

import { createMutation, createQuery } from "@/api/factory";
import {
  ADMIN_SETTLE_TRANSACTION_MUTATION,
  ADMIN_TRANSACTION_OVERVIEW_QUERY,
  TRANSACTION_QUERY,
  TRANSACTION_RECEIPT_QUERY,
  TRANSACTIONS_QUERY,
} from "@/api/transactions/document";
import type { AdminDateRangeInput } from "@/types/filters";
import type { AdminTransactionOverview } from "@/types/metrics";
import type {
  AdminSettleTransactionInput,
  Transaction,
  TransactionFilterInput,
} from "@/types/transaction";

export const useAdminTransactionOverview = createQuery<
  AdminTransactionOverview[],
  AdminDateRangeInput
>({
  resolver: "adminTransactionOverview",
  document: ADMIN_TRANSACTION_OVERVIEW_QUERY,
  scope: "transactions",
});

export const useTransactions = createQuery<Transaction[], TransactionFilterInput>({
  resolver: "transactions",
  document: TRANSACTIONS_QUERY,
  scope: "transactions",
  paginated: true,
});

export const useTransaction = createQuery<Transaction, TransactionFilterInput>({
  resolver: "transaction",
  document: TRANSACTION_QUERY,
  scope: "transactions",
  key: (input) => ["detail", input?.transaction_id ?? input?.reference],
  enabled: (input) => Boolean(input?.transaction_id || input?.reference),
});

export const useTransactionReceipt = createQuery<never, TransactionFilterInput>({
  resolver: "transactionReceipt",
  document: TRANSACTION_RECEIPT_QUERY,
  scope: "transactions",
  key: (input) => ["receipt", input?.transaction_id ?? input?.reference],
  enabled: (input) => Boolean(input?.transaction_id || input?.reference),
});

export const useAdminSettleTransaction = createMutation<
  Transaction,
  AdminSettleTransactionInput
>({
  resolver: "adminSettleTransaction",
  document: ADMIN_SETTLE_TRANSACTION_MUTATION,
  success: "Transaction settled.",
  invalidates: ["transactions", "wallets", "savings", "metrics", "treasury"],
});
