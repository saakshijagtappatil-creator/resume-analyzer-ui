<script setup>
definePageMeta({
  middleware: 'auth'
})

useHead({ title: 'Analysis Results | Resume Analyzer' })

const route = useRoute()
const router = useRouter()
const api = useApi()

const resumeId = route.params.id
const status = ref('PENDING')
const result = ref(null)
const isLoading = ref(true)
const error = ref('')
let pollInterval = null

const pollStatus = async () => {
  try {
    const statusResponse = await api.getResumeStatus(resumeId)
    status.value = statusResponse.data.status

    if (status.value === 'COMPLETED') {
      clearInterval(pollInterval)
      const resultResponse = await api.getResumeResult(resumeId)
      result.value = resultResponse.data
      isLoading.value = false
    } else if (status.value === 'FAILED') {
      clearInterval(pollInterval)
      error.value = 'Analysis failed. Please try uploading again.'
      isLoading.value = false
    }
  } catch (err) {
    clearInterval(pollInterval)
    error.value = 'Failed to fetch results. Please try again.'
    isLoading.value = false
  }
}

onMounted(() => {
  pollInterval = setInterval(pollStatus, 2000)
  pollStatus()
})

onUnmounted(() => {
  clearInterval(pollInterval)
})

const getScoreColor = (score) => {
  if (score >= 80) return '#16a34a'
  if (score >= 60) return '#d97706'
  return '#dc2626'
}

const getScoreBg = (score) => {
  if (score >= 80) return '#f0fdf4'
  if (score >= 60) return '#fffbeb'
  return '#fef2f2'
}

const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent Match'
  if (score >= 60) return 'Good Match'
  if (score >= 40) return 'Fair Match'
  return 'Poor Match'
}
</script>

