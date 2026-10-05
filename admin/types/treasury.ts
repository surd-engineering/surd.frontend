import type {
  CapitalTransactionType,
  ChallengeMethod,
  Currency,
} from "@/types/enum";

export const CAPITAL_DESCRIPTION_LIMIT = 256;

export interface CapitalTransactionChallenge {
  challenge_id: string;

  expires_at: string;
  type: CapitalTransactionType | string;
  currency: Currency;
  amount: number;

  method: ChallengeMethod;
}

export interface AdminInitiateCapitalOutflowInput {
  amount: number;

  currency: Currency;

  reason: string;
  description?: string;
}

export interface AdminInitiateCapitalRefundInput {
  amount: number;
  currency: Currency;
  description?: string;
}

export interface AdminConfirmCapitalTransactionInput {
  challenge_id: string;
  code: string;
}
