"use client";

import { Accordion as RadixAccordion } from "radix-ui";
import { MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export type AccordionEntry = {
  id: string;
  question: string;
  answer: string;
};

const tones = {
  light: {
    root: "",
    item: "border-b border-dashed border-grey-100 last:border-b-0 data-[state=open]:bg-primary",
    question: "text-grey-600 group-data-[state=open]:text-white",
    chip: "bg-primary text-white group-data-[state=open]:bg-white/20",
    answer: "text-grey-500 group-data-[state=open]:text-white/90",
  },
  dark: {
    root: "border border-dashed border-grey-800",
    item: "border-b border-dashed border-grey-800 last:border-b-0 data-[state=open]:bg-grey-800",
    question: "text-grey-400 group-data-[state=open]:text-white",
    chip: "bg-grey-700 text-white group-data-[state=open]:bg-white group-data-[state=open]:text-grey-900",
    answer: "text-grey-400 group-data-[state=open]:text-grey-200",
  },
} as const;

type AccordionProps = {
  items: AccordionEntry[];
  tone?: keyof typeof tones;
  defaultValue?: string;
  className?: string;
};

export function Accordion({
  items,
  tone = "light",
  defaultValue,
  className,
}: AccordionProps) {
  const palette = tones[tone];

  return (
    <RadixAccordion.Root
      type="single"
      collapsible
      defaultValue={defaultValue}
      className={cn(
        "w-full overflow-hidden rounded-2xl",
        palette.root,
        className,
      )}
    >
      {items.map((item) => (
        <RadixAccordion.Item
          key={item.id}
          value={item.id}
          className={cn(
            "group overflow-hidden rounded-2xl transition-colors",
            palette.item,
          )}
        >
          <RadixAccordion.Header>
            <RadixAccordion.Trigger
              className={cn(
                "flex w-full items-center justify-between gap-6 px-5 py-5 text-left",
                "text-md font-bold outline-none sm:px-6",
                "focus-visible:shadow-ring-primary",
                palette.question,
              )}
            >
              {item.question}
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full transition-colors",
                  palette.chip,
                )}
              >
                <Icon
                  icon={PlusSignIcon}
                  size={15}
                  strokeWidth={2}
                  className="group-data-[state=open]:hidden"
                />
                <Icon
                  icon={MinusSignIcon}
                  size={15}
                  strokeWidth={2}
                  className="hidden group-data-[state=open]:block"
                />
              </span>
            </RadixAccordion.Trigger>
          </RadixAccordion.Header>

          <RadixAccordion.Content
            className={cn(
              "overflow-hidden",
              "data-[state=closed]:animate-accordion-up",
              "data-[state=open]:animate-accordion-down",
            )}
          >
            <p
              className={cn(
                "px-5 pb-5 text-paragraph-sm sm:px-6",
                palette.answer,
              )}
            >
              {item.answer}
            </p>
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      ))}
    </RadixAccordion.Root>
  );
}
