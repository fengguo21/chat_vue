<template>
  <div class="sidebar">
    <button class="new-chat" @click="$emit('selectChat', null)">+ 新建会话</button>
    <ul class="chat-list">
      <li v-for="chat in chats" :key="chat.id" @click="$emit('selectChat', chat.id)">
        {{ chat.title }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const chats = ref([
  { id: 1, title: '10秒动画-寻找失物' },
  { id: 2, title: '100 Common Travel Phrases' },
  { id: 3, title: 'PPT Content Assistance' }
])
</script>

<style scoped>
.sidebar {
  color: #000;
  width: 240px;
  background: #fafbfc;
  border-right: 1px solid #eee;
  padding: 0;
  height: 100vh;
}
.new-chat {
  width: 90%;
  margin: 0 5%;
  padding: 8px;
  background: #e6f0ff;
  border: none;
  border-radius: 6px;
  margin-bottom: 16px;
  cursor: pointer;
}
.chat-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.chat-list li {
  padding: 10px 24px;
  cursor: pointer;
  border-radius: 4px;
}
.chat-list li:hover {
  background: #f0f4fa;
}
</style> 