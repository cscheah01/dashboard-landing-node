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

function getClients() {
  return clients;
}

function createClient(client) {
  const newClient = {
    ...client,
    id: nextClientId,
  };

  nextClientId += 1;
  clients.push(newClient);

  return newClient;
}

function updateClient(clientId, client) {
  const clientIndex = clients.findIndex((item) => item.id === clientId);

  if (clientIndex === -1) {
    return null;
  }

  const updatedClient = {
    ...client,
    id: clientId,
  };

  clients[clientIndex] = updatedClient;

  return updatedClient;
}

function deleteClient(clientId) {
  const clientExists = clients.some((client) => client.id === clientId);

  if (!clientExists) {
    return false;
  }

  clients = clients.filter((client) => client.id !== clientId);

  return true;
}

module.exports = {
  createClient,
  deleteClient,
  getClients,
  updateClient,
};
