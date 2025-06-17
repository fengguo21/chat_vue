<template>
  <div class="chat-input-bar">
    <textarea
      v-model="input"
      class="chat-input-textarea"
      placeholder="Message DeepSeek"
      rows="1"
    />
    <div class="chat-input-actions">
      <div class="chat-input-left">
        <button class="action-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="#bcbec4" stroke-width="2"/><circle cx="10" cy="10" r="4" stroke="#bcbec4" stroke-width="2"/></svg>
          DeepThink (R1)
        </button>
        <button class="action-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="#bcbec4" stroke-width="2"/><path d="M6 10h8" stroke="#bcbec4" stroke-width="2"/></svg>
          Search
        </button>
      </div>
      <div class="chat-input-right">
        <button class="icon-btn" @click="onUploadClick">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M16.5 13.5L7.5 4.5M7.5 4.5V9.5M7.5 4.5H12.5" stroke="#bcbec4" stroke-width="2"/></svg>
        </button>
        <button class="icon-btn" @click="send">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 20L20 12L4 4V10L16 12L4 14V20Z" fill="#bcbec4"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['send'])
const input = ref('')
function send() {
  if (input.value.trim()) {
    emit('send', input.value)
    input.value = ''
  }
}
async function uploadFile() {
  return new Promise((resolve, reject) => {
    const file = document.createElement('input')
    file.type = 'file'
    file.accept = 'image/*'
    file.onchange = async () => {
      resolve(file.files[0])
      const formData = new FormData();
      formData.append('file', file.files[0]);
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      console.log(result);
    }
    file.click()
  })
}
async function onUploadClick() {
  const file = await uploadFile()
  console.log(file)
  // upload file 
  // emit('upload', file)
}
</script>

<style scoped>
.chat-input-bar {
  background: #36363a;
  border-radius: 24px;
  padding: 20px 24px 56px 24px;
  margin: 24px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
}
.chat-input-textarea {
  background: transparent;
  border: none;
  color: #e0e0e0;
  font-size: 18px;
  width: 100%;
  resize: none;
  outline: none;
  margin-bottom: 12px;
}
.chat-input-actions {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 16px;
}
.chat-input-left {
  display: flex;
  gap: 12px;
}
.action-btn {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.04);
  border: 1px solid #4a4a4f;
  color: #e0e0e0;
  border-radius: 18px;
  padding: 6px 16px;
  font-size: 15px;
  cursor: pointer;
  gap: 6px;
  transition: background 0.2s, border 0.2s;
}
.action-btn:hover {
  background: #44444a;
  border-color: #6a6a6f;
}
.chat-input-right {
  display: flex;
  gap: 10px;
}
.icon-btn {
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.04);
  border: 1px solid #4a4a4f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bcbec4;
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
}
.icon-btn:hover {
  background: #44444a;
  border-color: #6a6a6f;
}
</style> 