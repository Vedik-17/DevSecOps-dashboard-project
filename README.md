Here is a complete and well-formatted **`README.md`** for your **DevSecOps Executive Dashboard** project:

---

# 🛡️ DevSecOps Executive Dashboard

An interactive dashboard application built with **React** and **Recharts**, designed to provide high-level insights into key **DevSecOps metrics** for **executive decision-making**. The dashboard helps visualize vulnerabilities, MTTR, scan coverage, compliance rates, and more—with full support for custom JSON uploads and responsive design.

---

## ✨ Features

* **Overview Tab**: Summary of total vulnerabilities, critical ones, average MTTR, and scan coverage.
* **Vulnerabilities Tab**: View trends by severity over time and top affected applications.
* **Efficiency & Compliance Tab**: Analyze scan coverage, gate pass rates, compliance levels, and MTTR by severity.
* **Time Filtering**: Filter dashboard data by Last Month, 3, 6, or 12 Months.
* **Custom Data Upload**: Upload your own JSON to visualize specific organizational metrics.
* **Theme Toggle**: Switch between light and dark themes.
* **Responsive Design**: Optimized for desktop, tablet, and mobile.

---

## 🧰 Technologies Used

* **React**: UI library for building the app.
* **Recharts**: Library for rendering charts and graphs.
* **CSS**: Handcrafted styles, fully responsive without external frameworks.

---

## 📦 Setup & Installation

### ✅ Prerequisites

* [Node.js & npm](https://nodejs.org/) (or [Yarn](https://yarnpkg.com/))

---

### 🚀 Steps to Run

#### 1. Create a New React Project (using Vite):

```bash
npm create vite@latest devsecops-dashboard-app -- --template react
```

* Choose `react` and `javascript` as options.

#### 2. Navigate to the Project:

```bash
cd devsecops-dashboard-app
```

#### 3. Install Dependencies:

```bash
npm install
```

#### 4. Install Recharts:

```bash
npm install recharts
```

#### 5. Replace App Content:

* Open `src/App.jsx`, remove all contents, and paste the full code from your dashboard's source (with inlined `<style>`).

#### 6. Clean Up Unused CSS:

* Make sure `src/index.css` or `src/App.css` is empty or deleted.
* In `src/main.jsx`, **comment/remove** any CSS imports like:

```js
// import './index.css'; // Remove this if present
```

```js
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

#### 7. Start the Dev Server:

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser to view the dashboard.

---

## 📊 Usage Guide

### Navigate Tabs

* Switch between `Overview`, `Vulnerabilities`, and `Efficiency & Compliance` to view different metrics.

### Filter Time Range

* Use the **Time Range** dropdown to select:

  * Last Month
  * Last 3 Months
  * Last 6 Months
  * Last 12 Months

### Upload Custom JSON Data

* Click **"Upload Data File (JSON)"**
* Choose a JSON file with the structure below:

```json
{
  "vulnerabilityTrends": [
    { "month": "Jan 2023", "critical": 15, "high": 30, "medium": 80, "low": 120, "new": 50, "resolved": 45 },
    ...
  ],
  "mttrTrends": [
    { "month": "Jan 2023", "critical": 10.5, "high": 7.2, "medium": 4.1 },
    ...
  ],
  "scanCoverage": {
    "sast": 92,
    "dast": 85,
    "sca": 95
  },
  "vulnerabilitiesBySeverity": [
    { "name": "Critical", "value": 25 },
    { "name": "High", "value": 75 },
    ...
  ],
  "vulnerabilitiesByApp": [
    { "name": "App A", "critical": 5, "high": 12 },
    ...
  ],
  "securityGatePassRate": 90,
  "policyComplianceRate": 93
}
```

### Reset to Mock Data

* Click **"Reset to Mock Data"** to revert to default sample data.

### Toggle Theme

* Use the **"Toggle Theme"** button to switch between **Light** and **Dark** display modes.

---

## 🧾 JSON Data Requirements (Summary)

| Field                       | Type   | Description                                  |
| --------------------------- | ------ | -------------------------------------------- |
| `vulnerabilityTrends`       | Array  | Monthly severity data (critical, high, etc.) |
| `mttrTrends`                | Array  | Monthly MTTR for different severities        |
| `scanCoverage`              | Object | SAST, DAST, SCA percentages                  |
| `vulnerabilitiesBySeverity` | Array  | Pie chart data for vulnerability counts      |
| `vulnerabilitiesByApp`      | Array  | Bar chart data for top applications          |
| `securityGatePassRate`      | Number | Pass rate (%)                                |
| `policyComplianceRate`      | Number | Compliance rate (%)                          |

---

## 🤝 Contributing

Want to improve or customize this dashboard? Fork the repository, make your changes, and submit a pull request. Contributions are welcome!

---

## 📄 License

This project is open-source and free to use for educational and internal organizational purposes.

---

## 🧠 Author

M.Vedik Reddy
