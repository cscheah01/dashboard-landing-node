"use client";

import { FormEvent, useEffect, useState } from "react";
import ActionButton from "../components/ActionButton";
import DashboardCard from "../components/DashboardCard";
import EmptyTableRow from "../components/EmptyTableRow";
import FormError from "../components/FormError";
import SelectField from "../components/SelectField";
import StatusBadge from "../components/StatusBadge";
import StatusMessageBadge from "../components/StatusMessageBadge";
import TextInput from "../components/TextInput";

type Client = {
  id: number;
  name: string;
  company: string;
  email: string;
  plan: string;
  status: string;
};

type ClientForm = Omit<Client, "id">;

const emptyForm: ClientForm = {
  name: "",
  company: "",
  email: "",
  plan: "Starter",
  status: "Active",
};

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-300/10 text-emerald-300",
  Trial: "bg-sky-300/10 text-sky-300",
  Paused: "bg-amber-300/10 text-amber-300",
  Churned: "bg-rose-300/10 text-rose-300",
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState<ClientForm>(emptyForm);
  const [editingClientId, setEditingClientId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("Loading clients...");
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      normalizedSearchQuery.length === 0 ||
      client.name.toLowerCase().includes(normalizedSearchQuery) ||
      client.email.toLowerCase().includes(normalizedSearchQuery) ||
      client.company.toLowerCase().includes(normalizedSearchQuery);
    const matchesStatus =
      statusFilter === "All" ||
      client.status === statusFilter ||
      (statusFilter === "Pending" && client.status === "Trial") ||
      (statusFilter === "Inactive" &&
        ["Paused", "Churned"].includes(client.status));

    return matchesSearch && matchesStatus;
  });

  async function loadClients(isMounted = true) {
    try {
      const response = await fetch("http://localhost:5000/api/clients");

      if (!response.ok) {
        throw new Error("Clients request failed");
      }

      const data = (await response.json()) as Client[];

      if (isMounted) {
        setClients(data);
        setError("");
        setMessage("Client data synced");
      }
    } catch {
      if (isMounted) {
        setError("Unable to load clients");
        setMessage("Client sync failed");
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadInitialClients() {
      try {
        const response = await fetch("http://localhost:5000/api/clients");

        if (!response.ok) {
          throw new Error("Clients request failed");
        }

        const data = (await response.json()) as Client[];

        if (isMounted) {
          setClients(data);
          setError("");
          setMessage("Client data synced");
        }
      } catch {
        if (isMounted) {
          setError("Unable to load clients");
          setMessage("Client sync failed");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialClients();

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
      plan: form.plan.trim(),
      status: form.status.trim(),
    };

    if (
      !trimmedForm.name ||
      !trimmedForm.company ||
      !trimmedForm.email ||
      !trimmedForm.plan ||
      !trimmedForm.status
    ) {
      setError("All client fields are required");
      return;
    }

    if (!trimmedForm.email.includes("@")) {
      setError("Enter a valid client email");
      return;
    }

    const endpoint =
      editingClientId === null
        ? "http://localhost:5000/api/clients"
        : `http://localhost:5000/api/clients/${editingClientId}`;

    try {
      setIsSaving(true);
      setError("");

      const response = await fetch(endpoint, {
        method: editingClientId === null ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trimmedForm),
      });

      if (!response.ok) {
        throw new Error("Save request failed");
      }

      setForm(emptyForm);
      setEditingClientId(null);
      setMessage(editingClientId === null ? "Client added" : "Client updated");
      await loadClients();
    } catch {
      setError("Unable to save client");
      setMessage("Save failed");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(clientId: number) {
    try {
      setIsSaving(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/clients/${clientId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Delete request failed");
      }

      if (editingClientId === clientId) {
        setEditingClientId(null);
        setForm(emptyForm);
      }

      setClients((currentClients) =>
        currentClients.filter((client) => client.id !== clientId),
      );
      setMessage("Client deleted");
    } catch {
      setError("Unable to delete client");
      setMessage("Delete failed");
    } finally {
      setIsSaving(false);
    }
  }

  function startEditing(client: Client) {
    setEditingClientId(client.id);
    setForm({
      name: client.name,
      company: client.company,
      email: client.email,
      plan: client.plan,
      status: client.status,
    });
    setError("");
    setMessage(`Editing ${client.company}`);
  }

  function cancelEditing() {
    setEditingClientId(null);
    setForm(emptyForm);
    setError("");
    setMessage("Client data synced");
  }

  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <DashboardCard>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                {editingClientId === null ? "Add client" : "Edit client"}
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Keep client records simple while the data stays in memory.
              </p>
            </div>
            <StatusMessageBadge hasError={Boolean(error)} message={message} />
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <FormError message={error} />
            <TextInput
              label="Name"
              onChange={(value) => setForm({ ...form, name: value })}
              value={form.name}
            />
            <TextInput
              label="Company"
              onChange={(value) => setForm({ ...form, company: value })}
              value={form.company}
            />
            <TextInput
              label="Email"
              onChange={(value) => setForm({ ...form, email: value })}
              type="email"
              value={form.email}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Plan"
                onChange={(value) => setForm({ ...form, plan: value })}
                options={["Starter", "Growth", "Scale"]}
                value={form.plan}
              />
              <SelectField
                label="Status"
                onChange={(value) => setForm({ ...form, status: value })}
                options={["Active", "Trial", "Paused", "Churned"]}
                value={form.status}
              />
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <ActionButton disabled={isSaving} type="submit">
                {isSaving
                  ? "Saving..."
                  : editingClientId === null
                    ? "Add client"
                    : "Save changes"}
              </ActionButton>
              {editingClientId !== null ? (
                <ActionButton
                  onClick={cancelEditing}
                  type="button"
                  variant="secondary"
                >
                  Cancel
                </ActionButton>
              ) : null}
            </div>
          </form>
        </DashboardCard>

        <DashboardCard>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Clients</h2>
              <p className="mt-1 text-sm text-zinc-500">
                In-memory client records from the Express API.
              </p>
            </div>
            <span className="rounded-full bg-white/[0.05] px-3 py-1 text-sm text-zinc-400">
              {filteredClients.length} of {clients.length} shown
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_180px]">
            <TextInput
              label="Search clients"
              onChange={setSearchQuery}
              placeholder="Search name, email, or company"
              required={false}
              type="search"
              value={searchQuery}
            />
            <SelectField
              label="Status"
              onChange={setStatusFilter}
              options={["All", "Active", "Pending", "Inactive"]}
              value={statusFilter}
            />
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-[0.16em] text-zinc-500">
                <tr>
                  <th className="py-3 pr-4 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Plan</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="py-3 pl-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {isLoading ? (
                  <EmptyTableRow colSpan={5}>Loading clients...</EmptyTableRow>
                ) : clients.length === 0 ? (
                  <EmptyTableRow colSpan={5}>
                      No clients yet. Add your first client to populate this
                      table.
                  </EmptyTableRow>
                ) : filteredClients.length === 0 ? (
                  <EmptyTableRow colSpan={5}>
                      No clients match your current search or status filter.
                  </EmptyTableRow>
                ) : (
                  filteredClients.map((client) => (
                  <tr key={client.id}>
                    <td className="py-4 pr-4">
                      <p className="font-medium text-white">{client.name}</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {client.email}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-zinc-400">
                      {client.company}
                    </td>
                    <td className="px-4 py-4 text-zinc-400">{client.plan}</td>
                    <td className="px-4 py-4">
                      <StatusBadge
                        className={
                          statusStyles[client.status] ??
                          "bg-white/[0.06] text-zinc-300"
                        }
                      >
                        {client.status}
                      </StatusBadge>
                    </td>
                    <td className="py-4 pl-4 text-right">
                      <div className="flex justify-end gap-2">
                        <ActionButton
                          className="px-3 py-1.5 text-xs"
                          disabled={isSaving}
                          onClick={() => startEditing(client)}
                          type="button"
                          variant="ghost"
                        >
                          Edit
                        </ActionButton>
                        <ActionButton
                          className="px-3 py-1.5 text-xs"
                          disabled={isSaving}
                          onClick={() => handleDelete(client.id)}
                          type="button"
                          variant="danger"
                        >
                          Delete
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </section>
    </>
  );
}
