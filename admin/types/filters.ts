import type {
  BreakdownMode,
  Currency,
  Granularity,
  KycStatus,
  SortDirection,
  UserStatus,
} from "@/types/enum";

export interface DateRange {
  start_date?: string;
  end_date?: string;
}

export interface PageRequest {
  page?: number;
  limit?: number;
  sort?: SortDirection;
}

export interface AdminCurrencyInput {
  currency?: Currency;
}

export interface AdminDateRangeInput extends DateRange {
  currency?: Currency;
}

export interface AdminSeriesInput extends DateRange {
  currency?: Currency;

  granularity?: Granularity;
}

export interface AdminBreakdownInput extends DateRange {
  mode?: BreakdownMode;

  currency?: Currency;
}

export interface AdminUsersFilterInput extends PageRequest {
  search?: string;
  status?: UserStatus;

  tier?: string;

  balance_currency?: Currency;

  min_balance?: number;
  max_balance?: number;

  joined_after?: string;

  joined_before?: string;
  include_internal?: boolean;
  paginate?: boolean;
}

export type AdminUsersOverviewInput = DateRange;

export interface AdminKycFilterInput extends PageRequest {
  search?: string;
  status?: KycStatus;
  user_id?: string;
  email?: string;

  pending_review_only?: boolean;

  stuck_only?: boolean;

  sla_hours?: number;
  include_internal?: boolean;
  paginate?: boolean;
}

export interface AdminKycOverviewInput {
  sla_hours?: number;
  include_internal?: boolean;
}

export interface AdminKycUserInput {
  user_id?: string;
  kyc_id?: string;
}

export interface AdminUserSessionsInput extends PageRequest {
  user_id: string;
  active_only?: boolean;
}

export interface AdminUserInput {
  user_id?: string;
  id?: string;
  email?: string;
}

export interface FaqFilterInput extends PageRequest {
  search?: string;
  category?: string;
  status?: string;
}

export interface TargetPlanTemplateFilterInput extends PageRequest {
  search?: string;
  status?: string;
  currency?: Currency;
}
