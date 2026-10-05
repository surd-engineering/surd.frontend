"use client";

import { useMemo, useState } from "react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Accordion } from "@/components/ui/accordion";
import { Icon } from "@/components/ui/icon";
import { FAQ_HERO, type FaqCategory } from "@/content/faqs";
import { cn } from "@/lib/cn";

export function FaqBrowser({
  categories,
  query,
}: {
  categories: FaqCategory[];
  query: string;
}) {
  const [activeId, setActiveId] = useState(categories[0]?.id);

  const trimmed = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!trimmed) {
      return categories.find((category) => category.id === activeId)?.items ?? [];
    }
    return categories
      .flatMap((category) => category.items)
      .filter(
        (item) =>
          item.question.toLowerCase().includes(trimmed) ||
          item.answer.toLowerCase().includes(trimmed),
      );
  }, [categories, activeId, trimmed]);

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
      <nav
        aria-label="FAQ categories"
        className={cn("lg:w-64 lg:shrink-0", trimmed && "opacity-40")}
      >
        <p className="mb-4 text-sm font-extrabold tracking-[0.1em] text-grey-400 uppercase">
          Category
        </p>
        <ul className="flex flex-col gap-1 border-l border-grey-50">
          {categories.map((category) => (
            <li key={category.id}>
              <button
                type="button"
                onClick={() => setActiveId(category.id)}
                disabled={Boolean(trimmed)}
                aria-current={category.id === activeId ? "true" : undefined}
                className={cn(
                  "-ml-px block w-full border-l-2 py-2 pl-4 text-left text-base transition-colors",
                  category.id === activeId
                    ? "border-primary font-semibold text-primary"
                    : "border-transparent text-grey-500 hover:text-grey-900",
                )}
              >
                {category.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-w-0 flex-1">
        {results.length > 0 ? (
          <Accordion
            key={trimmed || activeId}
            items={results}
            defaultValue={results[0]?.id}
            className="border border-grey-50"
          />
        ) : (
          <p className="rounded-2xl border border-dashed border-grey-100 px-6 py-16 text-center text-paragraph-sm text-grey-400">
            No questions match “{query}”. Try a different search, or email{" "}
            <a
              href="mailto:support@surd.finance"
              className="font-semibold text-primary hover:underline"
            >
              support@surd.finance
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
}

export function FaqSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="mt-4 flex w-full max-w-[25rem] items-center gap-3 border-b border-grey-700 pb-3">
      <Icon icon={Search01Icon} size={24} className="shrink-0 text-primary" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={FAQ_HERO.searchPlaceholder}
        aria-label="Search frequently asked questions"
        className={cn(
          "min-w-0 flex-1 bg-transparent text-md text-white outline-none",
          "placeholder:text-grey-400",
        )}
      />
    </label>
  );
}
