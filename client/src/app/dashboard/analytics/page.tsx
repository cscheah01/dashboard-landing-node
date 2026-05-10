"use client";

import { useEffect, useState } from "react";

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

type AnalyticsData = typeof analyticsFallback;

function getChangeBadgeClass(change: string) {
  return change.trim().startsWith("-")
    ? "bg-rose-300/10 text-rose-300"
    : "bg-emerald-300/10 text-emerald-300";
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
          <article
            className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20"
            key={metric.label}
          >
            <p className="text-sm text-zinc-400">{metric.label}</p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <p className="text-3xl font-semibold tracking-tight">
                {metric.value}
              </p>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getChangeBadgeClass(
                  metric.change,
                )}`}
              >
                {metric.change}
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <article className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20">
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
        </article>

        <article className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20">
          <h2 className="text-xl font-semibold tracking-tight">
            Segment health
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Retention and expansion by customer segment.
          </p>
          <div className="mt-6 space-y-3">
            {analyticsData.cohorts.map(([segment, retention, expansion]) => (
              <div
                className="grid grid-cols-3 gap-3 rounded-md bg-zinc-950/70 p-4 text-sm"
                key={segment}
              >
                <span className="font-medium text-white">{segment}</span>
                <span className="text-zinc-400">{retention}</span>
                <span className="text-right text-teal-200">{expansion}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
