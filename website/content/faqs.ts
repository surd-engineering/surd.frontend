import type { AccordionEntry } from "@/components/ui/accordion";

export const FAQ_HERO = {
  title: "Frequently Asked Questions",
  body: "Have a question? We’ve got answers! Browse through our most commonly asked questions below. If you still can’t find what you’re looking for, feel free to reach out to our team—we’re always happy to help.",
  searchPlaceholder: "Search articles, topics, or money tips",
} as const;

export type FaqCategory = {
  id: string;
  label: string;
  items: AccordionEntry[];
};

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "security",
    label: "Security & Peace of Mind",
    items: [
      {
        id: "withdraw-anytime",
        question: "Can I withdraw my savings anytime?",
        answer:
          "Yes. Your money is always yours. If life happens or your plans change, you can access your savings whenever you need them, subject to the terms of your savings plan.",
      },
      {
        id: "how-much-to-start",
        question: "How much do I need to start saving?",
        answer:
          "You can start with any amount that feels comfortable. There is no minimum balance to open a Flexi Wallet, and target plans let you set the pace yourself.",
      },
      {
        id: "multiple-goals",
        question: "Can I create multiple savings goals?",
        answer:
          "You can run as many goals as you like at once — a rent fund, a travel fund and an emergency buffer can each have their own target, schedule and progress.",
      },
      {
        id: "money-safe",
        question: "Is my money safe with Surd?",
        answer:
          "Your funds are held with licensed partner institutions and protected by bank-level encryption. We never share your personal information without your consent.",
      },
      {
        id: "automatic-saving",
        question: "How does automatic saving work?",
        answer:
          "Pick an amount and a rhythm — daily, weekly or monthly — and Surd moves the money for you. You can pause, resume or adjust it at any time.",
      },
      {
        id: "change-plan",
        question: "Can I change or pause my savings plan?",
        answer:
          "Always. Plans bend to your circumstances: change the amount, shift the date, or pause entirely without losing the progress you have already made.",
      },
      {
        id: "why-not-bank",
        question: "Why should I use Surd instead of saving in my bank account?",
        answer:
          "A bank account holds money; Surd helps you build the habit. Goals, automation and progress tracking turn saving into something you do consistently rather than occasionally.",
      },
    ],
  },
  {
    id: "interest",
    label: "Earning Interest & Savings Goals",
    items: [
      {
        id: "interest-rate",
        question: "How much interest do I earn?",
        answer:
          "Rates depend on the product. Fixed Deposit pays the highest return in exchange for locking funds for a set period, while Flexi Wallet trades a little yield for instant access.",
      },
      {
        id: "interest-paid",
        question: "When is interest paid?",
        answer:
          "Interest accrues daily and is credited to your balance at the end of each cycle, so you can watch it grow rather than waiting for a statement.",
      },
      {
        id: "goal-reached",
        question: "What happens when I reach a goal?",
        answer:
          "You will be notified as soon as the target is met. From there you can withdraw the funds, roll them into a new goal, or keep saving past the original target.",
      },
    ],
  },
  {
    id: "deposits",
    label: "Deposits & Withdrawals",
    items: [
      {
        id: "fund-account",
        question: "How do I fund my account?",
        answer:
          "Add money by bank transfer, card, or a direct debit that runs on your chosen schedule. Deposits usually reflect within minutes.",
      },
      {
        id: "withdrawal-time",
        question: "How long do withdrawals take?",
        answer:
          "Flexi Wallet withdrawals are typically instant. Fixed Deposit withdrawals are released at maturity, or earlier with an adjustment to the interest earned.",
      },
      {
        id: "withdrawal-limit",
        question: "Is there a withdrawal limit?",
        answer:
          "Standard daily limits apply for security. If you need to move a larger amount, our team can raise the limit after a quick verification.",
      },
    ],
  },
  {
    id: "account",
    label: "Account Setup & Fees",
    items: [
      {
        id: "open-account",
        question: "What do I need to open an account?",
        answer:
          "A valid ID, a phone number and a few minutes. Verification is handled in the app and most accounts are ready to use straight away.",
      },
      {
        id: "fees",
        question: "Does Surd charge any fees?",
        answer:
          "Saving with Surd is free. Where a partner bank or card network charges a transfer fee, we show it to you before you confirm.",
      },
      {
        id: "close-account",
        question: "Can I close my account?",
        answer:
          "Yes. Withdraw your balance and close the account from settings, or contact support and we will handle it for you.",
      },
    ],
  },
];

export const LANDING_FAQS = FAQ_CATEGORIES[0].items;
