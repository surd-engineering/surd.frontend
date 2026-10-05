import type {
  Currency,
  KycStatus,
  UserStatus,
  UserTier,
} from "@/types/enum";
import type { Kyc } from "@/types/kyc";

export interface AdminUserSummary {
  id: string;
  firstname: string | null;
  middlename: string | null;
  lastname: string | null;
  fullname: string | null;
  email: string;
  avatar: string | null;
  status: UserStatus;
  tier: UserTier | null;
  kyc_level: string | null;
  total_balance_ngn: number;
  total_balance_usd: number;
  fixed_deposits_ngn: number;
  fixed_deposits_usd: number;
  target_savings_ngn: number;
  target_savings_usd: number;
  joined_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  state: string | null;
  city: string | null;
  house_number: string | null;
  address_meta: string | null;
  street: string | null;
  zip: string | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface SecuritySetting {
  id: string;
  user_id: string;
  appearance_mode: string | null;
  push_enabled: boolean;
  email_enabled: boolean;
  biometric_enabled: boolean;
  private_mode: boolean;
  allow_screenshot: boolean;
  context_menu: boolean;
  sms_alert: boolean;
  two_factor_enabled: boolean;
  two_factor_channel: string | null;
  authenticator_configured: boolean;
  authenticator_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Device {
  device_id: string;
  device_name: string | null;
  device_token: string | null;
  app_version: string | null;
  timezone: string | null;
  datetime: string | null;
}

export interface User {
  id: string;
  firstname: string | null;
  middlename: string | null;
  lastname: string | null;
  email: string;
  phone: string | null;
  phone_code: string | null;
  gender: string | null;
  country: string | null;
  username: string | null;
  language: string | null;
  tier: UserTier | null;
  dob: string | null;

  passcode: boolean;
  pin_set: boolean;
  referral: string | null;
  avatar: string | null;

  internal: boolean;
  role: string | null;
  status: UserStatus;

  is_hni?: boolean;
  address?: Address | null;
  security_setting?: SecuritySetting | null;
  kyc?: Kyc | null;
  device?: Device | null;
  created_at: string;
  updated_at: string;
}

export interface AdminUpdateUserStatusInput {
  user_id: string;
  status: UserStatus;

  reason?: string;
}

export interface AdminUsersOverview {
  total_users: number;
  total_users_change_pct_vs_last_month: number | null;
  active_users: number;
  active_users_change_pct_vs_last_month: number | null;
  closed_accounts: number;
  closed_accounts_change_pct_vs_last_month: number | null;
  hnis: number;
  hnis_change_pct_vs_yesterday: number | null;
  suspended_users: number;
  frozen_users: number;
}

export interface AdminUserBalance {
  currency: Currency;
  active_plans: number;

  completed_plans: number;
  target_savings: number;
  fixed_deposits: number;
  flexi_balance: number;
  roi_earned: number;
  total_withdrawals: number;
}

export interface AdminUserOverview {
  user_id: string;
  balances: AdminUserBalance[];
}

export interface UserSession {
  id: string;
  user_id: string;
  device_name: string | null;
  ip_address: string | null;
  location: string | null;
  active: boolean;
  created_at: string;
  last_seen_at: string | null;
}

export interface AdminCloseUserAccountInput {
  user_id: string;

  reason?: string;
}

export type UserBalances = Record<Currency, number>;

export type { KycStatus };
export type {
  AdminUserInput,
  AdminUserSessionsInput,
} from "@/types/filters";
