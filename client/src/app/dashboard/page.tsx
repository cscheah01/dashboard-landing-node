"use client";

import { useEffect, useState } from "react";
import DashboardCard from "./components/DashboardCard";
import StatusBadge from "./components/StatusBadge";
import { apiFetch, getApiBaseUrl } from "@/lib/api";

const overviewFallback = {
  metrics: [
  { label: "Revenue", value: "$248.6K", change: "+18.2%" },
  { label: "Active users", value: "42,891", change: "+9.4%" },
  { label: "Conversion", value: "7.8%", change: "+2.1%" },
  { label: "Retention", value: "96.4%", change: "+4.6%" },
  ],
  revenueData: [
  { month: "Jan", value: 36 },
  { month: "Feb", value: 44 },
  { month: "Mar", value: 41 },
  { month: "Apr", value: 58 },
  { month: "May", value: 53 },
  { month: "Jun", value: 67 },
  { month: "Jul", value: 72 },
  { month: "Aug", value: 80 },
  { month: "Sep", value: 76 },
  { month: "Oct", value: 88 },
  { month: "Nov", value: 84 },
  { month: "Dec", value: 96 },
  ],
  activities: [
  {
    event: "Enterprise renewal closed",
    owner: "Sales",
    status: "Complete",
    time: "12 min ago",
  },
  {
    event: "Forecast model refreshed",
    owner: "Ops",
    status: "Synced",
    time: "34 min ago",
  },
  {
    event: "Product usage cohort updated",
    owner: "Data",
    status: "Live",
    time: "1 hr ago",
  },
  {
    event: "Board report exported",
    owner: "Finance",
    status: "Ready",
    time: "2 hrs ago",
  },
  ],
};

const pipelineStages = [
  { label: "New", value: 24, amount: "$148K", color: "bg-sky-300" },
  { label: "Qualified", value: 18, amount: "$286K", color: "bg-emerald-300" },
  { label: "Proposal", value: 9, amount: "$412K", color: "bg-violet-300" },
  { label: "Won", value: 6, amount: "$196K", color: "bg-teal-300" },
];

const upcomingTasks = [
  { task: "Review enterprise renewal deck", owner: "Finance", due: "Today" },
  { task: "Follow up with proposal-stage leads", owner: "Sales", due: "Tomorrow" },
  { task: "Publish weekly operating summary", owner: "Ops", due: "Fri" },
];

const topClients = [
  { company: "Vertex Labs", plan: "Scale", revenue: "$84K", health: "96%" },
  { company: "Aurora Systems", plan: "Growth", revenue: "$62K", health: "91%" },
  { company: "Summit Cloud", plan: "Starter", revenue: "$28K", health: "87%" },
];

type Metric = (typeof overviewFallback.metrics)[number];
type RevenuePoint = (typeof overviewFallback.revenueData)[number];
type Activity = (typeof overviewFallback.activities)[number];
type OverviewData = {
  metrics: Metric[];
  revenueData: RevenuePoint[];
  activities: Activity[];
};

type BackendStatus = "loading" | "connected" | "error" | "hidden";

function getChangeBadgeClass(change: string) {
  return change.trim().startsWith("-")
    ? "bg-rose-300/10 text-rose-300"
    : "bg-emerald-300/10 text-emerald-300";
}

