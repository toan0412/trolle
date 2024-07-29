<template>
  <div>
    <ul id="messages">
      <li v-for="message in messages" :key="message">{{ message }}</li>
    </ul>
    <form @submit.prevent="sendMessage">
      <input v-model="message" autocomplete="off" />
      <button>Send</button>
    </form>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  data() {
    return {
      socket: null,
      message: '',
      messages: [],
    };
  },
  mounted() {
    this.socket = io('https://f5d348c9-3e9a-4a0a-9cc0-b46035be571c-00-2suhoo6y70ed8.pike.replit.dev:3002');

    this.socket.on('chat message', (msg) => {
      this.messages.push(msg);
    });
  },
  methods: {
    sendMessage() {
      if (this.message.trim() !== '') {
        this.socket.emit('chat message', this.message);
        this.message = '';
      }
    },
  },
};
</script>

<style scoped>
#messages {
  list-style-type: none;
  padding: 0;
}

#messages li {
  padding: 8px;
  margin-bottom: 8px;
  background-color: #f4f4f4;
  border-radius: 4px;
}
</style>
