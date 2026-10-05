import {
  AdminAccountStatus,
  AdminInviteStatus,
  UserStatus,
  type AdminPrivilege,
} from "@/types/enum";
import type { PageRequest } from "@/types/filters";

export interface AdminAccount {
  id: string;
  firstname: string | null;
  lastname: string | null;
  email: string;
  avatar: string | null;

  status: UserStatus | string;
  admin_role_id: string | null;
  admin_role_name: string | null;

  admin_privileges: AdminPrivilege[];
  admin_invite: AdminInviteStatus | null;

  admin_last_login_at: string | null;
  created_at: string;
}

export interface AdminPortalRole {
  id: string;
  name: string;
  active: boolean;

  system: boolean;
  privileges: AdminPrivilege[];
}

export interface AdminPrivilegeOption {
  privilege: AdminPrivilege;
  label: string;
  description: string;
}

export interface AdminInvite {
  user_id: string;
  email: string;
  role_name: string;

  expires_at: string;
}

export interface AdminAccountsFilterInput extends PageRequest {
  search?: string;
  role_id?: string;
  status?: AdminAccountStatus;
  paginate?: boolean;
}

export interface AdminInviteAdminInput {
  full_name: string;
  email: string;
  role_id: string;

  privileges?: AdminPrivilege[];
}

export interface AdminUpdateAdminAccountInput {
  user_id: string;

  role_id: string;

  privileges?: AdminPrivilege[];
}

export interface AdminAccountActionInput {
  user_id: string;
}

export interface AdminRoleInput {
  role_id?: string;
  name?: string;
  privileges?: AdminPrivilege[];
  active?: boolean;
}

export function accountStatus(account: AdminAccount): AdminAccountStatus {
  if (account.admin_invite === AdminInviteStatus.Pending) {
    return AdminAccountStatus.PendingInvite;
  }
  if (account.status === UserStatus.Suspended || account.status === "USER_SUSPEND") {
    return AdminAccountStatus.Suspended;
  }
  return AdminAccountStatus.Active;
}
