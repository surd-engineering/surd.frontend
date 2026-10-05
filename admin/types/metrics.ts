import type { BreakdownMode, Currency } from "@/types/enum";

export interface AdminOverviewMetrics {
  currency: Currency;
  total_funds: number;
  total_funds_change_pct_vs_last_month: number | null;
  total_flexi_balance: number;
  total_flexi_balance_change_pct_vs_yesterday: number | null;
  total_savings_balance: number;
  total_savings_balance_change_pct_vs_last_month: number | null;
  total_roi_liability: number;
  total_roi_liability_change_today: number;
  pending_withdrawals: number;
  pending_withdrawals_count: number;
  daily_deposits: number;
  daily_deposits_change_pct_vs_yesterday: number | null;
  daily_withdrawals: number;
  daily_withdrawals_change_pct_vs_yesterday: number | null;
  net_capital_position: number;
  net_capital_position_status: string;

  liquidity_ratio: number;
  liquidity_status: string;
  safe_deployable_capital: number;

  locked_savings_principal: number;
  total_capital_outflow: number;
  capital_outflow_health_balance: number;
}

export interface AdminSystemFundsPoint {
  date: string;
  flexi_balance: number;
  savings_balance: number;
  roi_liability: number;
}

export interface AdminBreakdownItem {
  key: string;
  label: string;

  amount: number;

  native_amount: number | null;
}

export interface AdminBreakdownGroup {
  mode: BreakdownMode;
  items: AdminBreakdownItem[];
}

export const SYSTEM_DONUT_KEYS = [
  "TOTAL_FLEXI_BALANCE",
  "TOTAL_FIXED_BALANCE",
  "TOTAL_TARGET_BALANCE",
  "TOTAL_ROI_LIABILITY",
  "PENDING_WITHDRAWALS",
  "TOTAL_CAPITAL_OUTFLOW",
] as const;

export interface AdminWalletOverview {
  currency: Currency;
  total_flexi_balance: number;
  total_flexi_balance_change_pct_vs_last_month: number | null;
  total_flexi_deposits: number;
  total_flexi_deposits_change_pct_vs_yesterday: number | null;
  total_flexi_withdrawals: number;
  total_flexi_withdrawals_change_pct_vs_yesterday: number | null;

  flexi_roi_liability: number;
  flexi_roi_liability_change_today: number;

  large_transaction_requests: number;
}

export interface AdminWalletBalancePoint {
  date: string;
  flexi_balance: number;
}

export interface AdminTransactionOverview {
  currency: Currency;
  total_transaction_volume: number;
  total_deposits: number;
  total_deposits_change_pct_vs_previous_period: number | null;
  total_withdrawals: number;
  total_withdrawals_change_pct_vs_previous_period: number | null;

  net_flow: number;
  average_daily_transaction_volume: number;

  today_transaction_volume: number;
}

export interface AdminSavingsOverview {
  currency: Currency;
  total_savings_balance: number;
  total_savings_balance_change_pct_vs_yesterday: number | null;
  total_fixed_deposit_balance: number;
  total_fixed_deposit_balance_change_pct_vs_last_month: number | null;
  total_target_savings_balance: number;
  total_target_savings_balance_change_pct_vs_last_month: number | null;

  total_locked_savings: number;
  total_locked_savings_change_pct_vs_last_month: number | null;

  average_plan_size: number;
  average_plan_size_change_pct_vs_yesterday: number | null;
  active_savings_plans_count: number;
  upcoming_maturities_30d_amount: number;
  upcoming_maturities_30d_count: number;
}

export interface AdminSavingsBalancePoint {
  date: string;
  total_savings_balance: number;
}

export interface AdminMaturityPoint {
  date: string;
  amount: number;
  count: number;
}

export interface AdminRoiOverview {
  currency: Currency;

  total_roi_liability: number;
  total_roi_liability_change_today: number;

  roi_generated_today: number | null;
  roi_generated_today_change_pct_vs_yesterday: number | null;
  roi_withdrawn_today: number;
  roi_withdrawn_today_change_pct_vs_yesterday: number | null;

  roi_clawed_back: number;
  roi_clawed_back_change_pct_vs_previous_period: number | null;
}

export interface AdminRoiFlowPoint {
  date: string;
  roi_generated: number;
  roi_withdrawn: number;
}

export interface AdminTreasuryOverview {
  currency: Currency;

  safe_deployable_capital: number;

  total_capital_outflow: number;
  total_capital_refund: number;

  net_capital_position: number;

  net_capital_position_change_today: number;

  liquidity_ratio: number | null;
  liquidity_status: string;

  treasury_exposure_pct: number | null;
  treasury_exposure_status: string;

  obligations: number;
  liquid_assets: number;
}

export interface AdminTreasuryPoint {
  date: string;
  safe_deployable_capital_pct: number;
  obligations_pct: number;
  liquidity_ratio: number | null;
}
