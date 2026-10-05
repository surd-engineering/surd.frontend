"use client";

import { useAdminAccounts } from "@/api";
import { Avatar } from "@/components/ui/avatar";
import type { FilterGroup } from "@/components/ui/table-controls";
import { formatName } from "@/lib/format";

const ADMIN_LIMIT = 100;

export function useAuthorizedByFilter(field = "author"): FilterGroup {
  const { data, isLoading } = useAdminAccounts({
    limit: ADMIN_LIMIT,
    paginate: false,
  });

  return {
    id: field,
    label: "Authorized by",
    loading: isLoading,
    options: [
      { value: "", label: "Anyone" },
      ...(data?.data ?? []).map((admin) => ({
        value: admin.id,
        label: formatName(admin),
        adornment: (
          <Avatar
            name={formatName(admin)}
            src={admin.avatar ?? undefined}
            size="xs"
          />
        ),
      })),
    ],
  };
}
