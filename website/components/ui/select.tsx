"use client";

import { Select as RadixSelect } from "radix-ui";
import { ArrowDown01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export type SelectOption = { label: string; value: string };

type SelectProps = {
  label: string;
  value: string;
  options: readonly (SelectOption | string)[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

function toOption(option: SelectOption | string): SelectOption {
  return typeof option === "string" ? { label: option, value: option } : option;
}

export function Select({
  label,
  value,
  options,
  onValueChange,
  placeholder,
  className,
}: SelectProps) {
  return (
    <RadixSelect.Root value={value} onValueChange={onValueChange}>
      <RadixSelect.Trigger
        aria-label={label}
        className={cn(
          "group flex items-center gap-2 rounded-full border border-grey-100 bg-white",
          "py-2.5 pr-4 pl-5 text-sm font-semibold text-grey-900",
          "transition-colors outline-none hover:border-grey-150",
          "focus-visible:shadow-ring-primary",
          "dark:border-grey-800 dark:bg-grey-950 dark:text-grey-50",
          className,
        )}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon className="text-grey-900 transition-transform duration-200 group-data-[state=open]:rotate-180 dark:text-grey-300">
          <Icon icon={ArrowDown01Icon} size={20} strokeWidth={2} />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={8}
          className={cn(
            "z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden",
            "rounded-2xl border border-grey-100 bg-white shadow-2xl",
            "dark:border-grey-800 dark:bg-grey-950",
          )}
        >
          <RadixSelect.Viewport className="flex max-h-72 flex-col gap-0.5 p-2">
            {options.map(toOption).map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                className={cn(
                  "flex h-10 cursor-pointer items-center justify-between gap-6 rounded-lg px-3",
                  "text-sm font-medium text-grey-700 outline-none select-none",
                  "data-[highlighted]:bg-grey-25 data-[highlighted]:text-grey-900",
                  "data-[state=checked]:font-semibold data-[state=checked]:text-grey-900",
                  "dark:text-grey-300 dark:data-[highlighted]:bg-grey-900",
                  "dark:data-[highlighted]:text-grey-50 dark:data-[state=checked]:text-grey-50",
                )}
              >
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                <RadixSelect.ItemIndicator className="text-primary">
                  <Icon icon={Tick02Icon} size={16} strokeWidth={2} />
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
