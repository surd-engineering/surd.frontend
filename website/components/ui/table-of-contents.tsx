"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export type TocEntry = {
  id: string;
  label: string;
  children?: TocEntry[];
};

function flatten(entries: TocEntry[]): string[] {
  return entries.flatMap((entry) => [
    entry.id,
    ...(entry.children ? flatten(entry.children) : []),
  ]);
}

export function TableOfContents({
  entries,
  title = "On this page",
  className,
}: {
  entries: TocEntry[];
  title?: string;
  className?: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const ids = flatten(entries);
    const observer = new IntersectionObserver(
      (records) => {
        const visible = records
          .filter((record) => record.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-88px 0px -66% 0px", threshold: 0 },
    );

    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [entries]);

  return (
    <nav
      aria-label={title}
      className={cn("flex flex-col gap-4 text-md", className)}
    >
      <p className="text-md font-extrabold tracking-[0.1em] text-grey-500 uppercase">
        {title}
      </p>
      <ul className="flex flex-col gap-3 border-l border-grey-50">
        {entries.map((entry) => (
          <li key={entry.id} className="flex flex-col gap-2">
            <TocLink entry={entry} activeId={activeId} />
            {entry.children ? (
              <ul className="flex flex-col gap-2">
                {entry.children.map((child) => (
                  <li key={child.id}>
                    <TocLink entry={child} activeId={activeId} nested />
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </nav>
  );
}

function TocLink({
  entry,
  activeId,
  nested = false,
}: {
  entry: TocEntry;
  activeId: string | null;
  nested?: boolean;
}) {
  const isActive = activeId === entry.id;

  return (
    <a
      href={`#${entry.id}`}
      aria-current={isActive ? "location" : undefined}
      className={cn(
        "-ml-px block border-l-2 py-0.5 transition-colors",
        nested ? "pl-6 text-xs" : "pl-4 font-semibold",
        isActive
          ? "border-primary text-primary"
          : "border-transparent text-grey-400 hover:text-grey-900",
      )}
    >
      {entry.label}
    </a>
  );
}
