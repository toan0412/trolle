import { io } from 'socket.io-client';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const socket = io(backendUrl);

const chatService = {
  registerUser(user) {
    socket.emit('register user', user);
  },
  createRoom(roomName) {
    socket.emit('create room', roomName);
  },
  joinRoom(roomName) {
    socket.emit('join room', roomName);
  },
  leaveRoom(roomName) {
    socket.emit('leave room', roomName);
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
