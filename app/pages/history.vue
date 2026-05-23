<script setup>
definePageMeta({
  middleware: 'auth'
})

const api = useApi()
const router = useRouter()

const history = ref([])
const isLoading = ref(true)
const error = ref('')
const searchQuery = ref('')
const filterStatus = ref('ALL')
const downloadingId = ref(null)
const deletingId = ref(null)
const deleteTarget = ref(null)
const toasts = ref([])

onMounted(async () => {
  try {
    const response = await api.getHistory()
    history.value = response.data || []
  } catch (err) {
    error.value = 'Failed to load history'
  } finally {
    isLoading.value = false
  }
})

const filteredHistory = computed(() => {
  return history.value.filter(item => {
    const matchesSearch = item.originalFilename
      ?.toLowerCase()
      .includes(searchQuery.value.toLowerCase())
    const matchesStatus = filterStatus.value === 'ALL' ||
      item.status === filterStatus.value
    return matchesSearch && matchesStatus
  })
})

const getStatusColor = (status) => {
  if (status === 'COMPLETED') return { bg: '#dcfce7', color: '#166534' }
  if (status === 'PENDING')   return { bg: '#fef3c7', color: '#92400e' }
  if (status === 'FAILED')    return { bg: '#fee2e2', color: '#991b1b' }
  return { bg: '#f1f5f9', color: '#475569' }
}

const getScoreColor = (score) => {
  if (score >= 80) return '#16a34a'
  if (score >= 60) return '#d97706'
  return '#dc2626'
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const showToast = (message, type = 'success') => {
  const id = Date.now()
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 3500)
}

const handleDownload = async (item) => {
  if (downloadingId.value) return
  downloadingId.value = item.resumeId
  try {
    await api.downloadResume(item.resumeId, item.originalFilename)
  } catch {
    showToast('Failed to download. The file may no longer be available.', 'error')
  } finally {
    downloadingId.value = null
  }
}

const handleDeleteClick = (item) => {
  deleteTarget.value = { id: item.resumeId, filename: item.originalFilename }
}

const cancelDelete = () => {
  deleteTarget.value = null
}

const confirmDelete = async () => {
  if (!deleteTarget.value || deletingId.value) return
  const { id } = deleteTarget.value
  deletingId.value = id
  deleteTarget.value = null
  try {
    await api.deleteResume(id)
    history.value = history.value.filter(h => h.resumeId !== id)
    showToast('Resume deleted successfully')
  } catch {
    showToast('Failed to delete resume. Please try again.', 'error')
  } finally {
    deletingId.value = null
  }
}
</script>

