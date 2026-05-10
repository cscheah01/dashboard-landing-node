"use client";

import { useEffect, useState } from "react";

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
          <article
            className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20"
            key={card.label}
          >
            <p className="text-sm text-zinc-400">{card.label}</p>
            <p className="mt-4 text-3xl font-semibold tracking-tight">
              {card.value}
            </p>
            <p className="mt-2 text-sm text-teal-200">{card.detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Reports library
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Operational reporting packs and scheduled exports.
            </p>
          </div>
          <span className="rounded-full bg-teal-300/10 px-3 py-1 text-sm font-medium text-teal-200">
            Auto-sync enabled
          </span>
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
                <tr key={report.name}>
                  <td className="py-4 pr-4 font-medium text-white">
                    {report.name}
                  </td>
                  <td className="px-4 py-4 text-zinc-400">{report.owner}</td>
                  <td className="px-4 py-4 text-zinc-400">{report.cadence}</td>
                  <td className="py-4 pl-4 text-right">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClass(
                        report.status,
                      )}`}
                    >
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
