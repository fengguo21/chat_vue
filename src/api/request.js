const baseURL = 'http://127.0.0.1:8000'

// 简单请求封装，自动加 JWT header
export async function apiRequest(url, { method = 'GET', data, headers = {}, ...rest } = {}) {
  const token = localStorage.getItem('jwt')
  const allHeaders = {
    'Content-Type': 'application/json',
    ...headers
  }
  if (token) {
    allHeaders['Authorization'] = `Bearer ${token}`
  }
  let body = undefined
  if (data) {
    body = allHeaders['Content-Type'] === 'application/json' ? JSON.stringify(data) : data
  }
  // 拼接 baseURL
  const fullUrl = url.startsWith('http') ? url : baseURL + url
  console.log(fullUrl,'usl===')
  const res = await fetch(fullUrl, {
    method,
    headers: allHeaders,
    body: method === 'GET' ? undefined : body,
    ...rest
  })
  if (res.status === 401) {
    localStorage.removeItem('jwt')
    window.location.href = '/login'
    throw new Error('未认证')
  }
  return res
}

export function get(url, options) {
  return apiRequest(url, { ...options, method: 'GET' })
}
export function post(url, data, options) {
  return apiRequest(url, { ...options, method: 'POST', data })
}
export function put(url, data, options) {
  return apiRequest(url, { ...options, method: 'PUT', data })
}
export function del(url, options) {
  return apiRequest(url, { ...options, method: 'DELETE' })
} 