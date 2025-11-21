// // src/App.jsx
// import React, { useState } from 'react';
// import './App.css';
// import FileUpload from './components/FileUpload';

// function App() {
//   const [dataSummary, setDataSummary] = useState(null);

//   return (
//     <div className="App" style={{ padding: '20px', fontFamily: 'Arial' }}>
//       <header>
//         <h1>Chemical Equipment Parameter Visualizer</h1>
//       </header>
      
//       <main>
//         {/* Pass a function to receive the data after successful upload */}
//         <FileUpload onUploadSuccess={(data) => setDataSummary(data)} />

//         {/* Temporary: Show the raw data to confirm it works */}
//         {dataSummary && (
//           <div style={{ marginTop: '20px', padding: '20px', backgroundColor: 'black' }}>
//             <h3>Data Received from Backend:</h3>
//             <pre style={{ textAlign: 'left' }}>{JSON.stringify(dataSummary, null, 2)}</pre>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }


// export default App;

// src/App.jsx
// import React, { useState } from 'react';
// import './App.css';
// import FileUpload from './components/FileUpload';
// import Dashboard from './components/Dashboard'; // <--- 1. Import this

// function App() {
//   const [dataSummary, setDataSummary] = useState(null);

//   return (
//     <div className="App" style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
//       <header style={{ marginBottom: '30px' }}>
//         <h1 style={{ color: '#333' }}>Chemical Equipment Parameter Visualizer</h1>
//       </header>
      
//       <main>
//         <FileUpload onUploadSuccess={(data) => setDataSummary(data)} />

//         {/* 2. Use the Dashboard Component instead of the raw JSON block */}
//         {dataSummary && (
//             <Dashboard data={dataSummary} />
//         )}
//       </main>
//     </div>
//   );
// }

// export default App;

// src/App.jsx
import React, { useState } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import HistoryList from './components/HistoryList';

function App() {
  // State for Authentication
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // State for Data
  const [dataSummary, setDataSummary] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = (data) => {
    setDataSummary(data);
    // Increment this number to tell HistoryList to re-fetch
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="App" style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#f9f9f9', minHeight: '100vh', color: '#333' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1>Chemical Equipment Parameter Visualizer</h1>
        
        {/* Global Credentials Section */}
        <div style={{ backgroundColor: '#333', padding: '15px', borderRadius: '8px', color: 'white', display: 'inline-block' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Backend Authentication</p>
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              style={{ marginRight: '10px', padding: '5px' }}
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ padding: '5px' }}
            />
        </div>
      </header>
      
      <main>
        <FileUpload 
            username={username} 
            password={password} 
            onUploadSuccess={handleUploadSuccess} 
        />

        {dataSummary && (
            <Dashboard data={dataSummary} />
        )}

        {/* New History Section */}
        <HistoryList 
            username={username} 
            password={password} 
            refreshTrigger={refreshTrigger}
        />
      </main>
    </div>
  );
}

export default App;