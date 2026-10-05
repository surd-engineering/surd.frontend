import type { User } from "@/types/user";

export interface AdminLoginInput {
  email: string;
}

export interface AdminLoginChallenge {
  resend_after_seconds: number;
  expires_at: string;
}

export interface AdminVerifyLoginInput {
  email: string;

  code: string;

  device_id: string;
  device_name: string;

  timezone: string;
  datetime: string;
}

export type Session = User;

export const SESSION_STATES = [
  "loading",
  "authenticated",
  "unauthenticated",
] as const;
export type SessionState = (typeof SESSION_STATES)[number];
