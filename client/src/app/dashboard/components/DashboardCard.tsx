import { ReactNode } from "react";

export default function DashboardCard({ children }: { children: ReactNode }) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20">
      {children}
    </article>
  );
}
