const express = require("express");
const prisma = require("../data/prismaClient");
const { validateLeadInput } = require("../validators/leadValidator");

const router = express.Router();

function getLeadId(param) {
  const leadId = Number(param);
  return Number.isInteger(leadId) ? leadId : null;
}

router.get("/", async (req, res) => {
  const leads = await prisma.lead.findMany({
    orderBy: {
      id: "asc",
    },
  });

  res.json(leads);
});

router.post("/", async (req, res) => {
  const { lead, error } = validateLeadInput(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  const newLead = await prisma.lead.create({
    data: lead,
  });

  res.status(201).json(newLead);
});

router.put("/:id", async (req, res) => {
  const leadId = getLeadId(req.params.id);
  const { lead, error } = validateLeadInput(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  if (!leadId) {
    return res.status(404).json({ message: "Lead not found." });
  }

  const existingLead = await prisma.lead.findUnique({
    where: {
      id: leadId,
    },
  });

  if (!existingLead) {
    return res.status(404).json({ message: "Lead not found." });
  }

  const updatedLead = await prisma.lead.update({
    where: {
      id: leadId,
    },
    data: lead,
  });

  res.json(updatedLead);
});

router.delete("/:id", async (req, res) => {
  const leadId = getLeadId(req.params.id);

  if (!leadId) {
    return res.status(404).json({ message: "Lead not found." });
  }

  const existingLead = await prisma.lead.findUnique({
    where: {
      id: leadId,
    },
  });

  if (!existingLead) {
    return res.status(404).json({ message: "Lead not found." });
  }

  await prisma.lead.delete({
    where: {
      id: leadId,
    },
  });

  res.status(204).send();
});

module.exports = router;
