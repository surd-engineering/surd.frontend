import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BriefcaseDollarIcon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import { Container } from "@/components/layout/container";
import { HeroBand } from "@/components/layout/hero-band";
import { BackToTop } from "@/components/ui/back-to-top";
import { Icon } from "@/components/ui/icon";
import {
  TableOfContents,
  type TocEntry,
} from "@/components/ui/table-of-contents";
import { ApplyDialog } from "@/components/sections/careers/apply-dialog";
import { EQUAL_OPPORTUNITY, OPEN_ROLES, findJob } from "@/content/careers";

export function generateStaticParams() {
  return OPEN_ROLES.map((role) => ({ slug: role.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/careers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const job = findJob(slug);
  if (!job) return { title: "Role not found" };

  return {
    title: job.title,
    description: `${job.title} — ${job.office}, ${job.type}. ${job.department} at SURD.`,
  };
}

export default async function JobPage({ params }: PageProps<"/careers/[slug]">) {
  const { slug } = await params;
  const job = findJob(slug);
  if (!job) notFound();

  const toc: TocEntry[] = job.sections.map((section) => ({
    id: section.id,
    label: section.title,
  }));

  return (
    <>
      <HeroBand
        tone="blue"
        eyebrow={
          <span className="flex flex-wrap items-center justify-center gap-3 text-lg">
            <span className="inline-flex items-center gap-1.5">
              <Icon icon={Location01Icon} size={16} className="text-primary" />
              {job.office}
            </span>
            <span aria-hidden className="text-grey-400">
              —
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon
                icon={BriefcaseDollarIcon}
                size={16}
                className="text-primary"
              />
              {job.type}
            </span>
          </span>
        }
        title={job.title}
      >
        <p className="text-sm font-bold tracking-[0.1em] text-grey-600 uppercase  pb-20">
          {job.postedLabel}
        </p>
      </HeroBand>

      <Container className="py-16 lg:py-20">
        <div className="flex flex-col-reverse gap-12 lg:flex-row lg:gap-16">
          <article className="flex min-w-0 flex-1 flex-col gap-10">
            {job.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="flex scroll-mt-28 flex-col gap-3"
              >
                <h2 className="text-xl font-bold text-grey-800">
                  {section.title}
                </h2>

                {section.body?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-paragraph-lg text-grey-500"
                  >
                    {paragraph}
                  </p>
                ))}

                {section.bullets ? (
                  <ul className="flex list-disc flex-col gap-2 pl-5 text-paragraph-lg text-grey-600 marker:text-grey-300">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            <div className="mt-2 ">
              <ApplyDialog jobTitle={job.title} />
            </div>

            <p className="max-w-2xl text-md font-medium text-grey-400 italic">
              {EQUAL_OPPORTUNITY}
            </p>
          </article>

          <aside className="lg:w-64 lg:shrink-0">
            <div className="flex flex-col gap-8 lg:sticky lg:top-28">
              <TableOfContents entries={toc} />
              <div className="hidden justify-start lg:flex">
                <BackToTop />
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
