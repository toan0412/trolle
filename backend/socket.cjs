const socketIo = require('socket.io');

var users = [];
var rooms = [];

function setupSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    socket.on('register user', (user) => {
      if (users.includes(user)) return
      users.push(user)
      console.log(`User ${user} registered`);
      console.log('List users:', users)
    });

    socket.on('create room', (roomName, user) => {
      //Nếu chưa có phòng thì tạo phòng
      if (!rooms[roomName]) {
        rooms[roomName] = [];
        socket.join(roomName);
        rooms[roomName].push(user)
        io.emit('room created', roomName);
        console.log(`Room ${roomName} created by ${user}`);
      } else {
        socket.emit('error', `Phòng ${roomName} đã tồn tại.`);
      }
    });

    socket.on('join room', (roomName, user) => {
      if (rooms[roomName]) {
        socket.join(roomName);
        //Kiểm tra xem trong room có user chưa
        if (!rooms[roomName].includes(user)) {
          rooms[roomName].push(user)
        }
        io.to(roomName).emit('room joined', user);
        console.log(`User ${user} joined room ${roomName}`);
        console.log(`List user in room ${roomName}: ${rooms[roomName]}`)
      } else {
        socket.emit('error', `Phòng ${roomName} không tồn tại.`);
      }
    });

    socket.on('list users', (roomName) => {
      if (rooms[roomName]) {
        const roomUsers = rooms[roomName].map(user => user);
        socket.emit('room users', roomUsers);
      } else {
        socket.emit('error', `Phòng ${roomName} không tồn tại.`);
      }
    });

    socket.on('chat message', (message) => {
      //Lấy index của socket mới trong list users 
      const { roomName, content } = message;
      if (roomName && rooms[roomName]) {
        io.to(roomName).emit('chat message', { sender: content.sender, content: content.message });
      } else {
        socket.emit('error', `Room ${roomName} does not exist or message content is missing`);
      }
    });

    socket.on('leave room', (roomName, user) => {
      socket.leave(roomName);
      rooms[roomName].splice(user, 1);
      io.to(roomName).emit('user left', user);
      console.log(`${user} has left room ${roomName}`)
    });


    socket.on('remove room', (roomName) => {
      // Nếu phòng trống thì xóa phòng
      if (rooms[roomName].length === 0) {
        delete rooms[roomName];
        io.emit('room removed', roomName);
        console.log(`Room ${roomName} removed`);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
      const user = users[socket.id];
      delete users[socket.id];
      for (let room in rooms) {
        const index = rooms[room].indexOf(user);
        if (index !== -1) {
          rooms[room].splice(index, 1);
          io.to(room).emit('user left', user);
          if (rooms[room].length === 0) {
            delete rooms[room];
            io.emit('room removed', room);
          }
        }
      }
    });
  });

  return io;
}

module.exports = setupSocket;
