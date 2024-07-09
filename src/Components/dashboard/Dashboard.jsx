import './Dashboard.css'
import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { LoginSignup } from '../LoginSignup/LoginSignup';
import { useNavigate } from 'react-router-dom';
const ENDPOINT = 'http://localhost:5000';

function Dashboard() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileDetails, setFileDetails] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState('');

    const socket = socketIOClient(ENDPOINT, { secure: true });
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleClickLogin = () => {
        navigate("/login-signup");
    }

    const handleFileUpload = () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${ENDPOINT}/upload`, true);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const progress = (event.loaded / event.total) * 100;
                setUploadProgress(progress);
                setStatusMessage(`Uploading: ${Math.round(progress)}%`);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                const { fileUrl } = JSON.parse(xhr.responseText);
                setFileUrl(fileUrl);
                setStatusMessage('Upload complete!');
                socket.emit('file-upload', { fileName: selectedFile.name, fileSize: selectedFile.size });
            } else {
                setStatusMessage('Upload failed!');
                console.error('Error uploading file:', xhr.responseText);
            }
        };

        xhr.onerror = () => {
            setStatusMessage('Upload error!');
            console.error('Error uploading file:', xhr.responseText);
        };

        xhr.send(formData);
    };

    useEffect(() => {
        socket.on('file-details', (data) => {
            setFileDetails(data);
        });

        socket.on('file-url', (url) => {
            setFileUrl(url);
        });

        return () => {
            socket.disconnect();
        };
    }, [socket]);

    return (
        <>
            <h1 id='heading'>Yeezy-Transfer</h1><br />
            <div className="transfer">
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleFileUpload}>Upload File</button>
                {statusMessage && <p>{statusMessage}</p>}
                {uploadProgress > 0 && <progress value={uploadProgress} max="100">{uploadProgress}%</progress>}
                {fileDetails && (
                    <div>
                        <p>File Uploaded: {fileDetails.fileName}</p>
                        <p>File Size: {fileDetails.fileSize} bytes</p>
                    </div>
                )}
                {fileUrl && (
                    <div className='url'>
                        <p>Shareable link: <a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileUrl}</a></p>
                    </div>
                )}
                <div className='head'>
                    <button onClick={handleClickLogin}>Login/Signup</button>
                </div><br />
                <h1>Simple and reliable file transfers</h1>
            </div>
        </>
    );
}

export default Dashboard;
