"use client";

import { useEffect, useState } from "react";
import { apiFetch, getApiBaseUrl } from "@/lib/api";

const features = [
  {
    title: "Unified metrics",
    icon: "metrics",
    description:
      "Bring revenue, acquisition, retention, and product signals into one focused operating view.",
  },
  {
    title: "Executive reporting",
    icon: "reporting",
    description:
      "Publish clean, board-ready updates with live charts, notes, and variance tracking.",
  },
  {
    title: "Forecast confidence",
    icon: "forecast",
    description:
      "Model targets against actual performance so every team can course-correct early.",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$49",
    description: "For founders and small teams getting their first dashboards live.",
    features: ["5 dashboards", "Core integrations", "Weekly exports"],
  },
  {
    name: "Growth",
    price: "$149",
    description: "For growing teams that need deeper reporting and collaboration.",
    features: ["Unlimited dashboards", "Forecasting tools", "Priority support"],
    highlighted: true,
  },
  {
    name: "Scale",
    price: "Custom",
    description: "For larger organizations with advanced governance needs.",
    features: ["SSO and audit logs", "Custom data models", "Dedicated success"],
  },
];

const previewMetrics = [
  { label: "ARR", value: "$2.4M", change: "+18.2%" },
  { label: "Pipeline", value: "$684K", change: "+11.6%" },
  { label: "Retention", value: "96.8%", change: "+4.1%" },
];

const revenueTrend = [
  { week: "W1", value: 38 },
  { week: "W2", value: 52 },
  { week: "W3", value: 48 },
  { week: "W4", value: 64 },
  { week: "W5", value: 58 },
  { week: "W6", value: 72 },
  { week: "W7", value: 69 },
  { week: "W8", value: 82 },
  { week: "W9", value: 78 },
  { week: "W10", value: 88 },
  { week: "W11", value: 84 },
  { week: "W12", value: 96 },
];

type BackendStatus = "loading" | "connected" | "error" | "hidden";

