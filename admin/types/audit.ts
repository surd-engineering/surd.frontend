import type { AuditModule, AuditStatus } from "@/types/enum";
import type { DateRange, PageRequest } from "@/types/filters";

export interface AdminAuditLog {
  id: string;
  admin_id: string;

  admin_firstname: string;
  admin_lastname: string;
  admin_email: string;
  admin_avatar: string;

  module: AuditModule;
  action: string;

  resolver: string;
  status: AuditStatus;

  ip_address: string;

  device: string;
  created_at: string;
}

export interface AdminAuditLogsFilterInput extends PageRequest, DateRange {
  search?: string;

  modules?: AuditModule[];

  admin_ids?: string[];
  paginate?: boolean;
}
