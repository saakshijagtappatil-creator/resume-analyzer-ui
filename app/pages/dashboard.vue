<script setup>
definePageMeta({
  middleware: 'auth'
})

const api = useApi()
const router = useRouter()
const authStore = useAuthStore()

const stats = ref(null)
const allResumes = ref([])
const recentResumes = ref([])
const isLoading = ref(true)
const error = ref('')
let pollInterval = null

const fetchDashboardData = async () => {
  try {
    const [statsResponse, resumesResponse] = await Promise.all([
      api.getHistoryStats(),
      api.getAllResumes()
    ])
    stats.value = statsResponse.data ?? statsResponse
    allResumes.value = resumesResponse.data ?? resumesResponse ?? []
    recentResumes.value = allResumes.value.slice(0, 5)
  } catch (err) {
    error.value = 'Failed to load dashboard data'
    stats.value = null
    allResumes.value = []
    recentResumes.value = []
  } finally {
    isLoading.value = false
  }
}

const hasPendingAnalyses = computed(() =>
  recentResumes.value.some(r => r.status === 'PENDING' || r.status === 'PROCESSING')
)

const startPolling = () => {
  if (pollInterval) return
  pollInterval = setInterval(async () => {
    await fetchDashboardData()
    if (!hasPendingAnalyses.value) stopPolling()
  }, 5000)
}

const stopPolling = () => {
  clearInterval(pollInterval)
  pollInterval = null
}

onMounted(async () => {
  await fetchDashboardData()
  if (hasPendingAnalyses.value) startPolling()
})

onUnmounted(() => stopPolling())

watch(hasPendingAnalyses, (hasPending) => {
  if (hasPending) startPolling()
  else stopPolling()
})

const welcomeMessage = computed(() => {
  const name = authStore.user?.username
  const capitalized = name ? name.charAt(0).toUpperCase() + name.slice(1) : ''
  const isNew = !totalAnalyses.value
  return isNew ? `Welcome, ${capitalized} 👋` : `Welcome back, ${capitalized} 👋`
})

const totalAnalyses = computed(() => stats.value?.totalResumes ?? null)
const completedCount = computed(() =>
  allResumes.value.filter(r => r.status === 'COMPLETED').length
)
const averageScore = computed(() => stats.value?.averageScore ?? null)
const highestScore = computed(() => stats.value?.highestScore ?? null)

const getStatusColor = (status) => {
  if (status === 'COMPLETED')  return { bg: '#dcfce7', color: '#166534' }
  if (status === 'PENDING')    return { bg: '#fef3c7', color: '#92400e' }
  if (status === 'PROCESSING') return { bg: '#dbeafe', color: '#1e40af' }
  if (status === 'FAILED')     return { bg: '#fee2e2', color: '#991b1b' }
  return { bg: '#f1f5f9', color: '#475569' }
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>

<template>
  <div style="max-width: 1100px; margin: 0 auto; padding: 3rem 2rem;">

    <!-- Header -->
    <div style="margin-bottom: 2.5rem;">
      <h1 style="font-size: 28px; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem;">
        {{ welcomeMessage }}
      </h1>
      <p style="color: #64748b; font-size: 15px;">
        Here is an overview of your resume analyses
      </p>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" style="text-align: center; padding: 4rem;">
      <p style="color: #64748b;">Loading dashboard...</p>
    </div>

    <div v-else>

      <!-- Stats Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 2.5rem;">

        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem;">
          <p style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem;">Total Analyses</p>
          <p style="font-size: 32px; font-weight: 700; color: #0f172a;">{{ totalAnalyses !== null ? totalAnalyses : '—' }}</p>
        </div>

        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem;">
          <p style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem;">Average Score</p>
          <p style="font-size: 32px; font-weight: 700; color: #1d4ed8;">{{ averageScore !== null ? averageScore.toFixed(1) + '%' : '—' }}</p>
        </div>

        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem;">
          <p style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem;">Highest Score</p>
          <p style="font-size: 32px; font-weight: 700; color: #16a34a;">{{ highestScore !== null ? highestScore.toFixed(1) + '%' : '—' }}</p>
        </div>

        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem;">
          <p style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem;">Completed</p>
          <p style="font-size: 32px; font-weight: 700; color: #0f172a;">{{ completedCount !== null ? completedCount : '—' }}</p>
        </div>

      </div>

      <!-- Quick Actions -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2.5rem;">

        <button
          @click="router.push('/upload')"
          style="background: #1d4ed8; color: white; border: none; padding: 1.25rem; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; text-align: left;"
        >
          <div style="font-size: 24px; margin-bottom: 0.5rem;">📤</div>
          Upload New Resume
        </button>

        <button
          @click="router.push('/history')"
          style="background: white; color: #0f172a; border: 1px solid #e2e8f0; padding: 1.25rem; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; text-align: left;"
        >
          <div style="font-size: 24px; margin-bottom: 0.5rem;">📊</div>
          View Full History
        </button>

      </div>

      <!-- Recent Analyses -->
      <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">

        <div style="padding: 1.5rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <h2 style="font-size: 16px; font-weight: 600; color: #0f172a;">Recent Analyses</h2>
            <span v-if="hasPendingAnalyses" style="font-size: 11px; background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 10px;">Updating...</span>
          </div>
          <button
            @click="router.push('/history')"
            style="background: transparent; border: none; color: #1d4ed8; font-size: 13px; cursor: pointer;"
          >
            View all →
          </button>
        </div>

        <!-- Empty state -->
        <div v-if="recentResumes.length === 0" style="padding: 4rem; text-align: center;">
          <div style="font-size: 40px; margin-bottom: 1rem;">📄</div>
          <p style="color: #64748b; font-size: 15px; margin-bottom: 1.5rem;">No analyses yet</p>
          <button
            @click="router.push('/upload')"
            style="background: #1d4ed8; color: white; border: none; padding: 10px 24px; border-radius: 8px; font-size: 14px; cursor: pointer;"
          >
            Upload your first resume
          </button>
        </div>

        <!-- Resume list -->
        <div v-else>
          <div
            v-for="resume in recentResumes"
            :key="resume.id"
            @click="resume.status === 'COMPLETED' && router.push(`/results/${resume.id}`)"
            :style="{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: resume.status === 'COMPLETED' ? 'pointer' : 'default',
              transition: 'background 0.15s'
            }"
            @mouseenter="e => e.currentTarget.style.background = '#f8fafc'"
            @mouseleave="e => e.currentTarget.style.background = 'white'"
          >
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="width: 40px; height: 40px; background: #f1f5f9; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                📄
              </div>
              <div>
                <p style="font-size: 14px; font-weight: 500; color: #0f172a; margin-bottom: 2px;">
                  {{ resume.originalFilename }}
                </p>
                <p style="font-size: 12px; color: #94a3b8;">
                  {{ formatDate(resume.createdAt) }}
                </p>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 1rem;">
              <span
                :style="{
                  background: getStatusColor(resume.status).bg,
                  color: getStatusColor(resume.status).color,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500'
                }"
              >
                {{ resume.status }}
              </span>
              <span v-if="resume.status === 'COMPLETED'" style="color: #94a3b8; font-size: 14px;">→</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>
