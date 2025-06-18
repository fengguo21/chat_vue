<template>
  <div class="chat-window">
    <div class="messages">
      <div
        v-for="(msg, idx) in messages"
        :key="idx"
        :class="['msg-row', msg.role]"
      >
        <div class="avatar">
          <template v-if="msg.role === 'user'">🧑</template>
          <template v-else>🤖</template>
        </div>
        <div class="msg-bubble" v-if="msg.role === 'user'">
          {{ msg.content }}
        </div>
        <div class="msg-bubble" v-else v-html="marked(msg.content)"></div>
      </div>
    </div>
    <ChatInput @send="onSend" />
  </div>
</template>

<script setup>
import ChatInput from './ChatInput.vue'
import { marked } from 'marked'
const props = defineProps({ messages: Array })
const emit = defineEmits(['send'])
function onSend(text,uploadedfile) {
  emit('send', text,uploadedfile)
}
</script>

<style scoped>
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #23232a;
}
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 40px 0;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.msg-row {
  display: flex;
  width: 100%;
  margin-bottom: 24px;
  align-items: flex-end;
}
.msg-row.user {
  flex-direction: row-reverse;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #393a40;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 16px;
  font-size: 22px;
  color: #bcbec4;
}
.msg-bubble {
  max-width: 70%;
  padding: 18px 22px;
  border-radius: 18px;
  font-size: 16px;
  line-height: 1.7;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  word-break: break-word;
}
.msg-row.user .msg-bubble {
  background: #393a40;
  color: #e0e0e0;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 18px;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
}
.msg-row.assistant .msg-bubble {
  background: #28282f;
  color: #e0e0e0;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 18px;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
}
/* Markdown内容优化 */
.msg-bubble h1,
.msg-bubble h2,
.msg-bubble h3 {
  margin: 8px 0 4px 0;
}
.msg-bubble code {
  background: #33343a;
  border-radius: 4px;
  padding: 2px 4px;
  font-size: 90%;
}
.msg-bubble pre {
  background: #18181c;
  color: #fff;
  border-radius: 6px;
  padding: 12px;
  overflow-x: auto;
}
</style> 