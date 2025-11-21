// // src/components/FileUpload.jsx
// import React, { useState } from 'react';
// import axios from 'axios';

// const FileUpload = ({ onUploadSuccess }) => {
//   const [file, setFile] = useState(null);
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [status, setStatus] = useState('');

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file || !username || !password) {
//       setStatus('Please select a file and enter credentials.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file); // Matches the 'file' key expected by Django

//     try {
//       setStatus('Uploading...');
      
//       // POST request to your Django API
//       const response = await axios.post('http://127.0.0.1:8000/api/upload/', formData, {
//         auth: {
//           username: username, // Basic Auth credentials
//           password: password
//         },
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         }
//       });

//       setStatus('Upload Successful!');
//       // Send the summary data back up to the main App component
//       onUploadSuccess(response.data); 
      
//     } catch (error) {
//       console.error(error);
//       setStatus('Upload Failed: ' + (error.response?.data?.error || error.message));
//     }
//   };

//   return (
//     <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px', borderRadius: '8px' }}>
//       <h2>1. Upload Equipment CSV</h2>
//       <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: '0 auto' }}>
        
//         {/* File Input */}
//         <div>
//             <label>Select CSV: </label>
//             <input type="file" accept=".csv" onChange={handleFileChange} />
//         </div>

//         {/* Auth Inputs (Required for Basic Auth) */}
//         <input 
//           type="text" 
//           placeholder="Admin Username" 
//           value={username} 
//           onChange={(e) => setUsername(e.target.value)} 
//           style={{padding: '8px'}}
//         />
//         <input 
//           type="password" 
//           placeholder="Admin Password" 
//           value={password} 
//           onChange={(e) => setPassword(e.target.value)} 
//           style={{padding: '8px'}}
//         />

//         <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
//           Upload Data
//         </button>
//       </form>
      
//       {status && <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{status}</p>}
//     </div>
//   );
// };

// export default FileUpload;

// src/components/HistoryList.jsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const FileUpload = ({ username, password, refreshTrigger }) => {
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch history whenever credentials change or a new upload happens (refreshTrigger)
//   useEffect(() => {
//     if (username && password) {
//       fetchHistory();
//     }
//   }, [username, password, refreshTrigger]);

//   const fetchHistory = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('http://127.0.0.1:8000/api/history/', {
//         auth: { username, password }
//       });
//       setHistory(response.data);
//     } catch (error) {
//       console.error("Error fetching history", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownloadPDF = async (id, fileName) => {
//     try {
//       // We must use axios to download because of the Basic Auth requirement
//       const response = await axios.get(`http://127.0.0.1:8000/api/report/${id}/`, {
//         auth: { username, password },
//         responseType: 'blob', // Important: This tells axios to treat the response as a file
//       });

//       // Create a hidden link to trigger the browser download
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `Report_${fileName}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       alert("Failed to download PDF. Check console.");
//       console.error(error);
//     }
//   };

//   return (
//     <div style={{ marginTop: '30px', padding: '20px', borderTop: '2px solid #eee' }}>
//       <h2>History & Reports (Last 5)</h2>
      
//       {loading && <p>Loading history...</p>}

//       {!loading && history.length === 0 && <p>No history found.</p>}

//       <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '600px', margin: '0 auto' }}>
//         {history.map((item) => (
//           <div key={item.id} style={itemStyle}>
//             <div>
//               <strong>{item.file_name}</strong>
//               <br />
//               <small>{new Date(item.uploaded_at).toLocaleString()}</small>
//             </div>
            
//             <button 
//               onClick={() => handleDownloadPDF(item.id, item.file_name)}
//               style={buttonStyle}
//             >
//               Download PDF
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const itemStyle = {
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   padding: '10px',
//   backgroundColor: 'white',
//   border: '1px solid #ddd',
//   borderRadius: '5px'
// };

// const buttonStyle = {
//   backgroundColor: '#008CBA',
//   color: 'white',
//   border: 'none',
//   padding: '8px 12px',
//   borderRadius: '4px',
//   cursor: 'pointer'
// };

// export default FileUpload;

// src/components/FileUpload.jsx
import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ onUploadSuccess, username, password }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
        setStatus('Please enter your credentials at the top of the page first.');
        return;
    }
    if (!file) {
      setStatus('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setStatus('Uploading...');
      const response = await axios.post('http://127.0.0.1:8000/api/upload/', formData, {
        auth: { username, password },
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setStatus('Upload Successful!');
      onUploadSuccess(response.data); 
      
    } catch (error) {
      console.error(error);
      setStatus('Upload Failed: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px', borderRadius: '8px', backgroundColor: '#fff' }}>
      <h2>1. Upload Equipment CSV</h2>
      <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px', margin: '0 auto' }}>
        
        <div>
            <input type="file" accept=".csv" onChange={handleFileChange} style={{ padding: '10px' }}/>
        </div>

        <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', fontSize: '16px' }}>
          Upload Data
        </button>
      </form>
      
      {status && <p style={{ marginTop: '10px', fontWeight: 'bold', color: '#333' }}>{status}</p>}
    </div>
  );
};

export default FileUpload;