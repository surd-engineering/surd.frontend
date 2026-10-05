"use client";

import { useState } from "react";
import { Edit02Icon, PercentIcon } from "@hugeicons/core-free-icons";
import { useRates, useSaveRate } from "@/api";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Can } from "@/components/auth/can";
import { CurrencyChip } from "@/components/dashboard/editor-cell";
import { PersonCell } from "@/components/dashboard/person-cell";
import { DataTable, type Column } from "@/components/ui/table";
import { useDisclosure } from "@/hooks/use-disclosure";
import { formatName, formatTimestamp } from "@/lib/format";
import { Permission } from "@/types/permission";
import type { Currency } from "@/content/configuration";
import type { Rate } from "@/types/rate";

export default function RatesPage() {
  const editRate = useDisclosure<Rate>();

  const { data, isLoading, error } = useRates({});

  const columns: Column<Rate>[] = [
    {
      id: "pair",
      header: "Currency Pair",
      cell: (rate) => (
        <span className="flex items-center gap-3">
          <CurrencyChip
            currency={rate.base as Currency}
            className="bg-transparent px-0"
          />
          <span aria-hidden className="text-grey-300">
            &rarr;
          </span>
          <CurrencyChip
            currency={rate.exchange as Currency}
            className="bg-transparent px-0"
          />
        </span>
      ),
      width: "min-w-52",
    },
    {
      id: "value",
      header: "Value",
      cell: (rate) => (
        <span className="tabular-nums">
          1 {rate.base} = {rate.val.toLocaleString("en-NG")} {rate.exchange}
        </span>
      ),
      width: "min-w-52",
    },
    {
      id: "margin",
      header: "FX Margin",
      cell: (rate) => (
        <span className="flex flex-col">
          <span className="font-semibold">
            {rate.markup == null ? "—" : `${rate.markup}%`}
          </span>
          <span className="text-xs text-grey-400">not applied to conversions</span>
        </span>
      ),
    },
    {
      id: "effective",
      header: "Effective date",
      cell: (rate) => formatTimestamp(rate.updated_at),
    },
    {
      id: "updatedBy",
      header: "Last Updated by",
      cell: (rate) => (
        <PersonCell
          name={rate.user ? formatName(rate.user) : null}
          email={rate.user?.email}
          avatar={rate.user?.avatar}
        />
      ),
      width: "min-w-56",
    },
    {
      id: "actions",
      header: "Actions",
      cell: (rate) => (
        <Can do={Permission.PlatformManage}>
          <Button
            variant="soft"
            size="md"
            shape="pill"
            leadingIcon={Edit02Icon}
            onClick={() => editRate.open(rate)}
          >
            Edit
          </Button>
        </Can>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Rates"
        description="The exchange rate every NGN ↔ USD conversion uses"
      />

      <section className="rounded-2xl border border-grey-50 bg-white p-4 sm:p-5">
        <DataTable
          data={data?.data ?? []}
          columns={columns}
          getRowId={(rate) => rate.id}
          isLoading={isLoading}
          pagination={false}
          minWidth="min-w-5xl"
          emptyState={
            <EmptyState
              icon={PercentIcon}
              title="No exchange rates configured"
              description={
                error
                  ? "No rate pairs have been set up yet."
                  : "Add a currency pair to start converting."
              }
            />
          }
        />
      </section>

      {editRate.isOpen && editRate.data ? (
        <EditRateDialog control={editRate} rate={editRate.data} />
      ) : null}
    </div>
  );
}

function EditRateDialog({
  control,
  rate,
}: {
  control: ReturnType<typeof useDisclosure<Rate>>;
  rate: Rate;
}) {
  const [value, setValue] = useState(String(rate.val));
  const [markup, setMarkup] = useState(rate.markup == null ? "" : String(rate.markup));

  const save = useSaveRate({ onSuccess: control.close });

  const parsedValue = Number(value);
  const parsedMarkup = markup.trim() === "" ? undefined : Number(markup);

  const invalid =
    !Number.isFinite(parsedValue) ||
    parsedValue <= 0 ||
    (parsedMarkup !== undefined && !Number.isFinite(parsedMarkup));

  return (
    <Dialog
      control={control}
      title="Edit Rate"
      icon={PercentIcon}
      width="md"
      confirmLabel="Save changes"
      confirmDisabled={invalid}
      isSubmitting={save.isPending}
      onConfirm={() =>
        save.mutate({
          base: rate.base,
          exchange: rate.exchange,
          value: parsedValue,
          markup: parsedMarkup,
        })
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <Field label="From">
          <Input value={rate.base} readOnly />
        </Field>
        <Field label="To">
          <Input value={rate.exchange} readOnly />
        </Field>
      </div>

      <Field
        label="Rate"
        htmlFor="rate-value"
        error={invalid && value !== "" ? "Enter a rate greater than zero." : undefined}
      >
        <div className="flex items-center gap-3">
          <Input value={`1 ${rate.base}`} readOnly className="w-32 shrink-0" />
          <span aria-hidden className="text-grey-300">
            =
          </span>
          <Input
            id="rate-value"
            type="number"
            min={0}
            step="any"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            rightIcon={<span className="text-sm text-grey-400">{rate.exchange}</span>}
          />
        </div>
      </Field>

      <Field
        label="FX Margin"
        htmlFor="rate-markup"
        hint="Stored and displayed, but no conversion currently applies it."
      >
        <Input
          id="rate-markup"
          type="number"
          step="any"
          value={markup}
          onChange={(event) => setMarkup(event.target.value)}
          rightIcon={<span className="text-sm text-grey-400">%</span>}
        />
      </Field>

      <p className="text-xs text-grey-400">
        Saving takes effect immediately — rates are stored one row per pair, so
        there is nothing to schedule.
      </p>
    </Dialog>
  );
}
