"use client";

import { useEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard";
import StatusBadge from "../components/StatusBadge";

const analyticsFallback = {
  metrics: [
    { label: "Sessions", value: "128.4K", change: "+14.8%" },
    { label: "Activation", value: "42.7%", change: "+5.3%" },
    { label: "Expansion", value: "$86.2K", change: "+12.1%" },
    { label: "Churn risk", value: "3.2%", change: "-1.4%" },
  ],
  funnel: [
    { label: "Visitors", value: 94 },
    { label: "Trials", value: 68 },
    { label: "Activated", value: 48 },
    { label: "Paid", value: 31 },
  ],
  cohorts: [
    ["Enterprise", "98.2%", "$148K"],
    ["Mid-market", "94.6%", "$72K"],
    ["Startup", "89.1%", "$28K"],
  ],
};

const revenueTrend = [
  { month: "Jan", value: 42 },
  { month: "Feb", value: 48 },
  { month: "Mar", value: 45 },
  { month: "Apr", value: 58 },
  { month: "May", value: 63 },
  { month: "Jun", value: 70 },
  { month: "Jul", value: 76 },
  { month: "Aug", value: 82 },
  { month: "Sep", value: 80 },
  { month: "Oct", value: 88 },
  { month: "Nov", value: 91 },
  { month: "Dec", value: 96 },
];

const leadsByStage = [
  { label: "New", value: 34, className: "bg-sky-300" },
  { label: "Contacted", value: 26, className: "bg-teal-300" },
  { label: "Qualified", value: 18, className: "bg-emerald-300" },
  { label: "Proposal", value: 9, className: "bg-violet-300" },
  { label: "Won", value: 6, className: "bg-emerald-400" },
];

const clientStatusBreakdown = [
  { label: "Active", value: 68, className: "bg-emerald-300/10 text-emerald-300" },
  { label: "Trial", value: 18, className: "bg-sky-300/10 text-sky-300" },
  { label: "Paused", value: 9, className: "bg-amber-300/10 text-amber-300" },
  { label: "Churned", value: 5, className: "bg-rose-300/10 text-rose-300" },
];

const kpiComparisons = [
  { label: "Pipeline velocity", value: "21 days", detail: "4 days faster" },
  { label: "Sales cycle", value: "36 days", detail: "2 days slower" },
  { label: "Net revenue retention", value: "118%", detail: "+6 pts QoQ" },
];

type AnalyticsData = typeof analyticsFallback;

function getChangeBadgeClass(change: string) {
  return change.trim().startsWith("-")
    ? "bg-rose-300/10 text-rose-300"
    : "bg-emerald-300/10 text-emerald-300";
}

function createSmoothTrendPath(points: { value: number }[]) {
  return points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 100 - point.value;

      if (index === 0) {
        return `M ${x},${y}`;
      }

      const previousX = ((index - 1) / (points.length - 1)) * 100;
      const previousY = 100 - points[index - 1].value;
      const controlX = (previousX + x) / 2;

      return `C ${controlX},${previousY} ${controlX},${y} ${x},${y}`;
    })
    .join(" ");
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] =
    useState<AnalyticsData>(analyticsFallback);

  useEffect(() => {
    let isMounted = true;

    async function fetchAnalyticsData() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/dashboard/analytics",
        );

        if (!response.ok) {
          throw new Error("Analytics request failed");
        }

        const data = (await response.json()) as AnalyticsData;

        if (isMounted) {
          setAnalyticsData(data);
        }
      } catch {
        if (isMounted) {
          setAnalyticsData(analyticsFallback);
        }
      }
    }

    fetchAnalyticsData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {analyticsData.metrics.map((metric) => (
          <DashboardCard
            className="transition hover:-translate-y-0.5 hover:border-teal-300/30 hover:bg-white/[0.06]"
            key={metric.label}
          >
            <p className="text-sm text-zinc-400">{metric.label}</p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <p className="text-3xl font-semibold tracking-tight">
                {metric.value}
              </p>
              <StatusBadge className={getChangeBadgeClass(metric.change)}>
                {metric.change}
              </StatusBadge>
            </div>
          </DashboardCard>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <RevenueTrendCard />
        <DashboardCard>
          <h2 className="text-xl font-semibold tracking-tight">
            KPI comparison
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Mock operating benchmarks versus last quarter.
          </p>
          <div className="mt-5 space-y-3">
            {kpiComparisons.map((item) => (
              <div
                className="rounded-md bg-zinc-950/60 p-4 transition hover:bg-white/[0.05]"
                key={item.label}
              >
                <p className="text-sm text-zinc-500">{item.label}</p>
                <div className="mt-2 flex items-end justify-between gap-4">
                  <p className="text-2xl font-semibold text-white">{item.value}</p>
                  <span className="text-sm text-teal-200">{item.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-3">
        <DashboardCard>
          <h2 className="text-xl font-semibold tracking-tight">Leads by stage</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Mock pipeline distribution by sales stage.
          </p>
          <div className="mt-6 space-y-4">
            {leadsByStage.map((stage) => (
              <div key={stage.label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-zinc-400">{stage.label}</span>
                  <span className="font-medium text-white">{stage.value}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full ${stage.className}`}
                    style={{ width: `${stage.value * 2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard>
          <h2 className="text-xl font-semibold tracking-tight">
            Client status
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Mock customer lifecycle mix.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {clientStatusBreakdown.map((status) => (
              <div className="rounded-md bg-zinc-950/60 p-4" key={status.label}>
                <StatusBadge className={status.className}>{status.label}</StatusBadge>
                <p className="mt-4 text-3xl font-semibold">{status.value}%</p>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard>
          <h2 className="text-xl font-semibold tracking-tight">
            Conversion funnel
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Product-led motion across the current quarter.
          </p>
          <div className="mt-6 space-y-4">
            {analyticsData.funnel.map((stage) => (
              <div key={stage.label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-zinc-400">{stage.label}</span>
                  <span className="font-medium text-white">{stage.value}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-400 to-sky-300"
                    style={{ width: `${stage.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </section>

      <section className="mt-6">
        <DashboardCard>
          <h2 className="text-xl font-semibold tracking-tight">
            Segment health
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Retention and expansion by customer segment.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {analyticsData.cohorts.map(([segment, retention, expansion]) => (
              <div
                className="rounded-md bg-zinc-950/70 p-4 text-sm transition hover:bg-white/[0.05]"
                key={segment}
              >
                <span className="font-medium text-white">{segment}</span>
                <div className="mt-4 flex justify-between text-zinc-400">
                  <span>{retention} retained</span>
                  <span className="text-teal-200">{expansion}</span>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </section>
    </>
  );
}

function RevenueTrendCard() {
  const chartPath = createSmoothTrendPath(revenueTrend);

  return (
    <DashboardCard className="bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.1),transparent_34%),rgba(255,255,255,0.04)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Revenue trend</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Mock revenue momentum across the year.
          </p>
        </div>
        <StatusBadge className="bg-emerald-300/10 text-emerald-300">
          +22.4% YoY
        </StatusBadge>
      </div>

      <div className="relative mt-6 h-72 overflow-hidden rounded-md border border-white/10 bg-zinc-950/70 p-5">
        <div className="absolute inset-x-5 top-8 h-px bg-white/[0.06]" />
        <div className="absolute inset-x-5 top-1/2 h-px bg-white/[0.06]" />
        <div className="absolute inset-x-5 bottom-12 h-px bg-white/[0.06]" />
        <svg
          aria-hidden="true"
          className="absolute inset-x-5 bottom-12 top-8 h-[calc(100%-5rem)] w-[calc(100%-2.5rem)] overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient id="analyticsLine" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="rgba(45, 212, 191, 0.75)" />
              <stop offset="100%" stopColor="rgba(125, 211, 252, 0.95)" />
            </linearGradient>
            <linearGradient id="analyticsArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(45, 212, 191, 0.18)" />
              <stop offset="100%" stopColor="rgba(45, 212, 191, 0)" />
            </linearGradient>
          </defs>
          <path d={`${chartPath} L 100,100 L 0,100 Z`} fill="url(#analyticsArea)" />
          <path
            d={chartPath}
            fill="none"
            stroke="url(#analyticsLine)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="absolute inset-x-5 bottom-4 flex justify-between text-[10px] font-medium uppercase text-zinc-600">
          {["Jan", "Apr", "Aug", "Dec"].map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}