export default function Home() {
  const currentYear = new Date().getFullYear();
  const apiBaseUrl = getApiBaseUrl();
  const shouldShowBackendStatus = process.env.NODE_ENV === "development";
  const [backendStatus, setBackendStatus] =
    useState<BackendStatus>(apiBaseUrl ? "loading" : "hidden");
  const [backendMessage, setBackendMessage] = useState("Checking backend...");

  useEffect(() => {
    let isMounted = true;

    async function fetchBackendStatus() {
      if (!apiBaseUrl) {
        setBackendStatus("hidden");
        return;
      }

      try {
        const response = await apiFetch("/");

        if (!response.ok) {
          throw new Error("Backend returned an error");
        }

        const data = (await response.json()) as { message?: string };

        if (isMounted) {
          setBackendStatus("connected");
          setBackendMessage(data.message ?? "Backend connected");
        }
      } catch {
        if (isMounted) {
          setBackendStatus("error");
          setBackendMessage("Backend unavailable");
        }
      }
    }

    fetchBackendStatus();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl]);

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.22),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.2),_transparent_32%)]" />
        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 sm:px-8 lg:px-10">
          <nav className="flex items-center justify-between">
            <a href="#" className="text-lg font-semibold tracking-tight">
              Northstar
            </a>
            <div className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
              <a className="transition hover:text-white" href="#features">
                Features
              </a>
              <a className="transition hover:text-white" href="#preview">
                Preview
              </a>
              <a className="transition hover:text-white" href="#pricing">
                Pricing
              </a>
            </div>
            <a
              href="#pricing"
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:border-teal-300/60 hover:bg-white/10"
            >
              View plans
            </a>
          </nav>

          <div className="grid flex-1 items-center gap-14 py-20 lg:grid-cols-[1.02fr_0.98fr] lg:py-24">
            <div className="max-w-3xl">
              <p className="mb-5 inline-flex rounded-full border border-teal-300/25 bg-teal-300/10 px-3 py-1 text-sm font-medium text-teal-200">
                Analytics for high-velocity SaaS teams
              </p>
              {shouldShowBackendStatus ? (
                <BackendStatusBadge
                  message={backendMessage}
                  status={backendStatus}
                />
              ) : null}
              <h1 className="max-w-4xl text-5xl font-semibold leading-[1.03] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Run your business from one executive dashboard.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
                Northstar gives leadership teams a clean view of revenue,
                pipeline, retention, and forecast health so decisions happen
                with less noise and more confidence.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#pricing"
                  className="rounded-full bg-teal-300 px-6 py-3 text-center text-sm font-semibold text-zinc-950 transition hover:bg-teal-200"
                >
                  Start free trial
                </a>
                <a
                  href="#preview"
                  className="rounded-full border border-white/15 px-6 py-3 text-center text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/10"
                >
                  See dashboard
                </a>
              </div>
              <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-6">
                {previewMetrics.map((metric) => (
                  <div key={metric.label}>
                    <p className="text-2xl font-semibold tracking-tight text-white">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <DashboardPreview compact />
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">
            Features
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Built for leaders who need the signal, fast.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-lg border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20"
            >
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-md bg-teal-300/15 text-teal-200 ring-1 ring-teal-300/30">
                <FeatureIcon icon={feature.icon} />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-white">
                {feature.title}
              </h3>
              <p className="mt-3 leading-7 text-zinc-400">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="preview" className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">
              Dashboard preview
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Your operating rhythm, visualized.
            </h2>
            <p className="mt-5 text-lg leading-8 text-zinc-300">
              Track the numbers that matter, compare momentum across teams, and
              keep strategic goals visible without digging through spreadsheets.
            </p>
          </div>
          <DashboardPreview />
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">
            Pricing
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Simple plans that scale with your team.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-lg border p-6 ${
                plan.highlighted
                  ? "border-teal-300/60 bg-teal-300/10 shadow-2xl shadow-teal-950/40"
                  : "border-white/10 bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                {plan.highlighted ? (
                  <span className="rounded-full bg-teal-300 px-3 py-1 text-xs font-semibold text-zinc-950">
                    Popular
                  </span>
                ) : null}
              </div>
              <p className="mt-5">
                <span className="text-4xl font-semibold tracking-tight">
                  {plan.price}
                </span>
                {plan.price !== "Custom" ? (
                  <span className="text-zinc-400"> / month</span>
                ) : null}
              </p>
              <p className="mt-4 min-h-20 leading-7 text-zinc-400">
                {plan.description}
              </p>
              <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-300" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className={`mt-8 block rounded-full px-5 py-3 text-center text-sm font-semibold transition ${
                  plan.highlighted
                    ? "bg-teal-300 text-zinc-950 hover:bg-teal-200"
                    : "border border-white/15 text-white hover:border-white/35 hover:bg-white/10"
                }`}
              >
                Choose plan
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-lg border border-white/10 bg-white/[0.04] px-6 py-14 text-center sm:px-10">
          <h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Turn scattered metrics into a confident weekly operating cadence.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
            Launch a premium executive dashboard in days, then keep every
            decision tied to the latest numbers.
          </p>
          <a
            href="#pricing"
            className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            Get started
          </a>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center sm:px-8 lg:px-10">
        <p className="text-sm text-zinc-500">
          Copyright © {currentYear} Alfred Cheah
        </p>
      </footer>
    </main>
  );
}

function BackendStatusBadge({
  message,
  status,
}: {
  message: string;
  status: BackendStatus;
}) {
  const isConnected = status === "connected";
  const isLoading = status === "loading";

  if (status === "hidden") {
    return null;
  }

  return (
    <div className="mb-5 flex">
      <div
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
          isConnected
            ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-200"
            : isLoading
              ? "border-sky-300/25 bg-sky-300/10 text-sky-200"
              : "border-rose-300/25 bg-rose-300/10 text-rose-200"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isConnected
              ? "bg-emerald-300"
              : isLoading
                ? "bg-sky-300"
                : "bg-rose-300"
          }`}
        />
        <span>{isConnected ? "Backend connected" : message}</span>
        {isConnected ? <span className="text-zinc-400">{message}</span> : null}
      </div>
    </div>
  );
}

