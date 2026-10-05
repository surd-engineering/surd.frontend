"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { User02Icon } from "@hugeicons/core-free-icons";
import { useAdminLogin } from "@/api/auth/auth";
import { Alert } from "@/components/ui/alert";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_AUTHENTICATED_ROUTE, ROUTES } from "@/constants/routes";
import { useSession } from "@/contexts/session";
import { useNavigate } from "@/hooks/use-navigate";
import { Form } from "minimalist-reactkit";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const params = useSearchParams();
  const router = useNavigate();
  const { state } = useSession();

  const [email, setEmail] = useState("");

  const next = params.get("next");

  const login = useAdminLogin({
    silent: true,
    onSuccess: (response) => {
      const query = new URLSearchParams({ email });
      if (next) query.set("next", next);
      if (response.data) {
        query.set("resend", String(response.data.resend_after_seconds));
      }
      router.push(`${ROUTES.verifyEmail}?${query.toString()}`);
    },
  });

  console.log(login);

  useEffect(() => {
    if (state === "authenticated") router.replace(DEFAULT_AUTHENTICATED_ROUTE);
  }, [state, router]);

  const busy = login.isPending || router.isNavigating;

  const submit = () => {
    if (busy) return;
    login.mutate({ email: email.trim().toLowerCase() });
  };

  return (
    <Form onSubmit={submit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-heading-xs font-semibold text-grey-900">Welcome back</h1>
        <p className="text-md text-grey-500 font-medium">Log in to your admin account.</p>
      </div>

        <Input
          label="Email address"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="example@gmail.com"
          leftIcon={<Icon icon={User02Icon} size={22} className="text-grey-300" />}
          value={email}
          required
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />

        {login.isError ? (
          <Alert tone="warning" title="We couldn't sign you in.">
            {login.error.message}
          </Alert>
        ) : null}

        <Button
          type="submit"
          tone="primary"
          size="xxl"
          shape="pill"
          block
          disabled={busy || email.length < 10}
          loading={busy}
          className="mt-5"
        >
          Login
        </Button>

    </Form>
  );
}

function LoginSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6">
      <div className="h-8 w-3/4 rounded bg-grey-50" />
      <div className="h-5 w-full rounded bg-grey-50" />
      <div className="h-12 w-full rounded-xl bg-grey-50" />
      <div className="h-12 w-full rounded-full bg-grey-50" />
    </div>
  );
}
