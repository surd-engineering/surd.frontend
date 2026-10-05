"use client";

import { useState } from "react";
import {
  CheckmarkCircle02Icon,
  DocumentValidationIcon,
  FileValidationIcon,
  Image01Icon,
  SecurityLockIcon,
  UnavailableIcon,
  UserGroupIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { useAdminKyc, useAdminKycOverview, useAdminKycs, useAdminUpdateKycStatus } from "@/api";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import {
  TableFilter,
  type FilterGroup,
  type FilterOption,
} from "@/components/ui/table-controls";
import { Field } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { Spinner } from "@/components/ui/spinner";
import { Can } from "@/components/auth/can";
import { Panel } from "@/components/dashboard/panel";
import { PersonCell } from "@/components/dashboard/person-cell";
import { StatCard } from "@/components/dashboard/stat-card";
import { HniBadge, StatusBadge } from "@/components/dashboard/status-badge";
import { DataTable, type Column } from "@/components/ui/table";
import { useDebounced } from "@/hooks/use-debounced";
import { useTablePage } from "@/hooks/use-pagination";
import { useDisclosure } from "@/hooks/use-disclosure";
import { formatCount, formatEnum, formatName, formatTimestamp } from "@/lib/format";
import { ID_DOCUMENT_LABELS, KycStatus, type IdDocument } from "@/types/enum";
import { Permission } from "@/types/permission";
import type { KycWithUser } from "@/types/kyc";

const SLA_HOURS = 48;

const STATUS_OPTIONS: FilterOption[] = [
  { value: "", label: "All pending" },
  ...Object.values(KycStatus).map((status) => ({
    value: status,
    label: formatEnum(status.replace(/^KYC_/, "")),
  })),
];

const QUEUE_OPTIONS: FilterOption[] = [
  { value: "", label: "Every review" },
  { value: "stuck", label: `Stuck (>${SLA_HOURS}h)` },
];

export default function KycPage() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string | undefined>>({});
  const { page, setPage, pageSize, setPageSize } = useTablePage();

  const stuckOnly = filters.queue === "stuck";

  const review = useDisclosure<KycWithUser>();
  const search = useDebounced(query);

  const { data: overview, isLoading: loadingCards } = useAdminKycOverview({
    sla_hours: SLA_HOURS,
  });

  const { data, isLoading } = useAdminKycs({
    search: search || undefined,
    ...(stuckOnly
      ? { stuck_only: true }
      : filters.status
        ? { status: filters.status as KycStatus }
        : { pending_review_only: true }),
    sla_hours: SLA_HOURS,
    page,
    limit: pageSize,
    paginate: true,
  });

  const cards = overview?.data;

  const filterGroups: FilterGroup[] = [
    { id: "status", label: "Status", options: STATUS_OPTIONS },
    { id: "queue", label: "Review queue", options: QUEUE_OPTIONS },
  ];

  const reset = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  const columns: Column<KycWithUser>[] = [
    {
      id: "name",
      header: "Name",
      cell: (row) => (
        <PersonCell
          name={row.user ? formatName(row.user) : null}
          email={row.user?.email}
          avatar={row.user?.avatar}
        />
      ),
      width: "min-w-56",
    },
    {
      id: "document",
      header: "Documents",
      cell: (row) => (
        <span className="font-semibold">{documentLabel(row.id_document)}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={statusLabel(row.status)} />,
    },
    {
      id: "submitted",
      header: "Submitted",
      cell: (row) => formatTimestamp(row.created_at),
    },
    {
      id: "action",
      header: "",
      align: "right",
      cell: (row) => (
        <Button
          variant="soft"
          size="md"
          shape="pill"
          leadingIcon={ViewIcon}
          onClick={() => review.open(row)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="KYC & Compliance"
        description="Identity verification queue"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Pending Reviews"
          value={loadingCards ? "…" : formatCount(cards?.pending_reviews)}
          icon={DocumentValidationIcon}
          hint="Documents waiting on a decision"
        />
        <StatCard
          label="Closed Accounts"
          value={loadingCards ? "…" : formatCount(cards?.closed_accounts)}
          icon={UnavailableIcon}
          hint="Accounts closed after review"
        />
        <button
          type="button"
          onClick={() =>
            reset(setFilters)({
              ...filters,
              queue: stuckOnly ? undefined : "stuck",
            })
          }
          aria-pressed={stuckOnly}
          className="rounded-2xl text-left outline-none focus-visible:shadow-ring-primary"
        >
          <StatCard
            label={`Stuck Reviews (>${SLA_HOURS}h)`}
            value={loadingCards ? "…" : formatCount(cards?.stuck_reviews)}
            icon={SecurityLockIcon}
            note={stuckOnly ? "Filtering the table — tap to clear" : undefined}
            noteTone="warning"
            hint="Still pending past the service-level target"
          />
        </button>
      </div>

      <Panel
        title={stuckOnly ? "Stuck KYC Reviews" : "All Pending KYC Reviews"}
        icon={UserGroupIcon}
        actions={
          <>
            <SearchInput
              value={query}
              onChange={reset(setQuery)}
              placeholder="Search..."
              className="w-full sm:w-64"
            />
            <TableFilter
              groups={filterGroups}
              value={filters}
              onChange={reset(setFilters)}
            />
          </>
        }
        bleed
      >
        <div className="px-4 pb-5 sm:px-5">
          <DataTable
            data={data?.data ?? []}
            columns={columns}
            getRowId={(row) => row.id}
            isLoading={isLoading}
            minWidth="min-w-4xl"
            pagination={{
              mode: "server",
              page,
              pageSize,
              totalItems: data?.pagination?.total ?? 0,
              onPageChange: setPage,
              onPageSizeChange: setPageSize,
            }}
            emptyState={
              <EmptyState
                icon={DocumentValidationIcon}
                title="No User Pending KYC Account for Review Yet"
                description="No record for a user with pending KYC yet. When a new user matching the criteria has been onboarded, they will automatically appear here."
              />
            }
          />
        </div>
      </Panel>

      {review.isOpen && review.data ? (
        <KycReviewDialog control={review} row={review.data} />
      ) : null}
    </div>
  );
}

function documentLabel(document: IdDocument | null) {
  return document ? (ID_DOCUMENT_LABELS[document] ?? formatEnum(document)) : "—";
}

function statusLabel(status: KycStatus) {
  return formatEnum(status.replace(/^KYC_/, ""));
}

function KycReviewDialog({
  control,
  row,
}: {
  control: ReturnType<typeof useDisclosure<KycWithUser>>;
  row: KycWithUser;
}) {
  const decision = useDisclosure<KycStatus>();

  const { data, isLoading } = useAdminKyc({ user_id: row.user_id });
  const entry = data?.data ?? row;

  const name = entry.user ? formatName(entry.user) : entry.user_id;
  const pending =
    entry.status === KycStatus.Pending || entry.status === KycStatus.Processing;

  return (
    <>
      <Dialog
        control={control}
        title="Account KYC Review"
        icon={FileValidationIcon}
        width="md"
      >
        {isLoading ? (
          <div className="grid py-16 place-items-center">
            <Spinner size={28} className="text-primary" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <Avatar
                name={name}
                src={entry.user?.avatar ?? undefined}
                size="xl"
              />
              <div className="flex flex-col gap-1">
                <p className="text-xl font-bold text-grey-900">{name}</p>
                <p className="text-sm text-grey-500">{entry.user?.email ?? "—"}</p>
                <span className="flex flex-wrap items-center gap-2">
                  {entry.user ? (
                    <StatusBadge status={formatEnum(entry.user.status)} />
                  ) : null}
                  {entry.user?.is_hni ? <HniBadge /> : null}
                </span>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-5">
              <div>
                <dt className="text-sm text-grey-400">Document Type</dt>
                <dd className="mt-1 font-medium text-grey-900">
                  {documentLabel(entry.id_document)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-grey-400">Submitted</dt>
                <dd className="mt-1 font-medium text-grey-900">
                  {formatTimestamp(entry.created_at)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-grey-400">Status</dt>
                <dd className="mt-1">
                  <StatusBadge status={statusLabel(entry.status)} />
                </dd>
              </div>
            </dl>

            <Field label="Document preview">
              {entry.id_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={entry.id_url}
                  alt={`${documentLabel(entry.id_document)} for ${name}`}
                  className="aspect-[4/3] w-full rounded-xl object-contain"
                />
              ) : (
                <div className="grid aspect-[4/3] place-items-center rounded-xl bg-grey-25">
                  <Icon icon={Image01Icon} size={28} className="text-grey-300" />
                </div>
              )}
            </Field>

            {pending ? (
              <Can do={Permission.KycDecide}>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    tone="danger"
                    variant="soft"
                    size="xl"
                    shape="pill"
                    block
                    leadingIcon={UnavailableIcon}
                    onClick={() => decision.open(KycStatus.Rejected)}
                  >
                    Reject
                  </Button>
                  <Button
                    tone="primary"
                    size="xl"
                    shape="pill"
                    block
                    leadingIcon={CheckmarkCircle02Icon}
                    onClick={() => decision.open(KycStatus.Verified)}
                  >
                    Approve
                  </Button>
                </div>
              </Can>
            ) : null}
          </>
        )}
      </Dialog>

      <DecisionDialog
        control={decision}
        userId={entry.user_id}
        name={name}
        onDone={control.close}
      />
    </>
  );
}

function DecisionDialog({
  control,
  userId,
  name,
  onDone,
}: {
  control: ReturnType<typeof useDisclosure<KycStatus>>;
  userId: string;
  name: string;
  onDone: () => void;
}) {
  const status = control.data;
  const approving = status === KycStatus.Verified;

  const update = useAdminUpdateKycStatus({
    onSuccess: () => {
      control.close();
      onDone();
    },
  });

  return (
    <Dialog
      control={control}
      tone={approving ? "warning" : "danger"}
      title={approving ? `Approve ${name}'s KYC?` : `Reject ${name}'s KYC?`}
      description={
        approving
          ? "The account is verified and moves out of the review queue."
          : "The submission is rejected and the customer will need to resubmit."
      }
      confirmLabel={approving ? "Approve" : "Reject"}
      cancelLabel="Go back"
      isSubmitting={update.isPending}
      onConfirm={() => status && update.mutate({ user_id: userId, status })}
    />
  );
}
