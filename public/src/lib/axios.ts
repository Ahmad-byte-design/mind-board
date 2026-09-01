import axios from 'axios'

const api = axios.create({
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

export async function getCsrf() {
  await api.get('/sanctum/csrf-cookie')
}

export default api
