<template>
  <div class="chat-layout">
    <ChatSidebar @selectChat="handleSelectChat" />
    <ChatWindow :messages="messages" @send="handleSend" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ChatSidebar from '@/components/ChatSidebar.vue'
import ChatWindow from '@/components/ChatWindow.vue'
import { get, post } from '@/api/request'

const messages = ref([])
const currentSessionId = ref(null)

async function handleSelectChat(sessionId) {
  currentSessionId.value = sessionId
  // 拉取聊天记录
  try {
    const res = await get(`http://0.0.0.0:8000/history?session_id=${sessionId}`)
    const data = await res.json()
    // 假设 data.history 是 [{role, content, ...}]
    messages.value = data.history || []
  } catch (e) {
    messages.value = []
  }
}

async function handleSend(text) {
  messages.value.push({ role: 'user', content: text, session_id: currentSessionId.value })
  const res = await post('http://0.0.0.0:8000/chat', { message: text, session_id: currentSessionId.value })
  const data = await res.json()
  messages.value.push({ role: 'assistant', content: data.response, session_id: data.session_id })
}
</script>

<style scoped>
.chat-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style> 