function FeatureIcon({ icon }: { icon: string }) {
  if (icon === "reporting") {
    return (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path d="M7 4h7l3 3v13H7z" />
        <path d="M14 4v4h4" />
        <path d="M10 13h5" />
        <path d="M10 17h3" />
      </svg>
    );
  }

  if (icon === "forecast") {
    return (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path d="M4 17l5-5 4 4 7-8" />
        <path d="M16 8h4v4" />
        <path d="M5 20h14" />
      </svg>
    );
  }

  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M5 19V9" />
      <path d="M12 19V5" />
      <path d="M19 19v-7" />
      <path d="M4 19h16" />
    </svg>
  );
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

function DashboardPreview({ compact = false }: { compact?: boolean }) {
  const chartPath = createSmoothTrendPath(revenueTrend);

  return (
    <div
      className={`rounded-lg border border-white/10 bg-zinc-950/80 p-4 shadow-2xl shadow-black/40 ring-1 ring-white/5 ${
        compact ? "lg:translate-y-8" : ""
      }`}
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="text-sm font-medium text-zinc-400">Revenue command</p>
          <p className="mt-1 text-xl font-semibold text-white">Q3 performance</p>
        </div>
        <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-300">
          Live
        </div>
      </div>

      <div className="grid gap-3 py-4 sm:grid-cols-3">
        {previewMetrics.map((metric) => (
          <div key={metric.label} className="rounded-md bg-white/[0.04] p-4">
            <p className="text-sm text-zinc-500">{metric.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
              {metric.value}
            </p>
            <p className="mt-1 text-sm text-emerald-300">{metric.change}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-md bg-white/[0.04] p-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Revenue trend</p>
              <p className="mt-1 text-sm text-zinc-500">Last 12 weeks</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-emerald-300">+$418K</p>
              <p className="mt-1 text-xs text-zinc-500">live run-rate</p>
            </div>
          </div>
          <div className="relative h-48 overflow-hidden rounded-md border border-white/10 bg-zinc-950/70 p-4">
            <div className="absolute inset-x-4 top-6 h-px bg-white/[0.06]" />
            <div className="absolute inset-x-4 top-1/2 h-px bg-white/[0.06]" />
            <div className="absolute inset-x-4 bottom-10 h-px bg-white/[0.06]" />

            <div className="absolute inset-x-4 bottom-10 top-6 flex items-end gap-2">
              {revenueTrend.map((point) => (
                <div
                  key={point.week}
                  className="flex flex-1 items-end rounded-full bg-white/[0.04]"
                >
                  <div
                    className="w-full rounded-full bg-gradient-to-t from-teal-500/80 via-teal-300/80 to-white shadow-[0_0_18px_rgba(45,212,191,0.22)]"
                    style={{ height: `${point.value}%` }}
                  />
                </div>
              ))}
            </div>

            <svg
              className="absolute inset-x-4 bottom-10 top-6 h-[calc(100%-4rem)] w-[calc(100%-2rem)] overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="previewLine" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="rgba(45, 212, 191, 0.75)" />
                  <stop offset="100%" stopColor="rgba(125, 211, 252, 0.95)" />
                </linearGradient>
                <linearGradient id="previewArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(45, 212, 191, 0.18)" />
                  <stop offset="100%" stopColor="rgba(45, 212, 191, 0)" />
                </linearGradient>
              </defs>
              <path d={`${chartPath} L 100,100 L 0,100 Z`} fill="url(#previewArea)" />
              <path
                d={chartPath}
                fill="none"
                stroke="url(#previewLine)"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                cx="100"
                cy={100 - revenueTrend[revenueTrend.length - 1].value}
                fill="rgb(125, 211, 252)"
                r="1.1"
              />
            </svg>

            <div className="absolute inset-x-4 bottom-3 flex justify-between text-[10px] font-medium uppercase text-zinc-600">
              {["W1", "W4", "W8", "W12"].map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-md bg-white/[0.04] p-4">
          <p className="font-medium text-white">Goal health</p>
          <div className="mt-6 space-y-5">
            {[
              ["Sales", "86%"],
              ["Marketing", "74%"],
              ["Success", "91%"],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-zinc-400">{label}</span>
                  <span className="text-white">{value}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-teal-300"
                    style={{ width: value }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
