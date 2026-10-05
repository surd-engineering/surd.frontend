"use client";

import { ArrowUp02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export function BackToTop({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-grey-50 bg-white",
        "px-4 py-2.5 text-md font-semibold text-surd-blue-700 shadow-md",
        "transition-colors outline-none hover:bg-grey-25",
        "focus-visible:shadow-ring-primary",
        className,
      )}
    >
      <Icon icon={ArrowUp02Icon} size={16} />
      Back to top
    </button>
  );
}
