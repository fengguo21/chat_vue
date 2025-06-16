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

const messages = ref([])

function handleSelectChat(chatId) {
  // 这里可以根据 chatId 加载历史记录
}

async function handleSend(text) {
  messages.value.push({ role: 'user', content: text })
  const res = await fetch('http://0.0.0.0:8000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text })
  })
  const data = await res.json()
  messages.value.push({ role: 'assistant', content: data.response })
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