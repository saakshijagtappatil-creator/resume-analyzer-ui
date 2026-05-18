import { defineStore } from 'pinia'

export const useResumeStore = defineStore('resume', () => {
  const resumes = ref([])
  const currentResume = ref(null)
  const currentResult = ref(null)
  const isUploading = ref(false)
  const isLoading = ref(false)
  const error = ref(null)

  function setResumes(data) {
    resumes.value = data
  }

  function setCurrentResume(resume) {
    currentResume.value = resume
  }

  function setCurrentResult(result) {
    currentResult.value = result
  }

  function setUploading(val) {
    isUploading.value = val
  }

  function setLoading(val) {
    isLoading.value = val
  }

  function setError(msg) {
    error.value = msg
  }

  function clearError() {
    error.value = null
  }

  function reset() {
    resumes.value = []
    currentResume.value = null
    currentResult.value = null
    isUploading.value = false
    isLoading.value = false
    error.value = null
  }

  return {
    resumes,
    currentResume,
    currentResult,
    isUploading,
    isLoading,
    error,
    setResumes,
    setCurrentResume,
    setCurrentResult,
    setUploading,
    setLoading,
    setError,
    clearError,
    reset
  }
})
