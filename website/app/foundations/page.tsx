import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  PaintBoardIcon,
  TextFontIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";

const COLOR_SCALE = [
  50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 850, 900, 950,
];

const RAMPS: [string, number[]][] = [
  ["surd-blue", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]],
  [
    "grey",
    [10, 25, 50, 150, 200, 300, 400, 500, 600, 700, 800, 850, 900, 950, 1000],
  ],
  ["green", COLOR_SCALE],
  ["aqua", COLOR_SCALE],
  ["blue", COLOR_SCALE],
  ["purple", COLOR_SCALE],
  ["pink", COLOR_SCALE],
  ["red", COLOR_SCALE],
  ["orange", COLOR_SCALE],
  ["yellow", COLOR_SCALE],
];

const SEMANTIC: [string, string][] = [
  ["Primary", "bg-primary text-primary-foreground"],
  ["Success", "bg-success text-success-foreground"],
  ["Warning", "bg-warning text-warning-foreground"],
  ["Danger", "bg-danger text-danger-foreground"],
  ["Primary subtle", "bg-primary-subtle text-primary-subtle-foreground"],
  ["Success subtle", "bg-success-subtle text-success-subtle-foreground"],
  ["Warning subtle", "bg-warning-subtle text-warning-subtle-foreground"],
  ["Danger subtle", "bg-danger-subtle text-danger-subtle-foreground"],
];

const SHADOWS = ["xs", "sm", "md", "lg", "xl", "2xl"];
const BLURS = ["xs", "sm", "md", "lg", "xl"];

const RINGS: [string, string][] = [
  ["primary", "focus-visible:shadow-ring-primary"],
  ["brand", "focus-visible:shadow-ring-brand"],
  ["black", "focus-visible:shadow-ring-black"],
  ["gray", "focus-visible:shadow-ring-gray"],
  ["blue", "focus-visible:shadow-ring-blue"],
  ["purple", "focus-visible:shadow-ring-purple"],
  ["success", "focus-visible:shadow-ring-success"],
  ["destructive", "focus-visible:shadow-ring-destructive"],
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6 border-t border-border py-12">
      <h2 className="text-label-sm uppercase text-foreground-subtle">{title}</h2>
      {children}
    </section>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <header className="flex flex-col gap-3 pb-8">
        <p className="text-label-sm uppercase text-primary">Design system</p>
        <h1 className="text-heading-lg font-extrabold">SURD foundations</h1>
        <p className="max-w-xl text-paragraph-lg text-foreground-muted">
          Colour, typography, elevation and iconography tokens generated from the
          SURD product design library.
        </p>
      </header>

      <Section title="Colour — palette">
        <div className="flex flex-col gap-4">
          {RAMPS.map(([name, steps]) => (
            <div key={name} className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-foreground-muted">
                {name}
              </span>
              <div className="flex gap-1 overflow-x-auto">
                {steps.map((step) => (
                  <div
                    key={step}
                    title={`${name}-${step}`}
                    style={{ backgroundColor: `var(--color-${name}-${step})` }}
                    className="h-10 w-10 shrink-0 rounded-md border border-border"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Colour — semantic">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SEMANTIC.map(([label, classes]) => (
            <div
              key={label}
              className={`rounded-lg px-4 py-6 text-sm font-semibold ${classes}`}
            >
              {label}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <div className="flex flex-col gap-4">
          <p className="font-batica text-display-sm font-extrabold">
            Display sm — Batica
          </p>
          <p className="font-batica text-heading-md font-bold">
            Heading md — Batica
          </p>
          <p className="text-heading-md font-bold">Heading md</p>
          <p className="text-heading-xs font-semibold">Heading xs</p>
          <p className="text-xl font-medium">Text xl</p>
          <p className="text-md">Text md</p>
          <p className="max-w-xl text-paragraph-md text-foreground-muted">
            Paragraph md — in the sprawling realms of the interstellar matrix,
            where pulsating quantum waves intertwine with the fabric of
            spacetime, the enigmatic neural phoenix gracefully traverses the
            ethereal expanse.
          </p>
          <p className="text-label-md uppercase">Label md</p>
        </div>
      </Section>

      <Section title="Elevation">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {SHADOWS.map((step) => (
            <div
              key={step}
              style={{ boxShadow: `var(--shadow-${step})` }}
              className="rounded-lg bg-surface px-4 py-6 text-center text-sm font-semibold"
            >
              {step}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Blur">
        <div className="flex flex-wrap gap-4">
          {BLURS.map((step) => (
            <div
              key={step}
              className="relative h-24 w-40 overflow-hidden rounded-lg bg-linear-to-br from-primary to-pink-500"
            >
              <div
                style={{ backdropFilter: `blur(var(--blur-${step}))` }}
                className="absolute inset-x-0 bottom-0 border-t border-white/20 bg-white/20 px-3 py-2 text-xs font-semibold text-white"
              >
                backdrop {step}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Focus rings">
        <div className="flex flex-wrap gap-3">
          {RINGS.map(([name, ringClass]) => (
            <button
              key={name}
              type="button"
              className={`rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold outline-none ${ringClass}`}
            >
              ring-{name}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Iconography — Hugeicons">
        <div className="flex flex-wrap items-center gap-6">
          <Icon icon={PaintBoardIcon} size="lg" className="text-primary" />
          <Icon icon={TextFontIcon} size="lg" className="text-foreground" />
          <Icon icon={CheckmarkCircle02Icon} size="lg" className="text-success" />
          <Icon icon={Alert02Icon} size="lg" className="text-warning" />
          <Icon icon={InformationCircleIcon} size="lg" className="text-info" />
        </div>
      </Section>
    </main>
  );
}
