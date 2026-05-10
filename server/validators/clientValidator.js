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

module.exports = {
  validateClientInput,
};
