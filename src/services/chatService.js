import { io } from 'socket.io-client';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

class ChatService {
  constructor() {
    this.socket = io(backendUrl);
  }

  joinChat(username) {
    this.socket.emit('join', username);
  }

  sendMessage(message) {
    this.socket.emit('chat message', message);
  }

  onMessageReceived(callback) {
    this.socket.on('chat message', callback);
  }

  onUserJoined(callback) {
    this.socket.on('user joined', callback);
  }

  onUserLeft(callback) {
    this.socket.on('user left', callback);
  }

  disconnect() {
    this.socket.disconnect();
  }
}

export default new ChatService();
