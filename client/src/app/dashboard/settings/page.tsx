const settingsSections = [
  {
    title: "Workspace",
    description: "Manage core workspace identity and reporting defaults.",
    items: ["Northstar HQ", "USD reporting", "Monday week start"],
  },
  {
    title: "Notifications",
    description: "Control executive alerts for revenue and customer movement.",
    items: ["Weekly summary", "Forecast variance alerts", "Renewal risk digest"],
  },
  {
    title: "Security",
    description: "Review access controls and audit visibility.",
    items: ["SSO ready", "Admin approval", "Audit trail enabled"],
  },
];

export default function SettingsPage() {
  return (
    <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <article className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20">
        <h2 className="text-xl font-semibold tracking-tight">
          Workspace profile
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Static settings preview for the internal dashboard experience.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm text-zinc-400">Workspace name</span>
            <input
              className="mt-2 w-full rounded-md border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none"
              defaultValue="Northstar HQ"
              readOnly
            />
          </label>
          <label className="block">
            <span className="text-sm text-zinc-400">Primary region</span>
            <input
              className="mt-2 w-full rounded-md border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none"
              defaultValue="Asia Pacific"
              readOnly
            />
          </label>
        </div>
      </article>

      <div className="grid gap-4">
        {settingsSections.map((section) => (
          <article
            className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20"
            key={section.title}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  {section.title}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  {section.description}
                </p>
              </div>
              <span className="rounded-full bg-teal-300/10 px-3 py-1 text-sm font-medium text-teal-200">
                Active
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {section.items.map((item) => (
                <div
                  className="rounded-md border border-white/10 bg-zinc-950/70 p-4 text-sm font-medium text-zinc-300"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
