import {
  ADMIN_USER_SUMMARY_FIELDS,
  ERROR_FRAGMENT,
  PAGINATION_FIELDS,
  USER_FIELDS,
  USER_SESSION_FIELDS,
} from "@/api/fragments";

export const ADMIN_USERS_QUERY = `
query AdminUsers($input: AdminUsersFilterInput) {
  adminUsers(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminUsers {
      message
      data {
        ${ADMIN_USER_SUMMARY_FIELDS}
      }
      ${PAGINATION_FIELDS}
    }
  }
}
`;

export const ADMIN_USER_QUERY = `
query AdminUser($input: AdminUserInput!) {
  adminUser(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithUser {
      message
      data {
        ${USER_FIELDS}
        is_hni
        address {
          id
          user_id
          state
          city
          house_number
          street
          zip
          verified
        }
      }
    }
  }
}
`;

export const ADMIN_USER_OVERVIEW_QUERY = `
query AdminUserOverview($input: AdminUserInput!) {
  adminUserOverview(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminUserOverview {
      message
      data {
        user_id
        balances {
          currency
          active_plans
          completed_plans
          target_savings
          fixed_deposits
          flexi_balance
          roi_earned
          total_withdrawals
        }
      }
    }
  }
}
`;

export const ADMIN_USER_SESSIONS_QUERY = `
query AdminUserSessions($input: AdminUserSessionsInput!) {
  adminUserSessions(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithUserSessions {
      message
      data {
        ${USER_SESSION_FIELDS}
      }
      ${PAGINATION_FIELDS}
    }
  }
}
`;

export const ADMIN_USERS_OVERVIEW_QUERY = `
query AdminUsersOverview($input: AdminUsersOverviewInput) {
  adminUsersOverview(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminUsersOverview {
      message
      data {
        total_users
        total_users_change_pct_vs_last_month
        active_users
        active_users_change_pct_vs_last_month
        closed_accounts
        closed_accounts_change_pct_vs_last_month
        hnis
        hnis_change_pct_vs_yesterday
        suspended_users
        frozen_users
      }
    }
  }
}
`;

export const ADMIN_UPDATE_USER_STATUS_MUTATION = `
mutation AdminUpdateUserStatus($input: AdminUpdateUserStatusInput!) {
  adminUpdateUserStatus(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithUser {
      message
      data {
        ${USER_FIELDS}
      }
    }
  }
}
`;

export const ADMIN_CLOSE_USER_ACCOUNT_MUTATION = `
mutation AdminCloseUserAccount($input: AdminCloseUserAccountInput!) {
  adminCloseUserAccount(input: $input) {
    ${ERROR_FRAGMENT}
    ... on Respond {
      message
    }
  }
}
`;