<template>
  <div style="max-width: 1100px; margin: 0 auto; padding: 3rem 2rem;">

    <!-- Toast Notifications -->
    <div style="position: fixed; top: 1.5rem; right: 1.5rem; z-index: 1000; display: flex; flex-direction: column; gap: 0.5rem;">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :style="{
          padding: '12px 18px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          background: toast.type === 'error' ? '#fee2e2' : '#dcfce7',
          color: toast.type === 'error' ? '#991b1b' : '#166534',
          border: '1px solid',
          borderColor: toast.type === 'error' ? '#fca5a5' : '#86efac',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          minWidth: '260px'
        }"
      >
        {{ toast.message }}
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="deleteTarget"
      style="position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 500; display: flex; align-items: center; justify-content: center;"
      @click.self="cancelDelete"
    >
      <div style="background: white; border-radius: 16px; padding: 2rem; max-width: 420px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.2);">
        <div style="font-size: 32px; margin-bottom: 1rem;">🗑️</div>
        <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem;">Delete Resume</h3>
        <p style="font-size: 14px; color: #475569; margin-bottom: 0.5rem;">
          Are you sure you want to delete <strong>{{ deleteTarget.filename }}</strong>?
        </p>
        <p style="font-size: 13px; color: #94a3b8; margin-bottom: 1.75rem;">
          This will also delete the analysis results. This action cannot be undone.
        </p>
        <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
          <button
            @click="cancelDelete"
            style="padding: 9px 20px; border-radius: 8px; border: 1px solid #e2e8f0; background: white; color: #475569; font-size: 14px; cursor: pointer; font-weight: 500;"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            style="padding: 9px 20px; border-radius: 8px; border: none; background: #dc2626; color: white; font-size: 14px; cursor: pointer; font-weight: 600;"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h1 style="font-size: 28px; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem;">
          Analysis History
        </h1>
        <p style="color: #64748b; font-size: 15px;">
          All your resume analyses in one place
        </p>
      </div>
      <button
        @click="router.push('/upload')"
        style="background: #1d4ed8; color: white; border: none; padding: 10px 22px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;"
      >
        + Upload New
      </button>
    </div>

    <!-- Filters -->
    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by filename..."
        style="flex: 1; min-width: 200px; padding: 8px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; color: #0f172a; outline: none;"
      />
      <div style="display: flex; gap: 0.5rem;">
        <button
          v-for="status in ['ALL', 'COMPLETED', 'PENDING', 'FAILED']"
          :key="status"
          @click="filterStatus = status"
          :style="{
            padding: '7px 16px',
            borderRadius: '20px',
            border: '1px solid',
            fontSize: '13px',
            cursor: 'pointer',
            fontWeight: filterStatus === status ? '600' : '400',
            background: filterStatus === status ? '#0f172a' : 'white',
            color: filterStatus === status ? 'white' : '#475569',
            borderColor: filterStatus === status ? '#0f172a' : '#e2e8f0'
          }"
        >
          {{ status }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" style="text-align: center; padding: 4rem;">
      <p style="color: #64748b;">Loading history...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" style="background: #fee2e2; color: #b91c1c; padding: 1rem; border-radius: 8px; font-size: 14px;">
      {{ error }}
    </div>

    <!-- Empty -->
    <div v-else-if="filteredHistory.length === 0" style="text-align: center; padding: 5rem 2rem;">
      <div style="font-size: 48px; margin-bottom: 1rem;">📭</div>
      <p style="color: #64748b; font-size: 16px; margin-bottom: 1.5rem;">
        {{ history.length === 0 ? 'No analyses yet' : 'No results match your search' }}
      </p>
      <button
        v-if="history.length === 0"
        @click="router.push('/upload')"
        style="background: #1d4ed8; color: white; border: none; padding: 10px 24px; border-radius: 8px; font-size: 14px; cursor: pointer;"
      >
        Upload your first resume
      </button>
    </div>

    <!-- History List -->
    <div v-else style="display: flex; flex-direction: column; gap: 1rem;">
      <div
        v-for="item in filteredHistory"
        :key="item.resumeId || item.id"
        style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; position: relative;"
      >
        <!-- Action buttons — top right corner -->
        <div style="position: absolute; top: 1rem; right: 1rem; display: flex; gap: 0.4rem;">

          <!-- View Results -->
          <button
            v-if="item.status === 'COMPLETED'"
            @click="router.push(`/results/${item.resumeId || item.id}`)"
            title="View results"
            style="width: 32px; height: 32px; border-radius: 6px; border: 1px solid #bfdbfe; background: #eff6ff; color: #1d4ed8; cursor: pointer; display: flex; align-items: center; justify-content: center;"
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
          </button>

          <!-- Download -->
          <button
            @click="handleDownload(item)"
            :disabled="downloadingId === item.resumeId"
            title="Download PDF"
            :style="{
              width: '32px', height: '32px', borderRadius: '6px',
              border: '1px solid #e2e8f0', background: '#f8fafc',
              color: downloadingId === item.resumeId ? '#94a3b8' : '#475569',
              cursor: downloadingId === item.resumeId ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }"
          >
            <svg v-if="downloadingId !== item.resumeId" width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            <svg v-else width="15" height="15" stroke="currentColor" viewBox="0 0 24 24" style="animation: spin 1s linear infinite;">
              <circle cx="12" cy="12" r="9" stroke-width="2" fill="none" stroke-dasharray="28" stroke-dashoffset="10"/>
            </svg>
          </button>

          <!-- Delete -->
          <button
            @click="handleDeleteClick(item)"
            :disabled="deletingId === item.resumeId"
            title="Delete resume"
            :style="{
              width: '32px', height: '32px', borderRadius: '6px',
              border: '1px solid #fecaca', background: '#fff1f2',
              color: deletingId === item.resumeId ? '#fca5a5' : '#dc2626',
              cursor: deletingId === item.resumeId ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }"
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>

        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; padding-right: 7rem;">

          <!-- Left side -->
          <div style="display: flex; align-items: flex-start; gap: 1rem;">
            <div style="width: 44px; height: 44px; background: #f1f5f9; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;">
              📄
            </div>
            <div>
              <p style="font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 4px;">
                {{ item.originalFilename }}
              </p>
              <p style="font-size: 12px; color: #94a3b8; margin-bottom: 8px;">
                {{ formatDate(item.createdAt) }}
              </p>
              <div v-if="item.jobDescription" style="display: inline-block; background: #ede9fe; color: #4c1d95; font-size: 11px; padding: 3px 10px; border-radius: 20px; margin-bottom: 8px;">
                Job matched
              </div>
              <div v-if="item.compatibilityScore" style="display: flex; align-items: center; gap: 0.75rem;">
                <div style="width: 120px; background: #e2e8f0; border-radius: 4px; height: 6px;">
                  <div
                    :style="{
                      width: item.compatibilityScore + '%',
                      background: getScoreColor(item.compatibilityScore),
                      height: '100%',
                      borderRadius: '4px'
                    }"
                  />
                </div>
                <span :style="{ fontSize: '13px', fontWeight: '600', color: getScoreColor(item.compatibilityScore) }">
                  {{ item.compatibilityScore }}%
                </span>
              </div>
            </div>
          </div>

          <!-- Status badge -->
          <div style="display: flex; align-items: center;">
            <span
              :style="{
                background: getStatusColor(item.status).bg,
                color: getStatusColor(item.status).color,
                padding: '5px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500'
              }"
            >
              {{ item.status }}
            </span>
          </div>

        </div>
      </div>
    </div>

    <!-- Count -->
    <p v-if="!isLoading && filteredHistory.length > 0" style="text-align: center; color: #94a3b8; font-size: 13px; margin-top: 1.5rem;">
      Showing {{ filteredHistory.length }} of {{ history.length }} analyses
    </p>

  </div>
</template>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
