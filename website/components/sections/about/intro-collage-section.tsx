import Image from "next/image";
import { Container } from "@/components/layout/container";
import { ABOUT_INTRO } from "@/content/about";
import commuterPhoto from "@/public/clips/about/commuter.jpg";
import couchPhoto from "@/public/clips/about/couch.jpg";
import friendsPhoto from "@/public/clips/about/friends.jpg";
import headphonesPhoto from "@/public/clips/about/headphones.jpg";

const WATERMARK_FADE =
  "linear-gradient(to bottom, rgb(0 0 0 / 0.9), transparent)";

const WATERMARK_TILE = {
  maskImage: "url(/patterns/surd-pattern.svg)",
  WebkitMaskImage: "url(/patterns/surd-pattern.svg)",
  maskSize: "580px 380px",
  WebkitMaskSize: "580px 380px",
  maskRepeat: "repeat-x",
  WebkitMaskRepeat: "repeat-x",
  maskPosition: "top left",
  WebkitMaskPosition: "top left",
} satisfies React.CSSProperties;

const CELL = "relative overflow-hidden rounded-2xl lg:rounded-3xl";

export function IntroCollageSection() {
  return (
    <section className="relative py-12 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-26 h-36 sm:-top-34 sm:h-44"
        style={{ maskImage: WATERMARK_FADE, WebkitMaskImage: WATERMARK_FADE }}
      >
        <div className="size-full bg-grey-50 opacity-50" style={WATERMARK_TILE} />
      </div>

      <Container className="relative" noPadding>
        <div
          className={
            "relative grid grid-cols-2 gap-3 sm:gap-4 " +
            "lg:aspect-[1352/496] lg:grid-cols-[666fr_323fr_323fr] lg:grid-rows-2 lg:gap-5"
          }
        >
          <div
            className={`${CELL} col-span-2 aspect-[4/3] lg:col-span-1 lg:row-span-2 lg:aspect-auto`}
          >
            <Image
              src={friendsPhoto}
              alt="Two women laughing together at a garden celebration"
              fill
              priority
              placeholder="blur"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <Image
              src="/patterns/about-burst-pink.svg"
              alt=""
              aria-hidden
              width={116}
              height={119}
              unoptimized
              className="pointer-events-none absolute -top-[12%] left-[1%] h-auto w-[17%]"
            />
          </div>

          <div className={`${CELL} aspect-[323/238] lg:aspect-auto`}>
            <Image
              src={commuterPhoto}
              alt="Man in a tan blazer smiling at his phone"
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className={`${CELL} aspect-[323/238] lg:aspect-auto`}>
            <Image
              src={headphonesPhoto}
              alt="Woman in headphones smiling at her laptop"
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover"
            />
          </div>

          <div
            className={`${CELL} col-span-2 aspect-[666/238] lg:col-start-2 lg:aspect-auto`}
          >
            <Image
              src={couchPhoto}
              alt="Man relaxing on a couch, phone in hand"
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <Image
              src="/patterns/about-ring-yellow.svg"
              alt=""
              aria-hidden
              width={200}
              height={200}
              unoptimized
              className="pointer-events-none absolute -top-[57%] left-[68%] h-auto w-[30%]"
            />
          </div>

          <Image
            src="/patterns/about-clover-green.svg"
            alt=""
            aria-hidden
            width={82}
            height={82}
            unoptimized
            className="pointer-events-none absolute top-[53%] left-[50.5%] z-10 hidden h-auto w-[6%] -translate-x-1/2 -translate-y-1/2 lg:block"
          />

          <div
            aria-hidden
            className={
              "pointer-events-none absolute inset-0 hidden lg:block " +
              "bg-gradient-to-b from-transparent from-[55%] via-white/60 via-[74%] to-white to-[91%]"
            }
          />
        </div>

        <div className="mt-10 flex flex-col gap-6 lg:mt-4 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <h1 className="max-w-2xl font-batica text-heading-sm font-bold tracking-wide text-balance text-primary sm:text-heading-md">
            {ABOUT_INTRO.title}
          </h1>
          <p className="max-w-[29rem] text-paragraph-md text-grey-400 font-medium">
            {ABOUT_INTRO.body}
          </p>
        </div>
      </Container>
    </section>
  );
}
