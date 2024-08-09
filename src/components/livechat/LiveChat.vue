<template>
  <!-- Hiện form -->
  <div v-if="showChat">
    <div class="live-chat-wrapper">
      <!-- Header chung -->
      <div class="live-chat-header">
        <div class="live-chat-header-content">Chat trực tuyến</div>
        <div>
          <IconButton v-if="showChatRoom" @click="leaveRoom" icon="mdi-logout"></IconButton>
          <IconButton @click="toggleShowChat" icon="mdi-window-minimize"></IconButton>
        </div>
      </div>
      <!-- Body chung -->
      <div class="live-chat-body">
        <!-- Hiện form đăng nhập nếu chưa đăng nhập -->
        <div v-if="!isAuth" class="live-chat-body-content">
          <p style="font-weight: 500">Điền thông tin đăng nhập để bắt đầu đoạn chat</p>
          <label>Nhập tên đăng nhập</label>
          <input v-model="username" class="custom-input" />
          <label>Nhập mật khẩu</label>
          <input type="password" v-model="password" class="custom-input" />
          <p class="text-subtitle-2" style="color: red; font-size: 13px !important">
            {{ errorMessage }}
          </p>
          <DefaultButton @click="login" buttonColor="blue" textColor="white">Bắt đầu chat</DefaultButton>
        </div>

        <!-- Hiện form chọn phòng nếu đã đăng nhập -->
        <div v-else-if="!showChatRoom & isAuth" class="live-chat-body-content">
          <p style="font-weight: 500">Tạo hoặc vào phòng chat</p>
          <label>Nhập tên phòng</label>
          <input v-model="roomName" class="custom-input" />
          <p class="text-subtitle-2" style="color: red; font-size: 13px !important">
            {{ errorMessage }}
          </p>
          <DefaultButton @click="joinRoom" buttonColor="blue" textColor="white">Vào phòng</DefaultButton>
          <DefaultButton @click="createRoom" buttonColor="brown" textColor="white">Tạo phòng</DefaultButton>
        </div>

        <!-- Vào phong chat -->
        <div v-else-if="showChatRoom & isAuth" class="live-chat-body-content">
          <div>
            <ul id="messages">
              <li style="font-weight: 500">
                Chào mừng bạn đến với chat trực tuyến, vui lòng đợi để được bộ phận CSKH hỗ trợ.
              </li>
              <li v-for="message in messages" :key="message">{{ message }}</li>
            </ul>
            <form class="send-form" @submit.prevent="sendMessage">
              <input class="custom-input" v-model="message" autocomplete="off" />
              <IconButton icon="mdi-send"></IconButton>
            </form>
          </div>
        </div>

      </div>
    </div>
  </div>
  <!-- Tắt form-->
  <div v-else class="live-chat-logo">
    <DefaultButton buttonColor="blue" textColor="white" @click="toggleShowChat"
      prepend-icon="mdi-chat-processing-outline">
      Chat trực tuyến
    </DefaultButton>
  </div>
</template>

<script>
import DefaultButton from '@/components/button/DefaultButton.vue';
import IconButton from '@/components/button/IconButton.vue';
import chatService from '@/services/ChatService';
import loginAPI from '@/services/UserService';

