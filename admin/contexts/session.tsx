"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/api/auth/auth";
import {
  clearToken,
  hasToken,
  hydrate,
  touchSession,
  ABSOLUTE_SESSION_MS,
  IDLE_SESSION_MS,
  onSessionChange,
  type ExpiryReason,
} from "@/api/session-token";
import { toast } from "@/components/ui/toast";
import { useIdleTimer } from "@/hooks/use-idle-timer";
import { isAdminRole } from "@/types/permission";
import type { SessionState } from "@/types/auth";
import type { User } from "@/types/user";

type SessionContextValue = {
  state: SessionState;
  session: User | null;

  ready: boolean;

  isProfileLoading: boolean;

  endedBecause: ExpiryReason | null;

  idleMsLeft: number | null;
  signIn: (user: User) => void;
  signOut: () => void;

  extendSession: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used inside <SessionProvider>");
  }
  return context;
}

const CLOCK_CHECK_MS = 15_000;

const ENDED_MESSAGE: Record<Exclude<ExpiryReason, "signout">, string> = {
  unauthorized: "Your session is no longer valid. Please sign in again.",
  idle: `You were signed out after ${Math.round(
    IDLE_SESSION_MS / 60_000,
  )} minutes of inactivity.`,
  absolute: `You were signed out after ${Math.round(
    ABSOLUTE_SESSION_MS / 3_600_000,
  )} hours. Please sign in again.`,
};

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [endedBecause, setEndedBecause] = useState<ExpiryReason | null>(null);

  useEffect(() => {
    let cancelled = false;
    void hydrate().then((restored) => {
      if (cancelled) return;
      setAuthenticated(restored);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onSessionChange((reason) => {
      if (reason === null) return;
      setAuthenticated(false);
      setEndedBecause(reason);

      queryClient.clear();

      if (reason !== "signout") {
        toast({ tone: "warning", message: ENDED_MESSAGE[reason] });
      }
    });
    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  useEffect(() => {
    if (!authenticated) return;
    const timer = window.setInterval(() => {
      if (!hasToken()) setAuthenticated(false);
    }, CLOCK_CHECK_MS);
    return () => window.clearInterval(timer);
  }, [authenticated]);

  const idleMsLeft = useIdleTimer(authenticated);

  const { data: profile, isLoading } = useProfile(undefined, {
    enabled: ready && authenticated,
  });

  const user = profile?.data ?? null;

  useEffect(() => {
    if (user && !isAdminRole(user.role)) clearToken("unauthorized");
  }, [user]);

  const signIn = useCallback(
    (nextUser: User) => {
      setEndedBecause(null);
      setAuthenticated(true);

      queryClient.setQueryData(["session", "profile"], {
        message: "",
        data: nextUser,
      });
    },
    [queryClient],
  );

  const signOut = useCallback(() => clearToken("signout"), []);
  const extendSession = useCallback(() => touchSession(), []);

  const value = useMemo<SessionContextValue>(
    () => ({
      state: !ready
        ? "loading"
        : authenticated
          ? "authenticated"
          : "unauthenticated",
      session: user,
      ready,
      isProfileLoading: authenticated && isLoading,
      endedBecause,
      idleMsLeft,
      signIn,
      signOut,
      extendSession,
    }),
    [
      ready,
      authenticated,
      user,
      isLoading,
      endedBecause,
      idleMsLeft,
      signIn,
      signOut,
      extendSession,
    ],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export const IDLE_TIMEOUT_MINUTES = Math.round(IDLE_SESSION_MS / 60_000);

export default SessionProvider;
