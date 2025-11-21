// src/components/Dashboard.jsx
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

const Dashboard = ({ data }) => {
  // If no data is provided yet, don't render anything
  if (!data || !data.summary_data) return null;

  const { total_count, averages, type_distribution } = data.summary_data;

  // 2. Prepare Data for the Bar Chart
  const chartData = {
    labels: Object.keys(type_distribution), // e.g., ['Pump', 'Valve', ...]
    datasets: [
      {
        label: 'Equipment Count',
        data: Object.values(type_distribution), // e.g., [4, 3, ...]
        backgroundColor: 'rgba(53, 162, 235, 0.6)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Equipment Type Distribution' },
    },
  };

  return (
    <div style={{ padding: '20px', marginTop: '20px', borderTop: '2px solid #eee' }}>
      <h2>Analysis Dashboard</h2>

      {/* Section A: Summary Cards */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', justifyContent: 'center' }}>
        <div style={cardStyle}>
            <h3>Total Equipment</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{total_count}</p>
        </div>
        <div style={cardStyle}>
            <h3>Avg Flowrate</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{averages.Flowrate.toFixed(2)}</p>
        </div>
        <div style={cardStyle}>
            <h3>Avg Pressure</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{averages.Pressure.toFixed(2)}</p>
        </div>
        <div style={cardStyle}>
            <h3>Avg Temp</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{averages.Temperature.toFixed(2)}</p>
        </div>
      </div>

      {/* Section B: Chart & Table Container */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'center' }}>
        
        {/* Bar Chart */}
        <div style={{ flex: '1', minWidth: '300px', maxWidth: '600px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Detailed Table */}
        <div style={{ flex: '1', minWidth: '300px', maxWidth: '400px' }}>
            <h3>Type Distribution Table</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                        <th style={thStyle}>Type</th>
                        <th style={thStyle}>Count</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(type_distribution).map(([type, count]) => (
                        <tr key={type} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={tdStyle}>{type}</td>
                            <td style={tdStyle}>{count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

// Simple CSS Styles for this component
const cardStyle = {
  backgroundColor: '#fff',
  padding: '15px',
  borderRadius: '8px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  textAlign: 'center',
  minWidth: '120px',
  color: '#333'
};

const thStyle = { padding: '10px', borderBottom: '2px solid #ddd', color: '#333' };
const tdStyle = { padding: '10px', color: '#333' };

export default Dashboard;