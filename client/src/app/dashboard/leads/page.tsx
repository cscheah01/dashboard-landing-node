"use client";

import { FormEvent, useEffect, useState } from "react";

type LeadStage = "New" | "Contacted" | "Qualified" | "Proposal" | "Won" | "Lost";

type Lead = {
  id: number;
  name: string;
  company: string;
  email: string;
  source: string;
  stage: LeadStage;
  value: number;
  owner: string;
  createdAt: string;
};

type LeadForm = Omit<Lead, "id" | "value"> & {
  value: string;
};

const emptyForm: LeadForm = {
  name: "",
  company: "",
  email: "",
  source: "Website",
  stage: "New",
  value: "",
  owner: "",
  createdAt: new Date().toISOString().slice(0, 10),
};

const stageOptions: LeadStage[] = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal",
  "Won",
  "Lost",
];

const stageStyles: Record<LeadStage, string> = {
  New: "bg-sky-300/10 text-sky-300",
  Contacted: "bg-teal-300/10 text-teal-200",
  Qualified: "bg-emerald-300/10 text-emerald-300",
  Proposal: "bg-violet-300/10 text-violet-200",
  Won: "bg-emerald-300/10 text-emerald-300",
  Lost: "bg-rose-300/10 text-rose-300",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [form, setForm] = useState<LeadForm>(emptyForm);
  const [editingLeadId, setEditingLeadId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("Loading leads...");
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      normalizedSearchQuery.length === 0 ||
      lead.name.toLowerCase().includes(normalizedSearchQuery) ||
      lead.email.toLowerCase().includes(normalizedSearchQuery) ||
      lead.company.toLowerCase().includes(normalizedSearchQuery) ||
      lead.owner.toLowerCase().includes(normalizedSearchQuery) ||
      lead.source.toLowerCase().includes(normalizedSearchQuery);
    const matchesStage = stageFilter === "All" || lead.stage === stageFilter;

    return matchesSearch && matchesStage;
  });

  async function loadLeads(isMounted = true) {
    try {
      const response = await fetch("http://localhost:5000/api/leads");

      if (!response.ok) {
        throw new Error("Leads request failed");
      }

      const data = (await response.json()) as Lead[];

      if (isMounted) {
        setLeads(data);
        setError("");
        setMessage("Lead data synced");
      }
    } catch {
      if (isMounted) {
        setError("Unable to load leads");
        setMessage("Lead sync failed");
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadInitialLeads() {
      try {
        const response = await fetch("http://localhost:5000/api/leads");

        if (!response.ok) {
          throw new Error("Leads request failed");
        }

        const data = (await response.json()) as Lead[];

        if (isMounted) {
          setLeads(data);
          setError("");
          setMessage("Lead data synced");
        }
      } catch {
        if (isMounted) {
          setError("Unable to load leads");
          setMessage("Lead sync failed");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialLeads();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedForm = {
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      source: form.source.trim(),
      stage: form.stage,
      value: Number(form.value),
      owner: form.owner.trim(),
      createdAt: form.createdAt.trim(),
    };

    if (
      !trimmedForm.name ||
      !trimmedForm.company ||
      !trimmedForm.email ||
      !trimmedForm.source ||
      !trimmedForm.stage ||
      !trimmedForm.owner ||
      !trimmedForm.createdAt
    ) {
      setError("All lead fields are required");
      return;
    }

    if (!trimmedForm.email.includes("@")) {
      setError("Enter a valid lead email");
      return;
    }

    if (Number.isNaN(trimmedForm.value) || trimmedForm.value < 0) {
      setError("Lead value must be zero or greater");
      return;
    }

    const endpoint =
      editingLeadId === null
        ? "http://localhost:5000/api/leads"
        : `http://localhost:5000/api/leads/${editingLeadId}`;

    try {
      setIsSaving(true);
      setError("");

      const response = await fetch(endpoint, {
        method: editingLeadId === null ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trimmedForm),
      });

      if (!response.ok) {
        throw new Error("Save request failed");
      }

      setForm(emptyForm);
      setEditingLeadId(null);
      setMessage(editingLeadId === null ? "Lead added" : "Lead updated");
      await loadLeads();
    } catch {
      setError("Unable to save lead");
      setMessage("Save failed");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(leadId: number) {
    try {
      setIsSaving(true);
      setError("");

      const response = await fetch(`http://localhost:5000/api/leads/${leadId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete request failed");
      }

      if (editingLeadId === leadId) {
        setEditingLeadId(null);
        setForm(emptyForm);
      }

      setLeads((currentLeads) =>
        currentLeads.filter((lead) => lead.id !== leadId),
      );
      setMessage("Lead deleted");
    } catch {
      setError("Unable to delete lead");
      setMessage("Delete failed");
    } finally {
      setIsSaving(false);
    }
  }

  function startEditing(lead: Lead) {
    setEditingLeadId(lead.id);
    setForm({
      name: lead.name,
      company: lead.company,
      email: lead.email,
      source: lead.source,
      stage: lead.stage,
      value: String(lead.value),
      owner: lead.owner,
      createdAt: lead.createdAt,
    });
    setError("");
    setMessage(`Editing ${lead.company}`);
  }

  function cancelEditing() {
    setEditingLeadId(null);
    setForm(emptyForm);
    setError("");
    setMessage("Lead data synced");
  }

  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <article className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                {editingLeadId === null ? "Add lead" : "Edit lead"}
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Track pipeline opportunities while the data stays in memory.
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                error
                  ? "bg-rose-300/10 text-rose-200"
                  : "bg-teal-300/10 text-teal-200"
              }`}
            >
              {message}
            </span>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {error ? (
              <p className="rounded-md border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </p>
            ) : null}
            <LeadInput
              label="Name"
              onChange={(value) => setForm({ ...form, name: value })}
              value={form.name}
            />
            <LeadInput
              label="Company"
              onChange={(value) => setForm({ ...form, company: value })}
              value={form.company}
            />
            <LeadInput
              label="Email"
              onChange={(value) => setForm({ ...form, email: value })}
              type="email"
              value={form.email}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <LeadInput
                label="Source"
                onChange={(value) => setForm({ ...form, source: value })}
                value={form.source}
              />
              <LeadInput
                label="Owner"
                onChange={(value) => setForm({ ...form, owner: value })}
                value={form.owner}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block">
                <span className="text-sm text-zinc-400">Stage</span>
                <select
                  className="mt-2 w-full rounded-md border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-teal-300/50"
                  onChange={(event) =>
                    setForm({
                      ...form,
                      stage: event.target.value as LeadStage,
                    })
                  }
                  value={form.stage}
                >
                  {stageOptions.map((stage) => (
                    <option key={stage}>{stage}</option>
                  ))}
                </select>
              </label>
              <LeadInput
                label="Value"
                min="0"
                onChange={(value) => setForm({ ...form, value })}
                type="number"
                value={form.value}
              />
              <LeadInput
                label="Created"
                onChange={(value) => setForm({ ...form, createdAt: value })}
                type="date"
                value={form.createdAt}
              />
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                className="rounded-full bg-teal-300 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSaving}
                type="submit"
              >
                {isSaving
                  ? "Saving..."
                  : editingLeadId === null
                    ? "Add lead"
                    : "Save changes"}
              </button>
              {editingLeadId !== null ? (
                <button
                  className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/10"
                  onClick={cancelEditing}
                  type="button"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </article>

        <article className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Leads</h2>
              <p className="mt-1 text-sm text-zinc-500">
                In-memory pipeline records from the Express API.
              </p>
            </div>
            <span className="rounded-full bg-white/[0.05] px-3 py-1 text-sm text-zinc-400">
              {filteredLeads.length} of {leads.length} shown
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_190px]">
            <label className="block">
              <span className="text-sm text-zinc-400">Search leads</span>
              <input
                className="mt-2 w-full rounded-md border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-teal-300/50"
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search name, email, company, source, or owner"
                type="search"
                value={searchQuery}
              />
            </label>
            <label className="block">
              <span className="text-sm text-zinc-400">Stage</span>
              <select
                className="mt-2 w-full rounded-md border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-teal-300/50"
                onChange={(event) => setStageFilter(event.target.value)}
                value={stageFilter}
              >
                <option>All</option>
                {stageOptions.map((stage) => (
                  <option key={stage}>{stage}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-[0.16em] text-zinc-500">
                <tr>
                  <th className="py-3 pr-4 font-medium">Lead</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Stage</th>
                  <th className="px-4 py-3 font-medium">Value</th>
                  <th className="px-4 py-3 font-medium">Owner</th>
                  <th className="py-3 pl-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {isLoading ? (
                  <tr>
                    <td
                      className="py-10 text-center text-sm text-zinc-500"
                      colSpan={6}
                    >
                      Loading leads...
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td
                      className="py-10 text-center text-sm text-zinc-500"
                      colSpan={6}
                    >
                      No leads yet. Add your first lead to populate this table.
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td
                      className="py-10 text-center text-sm text-zinc-500"
                      colSpan={6}
                    >
                      No leads match your current search or stage filter.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="py-4 pr-4">
                        <p className="font-medium text-white">{lead.name}</p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {lead.email}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-zinc-400">{lead.company}</p>
                        <p className="mt-1 text-xs text-zinc-600">
                          {lead.source} · {lead.createdAt}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${stageStyles[lead.stage]}`}
                        >
                          {lead.stage}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-zinc-300">
                        {formatCurrency(lead.value)}
                      </td>
                      <td className="px-4 py-4 text-zinc-400">{lead.owner}</td>
                      <td className="py-4 pl-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition hover:border-teal-300/50 hover:bg-teal-300/10 hover:text-teal-100 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={isSaving}
                            onClick={() => startEditing(lead)}
                            type="button"
                          >
                            Edit
                          </button>
                          <button
                            className="rounded-full border border-rose-300/20 px-3 py-1.5 text-xs font-semibold text-rose-200 transition hover:bg-rose-300/10 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={isSaving}
                            onClick={() => handleDelete(lead.id)}
                            type="button"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function LeadInput({
  label,
  min,
  onChange,
  type = "text",
  value,
}: {
  label: string;
  min?: string;
  onChange: (value: string) => void;
  type?: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-zinc-400">{label}</span>
      <input
        className="mt-2 w-full rounded-md border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-teal-300/50"
        min={min}
        onChange={(event) => onChange(event.target.value)}
        required
        type={type}
        value={value}
      />
    </label>
  );
}