<template>
  <div style="max-width: 900px; margin: 0 auto; padding: 3rem 2rem;">

    <!-- Loading State -->
    <div v-if="isLoading" style="text-align: center; padding: 5rem 2rem;">
      <div style="font-size: 48px; margin-bottom: 1.5rem;">⏳</div>
      <h2 style="font-size: 22px; font-weight: 600; color: #0f172a; margin-bottom: 0.75rem;">
        Analyzing your resume...
      </h2>
      <p style="color: #64748b; font-size: 15px; margin-bottom: 1rem;">
        Our AI is reading your resume and generating insights
      </p>
      <div style="display: inline-block; background: #f1f5f9; padding: 6px 16px; border-radius: 20px;">
        <span style="color: #475569; font-size: 13px;">Status: {{ status }}</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" style="text-align: center; padding: 5rem 2rem;">
      <div style="font-size: 48px; margin-bottom: 1.5rem;">❌</div>
      <h2 style="font-size: 22px; font-weight: 600; color: #0f172a; margin-bottom: 0.75rem;">
        Something went wrong
      </h2>
      <p style="color: #64748b; font-size: 15px; margin-bottom: 2rem;">{{ error }}</p>
      <button
        @click="router.push('/upload')"
        style="background: #1d4ed8; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-size: 15px; cursor: pointer;"
      >
        Try Again
      </button>
    </div>

    <!-- Results -->
    <div v-else-if="result">

      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 style="font-size: 28px; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem;">
            Analysis Results
          </h1>
          <p style="color: #64748b; font-size: 14px;">{{ result.originalFilename }}</p>
        </div>
        <button
          @click="router.push('/upload')"
          style="background: #0f172a; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; cursor: pointer;"
        >
          Analyze Another
        </button>
      </div>

      <!-- Score Card -->
      <div
        v-if="result.compatibilityScore"
        :style="{
          background: getScoreBg(result.compatibilityScore),
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }"
      >
        <p style="font-size: 13px; color: #64748b; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px;">
          Compatibility Score
        </p>
        <div
          :style="{
            fontSize: '72px',
            fontWeight: '700',
            color: getScoreColor(result.compatibilityScore),
            lineHeight: '1'
          }"
        >
          {{ result.compatibilityScore }}%
        </div>
        <p
          :style="{
            fontSize: '16px',
            fontWeight: '600',
            color: getScoreColor(result.compatibilityScore),
            marginTop: '0.5rem'
          }"
        >
          {{ getScoreLabel(result.compatibilityScore) }}
        </p>

        <!-- Score bar -->
        <div style="max-width: 400px; margin: 1.5rem auto 0; background: #e2e8f0; border-radius: 4px; height: 8px;">
          <div
            :style="{
              width: result.compatibilityScore + '%',
              background: getScoreColor(result.compatibilityScore),
              height: '100%',
              borderRadius: '4px',
              transition: 'width 1s ease'
            }"
          />
        </div>
      </div>

      <!-- No score notice -->
      <div
        v-else
        style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1rem;"
      >
        <span style="font-size: 24px;">💡</span>
        <div>
          <p style="font-size: 14px; font-weight: 600; color: #0f172a; margin-bottom: 2px;">No compatibility score</p>
          <p style="font-size: 13px; color: #64748b;">Upload again with a job description to see how well your resume matches a specific role.</p>
        </div>
      </div>

      <!-- 2 Column Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">

        <!-- Extracted Skills -->
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.75rem;">
          <h2 style="font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 1rem;">
            ✅ Extracted Skills
          </h2>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            <span
              v-for="skill in result.extractedSkills"
              :key="skill"
              style="background: #dbeafe; color: #1e3a8a; padding: 5px 14px; border-radius: 20px; font-size: 13px; font-weight: 500;"
            >
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- Missing Keywords -->
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.75rem;">
          <h2 style="font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 1rem;">
            ❌ Missing Keywords
          </h2>
          <div v-if="result.missingKeywords && result.missingKeywords.length > 0" style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            <span
              v-for="keyword in result.missingKeywords"
              :key="keyword"
              style="background: #fee2e2; color: #991b1b; padding: 5px 14px; border-radius: 20px; font-size: 13px; font-weight: 500;"
            >
              {{ keyword }}
            </span>
          </div>
          <p v-else style="color: #16a34a; font-size: 14px;">
            Great! No missing keywords found.
          </p>
        </div>

        <!-- Strengths -->
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.75rem;">
          <h2 style="font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 1rem;">
            💪 Strengths
          </h2>
          <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.75rem;">
            <li
              v-for="strength in result.strengths"
              :key="strength"
              style="display: flex; align-items: flex-start; gap: 0.75rem; font-size: 14px; color: #374151;"
            >
              <span style="color: #16a34a; font-size: 16px; margin-top: 1px;">✓</span>
              {{ strength }}
            </li>
          </ul>
        </div>

        <!-- Suggestions -->
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.75rem;">
          <h2 style="font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 1rem;">
            💡 Suggestions
          </h2>
          <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.75rem;">
            <li
              v-for="suggestion in result.suggestions"
              :key="suggestion"
              style="display: flex; align-items: flex-start; gap: 0.75rem; font-size: 14px; color: #374151;"
            >
              <span style="color: #d97706; font-size: 16px; margin-top: 1px;">→</span>
              {{ suggestion }}
            </li>
          </ul>
        </div>

      </div>

      <!-- Experience Summary -->
      <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.75rem; margin-bottom: 1.5rem;">
        <h2 style="font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 1rem;">
          📋 Experience Summary
        </h2>
        <p style="color: #374151; font-size: 14px; line-height: 1.8;">
          {{ result.experienceSummary }}
        </p>
      </div>

      <!-- Meta Info -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; display: flex; gap: 2rem; flex-wrap: wrap;">
        <div>
          <p style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;">Model Used</p>
          <p style="font-size: 13px; color: #475569; font-weight: 500;">{{ result.modelUsed }}</p>
        </div>
        <div>
          <p style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;">Processing Time</p>
          <p style="font-size: 13px; color: #475569; font-weight: 500;">{{ result.processingTimeMs }}ms</p>
        </div>
        <div>
          <p style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;">Analyzed At</p>
          <p style="font-size: 13px; color: #475569; font-weight: 500;">{{ new Date(result.createdAt).toLocaleString() }}</p>
        </div>
      </div>

    </div>
  </div>
</template>
