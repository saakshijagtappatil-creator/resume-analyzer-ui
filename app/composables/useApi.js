export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const baseURL = config.public.apiBase

  const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' }
    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`
    }
    return headers
  }

  const apiFetch = async (url, options = {}) => {
    try {
      return await $fetch(url, options)
    } catch (err) {
      if (err?.status === 401) {
        authStore.logout()
        await navigateTo('/login')
        return
      }
      throw err
    }
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
    return await apiFetch(`${baseURL}/api/resumes/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authStore.token}` },
      body: formData
    })
  }

  const getResumeStatus = async (resumeId) => {
    return await apiFetch(`${baseURL}/api/resumes/${resumeId}/status`, {
      headers: getHeaders()
    })
  }

  const getResumeResult = async (resumeId) => {
    return await apiFetch(`${baseURL}/api/resumes/${resumeId}/result`, {
      headers: getHeaders()
    })
  }

  const getAllResumes = async () => {
    return await apiFetch(`${baseURL}/api/resumes`, {
      headers: getHeaders()
    })
  }

  const deleteResume = async (resumeId) => {
    return await apiFetch(`${baseURL}/api/resumes/${resumeId}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
  }

  const downloadResume = async (resumeId, filename) => {
    const response = await fetch(`${baseURL}/api/resumes/${resumeId}/download`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (response.status === 401) {
      authStore.logout()
      await navigateTo('/login')
      return
    }
    if (!response.ok) throw new Error(`Download failed: ${response.status}`)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // ── HISTORY ───────────────────────────────────────────
  const getHistory = async () => {
    return await apiFetch(`${baseURL}/api/history`, {
      headers: getHeaders()
    })
  }

  const getHistoryStats = async () => {
    return await apiFetch(`${baseURL}/api/history/stats`, {
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
    downloadResume,
    getHistory,
    getHistoryStats
  }
}
