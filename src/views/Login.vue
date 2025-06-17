<template>
  <div class="auth-container">
    <h2>登录</h2>
    <form @submit.prevent="onLogin">
      <input v-model="username" placeholder="用户名" required />
      <input v-model="password" type="password" placeholder="密码" required />
      <button type="submit">登录</button>
      <div class="switch-link">
        没有账号？<a @click.prevent="goRegister" href="#">注册</a>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { get, post } from '@/api/request'

import { useRouter } from 'vue-router'
const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
async function onLogin() {
  error.value = ''
  try {
    const res = await post('/login', { username: username.value, password: password.value })
    const data = await res.json()
    if ( data.access_token) {
      localStorage.setItem('jwt', data.access_token)
      router.push('/chat')
    } else {
      error.value = data.msg || '登录失败'
    }
  } catch (e) {
    error.value = '网络错误'
  }
}
function goRegister() {
  router.push('/register')
}
</script>

<style scoped>
.auth-container {
  max-width: 340px;
  margin: 80px auto;
  background: #23232a;
  border-radius: 16px;
  padding: 32px 28px;
  color: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}
h2 {
  text-align: center;
  margin-bottom: 24px;
}
input {
  width: 100%;
  margin-bottom: 18px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #393a40;
  background: #18181c;
  color: #fff;
  font-size: 16px;
}
button {
  width: 100%;
  padding: 10px 0;
  background: #1677ff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 17px;
  cursor: pointer;
  margin-bottom: 10px;
}
button:hover {
  background: #409eff;
}
.switch-link {
  text-align: right;
  font-size: 14px;
  margin-top: 8px;
}
.switch-link a {
  color: #1677ff;
  cursor: pointer;
}
.error {
  color: #ff4d4f;
  margin-top: 10px;
  text-align: center;
}
</style> 