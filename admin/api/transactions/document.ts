import {
  COUNTERPARTY_FIELDS,
  ERROR_FRAGMENT,
  PAGINATION_FIELDS,
  TRANSACTION_DETAIL_FIELDS,
  TRANSACTION_FIELDS,
} from "@/api/fragments";

export const ADMIN_TRANSACTION_OVERVIEW_QUERY = `
query AdminTransactionOverview($input: AdminDateRangeInput) {
  adminTransactionOverview(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminTransactionOverview {
      message
      data {
        currency
        total_transaction_volume
        total_deposits
        total_deposits_change_pct_vs_previous_period
        total_withdrawals
        total_withdrawals_change_pct_vs_previous_period
        net_flow
        average_daily_transaction_volume
        today_transaction_volume
      }
    }
  }
}
`;

export const TRANSACTION_RECEIPT_QUERY = `
query TransactionReceipt($input: TransactionFilterInput!) {
  transactionReceipt(input: $input) {
    ${ERROR_FRAGMENT}
    ... on Response {
      message
      url
    }
  }
}
`;

export const TRANSACTIONS_QUERY = `
query Transactions($input: TransactionFilterInput!) {
  transactions(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithTransactions {
      message
      data {
        ${TRANSACTION_FIELDS}
        ${COUNTERPARTY_FIELDS}
      }
      ${PAGINATION_FIELDS}
    }
  }
}
`;

export const TRANSACTION_QUERY = `
query Transaction($input: TransactionFilterInput!) {
  transaction(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithTransaction {
      message
      data {
        ${TRANSACTION_DETAIL_FIELDS}
      }
    }
  }
}
`;

export const ADMIN_SETTLE_TRANSACTION_MUTATION = `
mutation AdminSettleTransaction($input: AdminSettleTransactionInput!) {
  adminSettleTransaction(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithTransaction {
      message
      data {
        ${TRANSACTION_DETAIL_FIELDS}
      }
    }
  }
}
`;
