import type {
  CancellationReason,
  Currency,
  RoiActivityType,
  SavingsTemplate,
  SortDirection,
  TransactionCategory,
  TransactionDirection,
  TransactionStatus,
  TransactionType,
} from "@/types/enum";
import type { Rate } from "@/types/rate";
import type { User } from "@/types/user";

export interface TransactionHistoryEntry {
  act: string;
  by: string;
  at: string;
}

export interface TransactionInvoice {
  key: string | null;
  name: string | null;
  number: string | null;
  amount: number | null;
  fees: number | null;
  bank: string | null;
  metadata: string | null;
}

export interface TransactionFlow {
  source: string;
  destination: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  savings_id: string | null;
  wallet_id: string | null;

  type: TransactionType | string;

  category: TransactionCategory;
  reference: string;
  currency: Currency;
  source_currency: Currency | null;
  gateway: string | null;
  method: string | null;
  status: TransactionStatus;
  completed_at: string | null;
  failed_at: string | null;
  cancelled_at: string | null;

  checksum: string | null;
  payment_link: string | null;
  initial_config: string | null;
  final_config: string | null;
  metadata: string | null;
  savings_amount: number | null;
  source_amount: number | null;
  amount: number;
  fees: number;

  total: number;

  roi_clawback_amount: number;

  savings_template: SavingsTemplate | null;

  roi_activity_type: RoiActivityType | null;
  pre_balance: number | null;
  post_balance: number | null;
  remark: string | null;
  direction: TransactionDirection | null;
  settlement_reason: string | null;
  settlement_due_at: string | null;
  settlement_policy_version: string | null;
  parent_transaction_id: string | null;
  cycle_reference: string | null;

  flow?: TransactionFlow | null;
  history?: TransactionHistoryEntry[] | null;
  invoice?: TransactionInvoice | null;
  rate?: Rate | null;
  user?: Pick<
    User,
    "id" | "firstname" | "lastname" | "email" | "avatar" | "status"
  > | null;
  created_at: string;
  updated_at: string;
}

export interface TransactionFilterInput {
  transaction_id?: string;
  reference?: string;
  user_id?: string;
  savings_id?: string;
  wallet_id?: string;
  status?: TransactionStatus;

  category?: TransactionCategory;
  type?: TransactionType | string;
  types?: (TransactionType | string)[];
  statuses?: TransactionStatus[];
  direction?: TransactionDirection;
  currency?: Currency;

  search?: string;
  min_amount?: number;
  max_amount?: number;
  method?: string;

  roi_activity?: boolean;
  roi_withdrawal?: boolean;
  capital_transaction?: boolean;
  sort?: SortDirection;
  sort_by?: string;

  pending_approval?: boolean;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
  paginate?: boolean;
}

export interface AdminSettleTransactionInput {
  transaction_id: string;

  status: TransactionStatus;

  reason?: CancellationReason;

  note?: string;
}
