# SURD — Website

The public marketing site: landing page, blog, FAQs, careers, about and legal
pages.

---

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build — run before opening a PR
npm run lint
```

Visit [`/foundations`](http://localhost:3000/foundations) for a live reference of
every design token (colour ramps, type scale, shadows, blur, focus rings,
icons). It is a developer aid, not a public page.

---

## Stack

| Concern       | Choice                                                  |
| ------------- | ------------------------------------------------------- |
| Framework     | Next.js 16 (App Router, React Server Components)         |
| Language      | TypeScript, strict mode                                  |
| Styling       | Tailwind CSS v4 — CSS-first config, no `tailwind.config` |
| Components    | [Radix UI](https://www.radix-ui.com) (`radix-ui` package) |
| Icons         | [Hugeicons](https://hugeicons.com) by HalalLab            |
| Font          | Batica Sans (display, variable, `app/fonts/`) + Plus Jakarta Sans (body, `next/font/google`) |

---

## Folder layout

```
app/                    routes only — one folder per URL segment
  layout.tsx            html shell, fonts, header + footer
  globals.css           the entire design system (see below)
  foundations/          token reference page (dev only)
components/
  brand/                logo lockups
  layout/               container, site-header, site-footer
  sections/             page sections, grouped by page
  ui/                   reusable primitives (button, icon, accordion…)
content/                copy and data as plain typed objects
lib/                    framework-agnostic helpers (cn, formatters)
public/
  brand/  icons/  patterns/   exported Figma assets
```

### Naming

**Files and folders are lowercase, hyphen-separated.** No exceptions.

```
✅ components/ui/download-app-button.tsx
✅ components/sections/landing/hero-section.tsx
❌ components/ui/DownloadAppButton.tsx
❌ components/ui/downloadAppButton.tsx
```

React components themselves stay `PascalCase`; only the filename is kebab-case.
Import via the `@/` alias (`@/components/ui/button`), never a relative `../../`
chain.

---

## The design system

Everything lives in [`app/globals.css`](app/globals.css) in three layers. Read
it once before writing any UI — it will save you guessing.

### 1. Primitives

The raw palette and scales, straight from Figma. Tailwind's stock values are
cleared (`--color-*: initial`) so **only SURD tokens are available**. There is no
`bg-zinc-500`; there is `bg-grey-500`.

- Colour — `surd-blue-50…900`, `grey-10…1000`, plus `green` `aqua` `blue`
  `purple` `pink` `red` `orange` `yellow` (`50…950`)
- Type — `text-display-*`, `text-heading-*`, `text-{2xs…2xl}`,
  `text-paragraph-*`, `text-label-*`
- Effects — `shadow-{xs…2xl}`, `blur-*` / `backdrop-blur-*`,
  `shadow-ring-*` for focus states

### 2. Semantic tokens

What components should actually reference, so a theme change is one edit:

```
bg-background   bg-surface   bg-surface-raised
text-foreground text-foreground-muted text-foreground-subtle
border-border   border-border-strong
bg-primary      text-primary-foreground   bg-primary-subtle
bg-success / bg-warning / bg-danger / bg-info  (+ -subtle, -foreground)
```

Prefer these over raw palette steps. Reach for `grey-800` directly only when
replicating a specific Figma value that has no semantic equivalent.

### 3. Theming

Dark mode follows the OS by default. Adding `.dark` or `.light` to `<html>`
overrides it. The grey ramp mirrors between themes exactly as the Figma colour
board shows — `grey-10` is the lightest surface in light mode and the darkest in
dark mode.

### Typography usage

Size utilities carry line-height and tracking; pick the weight separately.

```tsx
<h1 className="text-heading-lg font-extrabold">…</h1>
<p className="text-paragraph-md">…</p>          {/* weight is baked in */}
<span className="text-label-sm uppercase">…</span>
```

| Family      | Use for                                       |
| ----------- | --------------------------------------------- |
| `display`   | Oversized marketing statements                |
| `heading`   | Section and page headings                     |
| `text`      | UI copy — buttons, labels, table cells        |
| `paragraph` | Long-form prose (Regular, 1.6 leading)        |
| `label`     | Eyebrows and overlines (ExtraBold, +10% track) |

---

## Layout and responsiveness

### One container, everywhere

Every section wraps its content in [`<Container>`](components/layout/container.tsx).
Do not hand-roll `max-w-* mx-auto px-*` — that is how gutters drift apart.

```tsx
<section className="py-20">
  <Container>…</Container>
