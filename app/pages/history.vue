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
</script>

<template>
  <div style="max-width: 1100px; margin: 0 auto; padding: 3rem 2rem;">

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

      <!-- Search -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by filename..."
        style="flex: 1; min-width: 200px; padding: 8px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; color: #0f172a; outline: none;"
      />

      <!-- Status Filter -->
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
        style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem;"
      >
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">

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

              <!-- Job description tag -->
              <div v-if="item.jobDescription" style="display: inline-block; background: #ede9fe; color: #4c1d95; font-size: 11px; padding: 3px 10px; border-radius: 20px; margin-bottom: 8px;">
                Job matched
              </div>

              <!-- Score bar if completed -->
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
                <span
                  :style="{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: getScoreColor(item.compatibilityScore)
                  }"
                >
                  {{ item.compatibilityScore }}%
                </span>
              </div>
            </div>
          </div>

          <!-- Right side -->
          <div style="display: flex; align-items: center; gap: 1rem;">
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

            <button
              v-if="item.status === 'COMPLETED'"
              @click="router.push(`/results/${item.resumeId || item.id}`)"
              style="background: #0f172a; color: white; border: none; padding: 8px 18px; border-radius: 8px; font-size: 13px; cursor: pointer;"
            >
              View Results
            </button>
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