export default {
  name: 'LiveChat',
  data() {
    return {
      showChat: false,
      showChatRoom: false,
      isAuth: false,
      username: '',
      password: '',
      roomName: '',
      message: '',
      messages: [],
      errorMessage: '',
      currentUser: ''
    };
  },
  components: {
    DefaultButton,
    IconButton
  },
  methods: {
    toggleShowChat() {
      this.showChat = !this.showChat;
      this.resetForm();
    },
    toggleShowLiveChatApp() {
      this.showChatRoom = !this.showChatRoom;
      if (this.showChatRoom) {
        const user = this.currentUser
        chatService.joinRoom(user);
        chatService.onMessageReceived((msg) => {
          let sender = msg.sender
          let message = msg.content
          this.messages.push(sender + ': ' + message);
        });
      }
    },
    login() {
      const user = {
        UserName: this.username,
        Password: this.password,
      };
      loginAPI(user)
        .then((res) => {
          this.currentUser = res.user.UserName;
          this.isAuth = true;
          chatService.registerUser(this.currentUser)
          this.errorMessage = ''
        })
        .catch((error) => {
          console.log('Login failed', error);
          this.errorMessage = "Tên đăng nhập hoặc mật khẩu không chính xác"
        });
    },
    resetForm() {
      this.username = '';
      this.password = '';
      this.roomName = '';
      this.errorMessage = ''
    },
    // Tạo phòng
    createRoom() {
      if (this.roomName.trim() == '') return
      chatService.createRoom(this.roomName, this.currentUser);
      chatService.onRoomCreated((room) => {
        this.$emit('roomCreated', room)
        this.joinRoom()
        this.messages.push(`${room} được tạo bởi ${this.currentUser}`)
      });
    },
    // Vào phòng
    joinRoom() {
      chatService.joinRoom(this.roomName, this.currentUser);
      chatService.onRoomJoined((user) => {
        this.messages.push(`${user} đã tham gia phòng`)
        this.showChatRoom = true
      });
      chatService.listUsers(this.roomName, (users) => {
        console.log('Room users:', users)
      });
    },
    // Gửi tin nhắn
    sendMessage() {
      if (this.message.trim()) {
        let content = { 'sender': this.currentUser, "message": this.message }
        chatService.sendMessage({
          roomName: this.roomName,
          content
        });
        this.message = ''
      }
    },
    //Thoát
    leaveRoom() {
      if (this.roomName) {
        chatService.leaveRoom(this.roomName, this.currentUser);
        chatService.onUserLeft((user) => {
          this.messages.push(`${user} đã thoát khỏi phòng`)
        });
        chatService.removeRoom(this.roomName);
        chatService.onRoomRemoved((room) => {
          console.log(`Room ${room} has been removed`);
        });
        this.showChatRoom = false;
        this.messages = [];
      }
    }
  },
  mounted() {
    chatService.onMessageReceived((msg) => {
      let sender = msg.sender
      let message = msg.content
      this.messages.push(sender + ': ' + message);
    });
    chatService.onError((err) => {
      this.errorMessage = err
      this.loginFail = true
    });
  },
  beforeDestroy() {
    chatService.disconnect()
  }
};
</script>



<style lang="scss">
.live-chat-wrapper {
  width: 368px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.2);
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0.48px 2.41px -0.38px, rgba(0, 0, 0, 0.17) 0px 4px 20px -0.75px;

  .live-chat-header {
    display: flex;
    align-items: center;
    padding: 0 8px 0 24px;
    height: 42px;
    justify-content: space-between;
    background-color: #3b5998;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;

    i {
      color: white !important;
      font-size: 18px !important;
    }
  }

  .live-chat-header-content {
    font-size: 16px;
    color: white;
    font-weight: 600;
  }

  .live-chat-body {
    padding: 8px 16px 32px;
    background: rgb(248, 248, 248);

    .live-chat-body-content {
      background-color: white;
      padding: 8px;
      border-radius: 12px;
      border: 1px solid #a5a5a5;
      height: 380px;

      .v-btn {
        width: 100%;
        padding: 6px 0;
        margin-top: 12px;
        margin-left: 0;
      }
    }

    .send-form {
      position: fixed;
      display: flex;
      align-items: center;
      bottom: 44px;
      width: 320px;
    }
  }

  .custom-input {
    width: 100%;
    border: 1px solid rgb(117, 117, 117);
    appearance: none;
    background-color: rgb(248, 248, 248);
    color: rgb(17, 17, 17);
    font-family: inherit;
    box-shadow: none;
    transition: border-color 100ms linear 0s, background-color 100ms linear 0s;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: normal;
    padding: 10px;
    margin: 2px 0px;
  }

  #messages {
    list-style-type: none;
    margin-bottom: 50px;
    padding: 0 4px;
    max-height: 280px;
    overflow-y: auto;
  }
}
</style>
