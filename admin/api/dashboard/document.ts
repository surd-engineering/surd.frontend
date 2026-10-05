import { ERROR_FRAGMENT } from "@/api/fragments";

export const ADMIN_OVERVIEW_METRICS_QUERY = `
query AdminOverviewMetrics($input: AdminCurrencyInput) {
  adminOverviewMetrics(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminOverviewMetrics {
      message
      data {
        currency
        total_funds
        total_funds_change_pct_vs_last_month
        total_flexi_balance
        total_flexi_balance_change_pct_vs_yesterday
        total_savings_balance
        total_savings_balance_change_pct_vs_last_month
        total_roi_liability
        total_roi_liability_change_today
        pending_withdrawals
        pending_withdrawals_count
        daily_deposits
        daily_deposits_change_pct_vs_yesterday
        daily_withdrawals
        daily_withdrawals_change_pct_vs_yesterday
        net_capital_position
        net_capital_position_status
        liquidity_ratio
        liquidity_status
        safe_deployable_capital
        locked_savings_principal
        total_capital_outflow
        capital_outflow_health_balance
      }
    }
  }
}
`;

export const ADMIN_SYSTEM_FUNDS_QUERY = `
query AdminSystemFunds($input: AdminSeriesInput) {
  adminSystemFunds(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminSystemFunds {
      message
      data {
        date
        flexi_balance
        savings_balance
        roi_liability
      }
    }
  }
}
`;

export const ADMIN_FUNDS_BREAKDOWN_QUERY = `
query AdminFundsBreakdown($input: AdminBreakdownInput!) {
  adminFundsBreakdown(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminBreakdownGroups {
      message
      data {
        mode
        items {
          key
          label
          amount
          native_amount
        }
      }
    }
  }
}
`;
