<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="logo">fengguo</div>
      <button class="icon-btn" @click="fetchSessions" title="刷新"><svg width="24" height="24" viewBox="0 0 24 24"><path d="M4 4v6h6" stroke="#bcbec4" stroke-width="2" fill="none"/><path d="M20 20v-6h-6" stroke="#bcbec4" stroke-width="2" fill="none"/><path d="M5 19A9 9 0 0 1 19 5" stroke="#bcbec4" stroke-width="2" fill="none"/></svg></button>
    </div>
    <button class="new-chat-btn" @click="addNewChat">
      <svg width="20" height="20" viewBox="0 0 20 20"><rect x="2" y="2" width="16" height="16" rx="8" fill="none" stroke="#fff" stroke-width="2"/><path d="M10 6v8M6 10h8" stroke="#fff" stroke-width="2"/></svg>
      New chat
    </button>
    <template v-for="(group, groupName) in groupedChats" :key="groupName">
      <div class="chat-group" v-if="group.length">
        <div class="group-title">{{ groupName }}</div>
        <div v-for="item in group" :key="getSessionKey(item)" class="chat-item" @click="$emit('selectChat', item.session_id)">
          {{ item.title }}
          <span v-if="item.message_count" class="msg-count">{{ item.message_count }}</span>
          <span v-if="item.last_active" class="last-active">{{ formatDate(item.last_active) }}</span>
        </div>
      </div>
    </template>
    <div class="sidebar-bottom">
      <button class="get-app-btn"> <svg width="20" height="20" viewBox="0 0 20 20"><rect x="2" y="2" width="16" height="16" rx="8" fill="none" stroke="#1677ff" stroke-width="2"/></svg> Get App <span class="new">NEW</span></button>
      <div class="profile">
        <img class="avatar" src="https://randomuser.me/api/portraits/men/32.jpg" />
        <span>My Profile</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { get } from '@/api/request'
const emit = defineEmits(['selectChat'])
const sessions = ref([])
let chatId = 1
async function fetchSessions() {
  try {
    const res = await get('http://0.0.0.0:8000/sessions')
    const data = await res.json()
    sessions.value = data.sessions
    // 过滤掉无效 session_id
    const validSessions = data.sessions.filter(s => typeof s.session_id === 'number' && !isNaN(s.session_id))
    chatId = validSessions.length ? Math.max(...validSessions.map(i => i.session_id)) + 1 : 1
  } catch (e) {
    sessions.value = []
  }
}
onMounted(fetchSessions)
function addNewChat() {
  // 保证 session_id 一定为数字且唯一
  const newSession = {
    session_id: Number(chatId++),
    title: 'New Chat',
    message_count: 0,
    last_active: new Date().toISOString()
  }
  sessions.value.unshift(newSession)
  nextTick(() => {
    const sidebar = document.querySelector('.sidebar')
    if (sidebar) sidebar.scrollTop = 0
    emit('selectChat', newSession.session_id)
  })
}
function getSessionKey(item) {
  // 保证 key 一定为字符串或数字
  return typeof item.session_id === 'number' && !isNaN(item.session_id) ? item.session_id : (item.title || Math.random())
}
function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString()
}
function getDaysDiff(date) {
  const d = new Date(date)
  const now = new Date()
  // 只比较日期部分
  d.setHours(0,0,0,0)
  now.setHours(0,0,0,0)
  return Math.floor((now - d) / (1000 * 60 * 60 * 24))
}
function isThisYear(date) {
  const d = new Date(date)
  const now = new Date()
  return d.getFullYear() === now.getFullYear()
}
const groupedChats = computed(() => {
  const groups = {
    'Today': [],
    '7 Days': [],
    '30 Days': [],
    'This Year': [],
    'Earlier': []
  }
  for (const s of sessions.value) {
    if (!s.last_active) {
      groups['Earlier'].push(s)
      continue
    }
    const days = getDaysDiff(s.last_active)
    if (days === 0) {
      groups['Today'].push(s)
    } else if (days > 0 && days < 7) {
      groups['7 Days'].push(s)
    } else if (days >= 7 && days < 30) {
      groups['30 Days'].push(s)
    } else if (isThisYear(s.last_active)) {
      groups['This Year'].push(s)
    } else {
      groups['Earlier'].push(s)
    }
  }
  return groups
})
</script>

<style scoped>
.sidebar {
  width: 320px;
  background:#212327;
  color: #e0e0e0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 0 0 16px 0;
}
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px 24px 0 24px;
}
.logo {
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 2px;
  color: #bcbec4;
}
.icon-btn {
  background: none;
  border: 1px solid #393a40;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bcbec4;
  cursor: pointer;
}
.new-chat-btn {
  margin: 24px 24px 16px 24px;
  width: calc(100% - 48px);
  background: #1677ff;
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 14px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(22,119,255,0.08);
  transition: background 0.2s;
}
.new-chat-btn:hover {
  background: #409eff;
}
.chat-group {
  margin: 0 24px 18px 24px;
}
.group-title {
  color: #7a7a8c;
  font-size: 0.95rem;
  font-weight: 600;
  margin: 18px 0 8px 0;
}
.chat-item {
  background: none;
  color: #e0e0e0;
  padding: 10px 0 10px 0;
  font-size: 1.05rem;
  border-radius: 10px;
  margin-bottom: 2px;
  cursor: pointer;
  transition: background 0.2s;
  padding-left: 12px;
  padding-right: 12px;
}
.chat-item:hover {
  background: #28282f;
}
.more {
  color: #bcbec4;
  font-size: 1.1em;
}
.sidebar-bottom {
  margin-top: auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.get-app-btn {
  width: 100%;
  background: none;
  border: 1.5px solid #1677ff;
  color: #1677ff;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 8px;
  position: relative;
}
.get-app-btn .new {
  background: #1677ff;
  color: #fff;
  border-radius: 8px;
  font-size: 0.8em;
  padding: 2px 8px;
  margin-left: 8px;
}
.profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #393a40;
}
.msg-count {
  color: #7a7a8c;
  font-size: 0.9em;
  margin-left: 8px;
}
.last-active {
  color: #7a7a8c;
  font-size: 0.85em;
  margin-left: 8px;
}
</style> 