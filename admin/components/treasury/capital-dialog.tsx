"use client";

import { useState } from "react";
import {
  useConfirmCapitalOutflow,
  useConfirmCapitalRefund,
  useInitiateCapitalOutflow,
  useInitiateCapitalRefund,
} from "@/api";
import { MoneySafeIcon, SecurityLockIcon } from "@hugeicons/core-free-icons";
import { Dialog } from "@/components/ui/dialog";
import { Dropdown } from "@/components/ui/dropdown";
import { Field } from "@/components/ui/field";
import { Flag } from "@/components/ui/flag";
import { Input } from "@/components/ui/input";
import { OtpInput } from "@/components/ui/otp-input";
import type { useDisclosure } from "@/hooks/use-disclosure";

import { CURRENCIES } from "@/constants/currency";
import { Currency } from "@/types/enum";
import {
  CAPITAL_DESCRIPTION_LIMIT,
  type CapitalTransactionChallenge,
} from "@/types/treasury";

const OUTFLOW_REASONS = [
  { value: "EXTERNAL_INVESTMENT", label: "External investment" },
  { value: "PARTNER_ALLOCATION", label: "Partner Allocation" },
  { value: "PROJECT_FUNDING", label: "Project Funding" },
  { value: "INVESTOR_ALLOCATION", label: "Investor Allocation" },
  { value: "OTHER", label: "Other" },
];

const CURRENCY_OPTIONS = CURRENCIES.map((entry) => ({
  value: entry.value,
  label: entry.label,
  icon: <Flag code={entry.country} size="sm" />,
}));

const CONTROL = "h-14 rounded-xl border-transparent bg-grey-25 px-4 text-md font-medium";

export function CapitalDialog({
  control,
  kind,
  currency: initialCurrency,
}: {
  control: ReturnType<typeof useDisclosure<void>>;
  kind: "outflow" | "refund";
  currency: Currency;
}) {
  const [challenge, setChallenge] = useState<CapitalTransactionChallenge | null>(null);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>(initialCurrency);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");

  const [done, setDone] = useState(false);

  const isOutflow = kind === "outflow";

  const initiateOutflow = useInitiateCapitalOutflow({
    onSuccess: (response) => setChallenge(response.data ?? null),
  });
  const initiateRefund = useInitiateCapitalRefund({
    onSuccess: (response) => setChallenge(response.data ?? null),
  });
  const recorded = () => setDone(true);

  const confirmOutflow = useConfirmCapitalOutflow({ onSuccess: recorded });
  const confirmRefund = useConfirmCapitalRefund({ onSuccess: recorded });

  const initiate = isOutflow ? initiateOutflow : initiateRefund;
  const confirm = isOutflow ? confirmOutflow : confirmRefund;

  const parsed = Number(amount);
  const amountInvalid = !Number.isFinite(parsed) || parsed <= 0;
  const tooLong = description.length > CAPITAL_DESCRIPTION_LIMIT;

  const title = isOutflow ? "Add a Capital Outflow" : "Add a Capital Refund";

  if (done) {
    return (
      <Dialog
        control={control}
        tone="success"
        title={
          isOutflow
            ? "New Capital Outflow Record Added"
            : "New Capital Refund Record Added"
        }
        description={
          isOutflow
            ? "A new record for capital outflow has been successfully added and your treasury balances have been updated accordingly."
            : "A new record for capital refund has been successfully added and your treasury balances have been updated accordingly."
        }
        confirmLabel="Ok got it"
      />
    );
  }

  if (challenge) {
    return (
      <Dialog
        control={control}
        title="Authorize with 2FA"
        icon={SecurityLockIcon}
        confirmLabel="Authorize"
        confirmDisabled={code.length < 6}
        isSubmitting={confirm.isPending}
        onConfirm={() =>
          confirm.mutate({ challenge_id: challenge.challenge_id, code })
        }
      >
        <div className="flex flex-col items-center gap-3">
          <OtpInput value={code} onChange={setCode} length={6} />
          <p className="text-sm text-grey-400">
            Enter code from your linked authenticator app
          </p>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog
      control={control}
      title={title}
      icon={MoneySafeIcon}
      width="lg"
      confirmLabel="Proceed"
      confirmDisabled={amountInvalid || tooLong || (isOutflow && !reason)}
      isSubmitting={initiate.isPending}
      onConfirm={() =>
        isOutflow
          ? initiateOutflow.mutate({
            amount: parsed,
            currency,
            reason,
            description: description.trim() || undefined,
          })
          : initiateRefund.mutate({
            amount: parsed,
            currency,
            description: description.trim() || undefined,
          })
      }
    >
      <Field
        label="Amount"
        htmlFor="capital-amount"
        error={amountInvalid && amount !== "" ? "Enter an amount above zero." : undefined}
      >
        <div className="flex items-stretch gap-3">
          <div className="flex-1">
            <Input
              id="capital-amount"
              type="number"
              min={0}
              step="any"
              placeholder="0"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="rounded-xl border-transparent"
            />
          </div>
          <Dropdown
            options={CURRENCY_OPTIONS}
            value={currency}
            onChange={(next) => setCurrency(next as Currency)}
            align="end"
            className={`${CONTROL} w-36 shrink-0`}
          />
        </div>
      </Field>

      {isOutflow ? (
        <Field label="Reason">
          <Dropdown
            options={OUTFLOW_REASONS}
            value={reason}
            onChange={setReason}
            placeholder="Select a reason for outflow"
            className={`${CONTROL} w-full`}
          />
        </Field>
      ) : (
        <Field
          label="Description"
          htmlFor="capital-description"
          optional
          error={tooLong ? "Description is too long." : undefined}
          hint={`${description.length} / ${CAPITAL_DESCRIPTION_LIMIT} characters`}
        >
          <textarea
            id="capital-description"
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Add a narration..."
            className="w-full resize-y rounded-xl bg-grey-25 px-4 py-3 text-md text-grey-900 outline-none placeholder:text-grey-400 focus:shadow-ring-gray"
          />
        </Field>
      )}

      {currency === Currency.USD && isOutflow ? (
        <p className="text-xs text-grey-500">
          While the USD ceiling is unset, the NGN cap converted at the live FX
          rate is enforced instead. So a USD outflow can still be refused.
        </p>
      ) : null}
    </Dialog>
  );
}
