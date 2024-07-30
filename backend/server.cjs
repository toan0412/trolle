const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const authRoutes = require('./routes/user.route.cjs');
const app = express();
const server = http.createServer(app);
const bodyParser = require('body-parser');

// Cấu hình CORS cho Express
app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use('/api/auth', authRoutes);

// Cấu hình CORS cho Socket.io
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
