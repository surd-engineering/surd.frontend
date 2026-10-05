"use client";

import { createQuery } from "@/api/factory";
import { ADMIN_AUDIT_LOGS_QUERY } from "@/api/audit/document";
import type { AdminAuditLog, AdminAuditLogsFilterInput } from "@/types/audit";

export const useAdminAuditLogs = createQuery<
  AdminAuditLog[],
  AdminAuditLogsFilterInput
>({
  resolver: "adminAuditLogs",
  document: ADMIN_AUDIT_LOGS_QUERY,
  scope: "audit",
  paginated: true,
  staleTime: 60_000,
});
