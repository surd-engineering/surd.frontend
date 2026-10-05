import { FlashIcon } from "@hugeicons/core-free-icons";
import Image from "next/image";
import { Section, SectionHeading } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { TESTIMONIALS, TESTIMONIALS_INTRO } from "@/content/landing";

export function TestimonialsSection() {
  return (
    <Section spacing="md">
      <SectionHeading
        align="left"
        eyebrow={<Eyebrow icon={FlashIcon}>{TESTIMONIALS_INTRO.eyebrow}</Eyebrow>}
        title={TESTIMONIALS_INTRO.title}
        className="max-w-xl"
      />

      <div className="mt-10 -mr-5 overflow-hidden sm:-mr-8 lg:-mr-12 xl:-mr-20">
        <div className="flex w-max animate-marquee-slow gap-4 hover:[animation-play-state:paused]">
          {[0, 1].map((pass) => (
            <ul
              key={pass}
              aria-hidden={pass === 1}
              className="flex shrink-0 gap-4"
            >
              {TESTIMONIALS.map((testimonial) => (
                <li
                  key={testimonial.name}
                  className="relative flex w-[85vw] max-w-[480px] shrink-0 flex-col justify-between gap-10 overflow-hidden rounded-3xl bg-grey-25 p-6 sm:w-[480px] sm:p-8 lg:min-h-[430px]"
                >
                  <blockquote className="text-paragraph-lg font-medium text-grey-700">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>

                  <div>
                    <p className="text-md font-semibold text-grey-900">
                      {testimonial.name}
                    </p>
                    <p className="text-md text-grey-400 font-medium">{testimonial.role}</p>
                  </div>

                  <Image
                    src="/patterns/Soft Flower.svg"
                    alt=""
                    aria-hidden
                    width={74}
                    height={48}
                    unoptimized
                    className="pointer-events-none absolute right-0 bottom-2 w-[72px] translate-x-3"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </Section>
  );
}
