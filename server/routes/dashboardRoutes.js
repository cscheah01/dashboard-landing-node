const express = require("express");
const {
  dashboardAnalytics,
  dashboardOverview,
  dashboardReports,
} = require("../data/dashboardData");

const router = express.Router();

router.get("/overview", (req, res) => {
  res.json(dashboardOverview);
});

router.get("/analytics", (req, res) => {
  res.json(dashboardAnalytics);
});

router.get("/reports", (req, res) => {
  res.json(dashboardReports);
});

module.exports = router;
