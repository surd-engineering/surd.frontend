import type { Currency } from "@/types/enum";
import type { User } from "@/types/user";

export interface Rate {
  id: string;

  base: Currency | string;

  exchange: Currency | string;
  symbol: string | null;

  val: number;
  markup: number;

  quote: number;
  fee: number;
  fee_type: string | null;
  updated_by: string | null;

  user?: Pick<User, "id" | "firstname" | "lastname" | "email" | "avatar"> | null;
  created_at: string;

  updated_at: string;
}

export interface RateFilter {
  base?: string;
  exchange?: string;
  symbol?: string;
}

export interface RateInput {
  base: string;
  exchange: string;

  value: number;
  markup?: number;
  symbol?: string;
  quote?: number;
  fee?: number;
  fee_type?: string;
}
