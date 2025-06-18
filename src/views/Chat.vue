<template>
  <div class="chat-layout">
    <ChatSidebar @selectChat="handleSelectChat" />
    <ChatWindow :messages="messages" @send="handleSend" @upload="handleUpload" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ChatSidebar from '@/components/ChatSidebar.vue'
import ChatWindow from '@/components/ChatWindow.vue'
import { get, post } from '@/api/request'

const messages = ref([])
const currentSessionId = ref(null)
const uploadedfile = ref(null)

async function handleSelectChat(sessionId) {
  currentSessionId.value = sessionId
  // 拉取聊天记录
  try {
    const res = await get(`/history?session_id=${sessionId}`)
    const data = await res.json()
    messages.value = data.history || []
  } catch (e) {
    messages.value = []
  }
}

function handleUpload(fileObj) {
  uploadedfile.value = fileObj
}

async function handleSend(text,uploadedfile) {
  console.log(uploadedfile,'uploadedfile=============')
  const payload = { message: text, session_id: currentSessionId.value }
  if (uploadedfile.value && uploadedfile.value.file_id) {
    payload.file_ids = [uploadedfile.value.file_id]
  }
  messages.value.push({ role: 'user', content: text, session_id: currentSessionId.value })
  const res = await post('/chat', payload)
  const data = await res.json()
  messages.value.push({ role: 'assistant', content: data.content, session_id: data.session_id })
  uploadedfile.value = null // 发送后清空
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