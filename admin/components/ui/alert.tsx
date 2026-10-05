import { cn } from "@/lib/cn";

export const ALERT_TONES = ["info", "success", "warning", "danger"] as const;
export type AlertTone = (typeof ALERT_TONES)[number];

type ToneConfig = {
  surface: string;
  badge: string;
  shape: "hexagon" | "circle";
  glyph: "exclamation" | "check" | "info";
};

const tones: Record<AlertTone, ToneConfig> = {
  info: {
    surface: "border-surd-blue-200 bg-surd-blue-50",
    badge: "text-primary",
    shape: "circle",
    glyph: "info",
  },
  success: {
    surface: "border-green-300 bg-green-50",
    badge: "text-green-600",
    shape: "circle",
    glyph: "check",
  },
  warning: {
    surface: "border-orange-400 bg-orange-50",
    badge: "text-orange-500",
    shape: "hexagon",
    glyph: "exclamation",
  },
  danger: {
    surface: "border-red-300 bg-red-50",
    badge: "text-red-500",
    shape: "hexagon",
    glyph: "exclamation",
  },
};

function ToneBadge({ tone, className }: { tone: AlertTone; className?: string }) {
  const { shape, glyph } = tones[tone];

  return (
    <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden className={className}>
      {shape === "hexagon" ? (
        <path
          d="M12 2.6 20.9 7.7 20.9 16.3 12 21.4 3.1 16.3 3.1 7.7Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth={2.9}
          strokeLinejoin="round"
        />
      ) : (
        <circle cx="12" cy="12" r="10.7" fill="currentColor" />
      )}

      {glyph === "check" ? (
        <path
          d="m7.7 12.3 2.9 2.9 5.7-6.2"
          fill="none"
          stroke="#fff"
          strokeWidth={2.35}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : glyph === "info" ? (
        <>
          <circle cx="12" cy="7.7" r="1.4" fill="#fff" />
          <path d="M12 11.3v5" stroke="#fff" strokeWidth={2.35} strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M12 7.4v5.2" stroke="#fff" strokeWidth={2.35} strokeLinecap="round" />
          <circle cx="12" cy="16.3" r="1.4" fill="#fff" />
        </>
      )}
    </svg>
  );
}

type AlertProps = React.ComponentProps<"div"> & {
  tone?: AlertTone;
  title?: string;
};

export function Alert({
  tone = "info",
  title,
  className,
  children,
  ...props
}: AlertProps) {
  const config = tones[tone];

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-4 rounded-lg border px-3 py-2",
        config.surface,
        className,
      )}
      {...props}
    >
      <ToneBadge tone={tone} className={cn("mt-0.5 shrink-0", config.badge)} />

      <div className="min-w-0 flex-1">
        {title ? (
          <p className="text-base font-semibold text-grey-900">{title}</p>
        ) : null}
        {children ? <p className="text-sm font-medium text-grey-500">{children}</p> : null}
      </div>
    </div>
  );
}
