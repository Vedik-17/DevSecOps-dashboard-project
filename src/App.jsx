import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
// import './App.css'; // Removed this import as CSS is now inlined

// Mock Data Generation (for demonstration purposes)
const generateMockData = () => {
  const today = new Date();
  const data = {
    vulnerabilityTrends: [],
    mttrTrends: [],
    scanCoverage: {
      sast: Math.floor(Math.random() * 20) + 80, // 80-100%
      dast: Math.floor(Math.random() * 20) + 70, // 70-90%
      sca: Math.floor(Math.random() * 20) + 85, // 85-100%
    },
    vulnerabilitiesBySeverity: [
      { name: 'Critical', value: Math.floor(Math.random() * 50) + 10 },
      { name: 'High', value: Math.floor(Math.random() * 100) + 50 },
      { name: 'Medium', value: Math.floor(Math.random() * 200) + 100 },
      { name: 'Low', value: Math.floor(Math.random() * 300) + 150 },
    ],
    vulnerabilitiesByApp: [
      { name: 'App A', critical: Math.floor(Math.random() * 10) + 2, high: Math.floor(Math.random() * 20) + 5 },
      { name: 'App B', critical: Math.floor(Math.random() * 8) + 1, high: Math.floor(Math.random() * 15) + 3 },
      { name: 'App C', critical: Math.floor(Math.random() * 12) + 3, high: Math.floor(Math.random() * 25) + 7 },
      { name: 'App D', critical: Math.floor(Math.random() * 5) + 1, high: Math.floor(Math.random() * 10) + 2 },
      { name: 'App E', critical: Math.floor(Math.random() * 7) + 1, high: Math.floor(Math.random() * 18) + 4 },
    ],
    securityGatePassRate: Math.floor(Math.random() * 10) + 85, // 85-95%
    policyComplianceRate: Math.floor(Math.random() * 10) + 88, // 88-98%
  };

  // Generate data for the last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });

    data.vulnerabilityTrends.push({
      month: monthYear,
      critical: Math.floor(Math.random() * 20) + 20 - i, // Decreasing trend for critical
      high: Math.floor(Math.random() * 30) + 50 - i,
      medium: Math.floor(Math.random() * 50) + 100 - i,
      low: Math.floor(Math.random() * 80) + 150 - i,
      new: Math.floor(Math.random() * 40) + 50,
      resolved: Math.floor(Math.random() * 45) + 55,
    });

    data.mttrTrends.push({
      month: monthYear,
      critical: Math.floor(Math.random() * 5) + 10, // Days
      high: Math.floor(Math.random() * 7) + 7,
      medium: Math.floor(Math.random() * 10) + 4,
    });
  }

  return data;
};

const COLORS = ['#EF4444', '#F97316', '#FACC15', '#22C55E']; // Red, Orange, Yellow, Green for severity

// Simplified UI components using custom CSS classes
const CardComponent = ({ children, className }) => (
  <div className={`card ${className}`}>
    {children}
  </div>
);

const CardHeaderComponent = ({ children, className }) => (
  <div className={`card-header ${className}`}>
    {children}
  </div>
);

const CardTitleComponent = ({ children, className }) => (
  <h3 className={`card-title ${className}`}>
    {children}
  </h3>
);

const CardDescriptionComponent = ({ children, className }) => (
  <p className={`card-description ${className}`}>
    {children}
  </p>
);

const CardContentComponent = ({ children, className }) => (
  <div className={`card-content ${className}`}>
    {children}
  </div>
);

const TabsComponent = ({ defaultValue, children, className }) => (
  <div className={`tabs-container ${className}`}>
    {children}
  </div>
);

const TabsListComponent = ({ children, className }) => (
  <div className={`tabs-list ${className}`}>
    {children}
  </div>
);

const TabsTriggerComponent = ({ value, children, className, onClick, activeTab }) => ( // Added activeTab prop
  <button
    className={`tabs-trigger ${className} ${activeTab === value ? 'tabs-trigger-active' : ''}`} // Use activeTab prop
    onClick={() => onClick(value)}
  >
    {children}
  </button>
);

