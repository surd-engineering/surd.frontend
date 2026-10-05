import type { User } from "@/types/user";
import type { IdDocument, KycStatus } from "@/types/enum";

export interface NextOfKin {
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  address: string | null;
  phone: string | null;
  phone_code: string | null;
  relationship: string | null;
}

export interface Kyc {
  id: string;
  user_id: string;
  status: KycStatus;

  bvn: string | null;
  bvn_meta: string | null;
  nin: string | null;
  nin_meta: string | null;
  id_document: IdDocument | null;

  id_url: string | null;
  face_map: string | null;
  marital_status: string | null;
  next_of_kin?: NextOfKin | null;
  income_range: string | null;
  work_industry: string | null;
  created_at: string;
  updated_at: string;
}

export interface KycWithUser extends Kyc {
  user?: User | null;
}

export interface AdminKycOverview {
  pending_reviews: number;
  closed_accounts: number;

  stuck_reviews: number;
  rejected_reviews: number;
  suspended_accounts: number;
  frozen_accounts: number;
}

export type { AdminKycUserInput, AdminKycFilterInput } from "@/types/filters";

export interface AdminUpdateKycStatusInput {
  user_id?: string;
  kyc_id?: string;

  status: KycStatus;

  reason?: string;
}
