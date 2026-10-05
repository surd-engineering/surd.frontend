export type JobSection = {
  id: string;
  title: string;
  body?: string[];
  bullets?: string[];
};

export type Job = {
  slug: string;
  title: string;
  department: string;
  office: string;
  type: string;
  postedLabel: string;
  sections: JobSection[];
};

export const CAREERS_INTRO = {
  eyebrow: "Join the team",
  title: "Build simple money tools that help people move forward.",
  description:
    "At Surd, we are building savings products that make financial growth feel clear, consistent, and trustworthy.",
  action: "View open roles",
} as const;

export const HOW_WE_WORK = {
  eyebrow: "Meet the team",
  title: "How we work",
  body: "We work with clear ownership, open communication, and a strong focus on user needs. Surd is for people who care about building useful products, solving real problems, and improving the way people experience saving.",
  principles: [
    { label: "Simple communication", tone: "pink" },
    { label: "User-first thinking", tone: "yellow" },
    { label: "Reliable execution", tone: "aqua" },
    { label: "Continuous improvement", tone: "red" },
    { label: "Clear ownership", tone: "green" },
  ],
  highlight:
    "Everyone understands their contributions and takes pride in them.",
} as const;

export const OPPORTUNITIES = {
  eyebrow: "Opportunities",
  title: "Come take a sit with us, we're hiring",
  emptyTitle: "No job openings here just yet!",
  emptyBody:
    "If you think you've got what it takes to join our crew, we'd love to hear from you!",
  emptyEmail: "careers@surdfinance.com",
} as const;

export const EQUAL_OPPORTUNITY =
  "Surd Finance is an equal opportunity employer. We hire on merit and welcome applications from candidates of all backgrounds, and experience levels, as long as you're based in the required location.";

const ABOUT_SURD: JobSection = {
  id: "about-surd-finance",
  title: "About Surd Finance",
  body: [
    "Surd is the savings infrastructure helping thousands of people build money habits that stick. We process millions of naira in deposits every month and obsess over one thing: making saving feel effortless for the people who depend on us. Our team is small, our ownership is real, and the code we ship on Monday is in production by Friday.",
  ],
};

