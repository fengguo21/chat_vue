<template>
  <div class="chat-window">
    <div class="messages">
      <div v-for="(msg, idx) in messages" :key="idx" :class="['msg', msg.role]">
        <span>{{ msg.role === 'user' ? '我' : 'AI' }}：</span>{{ msg.content }}
      </div>
    </div>
    <ChatInput @send="onSend" />
  </div>
</template>

<script setup>
import ChatInput from './ChatInput.vue'
const props = defineProps({ messages: Array })
const emit = defineEmits(['send'])
function onSend(text) {
  emit('send', text)
}
</script>

<style scoped>
.chat-window {
  color: #000;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #fff;
}
.msg {
  margin-bottom: 16px;
  padding: 10px 16px;
  border-radius: 8px;
  max-width: 70%;
  word-break: break-all;
}
.msg.user {
  background: #e6f7ff;
  align-self: flex-end;
}
.msg.assistant {
  background: #f5f5f5;
  align-self: flex-start;
}
</style> 