const TabsContentComponent = ({ value, children, className, activeTab }) => (
  <div className={`tabs-content ${className} ${activeTab === value ? 'tabs-content-active' : 'tabs-content-hidden'}`}>
    {children}
  </div>
);

const ButtonComponent = ({ children, className, onClick }) => (
  <button
    className={`button ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

const DropdownMenuComponent = ({ children, isOpen }) => <div className="dropdown-menu-container">{children}</div>;
const DropdownMenuTriggerComponent = ({ children, onClick }) => <div className="dropdown-menu-trigger" onClick={onClick}>{children}</div>;
const DropdownMenuContentComponent = ({ children, isOpen }) => (
  isOpen && (
    <div className="dropdown-menu-content">
      {children}
    </div>
  )
);
const DropdownMenuItemComponent = ({ children, onClick }) => (
  <div className="dropdown-menu-item" onClick={onClick}>
    {children}
  </div>
);
const DropdownMenuLabelComponent = ({ children }) => (
  <div className="dropdown-menu-label">
    {children}
  </div>
);
const DropdownMenuSeparatorComponent = () => <div className="dropdown-menu-separator"></div>;


const App = () => {
  const [mockData, setMockData] = useState(generateMockData());
  const [uploadedData, setUploadedData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('12m'); // Default to 12 months
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility

  // Determine which data to use: uploaded or mock
  const currentData = uploadedData || mockData;

  // Effect to apply theme class to body
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-mode' : '';
  }, [theme]);

  // Function to filter data based on time range (simplified for mock data)
  const getFilteredData = (dataToFilter, range) => {
    let filteredVulnerabilityTrends = dataToFilter.vulnerabilityTrends;
    let filteredMttrTrends = dataToFilter.mttrTrends;

    if (range === '6m') {
      filteredVulnerabilityTrends = dataToFilter.vulnerabilityTrends.slice(-6);
      filteredMttrTrends = dataToFilter.mttrTrends.slice(-6);
    } else if (range === '3m') {
      filteredVulnerabilityTrends = dataToFilter.vulnerabilityTrends.slice(-3);
      filteredMttrTrends = dataToFilter.mttrTrends.slice(-3);
    } else if (range === '1m') {
      filteredVulnerabilityTrends = dataToFilter.vulnerabilityTrends.slice(-1);
      filteredMttrTrends = dataToFilter.mttrTrends.slice(-1);
    }
    // '12m' is default, no slicing needed

    return { filteredVulnerabilityTrends, filteredMttrTrends };
  };

  const { filteredVulnerabilityTrends, filteredMttrTrends } = getFilteredData(currentData, timeRange);

  // Console logs to help debug the time range issue
  useEffect(() => {
    console.log('Time Range Changed:', timeRange);
    console.log('Filtered Vulnerability Trends:', filteredVulnerabilityTrends);
    console.log('Filtered MTTR Trends:', filteredMttrTrends);
  }, [timeRange, filteredVulnerabilityTrends, filteredMttrTrends]); // Depend on these to log when they change


  // Calculate summary metrics
  const totalCriticalVulns = currentData.vulnerabilitiesBySeverity.find(v => v.name === 'Critical')?.value || 0;
  const totalHighVulns = currentData.vulnerabilitiesBySeverity.find(v => v.name === 'High')?.value || 0;
  const totalVulnerabilities = currentData.vulnerabilitiesBySeverity.reduce((sum, item) => sum + item.value, 0);

  const avgMttrCritical = filteredMttrTrends.length > 0
    ? (filteredMttrTrends.reduce((sum, item) => sum + item.critical, 0) / filteredMttrTrends.length).toFixed(1)
    : 'N/A';
  const avgMttrHigh = filteredMttrTrends.length > 0
    ? (filteredMttrTrends.reduce((sum, item) => sum + item.high, 0) / filteredMttrTrends.length).toFixed(1)
    : 'N/A';

  const newVulnsLastMonth = filteredVulnerabilityTrends[filteredVulnerabilityTrends.length - 1]?.new || 0;
  const resolvedVulnsLastMonth = filteredVulnerabilityTrends[filteredVulnerabilityTrends.length - 1]?.resolved || 0;

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          // Assuming JSON for simplicity. For CSV, you'd use a library like 'papaparse'.
          const parsedData = JSON.parse(content);
          // Basic validation for the expected data structure
          if (parsedData.vulnerabilityTrends && parsedData.mttrTrends && parsedData.scanCoverage && parsedData.vulnerabilitiesBySeverity && parsedData.vulnerabilitiesByApp) {
            setUploadedData(parsedData);
            alert('Data uploaded successfully!');
          } else {
            alert('Invalid data format. Please upload a JSON file with the expected dashboard structure.');
            setUploadedData(null); // Clear invalid data
          }
        } catch (error) {
          alert('Error parsing file: ' + error.message + '. Please ensure it is a valid JSON file.');
          setUploadedData(null);
        }
      };
      reader.readAsText(file);
    }
  };

  const resetToMockData = () => {
    setUploadedData(null);
    setMockData(generateMockData()); // Regenerate mock data for a fresh start
    alert('Dashboard reset to mock data.');
  };

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleTimeRangeSelect = (range) => {
    setTimeRange(range);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  return (
    <div className="dashboard-container">
      {/* Inlined CSS for App.css content */}
      <style>
        {`
          /* Import Google Fonts - Inter */
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

          /* Global Styles */
          body {
            margin: 0;
            font-family: 'Inter', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            background-color: #f8f8f8; /* Light gray background */
            color: #333; /* Dark text for light mode */
          }

          /* Dark Mode */
          body.dark-mode {
            background-color: #1a202c; /* Dark background */
            color: #e2e8f0; /* Light text for dark mode */
          }

          body.dark-mode .card {
            background-color: #2d3748; /* Dark gray background */
          }
          body.dark-mode .card-title {
            color: #f7fafc; /* text-gray-100 */
          }
          body.dark-mode .card-description {
            color: #a0aec0; /* text-gray-400 */
          }
          body.dark-mode .metric-label {
            color: #a0aec0; /* text-gray-400 */
          }
          body.dark-mode .text-blue { color: #60a5fa; } /* blue-400 */
          body.dark-mode .text-red { color: #f87171; } /* red-400 */
          body.dark-mode .text-orange { color: #fb923c; } /* orange-400 */
          body.dark-mode .text-green { color: #4ade80; } /* green-400 */
          body.dark-mode .text-purple { color: #a78bfa; } /* purple-400 */
          body.dark-mode .text-cyan { color: #22d3ee; } /* cyan-400 */
          body.dark-mode .text-teal { color: #2dd4bf; } /* teal-400 */
          body.dark-mode .text-indigo { color: #818cf8; } /* indigo-400 */
          body.dark-mode .text-lime { color: #a3e635; } /* lime-400 */
          body.dark-mode .tabs-list {
            border-color: #4a5568; /* dark:border-gray-700 */
          }
          body.dark-mode .tabs-trigger {
            color: #cbd5e0; /* dark:text-gray-300 */
          }
          body.dark-mode .tabs-trigger:hover {
            background-color: #4a5568; /* dark:hover:bg-gray-700 */
          }
          body.dark-mode .tabs-trigger:focus {
            box-shadow: 0 0 0 2px #3b82f6, 0 0 0 4px rgba(59, 130, 246, 0.5); /* dark:focus:ring-offset-gray-800 */
          }
          body.dark-mode .button-secondary {
            background-color: #4a5568; /* dark:bg-gray-700 */
            color: #e2e8f0; /* dark:text-gray-200 */
          }
          body.dark-mode .button-secondary:hover {
            background-color: #2d3748; /* dark:hover:bg-gray-600 */
          }
          body.dark-mode .button-secondary:focus {
            box-shadow: 0 0 0 2px #3b82f6, 0 0 0 4px rgba(59, 130, 246, 0.5); /* dark:focus:ring-offset-gray-800 */
          }
          body.dark-mode .dropdown-menu-content {
            background-color: #2d3748; /* dark:bg-gray-800 */
          }
          body.dark-mode .dropdown-menu-item {
            color: #cbd5e0; /* dark:text-gray-300 */
          }
          body.dark-mode .dropdown-menu-item:hover {
            background-color: #4a5568; /* dark:hover:bg-gray-700 */
          }
          body.dark-mode .dropdown-menu-label {
            color: #a0aec0; /* dark:text-gray-400 */
          }
          body.dark-mode .dropdown-menu-separator {
            border-color: #4a5568; /* dark:border-gray-700 */
          }


          /* Dashboard Container */
          .dashboard-container {
            min-height: 100vh;
            padding: 1rem;
            max-width: 1280px; /* Equivalent to max-w-7xl */
            margin-left: auto;
            margin-right: auto;
            padding: 1.5rem; /* Equivalent to p-6 sm:p-4 */
          }

          .dashboard-title {
            font-size: 2.25rem; /* Equivalent to text-4xl */
            font-weight: 700; /* Equivalent to font-bold */
            margin-bottom: 1.5rem; /* Equivalent to mb-6 */
            text-align: center;
          }

          /* Card Styles */
          .card {
            background-color: #ffffff; /* White background */
            border-radius: 0.5rem; /* rounded-lg */
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* shadow-md */
            padding: 1rem; /* p-4 */
            transition: background-color 0.3s ease, color 0.3s ease;
          }

          .card-header {
            margin-bottom: 0.5rem; /* mb-2 */
          }

          .card-title {
            font-size: 1.125rem; /* text-lg */
            font-weight: 600; /* font-semibold */
            color: #1a202c; /* text-gray-900 */
            transition: color 0.3s ease;
          }

          .card-description {
            font-size: 0.875rem; /* text-sm */
            color: #718096; /* text-gray-500 */
            transition: color 0.3s ease;
          }

          .card-content {
            margin-top: 0.5rem; /* mt-2 */
          }

          /* Metric Values */
          .metric-value-large {
            font-size: 2.25rem; /* text-4xl */
            font-weight: 700; /* font-bold */
          }

          .metric-value-medium {
            font-size: 1.875rem; /* text-3xl */
            font-weight: 700; /* font-bold */
          }

          .metric-label {
            font-size: 0.875rem; /* text-sm */
            color: #718096; /* text-gray-500 */
            transition: color 0.3s ease;
          }

          /* Text Colors for Metrics */
          .text-blue { color: #2563eb; } /* blue-600 */
          .text-red { color: #dc2626; } /* red-600 */
          .text-orange { color: #ea580c; } /* orange-600 */
          .text-green { color: #16a34a; } /* green-600 */
          .text-purple { color: #7c3aed; } /* purple-600 */
          .text-cyan { color: #06b6d4; } /* cyan-600 */
          .text-teal { color: #0d9488; } /* teal-600 */
          .text-indigo { color: #4f46e5; } /* indigo-600 */
          .text-lime { color: #65a30d; } /* lime-600 */


          /* Grid Layouts */
          .grid-4-cols {
            display: grid;
            grid-template-columns: 1fr; /* Default to single column */
            gap: 1rem; /* gap-4 */
            margin-bottom: 2rem; /* mb-8 */
          }

          @media (min-width: 768px) { /* md breakpoint */
            .grid-4-cols {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (min-width: 1024px) { /* lg breakpoint */
            .grid-4-cols {
              grid-template-columns: repeat(4, 1fr);
            }
          }

          .grid-2-cols {
            display: grid;
            grid-template-columns: 1fr; /* Default to single column */
            gap: 1rem; /* gap-4 */
          }

          @media (min-width: 1024px) { /* lg breakpoint */
            .grid-2-cols {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          .grid-3-cols {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem; /* gap-4 */
          }

          /* Tabs Styles */
          .tabs-container {
            width: 100%;
          }

          .tabs-header-row {
            display: flex;
            flex-direction: column; /* Default to column for small screens */
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem; /* mb-6 */
            padding-left: 1rem; /* px-4 */
            padding-right: 1rem; /* px-4 */
          }

          @media (min-width: 640px) { /* sm breakpoint */
            .tabs-header-row {
              flex-direction: row; /* Row for larger screens */
            }
          }

          .tabs-list {
            display: flex;
            border-bottom: 1px solid #e2e8f0; /* border-b border-gray-200 */
            margin-bottom: 1rem; /* mb-4 */
          }

          @media (min-width: 640px) { /* sm breakpoint */
            .tabs-list {
              margin-bottom: 0; /* sm:mb-0 */
            }
          }

          .tabs-trigger {
            padding: 0.5rem 1rem; /* px-4 py-2 */
            font-size: 0.875rem; /* text-sm */
            font-weight: 500; /* font-medium */
            color: #4a5568; /* text-gray-700 */
            background-color: transparent;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out;
            border-bottom: 2px solid transparent; /* For active indicator */
          }

          .tabs-trigger:hover {
            background-color: #f7fafc; /* hover:bg-gray-100 */
          }

          .tabs-trigger:focus {
            outline: none;
            box-shadow: 0 0 0 2px #3b82f6, 0 0 0 4px rgba(59, 130, 246, 0.5); /* focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 */
            border-color: #3b82f6; /* Blue ring */
          }

          .tabs-trigger-active {
            color: #3b82f6; /* Active tab color */
            border-bottom: 2px solid #3b82f6; /* Active tab underline */
          }

          .tabs-content {
            padding: 1rem; /* p-4 */
          }

          .tabs-content-active {
            display: block;
          }

          .tabs-content-hidden {
            display: none;
          }

          /* Button Styles */
          .button {
            padding: 0.5rem 1rem; /* px-4 py-2 */
            border-radius: 0.375rem; /* rounded-md */
            font-weight: 500; /* font-medium */
            color: #ffffff; /* text-white */
            background-color: #2563eb; /* bg-blue-600 */
            border: none;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          }

          .button:hover {
            background-color: #1d4ed8; /* hover:bg-blue-700 */
          }

          .button:focus {
            outline: none;
            box-shadow: 0 0 0 2px #3b82f6, 0 0 0 4px rgba(59, 130, 246, 0.5); /* focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 */
          }

          .button-secondary {
            background-color: #e2e8f0; /* bg-gray-200 */
            color: #2d3748; /* text-gray-800 */
          }

          .button-secondary:hover {
            background-color: #cbd5e0; /* hover:bg-gray-300 */
          }

          /* Dropdown Menu Styles */
          .dropdown-menu-container {
            position: relative;
            display: inline-block; /* To allow absolute positioning of content */
          }

          .dropdown-menu-trigger {
            /* The button component is inside this, so its styles apply */
          }

          .dropdown-menu-content {
            position: absolute;
            z-index: 10;
            background-color: #ffffff; /* bg-white */
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05); /* shadow-lg */
            border-radius: 0.375rem; /* rounded-md */
            margin-top: 0.5rem; /* mt-2 */
            padding-top: 0.25rem; /* py-1 */
            padding-bottom: 0.25rem; /* py-1 */
            width: 12rem; /* w-48 */
            right: 0; /* Align to the right of the trigger */
            transition: background-color 0.3s ease, color 0.3s ease;
          }

          .dropdown-menu-item {
            padding: 0.5rem 1rem; /* px-4 py-2 */
            font-size: 0.875rem; /* text-sm */
            color: #4a5568; /* text-gray-700 */
            cursor: pointer;
            transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
          }

          .dropdown-menu-item:hover {
            background-color: #f7fafc; /* hover:bg-gray-100 */
          }

          .dropdown-menu-label {
            padding: 0.5rem 1rem; /* px-4 py-2 */
            font-size: 0.75rem; /* text-xs */
            font-weight: 600; /* font-semibold */
            color: #718096; /* text-gray-500 */
            text-transform: uppercase;
            transition: color 0.3s ease;
          }

          .dropdown-menu-separator {
            border-top: 1px solid #e2e8f0; /* border-t border-gray-200 */
            margin-top: 0.25rem; /* my-1 */
            margin-bottom: 0.25rem; /* my-1 */
            transition: border-color 0.3s ease;
          }

          .dropdown-arrow-icon {
            margin-left: 0.5rem; /* ml-2 */
            margin-right: -0.25rem; /* -mr-1 */
            height: 1rem; /* h-4 */
            width: 1rem; /* w-4 */
          }

          /* Recharts Tooltip Overrides */
          .recharts-default-tooltip {
            background-color: #333 !important;
            border: 1px solid #555 !important;
            color: #fff !important;
            border-radius: 0.5rem !important;
          }
          .recharts-tooltip-label {
            color: #ccc !important;
          }
          .recharts-tooltip-item {
            color: #fff !important;
          }

          /* Utility Classes for Layout */
          .max-width-7xl {
            max-width: 1280px;
          }

          .auto-margin {
            margin-left: auto;
            margin-right: auto;
          }

          .margin-bottom-8 {
            margin-bottom: 2rem;
          }

          .flex-center-items {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .text-center {
            text-align: center;
          }

          .dashboard-controls {
            display: flex;
            flex-wrap: wrap; /* Allow wrapping on smaller screens */
            gap: 1rem; /* Space between buttons */
            justify-content: center;
            margin-bottom: 1.5rem;
            padding: 0 1rem;
          }

          .upload-button {
            display: inline-flex; /* To make it behave like a button */
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
        `}
      </style>

      <h1 className="dashboard-title">DevSecOps Executive Dashboard</h1>

      <div className="dashboard-controls">
        <label htmlFor="file-upload" className="button button-secondary upload-button">
          Upload Data File (JSON)
          <input id="file-upload" type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />
        </label>
        <ButtonComponent className="button-secondary" onClick={resetToMockData}>
          Reset to Mock Data
        </ButtonComponent>
        <ButtonComponent className="button-secondary" onClick={toggleTheme}>
          Toggle Theme ({theme === 'light' ? 'Dark' : 'Light'})
        </ButtonComponent>
      </div>


      <TabsComponent defaultValue="overview" className="max-width-7xl auto-margin" activeTab={activeTab}>
        <div className="tabs-header-row">
          <TabsListComponent className="tabs-list-group">
            <TabsTriggerComponent value="overview" onClick={() => setActiveTab('overview')} activeTab={activeTab}>Overview</TabsTriggerComponent>
            <TabsTriggerComponent value="vulnerabilities" onClick={() => setActiveTab('vulnerabilities')} activeTab={activeTab}>Vulnerabilities</TabsTriggerComponent>
            <TabsTriggerComponent value="efficiency" onClick={() => setActiveTab('efficiency')} activeTab={activeTab}>Efficiency & Compliance</TabsTriggerComponent>
          </TabsListComponent>

          <DropdownMenuComponent isOpen={isDropdownOpen}>
            <DropdownMenuTriggerComponent onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <ButtonComponent className="button-secondary">
                Time Range: {timeRange === '12m' ? 'Last 12 Months' : timeRange === '6m' ? 'Last 6 Months' : timeRange === '3m' ? 'Last 3 Months' : 'Last Month'}
                <svg className="dropdown-arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </ButtonComponent>
            </DropdownMenuTriggerComponent>
            <DropdownMenuContentComponent isOpen={isDropdownOpen}>
              <DropdownMenuLabelComponent>Select Time Range</DropdownMenuLabelComponent>
              <DropdownMenuSeparatorComponent />
              <DropdownMenuItemComponent onClick={() => handleTimeRangeSelect('1m')}>Last Month</DropdownMenuItemComponent>
              <DropdownMenuItemComponent onClick={() => handleTimeRangeSelect('3m')}>Last 3 Months</DropdownMenuItemComponent>
              <DropdownMenuItemComponent onClick={() => handleTimeRangeSelect('6m')}>Last 6 Months</DropdownMenuItemComponent>
              <DropdownMenuItemComponent onClick={() => handleTimeRangeSelect('12m')}>Last 12 Months</DropdownMenuItemComponent>
            </DropdownMenuContentComponent>
          </DropdownMenuComponent>
        </div>

        <TabsContentComponent value="overview" activeTab={activeTab}>
          <div className="grid-4-cols margin-bottom-8">
            <CardComponent>
              <CardHeaderComponent>
                <CardTitleComponent>Total Vulnerabilities</CardTitleComponent>
                <CardDescriptionComponent>Across all applications</CardDescriptionComponent>
              </CardHeaderComponent>
              <CardContentComponent>
                <div className="metric-value-large text-blue">{totalVulnerabilities}</div>
              </CardContentComponent>
            </CardComponent>
            <CardComponent>
              <CardHeaderComponent>
                <CardTitleComponent>Critical Vulnerabilities</CardTitleComponent>
                <CardDescriptionComponent>Currently active</CardDescriptionComponent>
              </CardHeaderComponent>
              <CardContentComponent>
                <div className="metric-value-large text-red">{totalCriticalVulns}</div>
              </CardContentComponent>
            </CardComponent>
            <CardComponent>
              <CardHeaderComponent>
                <CardTitleComponent>Avg. MTTR (Critical)</CardTitleComponent>
                <CardDescriptionComponent>Days to resolve</CardDescriptionComponent>
              </CardHeaderComponent>
              <CardContentComponent>
                <div className="metric-value-large text-orange">{avgMttrCritical} days</div>
              </CardContentComponent>
            </CardComponent>
            <CardComponent>
              <CardHeaderComponent>
                <CardTitleComponent>Scan Coverage</CardTitleComponent>
                <CardDescriptionComponent>Overall average</CardDescriptionComponent>
              </CardHeaderComponent>
              <CardContentComponent>
                <div className="metric-value-large text-green">
                  {((currentData.scanCoverage.sast + currentData.scanCoverage.dast + currentData.scanCoverage.sca) / 3).toFixed(1)}%
                </div>
              </CardContentComponent>
            </CardComponent>
          </div>

          <div className="grid-2-cols">
            <CardComponent>
              <CardHeaderComponent>
                <CardTitleComponent>Vulnerability Trend ({timeRange === '1m' ? 'Last Month' : timeRange === '3m' ? 'Last 3 Months' : timeRange === '6m' ? 'Last 6 Months' : 'Last 12 Months'})</CardTitleComponent>
                <CardDescriptionComponent>New vs. Resolved vulnerabilities</CardDescriptionComponent>
              </CardHeaderComponent>
              <CardContentComponent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={filteredVulnerabilityTrends} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="new" stroke="#8884d8" name="New Vulnerabilities" />
                    <Line type="monotone" dataKey="resolved" stroke="#82ca9d" name="Resolved Vulnerabilities" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContentComponent>
            </CardComponent>

            <CardComponent>
              <CardHeaderComponent>
                <CardTitleComponent>Vulnerabilities by Severity</CardTitleComponent>
                <CardDescriptionComponent>Current breakdown</CardDescriptionComponent>
              </CardHeaderComponent>
              <CardContentComponent className="flex-center-items">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={currentData.vulnerabilitiesBySeverity}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {currentData.vulnerabilitiesBySeverity.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContentComponent>
            </CardComponent>
          </div>
        </TabsContentComponent>

        <TabsContentComponent value="vulnerabilities" activeTab={activeTab}>
          <div className="grid-2-cols">
            <CardComponent>
              <CardHeaderComponent>
                <CardTitleComponent>Vulnerabilities by Severity Trend ({timeRange === '1m' ? 'Last Month' : timeRange === '3m' ? 'Last 3 Months' : timeRange === '6m' ? 'Last 6 Months' : 'Last 12 Months'})</CardTitleComponent>
                <CardDescriptionComponent>Critical, High, Medium, Low over time</CardDescriptionComponent>
              </CardHeaderComponent>
              <CardContentComponent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={filteredVulnerabilityTrends} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="critical" stroke={COLORS[0]} name="Critical" />
                    <Line type="monotone" dataKey="high" stroke={COLORS[1]} name="High" />
                    <Line type="monotone" dataKey="medium" stroke={COLORS[2]} name="Medium" />
                    <Line type="monotone" dataKey="low" stroke={COLORS[3]} name="Low" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContentComponent>
            </CardComponent>

            <CardComponent>
              <CardHeaderComponent>
                <CardTitleComponent>Top Applications by Critical/High Vulnerabilities</CardTitleComponent>
                <CardDescriptionComponent>Current snapshot</CardDescriptionComponent>
              </CardHeaderComponent>
              <CardContentComponent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={currentData.vulnerabilitiesByApp} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="critical" fill={COLORS[0]} name="Critical" />
                    <Bar dataKey="high" fill={COLORS[1]} name="High" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContentComponent>
            </CardComponent>
          </div>
        </TabsContentComponent>

        <TabsContentComponent value="efficiency" activeTab={activeTab}>
          <div className="grid-2-cols margin-bottom-8">
            <CardComponent>
              <CardHeaderComponent>
                <CardTitleComponent>Security Scan Coverage</CardTitleComponent>
                <CardDescriptionComponent>Percentage of applications covered</CardDescriptionComponent>
              </CardHeaderComponent>
              <CardContentComponent>
                <div className="grid-3-cols text-center">
                  <div>
                    <div className="metric-value-medium text-purple">{currentData.scanCoverage.sast}%</div>
                    <div className="metric-label">SAST</div>
                  </div>
                  <div>
                    <div className="metric-value-medium text-cyan">{currentData.scanCoverage.dast}%</div>
                    <div className="metric-label">DAST</div>
                  </div>
                  <div>
                    <div className="metric-value-medium text-teal">{currentData.scanCoverage.sca}%</div>
                    <div className="metric-label">SCA</div>
                  </div>
                </div>
              </CardContentComponent>
            </CardComponent>

            <CardComponent>
              <CardHeaderComponent>
                <CardTitleComponent>Security Automation & Compliance</CardTitleComponent>
                <CardDescriptionComponent>Key efficiency metrics</CardDescriptionComponent>
              </CardHeaderComponent>
              <CardContentComponent>
                <div className="grid-2-cols text-center">
                  <div>
                    <div className="metric-value-medium text-indigo">{currentData.securityGatePassRate}%</div>
                    <div className="metric-label">Security Gate Pass Rate</div>
                  </div>
                  <div>
                    <div className="metric-value-medium text-lime">{currentData.policyComplianceRate}%</div>
                    <div className="metric-label">Policy Compliance</div>
                  </div>
                </div>
              </CardContentComponent>
            </CardComponent>
          </div>

          <CardComponent>
            <CardHeaderComponent>
              <CardTitleComponent>Mean Time To Resolution (MTTR) Trend ({timeRange === '1m' ? 'Last Month' : timeRange === '3m' ? 'Last 3 Months' : timeRange === '6m' ? 'Last 6 Months' : 'Last 12 Months'})</CardTitleComponent>
              <CardDescriptionComponent>Average days to resolve vulnerabilities by severity</CardDescriptionComponent>
            </CardHeaderComponent>
            <CardContentComponent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredMttrTrends} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" />
                  <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="critical" stroke={COLORS[0]} name="Critical MTTR" />
                  <Line type="monotone" dataKey="high" stroke={COLORS[1]} name="High MTTR" />
                  <Line type="monotone" dataKey="medium" stroke={COLORS[2]} name="Medium MTTR" />
                </LineChart>
              </ResponsiveContainer>
            </CardContentComponent>
          </CardComponent>
        </TabsContentComponent>
      </TabsComponent>
    </div>
  );
};

export default App;
