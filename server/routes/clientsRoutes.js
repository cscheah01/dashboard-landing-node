const express = require("express");
const prisma = require("../data/prismaClient");
const { validateClientInput } = require("../validators/clientValidator");

const router = express.Router();

function getClientId(param) {
  const clientId = Number(param);
  return Number.isInteger(clientId) ? clientId : null;
}

router.get("/", async (req, res) => {
  const clients = await prisma.client.findMany({
    orderBy: {
      id: "asc",
    },
  });

  res.json(clients);
});

router.post("/", async (req, res) => {
  const { client, error } = validateClientInput(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  const newClient = await prisma.client.create({
    data: client,
  });

  res.status(201).json(newClient);
});

router.put("/:id", async (req, res) => {
  const clientId = getClientId(req.params.id);
  const { client, error } = validateClientInput(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  if (!clientId) {
    return res.status(404).json({ message: "Client not found." });
  }

  const existingClient = await prisma.client.findUnique({
    where: {
      id: clientId,
    },
  });

  if (!existingClient) {
    return res.status(404).json({ message: "Client not found." });
  }

  const updatedClient = await prisma.client.update({
    where: {
      id: clientId,
    },
    data: client,
  });

  res.json(updatedClient);
});

router.delete("/:id", async (req, res) => {
  const clientId = getClientId(req.params.id);

  if (!clientId) {
    return res.status(404).json({ message: "Client not found." });
  }

  const existingClient = await prisma.client.findUnique({
    where: {
      id: clientId,
    },
  });

  if (!existingClient) {
    return res.status(404).json({ message: "Client not found." });
  }

  await prisma.client.delete({
    where: {
      id: clientId,
    },
  });

  res.status(204).send();
});

module.exports = router;
