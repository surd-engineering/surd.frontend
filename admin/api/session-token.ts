"use client";

import { store } from "@/lib/secure";

const TOKEN_KEY = "surd.session.token";
const CLOCK_KEY = "surd.session.clock";

export const ABSOLUTE_SESSION_MS = 8 * 60 * 60 * 1000;

export const IDLE_SESSION_MS = 60 * 60 * 1000;

type SessionClock = { issuedAt: number; lastActiveAt: number };

let token: string | null = null;
let clock: SessionClock | null = null;
let hydrated = false;

const listeners = new Set<(reason: ExpiryReason | null) => void>();

export type ExpiryReason = "idle" | "absolute" | "unauthorized" | "signout";

export function onSessionChange(listener: (reason: ExpiryReason | null) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function announce(reason: ExpiryReason | null) {
  for (const listener of listeners) listener(reason);
}

export function getToken(): string | null {
  if (!token) return null;
  const reason = expiryReason();
  if (reason) {
    clearToken(reason);
    return null;
  }
  return token;
}

export function hasToken() {
  return getToken() !== null;
}

export function isHydrated() {
  return hydrated;
}

function expiryReason(): ExpiryReason | null {
  if (!clock) return null;
  const now = Date.now();
  if (now - clock.issuedAt > ABSOLUTE_SESSION_MS) return "absolute";
  if (now - clock.lastActiveAt > IDLE_SESSION_MS) return "idle";
  return null;
}

export function setToken(next: string, { rotate = false } = {}) {
  token = next;
  const now = Date.now();
  clock = {
    issuedAt: rotate && clock ? clock.issuedAt : now,
    lastActiveAt: now,
  };
  hydrated = true;

  void store.set(TOKEN_KEY, next);
  void store.set(CLOCK_KEY, clock);

  if (!rotate) announce(null);
}

export function touchSession() {
  if (!token || !clock) return;
  clock = { ...clock, lastActiveAt: Date.now() };
  void store.set(CLOCK_KEY, clock);
}

export function msUntilExpiry(): number {
  if (!token || !clock) return Number.POSITIVE_INFINITY;
  const now = Date.now();
  return Math.max(
    0,
    Math.min(
      clock.issuedAt + ABSOLUTE_SESSION_MS - now,
      clock.lastActiveAt + IDLE_SESSION_MS - now,
    ),
  );
}

export function clearToken(reason: ExpiryReason = "signout") {
  token = null;
  clock = null;
  hydrated = true;

  try {
    sessionStorage.clear();
  } catch {
  }

  announce(reason);
}

export async function hydrate(): Promise<boolean> {
  if (hydrated) return token !== null;

  try {
    const [storedToken, storedClock] = await Promise.all([
      store.get<string>(TOKEN_KEY),
      store.get<SessionClock>(CLOCK_KEY),
    ]);

    if (storedToken && storedClock) {
      token = storedToken;
      clock = storedClock;
      const reason = expiryReason();
      if (reason) {
        clearToken(reason);
        return false;
      }
    }
  } catch {
    token = null;
    clock = null;
  }

  hydrated = true;
  return token !== null;
}
