"use client";

import { useState } from "react";
import { PencilEdit02Icon, Settings02Icon } from "@hugeicons/core-free-icons";
import { useAdminPlatformConfigKeys, useModifyPlatformConfig } from "@/api";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Dropdown } from "@/components/ui/dropdown";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Can } from "@/components/auth/can";
import { PersonCell } from "@/components/dashboard/person-cell";
import { DataTable, type Column } from "@/components/ui/table";
import { useDisclosure } from "@/hooks/use-disclosure";
import { formatConfigValue, formatTimestamp } from "@/lib/format";
import { ConfigUnit } from "@/types/enum";
import { Permission } from "@/types/permission";
import {
  CONFIG_KEY_FIELDS,
  type AdminPlatformConfigKey,
} from "@/types/platform";

const UNIT_SUFFIX: Record<ConfigUnit, string> = {
  [ConfigUnit.Percentage]: "% Percentage",
  [ConfigUnit.Ngn]: "₦ Naira",
  [ConfigUnit.Usd]: "$ Dollar",
  [ConfigUnit.Hours]: "Hours",
  [ConfigUnit.Days]: "Days",
};

const CONTROL = "h-14 w-full rounded-xl border-transparent bg-grey-25 px-4 text-md";

const HINTS: Partial<Record<keyof typeof CONFIG_KEY_FIELDS, string>> = {
  MAXIMUM_NET_CAPITAL_OUTFLOW_USD:
    "While this is 0 the NGN cap is converted at the live FX rate, so the USD ceiling moves with the market.",
};

export default function PlatformConfigurationPage() {
  const edit = useDisclosure<AdminPlatformConfigKey>();
  const { data, isLoading } = useAdminPlatformConfigKeys();

  const columns: Column<AdminPlatformConfigKey>[] = [
    {
      id: "type",
      header: "Type",
      cell: (row) => <span className="text-grey-900">{row.label}</span>,
      width: "min-w-48",
    },
    {
      id: "value",
      header: "Value",
      cell: (row) => (
        <span className="font-bold tabular-nums">
          {formatConfigValue(row.value, row.unit)}
        </span>
      ),
    },
    {
      id: "description",
      header: "Description",
      cell: (row) => (
        <span className="block max-w-md text-grey-900">{row.description}</span>
      ),
      width: "min-w-80",
    },
    {
      id: "updatedBy",
      header: "Updated by",
      cell: (row) => (
        <PersonCell
          name={`${row.updated_by_firstname} ${row.updated_by_lastname}`.trim()}
          email={row.updated_by_email}
          avatar={row.updated_by_avatar}
        />
      ),
      width: "min-w-52",
    },
    {
      id: "lastUpdated",
      header: "Last updated",
      cell: (row) => formatTimestamp(row.updated_at),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <Can do={Permission.PlatformManage}>
          <Button
            variant="soft"
            size="md"
            shape="pill"
            leadingIcon={PencilEdit02Icon}
            onClick={() => edit.open(row)}
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
        title="Platform Configuration"
        description="Manage all relevant variable system keys"
      />

      <section className="rounded-2xl border border-grey-50 bg-white p-4 sm:p-7">
        <DataTable
          data={data?.data ?? []}
          columns={columns}
          getRowId={(row) => row.key}
          isLoading={isLoading}
          pagination={false}
          minWidth="min-w-6xl"
          emptyState={
            <EmptyState
              icon={Settings02Icon}
              title="No configuration keys"
              description="The platform returned no tunable keys."
            />
          }
        />
      </section>

      {edit.isOpen && edit.data ? (
        <EditConfigKeyDialog
          control={edit}
          initial={edit.data}
          rows={data?.data ?? [edit.data]}
        />
      ) : null}
    </div>
  );
}

function EditConfigKeyDialog({
  control,
  initial,
  rows,
}: {
  control: ReturnType<typeof useDisclosure<AdminPlatformConfigKey>>;
  initial: AdminPlatformConfigKey;
  rows: AdminPlatformConfigKey[];
}) {
  const [config, setConfig] = useState(initial);
  const [value, setValue] = useState(String(initial.value));
  const save = useModifyPlatformConfig({ onSuccess: control.close });

  const selectKey = (key: string) => {
    const next = rows.find((row) => row.key === key);
    if (!next) return;
    setConfig(next);
    setValue(String(next.value));
  };

  const parsed = Number(value);

  const invalid = value.trim() === "" || Number.isNaN(parsed) || parsed < 0;

  const submit = () => {
    if (invalid) return;

    const { field, integer } = CONFIG_KEY_FIELDS[config.key];
    save.mutate({ [field]: integer ? Math.round(parsed) : parsed });
  };

  return (
    <Dialog
      control={control}
      title="Edit Config Key"
      icon={PencilEdit02Icon}
      width="lg"
      confirmLabel="Save changes"
      onConfirm={submit}
      confirmDisabled={invalid}
      isSubmitting={save.isPending}
    >
      <Field label="Type">
        <Dropdown
          options={rows.map((row) => ({ value: row.key, label: row.label }))}
          value={config.key}
          onChange={selectKey}
          className={CONTROL}
        />
      </Field>

      <Field
        label="Value"
        htmlFor="config-value"
        error={invalid && value !== "" ? "Enter a number of 0 or more." : undefined}
        hint={HINTS[config.key]}
      >
        <div className="flex items-stretch gap-3">
          <div className="flex-1">
            <Input
              id="config-value"
              type="number"
              min={0}
              step={CONFIG_KEY_FIELDS[config.key].integer ? 1 : "any"}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="rounded-xl text-md"
            />
          </div>
          <span className="flex h-14 w-44 shrink-0 items-center rounded-xl bg-grey-25 px-4 text-md text-grey-900">
            {UNIT_SUFFIX[config.unit]}
          </span>
        </div>
      </Field>

      <Field label="Description">
        <p className="min-h-32 rounded-xl bg-grey-25 px-4 py-4 text-md text-grey-900">
          {config.description}
        </p>
      </Field>
    </Dialog>
  );
}
