const express = require("express");
const {
  createClient,
  deleteClient,
  getClients,
  updateClient,
} = require("../data/clientsData");
const { validateClientInput } = require("../validators/clientValidator");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(getClients());
});

router.post("/", (req, res) => {
  const { client, error } = validateClientInput(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  res.status(201).json(createClient(client));
});

router.put("/:id", (req, res) => {
  const clientId = Number(req.params.id);
  const { client, error } = validateClientInput(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  const updatedClient = updateClient(clientId, client);

  if (!updatedClient) {
    return res.status(404).json({ message: "Client not found." });
  }

  res.json(updatedClient);
});

router.delete("/:id", (req, res) => {
  const clientId = Number(req.params.id);
  const deleted = deleteClient(clientId);

  if (!deleted) {
    return res.status(404).json({ message: "Client not found." });
  }

  res.status(204).send();
});

module.exports = router;
