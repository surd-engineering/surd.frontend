"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { useAdminLogin, useAdminVerifyLogin } from "@/api/auth/auth";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";
import { DEFAULT_AUTHENTICATED_ROUTE, ROUTES } from "@/constants/routes";
import { useSession } from "@/contexts/session";
import { useNavigate } from "@/hooks/use-navigate";
import { deviceContext } from "@/lib/device";
import type { APIError } from "@/types/api";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifySkeleton />}>
      <VerifyEmailForm />
    </Suspense>
  );
}

const CODE_LENGTH = 6;

const RESEND_SECONDS = 119;

function VerifyEmailForm() {
  const params = useSearchParams();
  const router = useNavigate();
  const { signIn } = useSession();

  const email = params.get("email") ?? "";
  const next = params.get("next");

  const [code, setCode] = useState("");
  const [error, setError] = useState<APIError | null>(null);
  const resendParam = params.get("resend");
  const [secondsLeft, setSecondsLeft] = useState(
    resendParam === null ? RESEND_SECONDS : Math.max(0, Number(resendParam) || 0),
  );

  const verify = useAdminVerifyLogin({
    silent: true,
    onSuccess: (response) => {
      if (!response.data) {
        setError(null);
        return;
      }
      signIn(response.data);
      router.replace(next ?? DEFAULT_AUTHENTICATED_ROUTE);
    },
    onError: (failure) => {
      setError(failure);
      setCode("");
    },
  });

  const resend = useAdminLogin({
    silent: true,
    onSuccess: (response) =>
      setSecondsLeft(response.data?.resend_after_seconds ?? RESEND_SECONDS),
    onError: setError,
  });

  useEffect(() => {
    if (!email) router.replace(ROUTES.login);
  }, [email, router]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setInterval(
      () => setSecondsLeft((current) => current - 1),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  const busy = verify.isPending || router.isNavigating;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (code.length < CODE_LENGTH || busy) return;
    setError(null);
    verify.mutate({ email, code, ...deviceContext() });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <Button
        type="button"
        variant="outline"
        shape="pill"
        size="md"
        className="w-fit"
        leadingIcon={ArrowLeft02Icon}
        onClick={() => router.push(ROUTES.login)}
      >
        Back
      </Button>

      <div className="flex flex-col gap-6">
        <h1 className="text-heading-xs font-semibold text-grey-900">
          Verify your email address
        </h1>
        <p className="text-md text-grey-500 font-medium">
          Please enter the {CODE_LENGTH}-digit code sent to{" "}
          {email ? (
            <span className="font-semibold text-grey-900">{email}</span>
          ) : (
            "your email"
          )}
          .
        </p>
      </div>

      <OtpInput
        value={code}
        onChange={(nextCode) => {
          setCode(nextCode);
          if (error) setError(null);
        }}
        length={CODE_LENGTH}
        state={error ? "error" : "default"}
      />

      {error ? (
        <Alert tone="warning" title="That didn't work.">
          {error.message}
        </Alert>
      ) : null}

      {secondsLeft > 0 ? (
        <p className="text-sm text-grey-300">
          Resend code in {formatCountdown(secondsLeft)}
        </p>
      ) : (
        <button
          type="button"
          onClick={() => {
            setCode("");
            setError(null);
            resend.mutate({ email });
          }}
          disabled={resend.isPending}
          className="w-fit text-sm font-bold text-orange-500 outline-none hover:underline focus-visible:underline disabled:opacity-50"
        >
          {resend.isPending ? "Sending…" : "Resend code"}
        </button>
      )}

      <Button
        type="submit"
        tone="primary"
        size="xxl"
        shape="pill"
        block
        loading={busy}
        disabled={code.length < CODE_LENGTH || busy}
        className="mt-5"
      >
        Verify Code
      </Button>
    </form>
  );
}

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function VerifySkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6">
      <div className="h-9 w-24 rounded-full bg-grey-50" />
      <div className="h-8 w-3/4 rounded bg-grey-50" />
      <div className="h-5 w-full rounded bg-grey-50" />
      <div className="flex gap-3">
        {Array.from({ length: CODE_LENGTH }).map((_, index) => (
          <div key={index} className="size-12 rounded-xl bg-grey-50 sm:size-14" />
        ))}
      </div>
      <div className="h-12 w-full rounded-full bg-grey-50" />
    </div>
  );
}
