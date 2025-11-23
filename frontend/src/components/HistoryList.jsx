// src/components/HistoryList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// --- Modern Design Style Definitions ---

const historyListStyles = {
    container: {
        padding: '30px',
        marginTop: '30px',
        backgroundColor: '#f8f9fa', // Light gray background
        borderRadius: '12px',
        fontFamily: 'Inter, sans-serif',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
    },
    header: {
        color: '#2c3e50', // Dark navy blue
        marginBottom: '25px',
        fontWeight: 700,
        fontSize: '1.8rem',
        borderBottom: '3px solid #3498db', // Blue accent line
        paddingBottom: '10px',
    },
    listContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        maxWidth: '700px', // Wider container for list items
        margin: '0 auto',
    },
    item: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
        borderRadius: '8px',
        borderLeft: '4px solid #f39c12', // Orange accent for history items
        transition: 'transform 0.1s ease-in-out',
    },
    itemHover: {
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    textInfo: {
        flexGrow: 1,
    },
    fileName: {
        fontSize: '16px',
        fontWeight: 600,
        color: '#34495e',
        marginBottom: '4px',
    },
    uploadTime: {
        fontSize: '12px',
        color: '#7f8c8d',
    },
    button: {
        backgroundColor: '#3498db', // Primary blue color
        color: 'white',
        border: 'none',
        padding: '10px 18px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        transition: 'background-color 0.2s',
        marginLeft: '20px',
    },
    buttonHover: {
        backgroundColor: '#2980b9',
    },
    loadingText: {
        textAlign: 'center',
        color: '#7f8c8d',
        fontSize: '16px',
        padding: '20px',
    }
};

const HistoryList = ({ username, password, refreshTrigger }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hoveredItemId, setHoveredItemId] = useState(null);

    // Fetch history whenever credentials change or a new upload happens (refreshTrigger)
    useEffect(() => {
        // Only fetch if authenticated credentials are provided
        if (username && password) {
            fetchHistory();
        } else {
            setHistory([]);
        }
    }, [username, password, refreshTrigger]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://127.0.0.1:8000/api/history/', {
                auth: { username, password }
            });
            // Limit to last 5 items (assuming they are returned chronologically, newest first)
            setHistory(response.data.slice(0, 5)); 
        } catch (error) {
            console.error("Error fetching history:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async (id, fileName) => {
        // Sanitize file name to ensure it's safe for saving
        const safeFileName = fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        
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
            link.setAttribute('download', `${safeFileName}_report.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
        } catch (error) {
            // Replaced alert() with console logging and a UI status message if needed
            console.error("Failed to download PDF. Check API endpoint or credentials.", error);
            // Optionally, update status in the future to show failure in UI
        }
    };

    return (
        <div style={historyListStyles.container}>
            <h2 style={historyListStyles.header}>History & Generated Reports</h2>
            
            {loading && <p style={historyListStyles.loadingText}>Loading history...</p>}

            {!loading && history.length === 0 && <p style={historyListStyles.loadingText}>No upload history found for your account.</p>}

            <div style={historyListStyles.listContainer}>
                {history.map((item) => (
                    <div 
                        key={item.id} 
                        style={{
                            ...historyListStyles.item,
                            ...(hoveredItemId === item.id ? historyListStyles.itemHover : {})
                        }}
                        onMouseEnter={() => setHoveredItemId(item.id)}
                        onMouseLeave={() => setHoveredItemId(null)}
                    >
                        <div style={historyListStyles.textInfo}>
                            <div style={historyListStyles.fileName}>{item.file_name}</div>
                            <div style={historyListStyles.uploadTime}>
                                Uploaded: {new Date(item.uploaded_at).toLocaleString()}
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => handleDownloadPDF(item.id, item.file_name)}
                            style={{
                                ...historyListStyles.button,
                                ...(hoveredItemId === item.id ? historyListStyles.buttonHover : {})
                            }}
                        >
                            Download PDF
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryList;