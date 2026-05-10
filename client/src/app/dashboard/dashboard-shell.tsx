"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/dashboard", description: "Executive overview" },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    description: "Performance analytics",
  },
  {
    label: "Clients",
    href: "/dashboard/clients",
    description: "Client management",
  },
  {
    label: "Leads",
    href: "/dashboard/leads",
    description: "Lead pipeline",
  },
  { label: "Reports", href: "/dashboard/reports", description: "Reports library" },
  {
    label: "Settings",
    href: "/dashboard/settings",
    description: "Workspace settings",
  },
];

export default function DashboardShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const activeItem =
    navItems.find((item) =>
      item.href === "/dashboard"
        ? pathname === item.href
        : pathname.startsWith(item.href),
    ) ?? navItems[0];

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/10 bg-white/[0.03] px-5 py-6 lg:block">
          <Link href="/" className="block text-xl font-semibold tracking-tight">
            Northstar
          </Link>
          <nav className="mt-10 space-y-1">
            {navItems.map((item) => (
              <DashboardNavLink
                href={item.href}
                isActive={activeItem.href === item.href}
                key={item.href}
                label={item.label}
              />
            ))}
          </nav>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-white/10 bg-[#05070d]/95 px-6 py-5 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal-300">
                  Internal dashboard
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {activeItem.description}
                </h1>
              </div>
              <Link
                href="/"
                className="w-fit rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:border-white/35 hover:bg-white/10"
              >
                Homepage
              </Link>
            </div>
            <nav className="mt-6 flex gap-2 overflow-x-auto lg:hidden">
              {navItems.map((item) => (
                <Link
                  href={item.href}
                  key={item.href}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeItem.href === item.href
                      ? "bg-teal-300/10 text-teal-200 ring-1 ring-teal-300/20"
                      : "bg-white/[0.04] text-zinc-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>

          <div className="flex-1 px-6 py-8 sm:px-8 lg:px-10">{children}</div>
        </section>
      </div>
    </main>
  );
}

function DashboardNavLink({
  href,
  isActive,
  label,
}: {
  href: string;
  isActive: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`flex rounded-md px-4 py-3 text-sm font-medium transition ${
        isActive
          ? "bg-teal-300/10 text-teal-200 ring-1 ring-teal-300/20"
          : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}
