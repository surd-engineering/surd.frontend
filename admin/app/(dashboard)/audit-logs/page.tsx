"use client";

import { useMemo, useState } from "react";
import {
  ComputerIcon,
  Settings02Icon,
  SmartPhone01Icon,
  Task01Icon,
  UserGroupIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { useAdminAccounts, useAdminAuditLogs } from "@/api";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FilterChip, MultiDropdown } from "@/components/ui/dropdown";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon, type IconSvgElement } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { PersonCell } from "@/components/dashboard/person-cell";
import { DataTable, type Column } from "@/components/ui/table";
import { useDebounced } from "@/hooks/use-debounced";
import { useTablePage } from "@/hooks/use-pagination";
import { formatName, formatTimestamp, maskIp, parseUserAgent } from "@/lib/format";
import {
  AUDIT_MODULE_GROUPS,
  AUDIT_MODULE_GROUP_OF,
  AuditStatus,
  type AuditModule,
  type AuditModuleGroup,
} from "@/types/enum";
import type { AdminAuditLog } from "@/types/audit";

const GROUP_ICONS: Record<AuditModuleGroup, IconSvgElement> = {
  Finance: Wallet01Icon,
  Users: UserGroupIcon,
  Configurations: Settings02Icon,
  Settings: Settings02Icon,
};

const GROUP_OPTIONS = (
  Object.keys(AUDIT_MODULE_GROUPS) as AuditModuleGroup[]
).map((group) => ({
  value: group,
  label: group,
  icon: <Icon icon={GROUP_ICONS[group]} size={16} className="text-grey-400" />,
}));

export default function AuditLogsPage() {
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<string[]>([]);
  const [admins, setAdmins] = useState<string[]>([]);
  const { page, setPage, pageSize, setPageSize } = useTablePage();

  const search = useDebounced(query);

  const modules = useMemo(
    () =>
      groups.flatMap(
        (group) => AUDIT_MODULE_GROUPS[group as AuditModuleGroup] ?? [],
      ),
    [groups],
  );

  const { data, isLoading } = useAdminAuditLogs({
    search: search || undefined,
    modules: modules.length ? (modules as AuditModule[]) : undefined,
    admin_ids: admins.length ? admins : undefined,
    page,
    limit: pageSize,
  });

  const { data: adminList } = useAdminAccounts({ paginate: false });

  const adminOptions = (adminList?.data ?? []).map((admin) => ({
    value: admin.id,
    label: formatName(admin),
    icon: (
      <Avatar name={formatName(admin)} src={admin.avatar ?? undefined} size="xs" />
    ),
  }));

  const columns: Column<AdminAuditLog>[] = [
    {
      id: "timestamp",
      header: "Timestamp",
      cell: (row) => formatTimestamp(row.created_at),
      width: "min-w-40",
    },
    {
      id: "admin",
      header: "Admin",
      cell: (row) => (
        <PersonCell
          name={`${row.admin_firstname} ${row.admin_lastname}`.trim()}
          email={row.admin_email}
          avatar={row.admin_avatar}
        />
      ),
      width: "min-w-52",
    },
    {
      id: "module",
      header: "Module",
      cell: (row) => AUDIT_MODULE_GROUP_OF[row.module] ?? row.module,
    },
    {
      id: "action",
      header: "Action",
      cell: (row) => (
        <span className="block max-w-64" title={row.resolver}>
          {row.action}
        </span>
      ),
      width: "min-w-64",
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge
          tone={row.status === AuditStatus.Failure ? "danger" : "success"}
          variant="outline"
          size="sm"
        >
          {row.status === AuditStatus.Failure ? "Failed" : "Success"}
        </Badge>
      ),
    },
    { id: "ip", header: "IP Address", cell: (row) => maskIp(row.ip_address) },
    {
      id: "device",
      header: "Device",
      cell: (row) => <DeviceCell agent={row.device} />,
      width: "min-w-52",
    },
  ];

  const hasFilters = groups.length > 0 || admins.length > 0;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Audit Logs"
        description="Complete history of every administrative action across the platform"
      />

      <section className="rounded-2xl border border-grey-50 bg-white p-4 sm:p-5">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <SearchInput
            value={query}
            onChange={(next) => {
              setQuery(next);
              setPage(1);
            }}
            placeholder="Search action, resolver, IP or admin"
            className="w-full sm:w-80"
          />

          {groups.length > 0 ? (
            <FilterChip
              label={groups.length === 1 ? groups[0] : `${groups.length} Modules`}
              onRemove={() => {
                setGroups([]);
                setPage(1);
              }}
            />
          ) : (
            <MultiDropdown
              options={GROUP_OPTIONS}
              value={groups}
              onChange={(next) => {
                setGroups(next);
                setPage(1);
              }}
              label="All modules"
            />
          )}

          {admins.length > 0 ? (
            <FilterChip
              label={
                admins.length === 1
                  ? (adminOptions.find((option) => option.value === admins[0])
                      ?.label ?? "Admin")
                  : `${admins.length} Admins`
              }
              icon={<Avatar name="Admin" size="xs" />}
              onRemove={() => {
                setAdmins([]);
                setPage(1);
              }}
            />
          ) : (
            <MultiDropdown
              options={adminOptions}
              value={admins}
              onChange={(next) => {
                setAdmins(next);
                setPage(1);
              }}
              label="All admins"
              searchable
              searchPlaceholder="Search admin"
            />
          )}
        </div>

        <DataTable
          data={data?.data ?? []}
          columns={columns}
          getRowId={(row) => row.id}
          isLoading={isLoading}
          minWidth="min-w-6xl"
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
              icon={Task01Icon}
              title="No matching activity"
              description={
                hasFilters || search
                  ? "No actions match the filters you applied. Try clearing one."
                  : "Administrative actions will appear here as they happen."
              }
            />
          }
        />
      </section>
    </div>
  );
}

function DeviceCell({ agent }: { agent: string }) {
  const parsed = parseUserAgent(agent);
  if (!parsed) return <span className="text-grey-400">—</span>;

  const handheld = ["iPhone", "iPad", "Android"].includes(parsed.platform);

  return (
    <span className="flex items-center gap-2" title={agent}>
      <Icon
        icon={handheld ? SmartPhone01Icon : ComputerIcon}
        size={18}
        className="shrink-0 text-grey-400"
      />
      <span className="flex flex-col">
        <span className="font-medium">{parsed.platform}</span>
        <span className="text-xs text-grey-400">{parsed.browser}</span>
      </span>
    </span>
  );
}
