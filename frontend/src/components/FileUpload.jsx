import React, { useState } from 'react';
import axios from 'axios';

// --- Modern Design Style Definitions ---

const fileUploadStyles = {
    card: {
        // Container styling consistent with Dashboard cards
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
        maxWidth: '500px',
        margin: '30px auto', // Center the card - FIX: Removed duplicate 'margin' key
        fontFamily: 'Inter, sans-serif',
    },
    header: {
        color: '#34495e',
        marginBottom: '20px',
        fontSize: '1.5rem',
        fontWeight: 600,
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    fileInputContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px dashed #bdc3c7',
        borderRadius: '8px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'border-color 0.3s',
        textAlign: 'center',
    },
    fileInput: {
        // Hide default file input and use custom styling
        width: '0.1px',
        height: '0.1px',
        opacity: 0,
        overflow: 'hidden',
        position: 'absolute',
        zIndex: -1,
    },
    fileLabel: {
        fontSize: '16px',
        color: '#3498db', // Blue accent
        fontWeight: 500,
        cursor: 'pointer',
    },
    fileName: {
        marginTop: '10px',
        fontSize: '14px',
        color: '#7f8c8d',
    },
    button: {
        padding: '12px 25px',
        cursor: 'pointer',
        backgroundColor: '#2ecc71', // Green for success/action
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 600,
        transition: 'background-color 0.3s, transform 0.1s',
        boxShadow: '0 4px #27ae60', // 3D effect
    },
    buttonHover: {
        backgroundColor: '#27ae60',
        transform: 'translateY(1px)',
        boxShadow: '0 3px #27ae60',
    },
    statusMessage: (color) => ({
        marginTop: '20px',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: '10px',
        borderRadius: '6px',
        color: color,
        // The color.replace needed to be adjusted slightly to handle the color string format correctly in this context
        // We will keep the original implementation but ensure the color value is a valid CSS string
        backgroundColor: color.includes('rgb') ? color.replace(')', ', 0.1)') : `${color}1A`, 
    }),
};

const FileUpload = ({ onUploadSuccess, username, password }) => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setStatus(`File selected: ${selectedFile.name}`);
        } else {
            setFile(null);
            setStatus('');
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        
        if (isUploading) return;

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
            setIsUploading(true);
            setStatus('Uploading data to server...');
            
            // Wait for a short moment to display 'Uploading...' status
            await new Promise(resolve => setTimeout(resolve, 500)); 

            const response = await axios.post('http://127.0.0.1:8000/api/upload/', formData, {
                auth: { username, password },
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const successMessage = 'Upload Successful! Data processed.';
            setStatus(successMessage);
            onUploadSuccess(response.data); 
            
        } catch (error) {
            console.error(error);
            const errorMessage = 'Upload Failed: ' + (error.response?.data?.error || error.message || 'Unknown Error');
            setStatus(errorMessage);
            
        } finally {
            setIsUploading(false);
        }
    };

    let statusColor = '#34495e'; // Neutral
    if (status.includes('Successful')) {
        statusColor = '#2ecc71'; // Green for success
    } else if (status.includes('Failed') || status.includes('Please enter')) {
        statusColor = '#e74c3c'; // Red for error
    }

    // Determine button styles based on state
    const currentButtonStyles = {
        ...fileUploadStyles.button,
        ...(isHovering ? fileUploadStyles.buttonHover : {}),
        opacity: isUploading ? 0.6 : 1,
        // Apply different style when disabled to indicate inability to click
        cursor: isUploading ? 'not-allowed' : 'pointer',
        boxShadow: isUploading ? 'none' : fileUploadStyles.button.boxShadow,
        transform: isUploading ? 'translateY(4px)' : (isHovering ? fileUploadStyles.buttonHover.transform : 'none'),
    };


    return (
        <div style={fileUploadStyles.card}>
            <h2 style={fileUploadStyles.header}>Upload Equipment Data (CSV)</h2>
            
            <form onSubmit={handleUpload} style={fileUploadStyles.form}>
                
                {/* Custom File Input Area */}
                <div 
                    style={fileUploadStyles.fileInputContainer}
                    onClick={() => document.getElementById('file-upload-input').click()}
                >
                    {/* Input is hidden but triggered by clicking the div */}
                    <input 
                        type="file" 
                        accept=".csv" 
                        onChange={handleFileChange} 
                        id="file-upload-input"
                        style={fileUploadStyles.fileInput}
                    />
                    <div>
                        <span style={fileUploadStyles.fileLabel}>
                            {file ? 'Change File' : 'Click to select .CSV file'}
                        </span>
                        {file && <p style={fileUploadStyles.fileName}>{file.name}</p>}
                    </div>
                </div>

                {/* Upload Button */}
                <button 
                    type="submit" 
                    style={currentButtonStyles}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    disabled={isUploading || !file} // Disable if uploading OR no file is selected
                >
                    {isUploading ? 'Processing...' : 'Upload & Analyze Data'}
                </button>
            </form>
            
            {/* Status Message */}
            {status && (
                <p style={fileUploadStyles.statusMessage(statusColor)}>
                    {status}
                </p>
            )}
        </div>
    );
};

export default FileUpload;