function getStatusBadgeClass(status: string) {
  const normalizedStatus = status.toLowerCase();

  if (["complete", "completed"].includes(normalizedStatus)) {
    return "bg-emerald-300/10 text-emerald-300";
  }

  if (["synced", "syncing"].includes(normalizedStatus)) {
    return "bg-sky-300/10 text-sky-300";
  }

  if (normalizedStatus === "live") {
    return "bg-teal-300/10 text-teal-200";
  }

  if (normalizedStatus === "ready") {
    return "bg-violet-300/10 text-violet-200";
  }

  if (["warning", "warn"].includes(normalizedStatus)) {
    return "bg-amber-300/10 text-amber-300";
  }

  if (["failed", "error"].includes(normalizedStatus)) {
    return "bg-rose-300/10 text-rose-300";
  }

  return "bg-white/[0.06] text-zinc-300";
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

export default function DashboardPage() {
  const apiBaseUrl = getApiBaseUrl();
  const [backendStatus, setBackendStatus] =
    useState<BackendStatus>(apiBaseUrl ? "loading" : "hidden");
  const [backendMessage, setBackendMessage] = useState(
    apiBaseUrl ? "Checking backend..." : "Backend not configured",
  );
  const [overviewData, setOverviewData] =
    useState<OverviewData>(overviewFallback);

  useEffect(() => {
    let isMounted = true;

    async function fetchBackendData() {
      if (!apiBaseUrl) {
        setBackendStatus("hidden");
        setBackendMessage("Backend not configured");
        return;
      }

      try {
        const [statusResponse, overviewResponse] = await Promise.all([
          apiFetch("/"),
          apiFetch("/api/dashboard/overview"),
        ]);

        if (!statusResponse.ok || !overviewResponse.ok) {
          throw new Error("Backend request failed");
        }

        const statusData = (await statusResponse.json()) as { message?: string };
        const overview = (await overviewResponse.json()) as OverviewData;

        if (isMounted) {
          setBackendStatus("connected");
          setBackendMessage(statusData.message ?? "Backend connected");
          setOverviewData(overview);
        }
      } catch {
        if (isMounted) {
          setBackendStatus("error");
          setBackendMessage("Backend unavailable");
        }
      }
    }

    fetchBackendData();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl]);

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewData.metrics.map((metric) => (
          <DashboardCard
            key={metric.label}
            className="transition hover:-translate-y-0.5 hover:border-teal-300/30 hover:bg-white/[0.06]"
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

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.75fr]">
        <RevenueChart revenueData={overviewData.revenueData} />
        <BackendPanel message={backendMessage} status={backendStatus} />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DashboardCard className="bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.08),transparent_35%),rgba(255,255,255,0.04)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Lead pipeline
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Mock opportunity flow by stage.
              </p>
            </div>
            <StatusBadge className="bg-teal-300/10 text-teal-200">
              $1.04M open
            </StatusBadge>
          </div>
          <div className="mt-6 space-y-4">
            {pipelineStages.map((stage) => (
              <div key={stage.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-zinc-300">{stage.label}</span>
                  <span className="text-zinc-500">
                    {stage.value} leads / {stage.amount}
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full ${stage.color}`}
                    style={{ width: `${Math.min(stage.value * 4, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Upcoming tasks
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Preview of priority operating work.
              </p>
            </div>
            <StatusBadge className="bg-white/[0.06] text-zinc-300">
              3 open
            </StatusBadge>
          </div>
          <div className="mt-5 space-y-3">
            {upcomingTasks.map((item) => (
              <div
                className="rounded-md border border-white/10 bg-zinc-950/60 p-4 transition hover:border-white/20 hover:bg-white/[0.05]"
                key={item.task}
              >
                <p className="font-medium text-white">{item.task}</p>
                <div className="mt-2 flex justify-between text-sm text-zinc-500">
                  <span>{item.owner}</span>
                  <span>{item.due}</span>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <DashboardCard>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Recent activity
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Latest operational updates across the business.
              </p>
            </div>
            <span className="rounded-full bg-white/[0.05] px-3 py-1 text-sm text-zinc-400">
              Live feed
            </span>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-[0.16em] text-zinc-500">
                <tr>
                  <th className="py-3 pr-4 font-medium">Event</th>
                  <th className="px-4 py-3 font-medium">Owner</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="py-3 pl-4 text-right font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {overviewData.activities.map((activity) => (
                  <tr className="transition hover:bg-white/[0.03]" key={activity.event}>
                    <td className="py-4 pr-4 font-medium text-white">
                      {activity.event}
                    </td>
                    <td className="px-4 py-4 text-zinc-400">{activity.owner}</td>
                    <td className="px-4 py-4">
                      <StatusBadge className={getStatusBadgeClass(activity.status)}>
                        {activity.status}
                      </StatusBadge>
                    </td>
                    <td className="py-4 pl-4 text-right text-zinc-500">
                      {activity.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Top clients</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Mock customer health and revenue preview.
            </p>
          </div>
          <div className="mt-5 space-y-3">
            {topClients.map((client) => (
              <div
                className="grid grid-cols-[1fr_auto] gap-4 rounded-md bg-zinc-950/60 p-4 transition hover:bg-white/[0.05]"
                key={client.company}
              >
                <div>
                  <p className="font-medium text-white">{client.company}</p>
                  <p className="mt-1 text-sm text-zinc-500">{client.plan}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-teal-200">{client.revenue}</p>
                  <p className="mt-1 text-sm text-zinc-500">{client.health} health</p>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </section>

    </>
  );
}

function BackendPill({ status }: { status: BackendStatus }) {
  const isConnected = status === "connected";
  const isLoading = status === "loading";

  if (status === "hidden") {
    return null;
  }

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium ${
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
      {isConnected
        ? "Backend connected"
        : isLoading
          ? "Checking backend"
          : "Backend offline"}
    </div>
  );
}

function RevenueChart({ revenueData }: { revenueData: RevenuePoint[] }) {
  const chartPath = createSmoothTrendPath(revenueData);

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Revenue trend</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Monthly recurring revenue performance.
          </p>
        </div>
        <div className="rounded-md border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-right">
          <p className="text-sm font-semibold text-emerald-200">+$64.2K</p>
          <p className="text-xs text-zinc-500">vs. last quarter</p>
        </div>
      </div>

      <div className="relative mt-6 h-72 overflow-hidden rounded-md border border-white/10 bg-zinc-950/70 p-5">
        <div className="absolute inset-x-5 top-8 h-px bg-white/[0.06]" />
        <div className="absolute inset-x-5 top-1/2 h-px bg-white/[0.06]" />
        <div className="absolute inset-x-5 bottom-12 h-px bg-white/[0.06]" />

        <div className="absolute inset-x-5 bottom-12 top-8 flex items-end gap-2">
          {revenueData.map((point) => (
            <div
              key={point.month}
              className="flex flex-1 items-end rounded-full bg-white/[0.04]"
            >
              <div
                className="w-full rounded-full bg-gradient-to-t from-teal-500/70 via-teal-300/75 to-white shadow-[0_0_18px_rgba(45,212,191,0.2)]"
                style={{ height: `${point.value}%` }}
              />
            </div>
          ))}
        </div>

        <svg
          className="absolute inset-x-5 bottom-12 top-8 h-[calc(100%-5rem)] w-[calc(100%-2.5rem)] overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="dashboardLine" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="rgba(45, 212, 191, 0.75)" />
              <stop offset="100%" stopColor="rgba(125, 211, 252, 0.95)" />
            </linearGradient>
            <linearGradient id="dashboardArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(45, 212, 191, 0.18)" />
              <stop offset="100%" stopColor="rgba(45, 212, 191, 0)" />
            </linearGradient>
          </defs>
          <path d={`${chartPath} L 100,100 L 0,100 Z`} fill="url(#dashboardArea)" />
          <path
            d={chartPath}
            fill="none"
            stroke="url(#dashboardLine)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="100"
            cy={100 - revenueData[revenueData.length - 1].value}
            fill="rgb(125, 211, 252)"
            r="1.1"
          />
        </svg>

        <div className="absolute inset-x-5 bottom-4 flex justify-between text-[10px] font-medium uppercase text-zinc-600">
          {["Jan", "Apr", "Aug", "Dec"].map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function BackendPanel({
  message,
  status,
}: {
  message: string;
  status: BackendStatus;
}) {
  const isConnected = status === "connected";
  const isHidden = status === "hidden";

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20">
      <h2 className="text-xl font-semibold tracking-tight">Backend data</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Live response from the Express service.
      </p>

      <div className="mt-6 rounded-md border border-white/10 bg-zinc-950/70 p-4">
        <BackendPill status={status} />
        <p className="mt-5 text-sm uppercase tracking-[0.16em] text-zinc-600">
          Response message
        </p>
        <p
          className={`mt-2 text-lg font-medium ${
            isConnected ? "text-white" : "text-zinc-400"
          }`}
        >
          {message}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-md bg-white/[0.04] p-4">
          <p className="text-sm text-zinc-500">Endpoint</p>
          <p className="mt-2 break-all text-sm font-medium text-zinc-300">
            {isHidden ? "Not configured" : getApiBaseUrl() || "Unavailable"}
          </p>
        </div>
        <div className="rounded-md bg-white/[0.04] p-4">
          <p className="text-sm text-zinc-500">Mode</p>
          <p className="mt-2 text-sm font-medium text-zinc-300">
            {isHidden ? "Fallback data" : "CORS enabled"}
          </p>
        </div>
      </div>
    </section>
  );
}
