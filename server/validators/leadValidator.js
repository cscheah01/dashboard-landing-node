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

module.exports = {
  validateLeadInput,
};
