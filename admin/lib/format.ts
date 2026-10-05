import { ConfigUnit, isCryptoCurrency, type Currency } from "@/types/enum";

const LOCALE = "en-NG";

const TIME_ZONE = "Africa/Lagos";

const CRYPTO_DECIMALS: Record<string, number> = {
  USDT: 2,
  USDC: 2,
  BTC: 8,
  ETH: 6,
  BNB: 6,
  SOL: 4,
  TRX: 2,
};

const DEFAULT_CRYPTO_DECIMALS = 4;

export function formatMoney(
  amount: number | null | undefined,
  currency: Currency | string = "NGN",
  { decimals }: { decimals?: number } = {},
) {
  if (amount == null || Number.isNaN(amount)) return "—";

  if (isCryptoCurrency(currency)) {
    const places = decimals ?? CRYPTO_DECIMALS[currency] ?? DEFAULT_CRYPTO_DECIMALS;
    const value = new Intl.NumberFormat(LOCALE, {
      minimumFractionDigits: 0,
      maximumFractionDigits: places,
    }).format(amount);
    return `${value} ${currency}`;
  }

  try {
    return new Intl.NumberFormat(LOCALE, {
      style: "currency",
      currency,
      minimumFractionDigits: decimals ?? 2,
      maximumFractionDigits: decimals ?? 2,
    }).format(amount);
  } catch {
    return `${new Intl.NumberFormat(LOCALE).format(amount)} ${currency}`;
  }
}

export function formatCompactMoney(
  amount: number | null | undefined,
  currency: Currency | string = "NGN",
) {
  if (amount == null || Number.isNaN(amount)) return "—";

  if (isCryptoCurrency(currency)) {
    const value = new Intl.NumberFormat(LOCALE, {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(amount);
    return `${value} ${currency}`;
  }

  try {
    return new Intl.NumberFormat(LOCALE, {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  } catch {
    const value = new Intl.NumberFormat(LOCALE, {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
    return `${value} ${currency}`;
  }
}

export function formatCount(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat(LOCALE).format(value);
}

export function formatMultiple(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  return `${value.toFixed(2)}×`;
}

export function formatChange(
  pct: number | null | undefined,
  suffix = "from last month",
): { value: string; direction: "up" | "down" | "flat" } {
  if (pct == null || Number.isNaN(pct)) return { value: "—", direction: "flat" };
  const rounded = Math.round(pct * 10) / 10;
  return {
    value: `${rounded > 0 ? "+" : ""}${rounded}% ${suffix}`,
    direction: rounded > 0 ? "up" : rounded < 0 ? "down" : "flat",
  };
}

export function formatTimestamp(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const day = date.toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TIME_ZONE,
  });
  const time = date
    .toLocaleTimeString(LOCALE, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: TIME_ZONE,
    })
    .replace(/\s/g, "")
    .toUpperCase();

  return `${day}. ${time}`;
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TIME_ZONE,
  });
}

export function formatAbsoluteChange(
  amount: number | null | undefined,
  currency: Currency | string = "NGN",
  suffix = "today",
): { value: string; direction: "up" | "down" | "flat" } {
  if (amount == null || Number.isNaN(amount)) {
    return { value: "—", direction: "flat" };
  }

  const sign = amount > 0 ? "+" : amount < 0 ? "-" : "";
  return {
    value: `${sign}${formatCompactMoney(Math.abs(amount), currency)} ${suffix}`,
    direction: amount > 0 ? "up" : amount < 0 ? "down" : "flat",
  };
}

export function formatPercent(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  return `${Math.round(value * 100) / 100}%`;
}

export function formatConfigValue(value: number, unit: ConfigUnit | string) {
  switch (unit) {
    case ConfigUnit.Percentage:
      return formatPercent(value);
    case ConfigUnit.Ngn:
    case ConfigUnit.Usd:
      return formatMoney(value, unit, { decimals: 0 });
    case ConfigUnit.Hours:
      return `${formatCount(value)} ${value === 1 ? "hour" : "hours"}`;
    case ConfigUnit.Days:
      return `${formatCount(value)} ${value === 1 ? "day" : "days"}`;
    default:
      return formatCount(value);
  }
}

export function maskIp(ip: string | null | undefined) {
  if (!ip) return "—";
  const parts = ip.split(".");
  if (parts.length !== 4) return ip;
  return `${parts[0]}.${parts[1]}.xxx.xxx`;
}

export function formatDaysLeft(value: string | null | undefined) {
  if (!value) return null;

  const end = new Date(value);
  if (Number.isNaN(end.getTime())) return null;

  const ms = end.getTime() - Date.now();
  if (ms <= 0) return null;

  const days = Math.ceil(ms / 86_400_000);
  return `${formatCount(days)} ${days === 1 ? "day" : "days"} left`;
}

export function parseUserAgent(agent: string | null | undefined) {
  if (!agent) return null;

  const platform =
    /Windows/.test(agent) ? "Windows"
    : /iPhone/.test(agent) ? "iPhone"
    : /iPad/.test(agent) ? "iPad"
    : /Android/.test(agent) ? "Android"
    : /Mac OS X|Macintosh/.test(agent) ? "macOS"
    : /CrOS/.test(agent) ? "ChromeOS"
    : /Linux/.test(agent) ? "Linux"
    : "Unknown";

  const browser =
    match(agent, /Edg\/(\d+)/, "Edge") ??
    match(agent, /OPR\/(\d+)/, "Opera") ??
    match(agent, /Firefox\/(\d+)/, "Firefox") ??
    match(agent, /Chrome\/(\d+)/, "Chrome") ??
    match(agent, /Version\/(\d+).*Safari/, "Safari") ??
    "Browser";

  return { platform, browser };
}

function match(agent: string, pattern: RegExp, name: string) {
  const found = agent.match(pattern);
  return found ? `${name} ${found[1]}` : null;
}

export function formatEnum(value: string | null | undefined) {
  if (!value) return "—";
  const spaced = value.toLowerCase().replace(/_/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function formatName(person: {
  fullname?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  email?: string | null;
}) {
  if (person.fullname) return person.fullname;
  const parts = [person.firstname, person.lastname].filter(Boolean);
  return parts.length ? parts.join(" ") : (person.email ?? "Unknown");
}
