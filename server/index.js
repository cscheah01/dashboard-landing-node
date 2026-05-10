const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

const dashboardOverview = {
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

const dashboardAnalytics = {
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

const dashboardReports = {
  reportCards: [
    { label: "Published reports", value: "24", detail: "+6 this month" },
    { label: "Scheduled exports", value: "11", detail: "Next in 2 hours" },
    { label: "Data sources", value: "18", detail: "All healthy" },
  ],
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
};

let nextClientId = 4;

let clients = [
  {
    id: 1,
    name: "Maya Tan",
    company: "Aurora Systems",
    email: "maya@aurorasystems.com",
    plan: "Growth",
    status: "Active",
  },
  {
    id: 2,
    name: "Daniel Lee",
    company: "Vertex Labs",
    email: "daniel@vertexlabs.com",
    plan: "Scale",
    status: "Active",
  },
  {
    id: 3,
    name: "Priya Shah",
    company: "Summit Cloud",
    email: "priya@summitcloud.com",
    plan: "Starter",
    status: "Trial",
  },
];

let nextLeadId = 4;

let leads = [
  {
    id: 1,
    name: "Rachel Wong",
    company: "Nimbus Analytics",
    email: "rachel@nimbusanalytics.com",
    source: "Website",
    stage: "New",
    value: 18000,
    owner: "Sales",
    createdAt: "2026-05-01",
  },
  {
    id: 2,
    name: "Ethan Miller",
    company: "Orbit Finance",
    email: "ethan@orbitfinance.com",
    source: "Referral",
    stage: "Qualified",
    value: 42000,
    owner: "Growth",
    createdAt: "2026-05-03",
  },
  {
    id: 3,
    name: "Nadia Rahman",
    company: "PeakOps",
    email: "nadia@peakops.com",
    source: "Webinar",
    stage: "Proposal",
    value: 65000,
    owner: "Enterprise",
    createdAt: "2026-05-06",
  },
];

function validateClientInput(body) {
  const client = {
    name: body.name?.trim(),
    company: body.company?.trim(),
    email: body.email?.trim(),
    plan: body.plan?.trim(),
    status: body.status?.trim(),
  };

  if (!client.name || !client.company || !client.email || !client.plan || !client.status) {
    return {
      error: "Name, company, email, plan, and status are required.",
    };
  }

  return { client };
}

function validateLeadInput(body) {
  const value = Number(body.value);
  const lead = {
    name: body.name?.trim(),
    company: body.company?.trim(),
    email: body.email?.trim(),
    source: body.source?.trim(),
    stage: body.stage?.trim(),
    value,
    owner: body.owner?.trim(),
    createdAt: body.createdAt?.trim(),
  };

  if (
    !lead.name ||
    !lead.company ||
    !lead.email ||
    !lead.source ||
    !lead.stage ||
    !lead.owner ||
    !lead.createdAt ||
    Number.isNaN(value)
  ) {
    return {
      error:
        "Name, company, email, source, stage, value, owner, and created date are required.",
    };
  }

  return { lead };
}

app.get("/", (req, res) => {
  res.json({
    message: "Backend server is running",
  });
});

app.get("/api/dashboard/overview", (req, res) => {
  res.json(dashboardOverview);
});

app.get("/api/dashboard/analytics", (req, res) => {
  res.json(dashboardAnalytics);
});

app.get("/api/dashboard/reports", (req, res) => {
  res.json(dashboardReports);
});

app.get("/api/clients", (req, res) => {
  res.json(clients);
});

app.post("/api/clients", (req, res) => {
  const { client, error } = validateClientInput(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  const newClient = {
    ...client,
    id: nextClientId,
  };

  nextClientId += 1;
  clients.push(newClient);

  res.status(201).json(newClient);
});

app.put("/api/clients/:id", (req, res) => {
  const clientId = Number(req.params.id);
  const clientIndex = clients.findIndex((client) => client.id === clientId);

  if (clientIndex === -1) {
    return res.status(404).json({ message: "Client not found." });
  }

  const { client, error } = validateClientInput(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  const updatedClient = {
    ...client,
    id: clientId,
  };

  clients[clientIndex] = updatedClient;

  res.json(updatedClient);
});

app.delete("/api/clients/:id", (req, res) => {
  const clientId = Number(req.params.id);
  const clientExists = clients.some((client) => client.id === clientId);

  if (!clientExists) {
    return res.status(404).json({ message: "Client not found." });
  }

  clients = clients.filter((client) => client.id !== clientId);

  res.status(204).send();
});

app.get("/api/leads", (req, res) => {
  res.json(leads);
});

app.post("/api/leads", (req, res) => {
  const { lead, error } = validateLeadInput(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  const newLead = {
    ...lead,
    id: nextLeadId,
  };

  nextLeadId += 1;
  leads.push(newLead);

  res.status(201).json(newLead);
});

app.put("/api/leads/:id", (req, res) => {
  const leadId = Number(req.params.id);
  const leadIndex = leads.findIndex((lead) => lead.id === leadId);

  if (leadIndex === -1) {
    return res.status(404).json({ message: "Lead not found." });
  }

  const { lead, error } = validateLeadInput(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  const updatedLead = {
    ...lead,
    id: leadId,
  };

  leads[leadIndex] = updatedLead;

  res.json(updatedLead);
});

app.delete("/api/leads/:id", (req, res) => {
  const leadId = Number(req.params.id);
  const leadExists = leads.some((lead) => lead.id === leadId);

  if (!leadExists) {
    return res.status(404).json({ message: "Lead not found." });
  }

  leads = leads.filter((lead) => lead.id !== leadId);

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
