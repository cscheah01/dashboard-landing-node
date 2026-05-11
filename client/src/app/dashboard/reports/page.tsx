"use client";

import { useEffect, useState } from "react";
import ActionButton from "../components/ActionButton";
import DashboardCard from "../components/DashboardCard";
import StatusBadge from "../components/StatusBadge";

const reportsFallback = {
  reports: [
    {
      name: "Board update",
      owner: "Finance",
      cadence: "Monthly",
      status: "Ready",
    },
    {
      name: "Revenue forecast",
      owner: "Operations",
      cadence: "Weekly",
      status: "Draft",
    },
    {
      name: "Customer health",
      owner: "Success",
      cadence: "Weekly",
      status: "Live",
    },
    {
      name: "Pipeline review",
      owner: "Sales",
      cadence: "Daily",
      status: "Synced",
    },
  ],
  reportCards: [
    { label: "Published reports", value: "24", detail: "+6 this month" },
    { label: "Scheduled exports", value: "11", detail: "Next in 2 hours" },
    { label: "Data sources", value: "18", detail: "All healthy" },
  ],
};

const monthlyPerformance = [
  { label: "Revenue report", value: "$248.6K", detail: "18.2% above target" },
  { label: "Pipeline report", value: "$1.04M", detail: "57 open opportunities" },
  { label: "Retention report", value: "96.4%", detail: "4.6 pts improvement" },
];

const growthInsights = [
  {
    title: "Expansion revenue is accelerating",
    detail: "Enterprise accounts contributed 42% of net new MRR this month.",
    tone: "text-emerald-200",
  },
  {
    title: "Proposal stage needs attention",
    detail: "Nine high-value opportunities have been open for more than 21 days.",
    tone: "text-amber-200",
  },
  {
    title: "Customer health remains strong",
    detail: "Top client health scores are holding above 90% across key segments.",
    tone: "text-sky-200",
  },
];

const reportHistory = [
  { name: "April executive snapshot", type: "PDF", time: "2 days ago" },
  { name: "Q2 sales pipeline export", type: "CSV", time: "5 days ago" },
  { name: "Customer health rollup", type: "XLSX", time: "1 week ago" },
];

type ReportsData = typeof reportsFallback;

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

export default function ReportsPage() {
  const [reportsData, setReportsData] =
    useState<ReportsData>(reportsFallback);

  useEffect(() => {
    let isMounted = true;

    async function fetchReportsData() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/dashboard/reports",
        );

        if (!response.ok) {
          throw new Error("Reports request failed");
        }

        const data = (await response.json()) as ReportsData;

        if (isMounted) {
          setReportsData(data);
        }
      } catch {
        if (isMounted) {
          setReportsData(reportsFallback);
        }
      }
    }

    fetchReportsData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        {reportsData.reportCards.map((card) => (
          <DashboardCard
            className="transition hover:-translate-y-0.5 hover:border-teal-300/30 hover:bg-white/[0.06]"
            key={card.label}
          >
            <p className="text-sm text-zinc-400">{card.label}</p>
            <p className="mt-4 text-3xl font-semibold tracking-tight">
              {card.value}
            </p>
            <p className="mt-2 text-sm text-teal-200">{card.detail}</p>
          </DashboardCard>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DashboardCard className="bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.08),transparent_35%),rgba(255,255,255,0.04)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Monthly performance
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Mock executive report highlights for the current month.
              </p>
            </div>
            <StatusBadge className="bg-emerald-300/10 text-emerald-300">
              On track
            </StatusBadge>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {monthlyPerformance.map((item) => (
              <div
                className="rounded-md border border-white/10 bg-zinc-950/60 p-4 transition hover:border-white/20 hover:bg-white/[0.05]"
                key={item.label}
              >
                <p className="text-sm text-zinc-500">{item.label}</p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  {item.value}
                </p>
                <p className="mt-2 text-sm text-teal-200">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-md border border-white/10 bg-zinc-950/60 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Report completion</span>
              <span className="font-medium text-white">82%</span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-teal-400 to-sky-300 shadow-[0_0_18px_rgba(45,212,191,0.2)]" />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard>
          <h2 className="text-xl font-semibold tracking-tight">
            Export center
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Static export actions for future reporting workflows.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <ActionButton className="justify-center" type="button">
              Export PDF
            </ActionButton>
            <ActionButton
              className="justify-center"
              type="button"
              variant="secondary"
            >
              Export CSV
            </ActionButton>
            <ActionButton
              className="justify-center"
              type="button"
              variant="ghost"
            >
              Schedule report
            </ActionButton>
          </div>

          <div className="mt-6 rounded-md border border-white/10 bg-zinc-950/60 p-4">
            <p className="text-sm font-medium text-white">
              Next scheduled export
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Revenue forecast will refresh automatically in 2 hours.
            </p>
          </div>
        </DashboardCard>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <DashboardCard>
          <h2 className="text-xl font-semibold tracking-tight">
            Growth insights
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Mock narrative summaries for leadership review.
          </p>
          <div className="mt-5 space-y-3">
            {growthInsights.map((insight) => (
              <div
                className="rounded-md border border-white/10 bg-zinc-950/60 p-4 transition hover:border-white/20 hover:bg-white/[0.05]"
                key={insight.title}
              >
                <p className={`font-medium ${insight.tone}`}>
                  {insight.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {insight.detail}
                </p>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Report history
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Recently generated exports and reporting snapshots.
              </p>
            </div>
            <StatusBadge className="bg-white/[0.06] text-zinc-300">
              3 recent
            </StatusBadge>
          </div>

          <div className="mt-5 space-y-3">
            {reportHistory.map((report) => (
              <div
                className="grid grid-cols-[1fr_auto] gap-4 rounded-md bg-zinc-950/60 p-4 transition hover:bg-white/[0.05]"
                key={report.name}
              >
                <div>
                  <p className="font-medium text-white">{report.name}</p>
                  <p className="mt-1 text-sm text-zinc-500">{report.time}</p>
                </div>
                <StatusBadge className="bg-sky-300/10 text-sky-300">
                  {report.type}
                </StatusBadge>
              </div>
            ))}
          </div>
        </DashboardCard>
      </section>

      <section className="mt-6">
        <DashboardCard>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Reports library
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Operational reporting packs and scheduled exports.
            </p>
          </div>
          <StatusBadge className="bg-teal-300/10 text-teal-200">
            Auto-sync enabled
          </StatusBadge>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-[0.16em] text-zinc-500">
              <tr>
                <th className="py-3 pr-4 font-medium">Report</th>
                <th className="px-4 py-3 font-medium">Owner</th>
                <th className="px-4 py-3 font-medium">Cadence</th>
                <th className="py-3 pl-4 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {reportsData.reports.map((report) => (
                <tr className="transition hover:bg-white/[0.03]" key={report.name}>
                  <td className="py-4 pr-4 font-medium text-white">
                    {report.name}
                  </td>
                  <td className="px-4 py-4 text-zinc-400">{report.owner}</td>
                  <td className="px-4 py-4 text-zinc-400">{report.cadence}</td>
                  <td className="py-4 pl-4 text-right">
                    <StatusBadge className={getStatusBadgeClass(report.status)}>
                      {report.status}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </DashboardCard>
      </section>
    </>
  );
}
