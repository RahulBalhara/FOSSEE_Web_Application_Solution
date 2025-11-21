// src/components/HistoryList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HistoryList = ({ username, password, refreshTrigger }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch history whenever credentials change or a new upload happens (refreshTrigger)
  useEffect(() => {
    if (username && password) {
      fetchHistory();
    }
  }, [username, password, refreshTrigger]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/api/history/', {
        auth: { username, password }
      });
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching history", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (id, fileName) => {
    try {
      // We must use axios to download because of the Basic Auth requirement
      const response = await axios.get(`http://127.0.0.1:8000/api/report/${id}/`, {
        auth: { username, password },
        responseType: 'blob', // Important: This tells axios to treat the response as a file
      });

      // Create a hidden link to trigger the browser download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Report_${fileName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Failed to download PDF. Check console.");
      console.error(error);
    }
  };

  return (
    <div style={{ marginTop: '30px', padding: '20px', borderTop: '2px solid #eee' }}>
      <h2>History & Reports (Last 5)</h2>
      
      {loading && <p>Loading history...</p>}

      {!loading && history.length === 0 && <p>No history found.</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '600px', margin: '0 auto' }}>
        {history.map((item) => (
          <div key={item.id} style={itemStyle}>
            <div>
              <strong>{item.file_name}</strong>
              <br />
              <small>{new Date(item.uploaded_at).toLocaleString()}</small>
            </div>
            
            <button 
              onClick={() => handleDownloadPDF(item.id, item.file_name)}
              style={buttonStyle}
            >
              Download PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const itemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px',
  backgroundColor: 'white',
  border: '1px solid #ddd',
  borderRadius: '5px'
};

const buttonStyle = {
  backgroundColor: '#008CBA',
  color: 'white',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default HistoryList;