</section>
```

It gives one gutter scale (`px-5 → px-20`) and one measure (1352px, matching the
1512px Figma frame minus its gutters). Past that width the content stops growing
and centres, so very wide displays stay comfortable to read rather than
stretching edge to edge. `width="prose"` narrows it for articles and legal copy.

### Breakpoints

Tailwind defaults, mapped to the devices we support:

| Token  | Min width | Target        |
| ------ | --------- | ------------- |
| _base_ | 0         | Mobile        |
| `sm`   | 640px     | Large phone   |
| `md`   | 768px     | Small tablet  |
| `lg`   | 1024px    | Large tablet  |
| `xl`   | 1280px    | Laptop        |
| `2xl`  | 1536px    | Large desktop |

**Write mobile first.** Unprefixed classes describe the phone; add `sm:`, `lg:`
and so on to grow. The Figma boards are desktop-only (1512px), so anything below
`lg` is our call — collapse multi-column grids to one column, swap inline nav for
the dialog menu, and step type down a size or two.

Check every change at 390, 768, 1024, 1440 and 1920 before you push.

---

## Writing components

1. **Server by default.** Only add `"use client"` when you need state, effects or
   browser events. `site-header.tsx` is a client component because the mobile
   menu holds open state; `site-footer.tsx` is not.
2. **Accept `className` and merge with `cn()`** so callers can adjust spacing
   without a wrapper div.
3. **Type props from the DOM element** you render rather than re-declaring them:
   ```tsx
   type CardProps = React.ComponentProps<"article"> & { tone?: CardTone };
   ```
4. **Variants are lookup objects,** not chained ternaries — see
   [`button.tsx`](components/ui/button.tsx):
   ```tsx
   const variants = { primary: "…", outline: "…" } as const;
   export type ButtonVariant = keyof typeof variants;
   ```
5. **Keep lines short and sections small.** If a component passes ~150 lines,
   split it. A page is a list of sections; a section is a list of small parts.
6. **Copy lives in `content/`,** not inline in JSX. Pages read data and render it.

### Using Radix

Import the namespace from the unified package:

```tsx
import { Accordion } from "radix-ui";

<Accordion.Root type="single" collapsible>
  <Accordion.Item value="fees">
    <Accordion.Header>
      <Accordion.Trigger>What are the fees?</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>…</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>;
```

Radix ships behaviour and accessibility, no styling — bring your own Tailwind
classes. Use `asChild` to keep the DOM clean instead of nesting a `<button>` in a
`<button>`.

### Using icons

```tsx
import { Home01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";

<Icon icon={Home01Icon} size="md" className="text-primary" />;
```

Sizes are `xs` 16 / `sm` 20 / `md` 24 / `lg` 32 / `xl` 40, or pass a number.
Icons inherit `currentColor`, so colour them with any text utility.

---

## Assets

Figma exports live under `public/` in `brand/`, `icons/` and `patterns/`.
**Download and commit the file — never hand-author an SVG** to stand in for a
design asset, and never point at a `figma.com/api/mcp/asset/...` URL in committed
code (those expire after ~7 days).

Decorative artwork gets `alt=""` and `aria-hidden`.

---

## Adding a page

1. Create `app/<kebab-case-route>/page.tsx`.
2. Export `metadata` for the title and description.
3. Build the page as a list of sections in
   `components/sections/<route>/`, one file per section.
4. Put copy in `content/<route>.ts`.
5. Add the route to `PRIMARY_NAV` or `FOOTER_COLUMNS` in
   [`content/site.ts`](content/site.ts) if it should be linked.

The header and footer come from the root layout — pages never render them.

---

## Page map

| Route                | Content source        | Sections                                                    |
| -------------------- | --------------------- | ----------------------------------------------------------- |
| `/`                  | `content/landing.ts`  | hero, products, why-surd, benefits, goals marquee, calculator, testimonials, FAQ |
| `/about-us`          | `content/about.ts`    | intro collage, vision/mission, core values, story, team, hiring CTA |
| `/careers`           | `content/careers.ts`  | intro, gallery, how-we-work, filterable open roles           |
| `/careers/[slug]`    | `content/careers.ts`  | job hero, body + TOC, apply dialog                            |
| `/faqs`              | `content/faqs.ts`     | dark hero + search, category rail, accordion                  |
| `/terms-of-service`  | `content/legal.ts`    | hero, TOC, numbered body                                      |
| `/privacy-policy`    | `content/legal.ts`    | same renderer as terms                                        |
| `/foundations`       | —                     | design-token reference (dev only)                             |

Legal pages share one renderer (`components/sections/legal/legal-document.tsx`)
and differ only in content. The landing FAQ reuses the first category from
`/faqs`, so the two never drift apart.

### Adding a job

Append to `OPEN_ROLES` in [`content/careers.ts`](content/careers.ts). The route,
the filters, the department and office dropdowns, and `generateStaticParams`
all derive from that array — nothing else to touch. Swapping the array for an
ATS fetch is the only change needed to go live.

---

