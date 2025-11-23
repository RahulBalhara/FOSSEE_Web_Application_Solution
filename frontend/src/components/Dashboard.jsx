import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// 1. Register the Chart.js components we need
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// --- Modern Design Style Definitions ---

const dashboardStyles = {
    // Overall container for a clean background
    container: {
        padding: '30px',
        backgroundColor: '#f8f9fa', // Light gray background
        borderRadius: '12px',
        fontFamily: 'Inter, sans-serif',
    },
    // Header styling
    header: {
        color: '#2c3e50', // Dark navy blue
        marginBottom: '30px',
        fontWeight: 700,
        fontSize: '1.8rem',
        borderBottom: '3px solid #3498db', // Blue accent line
        paddingBottom: '10px',
    },
    // Summary Card Grid (responsive layout)
    summaryGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '40px',
    },
    // Individual Card Style
    card: {
        backgroundColor: '#ffffff',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
        borderLeft: '5px solid var(--accent-color, #3498db)', // Dynamic accent color
        transition: 'transform 0.2s',
        textAlign: 'left',
    },
    cardTitle: {
        fontSize: '14px',
        color: '#7f8c8d', // Muted gray for title
        margin: '0 0 8px 0',
        fontWeight: 'normal',
        textTransform: 'uppercase',
    },
    cardValue: {
        fontSize: '28px',
        fontWeight: '900',
        color: '#2c3e50',
        margin: '0',
    },
    // Main content area (Chart and Table)
    contentArea: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '30px',
        marginTop: '30px',
    },
    chartBox: {
        flex: '2', // Chart takes more space
        minWidth: '350px',
        backgroundColor: '#ffffff',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        height: '450px', // Fixed height for visual consistency
    },
    tableBox: {
        flex: '1',
        minWidth: '300px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        overflow: 'hidden', // Ensures table corners are respected
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
    },
    tableHeader: {
        padding: '15px 25px',
        backgroundColor: '#3498db',
        color: 'white',
        fontSize: '1.1rem',
        fontWeight: 600,
        margin: 0,
    },
    // Table styling
    table: {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0',
    },
    th: {
        padding: '12px 25px',
        backgroundColor: '#ecf0f1', // Light header background
        textAlign: 'left',
        color: '#34495e',
        fontWeight: 600,
    },
    td: {
        padding: '12px 25px',
        borderBottom: '1px solid #e0e0e0',
        color: '#34495e',
    },
};

// Define colors for the bar chart
const chartColors = [
    '#3498db', // Blue
    '#2ecc71', // Green
    '#f1c40f', // Yellow
    '#e74c3c', // Red
    '#9b59b6', // Purple
];

// Reusable component for the Summary Cards
const SummaryCard = ({ title, value, unit = '', accentColor }) => (
    <div style={{ ...dashboardStyles.card, borderLeftColor: accentColor }}>
        <p style={dashboardStyles.cardTitle}>{title}</p>
        <p style={dashboardStyles.cardValue}>{value}{unit}</p>
    </div>
);

const Dashboard = ({ data }) => {
  // If no data is provided yet, render a loading state or null
  if (!data || !data.summary_data) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>Loading analysis data...</div>;
  }

  const { total_count, averages, type_distribution } = data.summary_data;
  
  const labels = Object.keys(type_distribution);
  const counts = Object.values(type_distribution);

  // Use dynamic colors for the bars
  const backgroundColors = counts.map((_, index) => chartColors[index % chartColors.length]);
  const borderColors = backgroundColors.map(color => color.replace('0.6', '1'));

  // 2. Prepare Data for the Bar Chart (updated colors)
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Equipment Count',
        data: counts,
        backgroundColor: backgroundColors.map(color => `${color}aa`), // Slightly transparent
        borderColor: backgroundColors,
        borderWidth: 2, // Thicker border for definition
        borderRadius: 5, // Rounded bars
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Important for fixed height
    plugins: {
      legend: { 
          position: 'top', 
          labels: { color: '#34495e' }
      },
      title: { 
          display: true, 
          text: 'Equipment Type Distribution',
          font: { size: 18, weight: 'bold' },
          color: '#2c3e50'
      },
      tooltip: {
          backgroundColor: 'rgba(44, 62, 80, 0.9)', // Dark tooltip
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 14 },
      }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: { color: '#ecf0f1' }, // Lighter grid lines
            ticks: { color: '#7f8c8d' }
        },
        x: {
            grid: { display: false },
            ticks: { color: '#7f8c8d' }
        }
    }
  };

  return (
    <div style={dashboardStyles.container}>
      <h2 style={dashboardStyles.header}>Equipment Analysis Dashboard</h2>

      {/* Section A: Summary Cards - Updated Layout */}
      <div style={dashboardStyles.summaryGrid}>
        {/* Total Equipment Card */}
        <SummaryCard 
          title="Total Equipment" 
          value={total_count}
          accentColor="#e67e22" // Orange
        />
        {/* Avg Flowrate Card */}
        <SummaryCard 
          title="Avg Flowrate" 
          value={averages.Flowrate.toFixed(2)} 
          unit=" L/s"
          accentColor="#3498db" // Blue
        />
        {/* Avg Pressure Card */}
        <SummaryCard 
          title="Avg Pressure" 
          value={averages.Pressure.toFixed(2)} 
          unit=" kPa"
          accentColor="#2ecc71" // Green
        />
        {/* Avg Temp Card */}
        <SummaryCard 
          title="Avg Temp" 
          value={averages.Temperature.toFixed(2)} 
          unit=" °C"
          accentColor="#e74c3c" // Red
        />
      </div>

      {/* Section B: Chart & Table Container - Updated Layout */}
      <div style={dashboardStyles.contentArea}>
        
        {/* Bar Chart */}
        <div style={dashboardStyles.chartBox}>
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Detailed Table */}
        <div style={dashboardStyles.tableBox}>
          <h3 style={dashboardStyles.tableHeader}>Type Distribution Table</h3>
          <div style={{ maxHeight: 'calc(450px - 60px)', overflowY: 'auto' }}> {/* Makes table scrollable if many types exist */}
            <table style={dashboardStyles.table}>
              <thead>
                <tr>
                  <th style={dashboardStyles.th}>Type</th>
                  <th style={{...dashboardStyles.th, textAlign: 'right'}}>Count</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(type_distribution).map(([type, count], index, array) => (
                  <tr key={type}>
                    <td style={{
                        ...dashboardStyles.td, 
                        // Remove border from the last row for cleaner look
                        borderBottom: index === array.length - 1 ? 'none' : dashboardStyles.td.borderBottom
                    }}>{type}</td>
                    <td style={{
                        ...dashboardStyles.td, 
                        textAlign: 'right', 
                        fontWeight: 'bold',
                        borderBottom: index === array.length - 1 ? 'none' : dashboardStyles.td.borderBottom
                    }}>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;