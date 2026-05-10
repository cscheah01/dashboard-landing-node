const express = require("express");
const {
  createLead,
  deleteLead,
  getLeads,
  updateLead,
} = require("../data/leadsData");
const { validateLeadInput } = require("../validators/leadValidator");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(getLeads());
});

router.post("/", (req, res) => {
  const { lead, error } = validateLeadInput(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  res.status(201).json(createLead(lead));
});

router.put("/:id", (req, res) => {
  const leadId = Number(req.params.id);
  const { lead, error } = validateLeadInput(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  const updatedLead = updateLead(leadId, lead);

  if (!updatedLead) {
    return res.status(404).json({ message: "Lead not found." });
  }

  res.json(updatedLead);
});

router.delete("/:id", (req, res) => {
  const leadId = Number(req.params.id);
  const deleted = deleteLead(leadId);

  if (!deleted) {
    return res.status(404).json({ message: "Lead not found." });
  }

  res.status(204).send();
});

module.exports = router;
