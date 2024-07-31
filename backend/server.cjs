const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/user.route.cjs');
const setupSocket = require('./socket.cjs'); // Ensure this path is correct

const app = express();
const server = http.createServer(app);

// Configure CORS for Express
app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use('/api/auth', authRoutes);

// Configure Socket.io
const io = setupSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

