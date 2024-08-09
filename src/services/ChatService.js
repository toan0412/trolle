import { io } from 'socket.io-client';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const socket = io(backendUrl);

const chatService = {
  registerUser(user) {
    socket.emit('register user', user);
  },
  createRoom(roomName, user) {
    socket.emit('create room', roomName, user);
  },
  joinRoom(roomName, user) {
    socket.emit('join room', roomName, user);
  },
  leaveRoom(roomName, user) {
    socket.emit('leave room', roomName, user);
  },
  removeRoom(roomName) {
    socket.emit('remove room', roomName);
  },
  listUsers(roomName, callback) {
    socket.emit('list users', roomName);
    socket.on('room users', callback);
  },
  sendMessage(message) {
    socket.emit('chat message', message);
  },
  onMessageReceived(callback) {
    socket.on('chat message', callback);
  },
  onRoomCreated(callback) {
    socket.on('room created', callback);
  },
  onRoomJoined(callback) {
    socket.on('room joined', callback);
  },
  onRoomRemoved(callback) {
    socket.on('room removed', callback);
  },
  onUserLeft(callback) {
    socket.on('user left', callback);
  },
  onError(callback) {
    socket.on('error', callback);
  },
  disconnect() {
    socket.disconnect();
  }
};

export default chatService;
