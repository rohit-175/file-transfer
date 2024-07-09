const express = require('express');
const http = require('http');
const https = require('https'); // Added for HTTPS
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();

// Ensure you have a valid SSL certificate for HTTPS
const privateKey = fs.readFileSync('path/to/privkey.pem', 'utf8');
const certificate = fs.readFileSync('path/to/cert.pem', 'utf8');
const ca = fs.readFileSync('path/to/chain.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate, ca: ca };
const httpsServer = https.createServer(credentials, app); // Use HTTPS server
const io = socketIo(httpsServer); // Attach to HTTPS server

const PORT = process.env.PORT || 5000;

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

// CORS middleware
app.use(cors());

// Serve static files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('file-upload', (data) => {
        const { fileName, fileSize } = data;
        console.log(`File ${fileName} (${fileSize} bytes) uploaded`);

        // Broadcast the file details to all connected clients
        io.emit('file-details', { fileName, fileSize });

        // Construct the URL for the uploaded file
        const fileUrl = `https://localhost:5000/uploads/${fileName}`;

        // Emit the URL to the client who uploaded the file
        socket.emit('file-url', fileUrl);
    });
});

// POST endpoint to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
    // Return the URL of the uploaded file
    const fileUrl = `https://localhost:5000/uploads/${req.file.filename}`;
    res.json({ fileUrl });
});

// Start server
httpsServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
