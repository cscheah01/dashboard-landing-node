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

function getLeads() {
  return leads;
}

function createLead(lead) {
  const newLead = {
    ...lead,
    id: nextLeadId,
  };

  nextLeadId += 1;
  leads.push(newLead);

  return newLead;
}

function updateLead(leadId, lead) {
  const leadIndex = leads.findIndex((item) => item.id === leadId);

  if (leadIndex === -1) {
    return null;
  }

  const updatedLead = {
    ...lead,
    id: leadId,
  };

  leads[leadIndex] = updatedLead;

  return updatedLead;
}

function deleteLead(leadId) {
  const leadExists = leads.some((lead) => lead.id === leadId);

  if (!leadExists) {
    return false;
  }

  leads = leads.filter((lead) => lead.id !== leadId);

  return true;
}

module.exports = {
  createLead,
  deleteLead,
  getLeads,
  updateLead,
};