export const OPEN_ROLES: Job[] = [
  {
    slug: "senior-front-end-engineer",
    title: "Senior Front-End Engineer",
    department: "Engineering",
    office: "Lagos (Hybrid)",
    type: "Full time",
    postedLabel: "Posted March 18, 2026",
    sections: [
      ABOUT_SURD,
      {
        id: "the-role",
        title: "The Role",
        body: [
          "We're looking for a Frontend Engineer to own the customer-facing layer of Surd — the dashboard where people check their balances, start plans, and track every goal. This is not a component-library maintenance role. You'll be making product decisions, shaping UX, and building features that customers interact with every single day. You'll work directly with our Product Manager and CTO, embedded in a four-person product squad that ships every two weeks.",
        ],
      },
      {
        id: "what-youll-be-doing",
        title: "What you'll be doing",
        bullets: [
          "Own the Surd customer dashboard end-to-end — architecture, component design, performance, and accessibility",
          "Build and maintain the onboarding experience that new savers meet first — the most conversion-critical surface we have",
          "Collaborate with the backend team to design API contracts that make the frontend a joy to build on, not an afterthought",
          "Translate complex financial data — transaction histories, interest accruals, goal projections — into interfaces anyone can navigate",
          "Define and enforce frontend standards across the codebase: component patterns, state management conventions, test coverage expectations",
          "Identify and fix performance bottlenecks; our customers are often on mobile, on lower-bandwidth connections, and the app must feel fast regardless",
          "Participate in design reviews and push back when a design will be slow, inaccessible, or difficult to maintain at scale",
          "Contribute to our public-facing pages and documentation, keeping the brand consistent from landing page to logged-in dashboard",
        ],
      },
      {
        id: "job-requirements",
        title: "Job Requirements (Must have)",
        bullets: [
          "3–5 years of experience building production frontend applications, with at least 2 years in React",
          "A strong command of TypeScript — we write typed code and expect you to care about it",
          "Experience building data-heavy interfaces: tables, charts, filters, exports, pagination — the kind of UX that financial products demand",
          "A genuine eye for detail; you notice when spacing is off, when a loading state is missing, when a button label doesn't match the action it triggers",
          "Experience working with REST APIs and a solid understanding of async data patterns — loading states, error handling, optimistic UI",
          "Familiarity with performance optimisation — code splitting, lazy loading, render profiling, bundle analysis",
          "Experience writing unit and integration tests; we use Vitest and React Testing Library",
          "Strong communication skills — you'll be writing specs, leaving thorough PR reviews, and representing frontend decisions in cross-functional conversations",
        ],
      },
      {
        id: "compensation-benefits",
        title: "Compensation & Benefits",
        bullets: [
          "Competitive salary benchmarked against Lagos and remote Nigerian market rates — shared transparently at first-round stage, no games",
          "Flexible working hours — we care about delivery, not when you're online",
          "Hybrid for Lagos; fully remote for everywhere else in Nigeria",
          "Direct access to leadership — no layers, no management theatre",
        ],
      },
    ],
  },
  {
    slug: "senior-brand-designer",
    title: "Senior Brand Designer",
    department: "Product",
    office: "Lagos (Hybrid)",
    type: "Full time",
    postedLabel: "Posted March 18, 2026",
    sections: [
      ABOUT_SURD,
      {
        id: "the-role",
        title: "The Role",
        body: [
          "You'll own how Surd looks and feels everywhere it appears — product, campaigns, social, and print. You will work alongside product design but your remit is the brand itself: the system, the voice, and the consistency of both.",
        ],
      },
      {
        id: "what-youll-be-doing",
        title: "What you'll be doing",
        bullets: [
          "Evolve and document the Surd visual identity across every surface",
          "Design campaign work that earns attention without straying from the system",
          "Partner with product design so brand and interface stay in step",
          "Set the standard for typography, illustration and motion in our work",
        ],
      },
      {
        id: "job-requirements",
        title: "Job Requirements (Must have)",
        bullets: [
          "4+ years of brand or visual design experience, ideally including a consumer product",
          "A portfolio showing systems thinking, not just individual artefacts",
          "Fluency in Figma and a strong grasp of design tokens",
          "Comfort giving and receiving direct critique",
        ],
      },
      {
        id: "compensation-benefits",
        title: "Compensation & Benefits",
        bullets: [
          "Competitive salary, shared transparently at first-round stage",
          "Flexible working hours",
          "Hybrid for Lagos; fully remote for everywhere else in Nigeria",
        ],
      },
    ],
  },
  {
    slug: "senior-back-end-engineer",
    title: "Senior Back-End Engineer",
    department: "Engineering",
    office: "Lagos (Hybrid)",
    type: "Full time",
    postedLabel: "Posted March 18, 2026",
    sections: [
      ABOUT_SURD,
      {
        id: "the-role",
        title: "The Role",
        body: [
          "You'll own the services that move and account for customer money — ledgers, scheduled debits, interest accrual and partner bank integrations. Correctness matters more than speed here, and you'll set the bar for both.",
        ],
      },
      {
        id: "what-youll-be-doing",
        title: "What you'll be doing",
        bullets: [
          "Design and operate the double-entry ledger that every product balance derives from",
          "Build resilient integrations with partner banks and payment processors",
          "Own the scheduling system behind automatic savings",
          "Define observability standards — if it moves money, we can trace it",
        ],
      },
      {
        id: "job-requirements",
        title: "Job Requirements (Must have)",
        bullets: [
          "5+ years building backend services in production",
          "Direct experience with financial systems, ledgers or payments",
          "Strong SQL and data-modelling skills",
          "A rigorous approach to testing and failure handling",
        ],
      },
      {
        id: "compensation-benefits",
        title: "Compensation & Benefits",
        bullets: [
          "Competitive salary, shared transparently at first-round stage",
          "Flexible working hours",
          "Hybrid for Lagos; fully remote for everywhere else in Nigeria",
        ],
      },
    ],
  },
  {
    slug: "tax-regulatory-compliance-officer",
    title: "Tax Regulatory & Compliance Officer",
    department: "Compliance",
    office: "Lagos (Hybrid)",
    type: "Full time",
    postedLabel: "Posted March 18, 2026",
    sections: [
      ABOUT_SURD,
      {
        id: "the-role",
        title: "The Role",
        body: [
          "You'll keep Surd on the right side of every regulation that applies to us, and make compliance something the team can act on rather than fear.",
        ],
      },
      {
        id: "what-youll-be-doing",
        title: "What you'll be doing",
        bullets: [
          "Own regulatory reporting and our relationships with regulators",
          "Maintain KYC and AML policy, and audit how well we follow it",
          "Advise product teams early, while decisions are still cheap to change",
          "Track regulatory change and translate it into concrete work",
        ],
      },
      {
        id: "job-requirements",
        title: "Job Requirements (Must have)",
        bullets: [
          "4+ years in financial services compliance in Nigeria",
          "Working knowledge of CBN regulation and Nigerian tax law",
          "A relevant professional qualification (ACA, ACCA, CISA or similar)",
          "The judgement to say no clearly, and the pragmatism to offer an alternative",
        ],
      },
      {
        id: "compensation-benefits",
        title: "Compensation & Benefits",
        bullets: [
          "Competitive salary, shared transparently at first-round stage",
          "Flexible working hours",
          "Hybrid for Lagos; fully remote for everywhere else in Nigeria",
        ],
      },
    ],
  },
];

export const DEPARTMENTS = [
  "All departments",
  ...Array.from(new Set(OPEN_ROLES.map((role) => role.department))),
];

export const OFFICES = [
  "All offices",
  ...Array.from(new Set(OPEN_ROLES.map((role) => role.office))),
];

export function findJob(slug: string) {
  return OPEN_ROLES.find((role) => role.slug === slug);
}
