const dashboardOverview = {
  metrics: [
    { label: "Revenue", value: "$248.6K", change: "+18.2%" },
    { label: "Active users", value: "42,891", change: "+9.4%" },
    { label: "Conversion", value: "7.8%", change: "+2.1%" },
    { label: "Retention", value: "96.4%", change: "+4.6%" },
  ],
  revenueData: [
    { month: "Jan", value: 36 },
    { month: "Feb", value: 44 },
    { month: "Mar", value: 41 },
    { month: "Apr", value: 58 },
    { month: "May", value: 53 },
    { month: "Jun", value: 67 },
    { month: "Jul", value: 72 },
    { month: "Aug", value: 80 },
    { month: "Sep", value: 76 },
    { month: "Oct", value: 88 },
    { month: "Nov", value: 84 },
    { month: "Dec", value: 96 },
  ],
  activities: [
    {
      event: "Enterprise renewal closed",
      owner: "Sales",
      status: "Complete",
      time: "12 min ago",
    },
    {
      event: "Forecast model refreshed",
      owner: "Ops",
      status: "Synced",
      time: "34 min ago",
    },
    {
      event: "Product usage cohort updated",
      owner: "Data",
      status: "Live",
      time: "1 hr ago",
    },
    {
      event: "Board report exported",
      owner: "Finance",
      status: "Ready",
      time: "2 hrs ago",
    },
  ],
};

const dashboardAnalytics = {
  metrics: [
    { label: "Sessions", value: "128.4K", change: "+14.8%" },
    { label: "Activation", value: "42.7%", change: "+5.3%" },
    { label: "Expansion", value: "$86.2K", change: "+12.1%" },
    { label: "Churn risk", value: "3.2%", change: "-1.4%" },
  ],
  funnel: [
    { label: "Visitors", value: 94 },
    { label: "Trials", value: 68 },
    { label: "Activated", value: 48 },
    { label: "Paid", value: 31 },
  ],
  cohorts: [
    ["Enterprise", "98.2%", "$148K"],
    ["Mid-market", "94.6%", "$72K"],
    ["Startup", "89.1%", "$28K"],
  ],
};

const dashboardReports = {
  reportCards: [
    { label: "Published reports", value: "24", detail: "+6 this month" },
    { label: "Scheduled exports", value: "11", detail: "Next in 2 hours" },
    { label: "Data sources", value: "18", detail: "All healthy" },
  ],
  reports: [
    {
      name: "Board update",
      owner: "Finance",
      cadence: "Monthly",
      status: "Ready",
    },
    {
      name: "Revenue forecast",
      owner: "Operations",
      cadence: "Weekly",
      status: "Draft",
    },
    {
      name: "Customer health",
      owner: "Success",
      cadence: "Weekly",
      status: "Live",
    },
    {
      name: "Pipeline review",
      owner: "Sales",
      cadence: "Daily",
      status: "Synced",
    },
  ],
};

module.exports = {
  dashboardAnalytics,
  dashboardOverview,
  dashboardReports,
};
