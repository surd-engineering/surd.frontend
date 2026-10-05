"use client";

import { createMutation, createQuery } from "@/api/factory";
import {
  ADMIN_CLOSE_USER_ACCOUNT_MUTATION,
  ADMIN_UPDATE_USER_STATUS_MUTATION,
  ADMIN_USER_OVERVIEW_QUERY,
  ADMIN_USER_QUERY,
  ADMIN_USER_SESSIONS_QUERY,
  ADMIN_USERS_OVERVIEW_QUERY,
  ADMIN_USERS_QUERY,
} from "@/api/users/document";
import type {
  AdminUserInput,
  AdminUsersFilterInput,
  AdminUsersOverviewInput,
  AdminUserSessionsInput,
} from "@/types/filters";
import type {
  AdminCloseUserAccountInput,
  AdminUpdateUserStatusInput,
  AdminUserOverview,
  AdminUsersOverview,
  AdminUserSummary,
  User,
  UserSession,
} from "@/types/user";

export const useAdminUsers = createQuery<AdminUserSummary[], AdminUsersFilterInput>({
  resolver: "adminUsers",
  document: ADMIN_USERS_QUERY,
  scope: "users",
  paginated: true,
});

export const useAdminUsersOverview = createQuery<
  AdminUsersOverview,
  AdminUsersOverviewInput
>({
  resolver: "adminUsersOverview",
  document: ADMIN_USERS_OVERVIEW_QUERY,
  scope: "users",
});

export const useAdminUser = createQuery<User, AdminUserInput>({
  resolver: "adminUser",
  document: ADMIN_USER_QUERY,
  scope: "users",
  key: (input) => ["detail", input?.user_id ?? input?.id ?? input?.email],
  enabled: (input) => Boolean(input?.user_id || input?.id || input?.email),
});

export const useAdminUserOverview = createQuery<AdminUserOverview, AdminUserInput>({
  resolver: "adminUserOverview",
  document: ADMIN_USER_OVERVIEW_QUERY,
  scope: "users",
  key: (input) => ["overview", input?.user_id ?? input?.id],
  enabled: (input) => Boolean(input?.user_id || input?.id),
});

export const useAdminUserSessions = createQuery<
  UserSession[],
  AdminUserSessionsInput
>({
  resolver: "adminUserSessions",
  document: ADMIN_USER_SESSIONS_QUERY,
  scope: "users",
  key: (input) => ["sessions", input?.user_id, input?.active_only],
  enabled: (input) => Boolean(input?.user_id),
  paginated: true,
});

export const useAdminUpdateUserStatus = createMutation<
  User,
  AdminUpdateUserStatusInput
>({
  resolver: "adminUpdateUserStatus",
  document: ADMIN_UPDATE_USER_STATUS_MUTATION,
  success: "Account status updated.",
  invalidates: ["users", "kyc", "metrics"],
});

export const useAdminCloseUserAccount = createMutation<
  never,
  AdminCloseUserAccountInput
>({
  resolver: "adminCloseUserAccount",
  document: ADMIN_CLOSE_USER_ACCOUNT_MUTATION,
  success: "Account closed.",
  invalidates: ["users", "kyc", "metrics", "audit"],
});
