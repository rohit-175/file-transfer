import React, { useState } from 'react';
import socketIOClient from 'socket.io-client';

const ENDPOINT = 'http://localhost:5000'; // Replace with your server endpoint

function Dashboard() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileDetails, setFileDetails] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);

    const socket = socketIOClient(ENDPOINT);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        fetch(`${ENDPOINT}/upload`, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                const { fileUrl } = data;
                setFileUrl(fileUrl);

                // Emit socket event for file upload
                socket.emit('file-upload', { fileName: selectedFile.name, fileSize: selectedFile.size });
            })
            .catch(error => console.error('Error uploading file:', error));
    };

    // Socket.io listener for file details
    socket.on('file-details', (data) => {
        setFileDetails(data);
    });

    // Socket.io listener for file URL
    socket.on('file-url', (url) => {
        setFileUrl(url);
    });

    return (
        <div className="App">
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload File</button>

            {fileDetails && (
                <div>
                    <p>File Uploaded: {fileDetails.fileName}</p>
                    <p>File Size: {fileDetails.fileSize} bytes</p>
                </div>
            )}

            {fileUrl && (
                <div>
                    <p>Shareable link: <a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileUrl}</a></p>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
