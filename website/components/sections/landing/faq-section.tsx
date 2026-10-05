import { FlashIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Accordion } from "@/components/ui/accordion";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LANDING_FAQS } from "@/content/faqs";
import { LANDING_FAQ_INTRO } from "@/content/landing";

export function FaqSection() {
  return (
    <section className=" bg-grey-1000 py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="flex flex-col items-center gap-4 text-center">
          <Eyebrow
            tone="dark"
            icon={FlashIcon}
            className="bg-blue-900 text-surd-blue-100"
          >
            {LANDING_FAQ_INTRO.eyebrow}
          </Eyebrow>
          <h2 className="max-w-lg font-batica font-bold text-heading-md tracking-wide text-balance text-white sm:text-heading-lg">
            {LANDING_FAQ_INTRO.title}
          </h2>
          <p className="text-sm text-grey-400">
            {LANDING_FAQ_INTRO.body}{" "}
            <Link href="/faqs" className="font-semibold text-surd-blue-400 underline">
              {LANDING_FAQ_INTRO.linkLabel}
            </Link>
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <Accordion
            items={LANDING_FAQS}
            tone="dark"
            defaultValue={LANDING_FAQS[0]?.id}
          />
        </div>
      </Container>
    </section>
  );
}
