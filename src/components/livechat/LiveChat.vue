<template>
  <div v-if="showLiveChatForm">
    <div class="live-chat-wrapper">
      <div class="live-chat-header">
        <div class="live-chat-header-content">Chat trực tuyến</div>
        <IconButton @click="toggleShowLiveChatForm" icon="mdi-close"></IconButton>
      </div>
      <div class="live-chat-body">
        <div v-if="showLiveChatApp" class="live-chat-body-content">
          <div>
            <ul id="messages">
              <li style="font-weight: 500">Chào mừng bạn đến với chat trực tuyến, vui lòng đợi để được bộ phận CSKH hỗ
                trợ.
              </li>
              <li v-for="message in messages" :key="message">{{ message }}</li>
            </ul>
            <form class="send-form" @submit.prevent="sendMessage">
              <input class="custom-input" v-model="message" autocomplete="off" />
              <IconButton icon="mdi-send"></IconButton>
            </form>
          </div>
        </div>
        <div v-else class="live-chat-body-content">
          <p style="font-weight: 500">Điền thông tin đăng nhập để bắt đầu đoạn chat</p>
          <label>Nhập tên đăng nhập</label>
          <input v-model="username" class="custom-input" />
          <label>Nhập mật khẩu</label>
          <input type="password" v-model="password" class="custom-input" />
          <p v-if="loginFail" class="text-subtitle-2" style="color: red; font-size: 13px !important">Sai thông tin đăng
            nhập hoặc mật khẩu,
            vui lòng
            thử lại</p>
          <DefaultButton @click="login" buttonColor="brown" textColor="white">Bắt đầu chat</DefaultButton>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="live-chat-logo">
    <DefaultButton buttonColor="brown" textColor="white" @click="toggleShowLiveChatForm"
      prepend-icon="mdi-chat-processing-outline">Chat trực tuyến</DefaultButton>
  </div>
</template>

<script>
import DefaultButton from '@/components/button/DefaultButton.vue'
import IconButton from '@/components/button/IconButton.vue'
import chatService from '@/services/chatService'
import addTeacher from '@/services/UserService'

export default {
  name: 'LiveChat',
  data() {
    return {
      showLiveChatForm: false,
      showLiveChatApp: false,
      username: '',
      password: '',
      message: '',
      messages: [],
      currentUser: '',
      loginFail: false,
    }
  },
  components: {
    DefaultButton,
    IconButton
  },
  methods: {
    toggleShowLiveChatForm() {
      this.showLiveChatForm = !this.showLiveChatForm;
      this.resetForm()
    },
    toggleShowLiveChatApp() {
      this.showLiveChatApp = !this.showLiveChatApp;
      if (this.showLiveChatApp) {
        chatService.joinChat(this.currentUser);
        chatService.onMessageReceived((msg) => {
          this.messages.push(msg);
        });
      }
    },
    sendMessage() {
      if (this.message.trim() !== '') {
        chatService.sendMessage(`${this.currentUser}: ${this.message}`);
        this.message = '';
      }
    },
    login() {
      const user = {
        UserName: this.username,
        Password: this.password,
      }
      addTeacher(user)
        .then(res => {
          this.currentUser = res.user.UserName;
          this.toggleShowLiveChatApp();
        })
        .catch(error => {
          console.log('Login failed', error);
          this.loginFail = true
        })
    },
    resetForm() {
      this.loginFail = false
      this.username = ''
      this.password = ''
    }
  },
  beforeDestroy() {
    chatService.disconnect();
  }
}
</script>

<style lang="scss">
.live-chat-wrapper {
  width: 368px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0.48px 2.41px -0.38px, rgba(0, 0, 0, 0.17) 0px 4px 20px -0.75px;

  .live-chat-header {
    display: flex;
    align-items: center;
    padding-left: 16px;
    height: 42px;
    justify-content: space-between;
    background-color: rgb(127, 127, 127);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  .live-chat-header-content {
    font-size: 16px;
    color: white;
    font-weight: 600;
  }

  .live-chat-body {
    padding: 16px;

    .live-chat-body-content {
      background-color: white;
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #a5a5a5;
      height: 350px;

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
