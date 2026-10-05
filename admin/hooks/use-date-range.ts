"use client";

import { useMemo, useState } from "react";
import { Granularity } from "@/types/enum";
import type { AdminSeriesInput } from "@/types/filters";

const PRESETS = {
  "7d": { label: "Last 7 days", days: 7, granularity: Granularity.Day },
  "30d": { label: "Last 30 days", days: 30, granularity: Granularity.Day },
  "12m": { label: "Last 12 months", days: 365, granularity: Granularity.Month },
  all: { label: "All time", days: null, granularity: Granularity.Month },
} as const;

export type RangeKey = keyof typeof PRESETS;

export const RANGE_OPTIONS = (Object.keys(PRESETS) as RangeKey[]).map((key) => ({
  value: key,
  label: PRESETS[key].label,
}));

export function useDateRange(initial: RangeKey = "30d") {
  const [key, setKey] = useState<RangeKey>(initial);

  const range = useMemo<AdminSeriesInput>(() => {
    const { days, granularity } = PRESETS[key];
    if (days === null) return { granularity };

    const start = new Date();
    start.setDate(start.getDate() - days);
    return { start_date: start.toISOString(), granularity };
  }, [key]);

  return { key, setKey, range, options: RANGE_OPTIONS };
}
