import {
  ArrowDownRight02Icon,
  ArrowUpRight02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { Icon, type IconSvgElement } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export type StatDelta = {
  value: string;
  direction: "up" | "down" | "flat";
};

const deltaTones = {
  onLight: { up: "text-green-600", down: "text-red-500", flat: "text-grey-400" },
  onBrand: { up: "text-green-300", down: "text-red-300", flat: "text-white/70" },
} as const;

const noteTones = {
  onLight: {
    success: "text-green-600",
    warning: "text-orange-500",
    danger: "text-red-500",
    neutral: "text-grey-500",
  },
  onBrand: {
    success: "text-green-300",
    warning: "text-orange-200",
    danger: "text-red-300",
    neutral: "text-white/70",
  },
} as const;

export type NoteTone = keyof (typeof noteTones)["onLight"];

export function healthTone(status: string | null | undefined): NoteTone {
  if (!status) return "neutral";

  const value = status.toUpperCase();
  if (/HEALTHY|GOOD|STABLE|SAFE|OK/.test(value)) return "success";
  if (/WARN|CAUTION|AT_RISK|LOW|TIGHT/.test(value)) return "warning";
  if (/CRITICAL|BREACH|UNHEALTHY|DANGER|NEGATIVE/.test(value)) return "danger";
  return "neutral";
}

function DeltaLabel({
  delta,
  surface,
}: {
  delta: StatDelta;
  surface: keyof typeof deltaTones;
}) {
  const glyph =
    delta.direction === "down" ? ArrowDownRight02Icon : ArrowUpRight02Icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-semibold",
        deltaTones[surface][delta.direction],
      )}
    >
      {delta.direction === "flat" ? null : <Icon icon={glyph} size={14} />}
      {delta.value}
    </span>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  delta?: StatDelta;

  suffix?: string;

  note?: string;
  noteTone?: NoteTone;
  icon?: IconSvgElement;
  hint?: string;

  footer?: React.ReactNode;
};

export function StatCard({
  label,
  value,
  delta,
  suffix,
  note,
  noteTone = "success",
  icon,
  hint,
  footer,
}: StatCardProps) {
  return (
    <article className="flex gap-2 justify-between rounded-lg border border-grey-50 bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-1 ">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-medium text-grey-400">{label}</h3>
          {hint ? (
            <Icon
              icon={InformationCircleIcon}
              size={15}
              className="text-grey-300"
              aria-label={hint}
            />
          ) : null}
        </div>

        <p className="text-heading-sm font-bold text-grey-900">
          {value}
          {suffix ? (
            <span className="ml-1.5 text-lg font-semibold text-grey-400">
              {suffix}
            </span>
          ) : null}
        </p>

        {delta ? <DeltaLabel delta={delta} surface="onLight" /> : null}
        {note ? (
          <span className={cn("text-xs font-semibold", noteTones.onLight[noteTone])}>
            {note}
          </span>
        ) : null}
        {footer}
      </div>
      {icon ? (
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-surd-blue-50 text-primary">
          <Icon icon={icon} size={22} />
        </span>
      ) : null}
    </article>
  );
}

export function HeroStat({
  label,
  value,
  delta,
  note,
  noteTone = "success",
  icon,
}: Omit<StatCardProps, "hint">) {
  return (
    <div className="relative z-10 flex flex-col gap-2">
      {icon ? (
        <span className="grid size-10 place-items-center rounded-lg bg-white/20 border border-white/10 text-white">
          <Icon icon={icon} size={22} strokeWidth={2} />
        </span>
      ) : null}

      <div className="flex items-center gap-1.5">
        <h3 className="text-sm font-medium text-grey-100">{label}</h3>
        <Icon
          icon={InformationCircleIcon}
          size={14}

          className="text-grey-100"
        />
      </div>

      <p className="text-heading-sm font-bold text-white">{value}</p>

      {delta ? <DeltaLabel delta={delta} surface="onBrand" /> : null}
      {note ? (
        <span className={cn("text-xs font-semibold", noteTones.onBrand[noteTone])}>
          {note}
        </span>
      ) : null}
    </div>
  );
}

export function HeroStatBanner({ children }: { children: React.ReactNode }) {
  return (
    <section className="brand-ribbon grid gap-6 rounded-lg p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-4">
      {children}
    </section>
  );
}
