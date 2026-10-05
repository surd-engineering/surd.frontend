"use client";

import { useId } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/cn";
import { formatCompactMoney, formatMoney, formatPercent } from "@/lib/format";
import type { Currency } from "@/types/enum";

export const SERIES_COLORS = {
  flexi: "#0066ff",
  savings: "#e58600",
  roi: "#00ac36",
} as const;

const axisStyle = {
  fontSize: 12,
  fill: "#818181",
} as const;

const gridProps = {
  stroke: "#e8e8e8",
  strokeDasharray: "4 4",
  vertical: false,
} as const;

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #e8e8e8",
  fontSize: 12,
} as const;

function tickDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        timeZone: "Africa/Lagos",
      });
}

type SeriesChartProps<T> = {
  data: T[];
  currency?: Currency | string;

  series: { key: keyof T & string; name: string; color: string }[];
  height?: string;

  unit?: "money" | "percent";
};

export function SeriesChart<T extends { date: string }>({
  data,
  currency = "NGN",
  series,
  height = "h-72",
  unit = "money",
}: SeriesChartProps<T>) {
  const axisLabel = (value: number) =>
    unit === "percent" ? `${Math.round(value)}%` : formatCompactMoney(value, currency);

  const tooltipLabel = (value: number) =>
    unit === "percent" ? formatPercent(value) : formatMoney(value, currency);

  return (
    <div className={cn("w-full", height)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis
            dataKey="date"
            tickFormatter={tickDate}
            tickLine={false}
            axisLine={false}
            tick={axisStyle}
            minTickGap={24}
            dy={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={axisStyle}
            tickFormatter={axisLabel}
            domain={unit === "percent" ? [0, 100] : undefined}
            width={unit === "percent" ? 48 : 72}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelFormatter={(label) => tickDate(String(label))}
            formatter={(value) => tooltipLabel(Number(value))}
          />
          {series.map((line) => (
            <Line
              key={line.key}
              type="linear"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={2.75}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarSeriesChart<T extends { date: string }>({
  data,
  currency = "NGN",
  dataKey,
  name,
  height = "h-72",
}: {
  data: T[];
  currency?: Currency | string;
  dataKey: keyof T & string;
  name: string;
  height?: string;
}) {
  const peak = data.reduce(
    (highest, point) => Math.max(highest, Number(point[dataKey]) || 0),
    0,
  );

  return (
    <div className={cn("w-full", height)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis
            dataKey="date"
            tickFormatter={tickDate}
            tickLine={false}
            axisLine={false}
            tick={axisStyle}
            minTickGap={16}
            dy={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={axisStyle}
            tickFormatter={(value: number) => formatCompactMoney(value, currency)}
            width={72}
          />
          <Tooltip
            cursor={{ fill: "#0066ff", fillOpacity: 0.04 }}
            contentStyle={tooltipStyle}
            labelFormatter={(label) => tickDate(String(label))}
            formatter={(value) => formatMoney(Number(value), currency)}
          />
          <Bar
            dataKey={dataKey as string}
            name={name}
            radius={[999, 999, 4, 4]}
            maxBarSize={44}
          >
            {data.map((point, index) => (
              <Cell
                key={`${point.date}-${index}`}
                fill={
                  peak > 0 && Number(point[dataKey]) === peak ? "#0066ff" : "#b7cffd"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export type BreakdownSlice = {
  name: string;
  value: number;
  color: string;
};

const RADIAN = Math.PI / 180;

function LeadPercentBadge({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  shadow,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  percent: number;
  shadow: string;
}) {
  const x = cx + outerRadius * Math.cos(-midAngle * RADIAN);
  const y = cy + outerRadius * Math.sin(-midAngle * RADIAN);

  return (
    <g style={{ pointerEvents: "none" }}>
      <circle cx={x} cy={y} r={24} fill="#ffffff" filter={`url(#${shadow})`} />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={13}
        fontWeight={600}
        fill="#101010"
      >
        {Math.round(percent * 100)}%
      </text>
    </g>
  );
}

export function FundsBreakdownChart({
  data,
  currency = "NGN",
  badges = "lead",
}: {
  data: BreakdownSlice[];
  currency?: Currency | string;

  badges?: "lead" | "all";
}) {
  const shadow = `donut-badge-${useId().replace(/:/g, "")}`;

  const total = data.reduce((sum, slice) => sum + slice.value, 0);

  const leadIndex = data.reduce(
    (lead, slice, index) => (slice.value > data[lead].value ? index : lead),
    0,
  );

  return (
    <div className="h-56 w-full [&_.recharts-surface]:overflow-visible">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            <filter id={shadow} x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="3"
                floodColor="#101010"
                floodOpacity="0.16"
              />
            </filter>
          </defs>

          <Pie
            data={[{ value: 1 }]}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius="97%"
            outerRadius="100%"
            fill="#e8e8e8"
            stroke="none"
            isAnimationActive={false}
          />

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="56%"
            outerRadius="88%"
            paddingAngle={1}
            stroke="none"
            label={(props) =>
              total > 0 && (badges === "all" || props.index === leadIndex) ? (
                <LeadPercentBadge
                  cx={Number(props.cx)}
                  cy={Number(props.cy)}
                  midAngle={Number(props.midAngle)}
                  outerRadius={Number(props.outerRadius)}
                  percent={Number(props.percent)}
                  shadow={shadow}
                />
              ) : (
                <g />
              )
            }
            labelLine={false}
          >
            {data.map((slice) => (
              <Cell key={slice.name} fill={slice.color} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => formatMoney(Number(value), currency)}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ChartLegend({
  items,
}: {
  items: { label: string; color: string; value?: string }[];
}) {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2 text-xs">
          <span
            aria-hidden
            className="w-1 h-2.5 shrink-0 rounded-2xl"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-grey-400 text-sm font-medium">{item.label}</span>
          {item.value ? (
            <span className="font-semibold text-grey-900">{item.value}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
