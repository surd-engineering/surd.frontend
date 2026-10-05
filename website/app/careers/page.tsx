import type { Metadata } from "next";
import { ArrowDownDoubleIcon, FlashIcon } from "@hugeicons/core-free-icons";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Icon } from "@/components/ui/icon";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { OpenRoles } from "@/components/sections/careers/open-roles";
import { CAREERS_INTRO, HOW_WE_WORK, OPEN_ROLES } from "@/content/careers";
import { cn } from "@/lib/cn";
import { SHIMMER } from "@/lib/image-placeholder";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Help build savings products that make financial growth feel clear, consistent and trustworthy.",
};

const principleTones: Record<string, { card: string; pill: string }> = {
  pink: { card: "bg-pink-50", pill: "bg-pink-150 text-pink-950" },
  yellow: { card: "bg-yellow-50", pill: "bg-yellow-150 text-yellow-950" },
  aqua: { card: "bg-aqua-50", pill: "bg-aqua-150 text-aqua-950" },
  red: { card: "bg-red-50", pill: "bg-red-150 text-red-950" },
  green: { card: "bg-green-50", pill: "bg-green-150 text-green-950" },
};

const pillClass =
  "inline-flex w-fit items-center rounded-full px-4 py-2 text-md font-semibold";

const stackedPrinciples = HOW_WE_WORK.principles.slice(0, -1);
const featuredPrinciple =
  HOW_WE_WORK.principles[HOW_WE_WORK.principles.length - 1];

export default function CareersPage() {
  return (
    <>
      <Section spacing="sm">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="flex flex-col gap-5">
            <Eyebrow icon={FlashIcon}>{CAREERS_INTRO.eyebrow}</Eyebrow>
            <h1 className="max-w-xl text-heading-md font-extrabold text-balance sm:text-heading-lg">
              {CAREERS_INTRO.title}
            </h1>
          </div>
          <div className="flex max-w-md flex-col items-start gap-6">
            <p className="text-paragraph-md font-medium text-grey-400">
              {CAREERS_INTRO.description}
            </p>
            <Button asChild>
              <a href="#open-roles">
                {CAREERS_INTRO.action}
                <Icon icon={ArrowDownDoubleIcon} size={20} strokeWidth={2} />
              </a>
            </Button>
          </div>
        </div>
      </Section>

      <Section spacing="sm" bleed>
        <div className="flex gap-4">
          {["Team at work", "Office", "Offsite", "Desk setup"].map(
            (label, index) => (
              <MediaPlaceholder
                key={label}
                label={label}
                aspect=""
                className={cn(
                  "min-w-0 flex-1",
                  index % 2 === 0 ? "h-64 sm:h-92" : "h-72 self-end sm:h-128",
                )}
              />
            ),
          )}
        </div>
      </Section>

      <Section spacing="lg" noPadding={false} className="!max-w-[1000px] !w-auto mx-auto">
        <div className="flex flex-col gap-5">
          <Eyebrow icon={FlashIcon}>{HOW_WE_WORK.eyebrow}</Eyebrow>
          <h2 className="text-heading-sm font-extrabold sm:text-heading-lg">
            {HOW_WE_WORK.title}
          </h2>
          <p className="text-paragraph-md sm:text-paragraph-2xl text-grey-400 font-medium">
            {HOW_WE_WORK.body}
          </p>
        </div>

        <div className="mt-10 grid gap-15 lg:grid-cols-12">
          <div className="relative lg:col-span-7">
            <Image
              src="/clips/work.svg"
              alt="Person using the Surd app"
              fill
              unoptimized
              placeholder={SHIMMER}
              className="w-full rounded-3xl"
            />
          </div>

          <ul className="flex flex-col gap-4 lg:col-span-5">
            {stackedPrinciples.map((principle) => (
              <li
                key={principle.label}
                className={cn(
                  "flex flex-1 items-center rounded-3xl p-2 sm:p-8",
                  principleTones[principle.tone].card,
                )}
              >
                <span
                  className={cn(pillClass, principleTones[principle.tone].pill)}
                >
                  {principle.label}
                </span>
              </li>
            ))}
            <li
              className={cn(
                "flex min-h-54 flex-[2.6] flex-col justify-between gap-8 rounded-3xl p-2 sm:p-8",
                principleTones[featuredPrinciple.tone].card,
              )}
            >
              <p className="max-w-sm text-paragraph-md font-semibold text-balance text-green-950 sm:text-2xl">
                {HOW_WE_WORK.highlight}
              </p>
              <span
                className={cn(
                  pillClass,
                  principleTones[featuredPrinciple.tone].pill,
                )}
              >
                {featuredPrinciple.label}
              </span>
            </li>
          </ul>
        </div>
      </Section>
      <Container id="open-roles" className="scroll-mt-28 pb-20 lg:pb-28" noPadding>
        <OpenRoles roles={OPEN_ROLES} />
      </Container>
    </>
  );
}
