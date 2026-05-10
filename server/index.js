const express = require("express");
const cors = require("cors");
const dashboardRoutes = require("./routes/dashboardRoutes");
const clientsRoutes = require("./routes/clientsRoutes");
const leadsRoutes = require("./routes/leadsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

app.get("/", (req, res) => {
  res.json({
    message: "Backend server is running",
  });
});

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/leads", leadsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
