"use client";

import { createMutation, createQuery } from "@/api/factory";
import {
  ADD_WALLET_MUTATION,
  ADMIN_WALLET_BALANCE_SERIES_QUERY,
  ADMIN_WALLET_OVERVIEW_QUERY,
  WALLETS_QUERY,
} from "@/api/wallet/document";
import type { AdminDateRangeInput, AdminSeriesInput } from "@/types/filters";
import type {
  AdminWalletBalancePoint,
  AdminWalletOverview,
} from "@/types/metrics";
import type { Wallet, WalletFilter, WalletInput } from "@/types/wallet";

export const useAdminWalletOverview = createQuery<
  AdminWalletOverview[],
  AdminDateRangeInput
>({
  resolver: "adminWalletOverview",
  document: ADMIN_WALLET_OVERVIEW_QUERY,
  scope: "wallets",
  staleTime: 30_000,
});

export const useAdminWalletBalanceSeries = createQuery<AdminWalletBalancePoint[], AdminSeriesInput>({
  resolver: "adminWalletBalanceSeries",
  document: ADMIN_WALLET_BALANCE_SERIES_QUERY,
  scope: "wallets",
  staleTime: 60_000,
});

export const useWallets = createQuery<Wallet[], WalletFilter>({
  resolver: "wallets",
  document: WALLETS_QUERY,
  scope: "wallets",
  paginated: true,
});

export const useAddWallet = createMutation<Wallet, WalletInput>({
  resolver: "addWallet",
  document: ADD_WALLET_MUTATION,
  success: "Wallet created.",
  invalidates: ["wallets", "metrics"],
});
