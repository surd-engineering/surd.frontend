"use client";

import { DropdownMenu } from "radix-ui";
import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  ArrowUpDownIcon,
  FilterIcon,
  SortingAZ01Icon,
  SortingZA01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { SortDirection } from "@/types/enum";

export type FilterOption = {
  value: string;
  label: string;

  adornment?: React.ReactNode;
};

export type FilterGroup = {
  id: string;
  label: string;
  options: FilterOption[];

  footer?: React.ReactNode;

  loading?: boolean;
};

const triggerClass = cn(
  "inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-grey-50 px-4",
  "text-sm font-medium text-grey-600 transition-colors",
  "hover:bg-grey-25 data-[state=open]:bg-grey-25",
  "outline-none focus-visible:shadow-ring-primary",
);

const menuClass = cn(
  "z-50 min-w-48 rounded-xl border border-grey-50 bg-white p-1 shadow-lg",
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
);

const itemClass = cn(
  "flex cursor-pointer select-none items-center justify-between gap-3 rounded-lg px-3 py-2.5",
  "text-sm text-grey-900 outline-none",
  "data-[highlighted]:bg-grey-25 data-[state=open]:bg-grey-25",
);

export function TableFilter({
  groups,
  value,
  onChange,
}: {
  groups: FilterGroup[];

  value: Record<string, string | undefined>;
  onChange: (next: Record<string, string | undefined>) => void;
}) {
  const active = Object.values(value).filter(Boolean).length;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className={triggerClass}>
        <Icon icon={FilterIcon} size={16} />
        Filter
        {active > 0 ? (
          <span className="grid size-5 place-items-center rounded-full bg-primary text-2xs font-bold text-white">
            {active}
          </span>
        ) : null}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={6} className={menuClass}>
          {groups.map((group) => (
            <DropdownMenu.Sub key={group.id}>
              <DropdownMenu.SubTrigger className={itemClass}>
                <span className="flex flex-col">
                  {group.label}
                  {value[group.id] ? (
                    <span className="text-xs text-primary">
                      {group.options.find((o) => o.value === value[group.id])?.label}
                    </span>
                  ) : null}
                </span>
                <Icon icon={ArrowRight01Icon} size={16} className="text-grey-400" />
              </DropdownMenu.SubTrigger>

              <DropdownMenu.Portal>
                <DropdownMenu.SubContent sideOffset={4} className={menuClass}>
                  {group.loading ? (
                    <p className="px-3 py-2.5 text-sm text-grey-400">Loading…</p>
                  ) : group.options.length === 0 ? (
                    <p className="px-3 py-2.5 text-sm text-grey-400">Nothing to filter by</p>
                  ) : (
                    group.options.map((option) => {
                      const selected = (value[group.id] ?? "") === option.value;

                      return (
                        <DropdownMenu.Item
                          key={option.value || "all"}
                          className={itemClass}
                          onSelect={() =>
                            onChange({
                              ...value,
                              [group.id]: option.value || undefined,
                            })
                          }
                        >
                          <span className="flex min-w-0 items-center gap-2.5">
                            {option.adornment}
                            <span className="truncate">{option.label}</span>
                          </span>
                          {selected ? (
                            <Icon icon={Tick02Icon} size={16} className="text-primary" />
                          ) : null}
                        </DropdownMenu.Item>
                      );
                    })
                  )}

                  {group.footer}
                </DropdownMenu.SubContent>
              </DropdownMenu.Portal>
            </DropdownMenu.Sub>
          ))}

          {active > 0 ? (
            <>
              <DropdownMenu.Separator className="my-1 h-px bg-grey-50" />
              <DropdownMenu.Item
                className={cn(itemClass, "text-grey-500")}
                onSelect={() => onChange({})}
              >
                Clear all
              </DropdownMenu.Item>
            </>
          ) : null}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function TableSort({
  value,
  onChange,
}: {
  value: SortDirection;
  onChange: (next: SortDirection) => void;
}) {
  const options = [
    { value: SortDirection.Asc, label: "Ascending", icon: SortingAZ01Icon },
    { value: SortDirection.Desc, label: "Descending", icon: SortingZA01Icon },
  ];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className={triggerClass}>
        <Icon icon={ArrowUpDownIcon} size={16} />
        Sort by
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={6} className={menuClass}>
          {options.map((option) => (
            <DropdownMenu.Item
              key={option.value}
              className={itemClass}
              onSelect={() => onChange(option.value)}
            >
              <span className="flex items-center gap-2.5">
                <Icon icon={option.icon} size={18} className="text-grey-500" />
                {option.label}
              </span>
              {value === option.value ? (
                <Icon icon={Tick02Icon} size={16} className="text-primary" />
              ) : null}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
