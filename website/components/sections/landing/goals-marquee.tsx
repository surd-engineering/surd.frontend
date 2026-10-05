import { SAVINGS_GOALS } from "@/content/landing";

export function GoalsMarquee() {
  return (
    <section
      aria-label="What people save for"
      className="overflow-hidden py-6"
    >
      <div className="flex w-max animate-marquee items-center gap-4">
        {[0, 1].map((pass) => (
          <ul
            key={pass}
            aria-hidden={pass === 1}
            className="flex shrink-0 items-center gap-4"
          >
            {SAVINGS_GOALS.map((goal) => (
              <li
                key={goal.label}
                className="flex items-center gap-3 rounded-full border border-grey-50 bg-white py-2 pr-6 pl-2 text-lg font-semibold whitespace-nowrap text-primary"
              >
                <span
                  aria-hidden
                  className="grid size-12 place-items-center rounded-full bg-surd-blue-50 text-xl"
                >
                  {goal.emoji}
                </span>
                {goal.label}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
