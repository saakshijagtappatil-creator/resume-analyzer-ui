export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const baseURL = config.public.apiBase

  const getHeaders = () => {
    const headers = {
      'Content-Type': 'application/json'
    }
    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`
    }
    return headers
  }

  // ── AUTH ──────────────────────────────────────────────
  const register = async (username, email, password) => {
    return await $fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { username, email, password }
    })
  }

  const login = async (emailOrUsername, password) => {
    return await $fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { emailOrUsername, password }
    })
  }

  // ── RESUME ────────────────────────────────────────────
  const uploadResume = async (file, jobDescription = null) => {
    const formData = new FormData()
    formData.append('file', file)
    if (jobDescription) {
      formData.append('jobDescription', jobDescription)
    }
    return await $fetch(`${baseURL}/api/resumes/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      },
      body: formData
    })
  }

  const getResumeStatus = async (resumeId) => {
    return await $fetch(`${baseURL}/api/resumes/${resumeId}/status`, {
      headers: getHeaders()
    })
  }

  const getResumeResult = async (resumeId) => {
    return await $fetch(`${baseURL}/api/resumes/${resumeId}/result`, {
      headers: getHeaders()
    })
  }

  const getAllResumes = async () => {
    return await $fetch(`${baseURL}/api/resumes`, {
      headers: getHeaders()
    })
  }

  const deleteResume = async (resumeId) => {
    return await $fetch(`${baseURL}/api/resumes/${resumeId}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
  }

  // ── HISTORY ───────────────────────────────────────────
  const getHistory = async () => {
    return await $fetch(`${baseURL}/api/history`, {
      headers: getHeaders()
    })
  }

  const getHistoryStats = async () => {
    return await $fetch(`${baseURL}/api/history/stats`, {
      headers: getHeaders()
    })
  }

  return {
    register,
    login,
    uploadResume,
    getResumeStatus,
    getResumeResult,
    getAllResumes,
    deleteResume,
    getHistory,
    getHistoryStats
  }
}
