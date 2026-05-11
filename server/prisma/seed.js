const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const clients = [
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

const leads = [
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

async function main() {
  await prisma.client.deleteMany();
  await prisma.lead.deleteMany();

  await prisma.client.createMany({ data: clients });
  await prisma.lead.createMany({ data: leads });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
