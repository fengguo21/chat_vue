<template>
  <div class="chat-input">
    <input v-model="input" @keyup.enter="send" placeholder="请输入内容..." />
    <button @click="send">发送</button>
    <button class="upload-btn" @click="onUploadClick">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M16.5 13.5L7.5 4.5M7.5 4.5V9.5M7.5 4.5H12.5" stroke="#bcbec4" stroke-width="2"/>
      </svg>
    </button>
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
.chat-input {
  display: flex;
  padding: 16px;
  border-top: 1px solid #eee;
  background: #fafbfc;
  position: relative;
}
input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-right: 12px;
}
button {
  padding: 8px 20px;
  background: #1677ff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
button:hover {
  background: #409eff;
}
.upload-btn {
  position: absolute;
  right: 16px;
  bottom: 16px;
  width: 40px;
  height: 40px;
  background: #393a40;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  color: #fff;
}
.upload-btn:hover {
  background: #50515a;
}
</style> 