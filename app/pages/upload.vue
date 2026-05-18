<script setup>
definePageMeta({
  middleware: 'auth'
})

const api = useApi()
const router = useRouter()

const file = ref(null)
const jobDescription = ref('')
const isUploading = ref(false)
const error = ref('')
const dragOver = ref(false)

const handleFileSelect = (event) => {
  const selected = event.target.files[0]
  if (selected) {
    if (selected.type !== 'application/pdf') {
      error.value = 'Please upload a PDF file only'
      return
    }
    if (selected.size > 10 * 1024 * 1024) {
      error.value = 'File size must be less than 10MB'
      return
    }
    file.value = selected
    error.value = ''
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  dragOver.value = false
  const dropped = event.dataTransfer.files[0]
  if (dropped) {
    if (dropped.type !== 'application/pdf') {
      error.value = 'Please upload a PDF file only'
      return
    }
    file.value = dropped
    error.value = ''
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
  dragOver.value = true
}

const handleDragLeave = () => {
  dragOver.value = false
}

const removeFile = () => {
  file.value = null
}

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const handleUpload = async () => {
  if (!file.value) {
    error.value = 'Please select a PDF file'
    return
  }

  isUploading.value = true
  error.value = ''

  try {
    const response = await api.uploadResume(
      file.value,
      jobDescription.value || null
    )

    if (response.success) {
      router.push(`/results/${response.data.id}`)
    }
  } catch (err) {
    error.value = err?.data?.message || 'Upload failed. Please try again.'
  } finally {
    isUploading.value = false
  }
}
</script>

<template>
  <div style="max-width: 800px; margin: 0 auto; padding: 3rem 2rem;">

    <!-- Page Header -->
    <div style="margin-bottom: 2rem;">
      <h1 style="font-size: 28px; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem;">
        Upload Resume
      </h1>
      <p style="color: #64748b; font-size: 15px;">
        Upload your PDF resume and optionally paste a job description for a compatibility score.
      </p>
    </div>

    <!-- Error -->
    <div v-if="error" style="background: #fee2e2; border: 1px solid #fecaca; color: #b91c1c; padding: 12px 16px; border-radius: 8px; font-size: 14px; margin-bottom: 1.5rem;">
      {{ error }}
    </div>

    <!-- Upload Card -->
    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 2rem; margin-bottom: 1.5rem;">

      <h2 style="font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 1.25rem;">
        Resume PDF
      </h2>

      <!-- Drop Zone -->
      <div
        v-if="!file"
        @drop="handleDrop"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        :style="{
          border: dragOver ? '2px dashed #1d4ed8' : '2px dashed #cbd5e1',
          borderRadius: '12px',
          padding: '3rem 2rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragOver ? '#eff6ff' : '#f8fafc',
          transition: 'all 0.2s'
        }"
        @click="$refs.fileInput.click()"
      >
        <div style="font-size: 40px; margin-bottom: 1rem;">📄</div>
        <p style="font-size: 15px; font-weight: 500; color: #0f172a; margin-bottom: 0.5rem;">
          Drag and drop your PDF here
        </p>
        <p style="font-size: 13px; color: #64748b; margin-bottom: 1rem;">
          or click to browse files
        </p>
        <span style="background: #1d4ed8; color: white; padding: 8px 20px; border-radius: 6px; font-size: 13px; font-weight: 500;">
          Choose File
        </span>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 1rem;">
          PDF files only • Max 10MB
        </p>
      </div>

      <!-- File Selected -->
      <div
        v-else
        style="border: 1px solid #bbf7d0; background: #f0fdf4; border-radius: 12px; padding: 1.25rem; display: flex; align-items: center; justify-content: space-between;"
      >
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 44px; height: 44px; background: #dcfce7; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 20px;">📄</span>
          </div>
          <div>
            <p style="font-size: 14px; font-weight: 600; color: #166534; margin-bottom: 2px;">
              {{ file.name }}
            </p>
            <p style="font-size: 12px; color: #16a34a;">
              {{ formatFileSize(file.size) }} • PDF
            </p>
          </div>
        </div>
        <button
          @click="removeFile"
          style="background: transparent; border: none; color: #64748b; cursor: pointer; font-size: 18px; padding: 4px;"
        >
          ✕
        </button>
      </div>

      <!-- Hidden file input -->
      <input
        ref="fileInput"
        type="file"
        accept=".pdf"
        @change="handleFileSelect"
        style="display: none;"
      />

    </div>

    <!-- Job Description Card -->
    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 2rem; margin-bottom: 1.5rem;">

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <h2 style="font-size: 16px; font-weight: 600; color: #0f172a;">
          Job Description
        </h2>
        <span style="background: #f1f5f9; color: #64748b; font-size: 11px; padding: 3px 10px; border-radius: 20px;">
          Optional
        </span>
      </div>

      <p style="color: #64748b; font-size: 13px; margin-bottom: 1rem;">
        Paste the job description to get a compatibility score and see which keywords are missing.
      </p>

      <textarea
        v-model="jobDescription"
        placeholder="Paste the job description here...&#10;&#10;Example: We are looking for a Senior Java Developer with experience in Spring Boot, Kubernetes, AWS and Microservices architecture..."
        rows="8"
        style="width: 100%; padding: 12px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; color: #0f172a; resize: vertical; font-family: inherit; outline: none;"
      />

      <p style="font-size: 12px; color: #94a3b8; margin-top: 0.5rem;">
        {{ jobDescription.length }} characters
      </p>

    </div>

    <!-- Upload Button -->
    <button
      @click="handleUpload"
      :disabled="isUploading || !file"
      :style="{
        width: '100%',
        background: isUploading || !file ? '#94a3b8' : '#1d4ed8',
        color: 'white',
        border: 'none',
        padding: '14px',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: isUploading || !file ? 'not-allowed' : 'pointer'
      }"
    >
      {{ isUploading ? 'Uploading & Analyzing...' : 'Upload & Analyze Resume' }}
    </button>

    <p style="text-align: center; color: #94a3b8; font-size: 13px; margin-top: 1rem;">
      Analysis typically takes 2-5 seconds
    </p>

  </div>
</template>
