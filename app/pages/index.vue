<script setup>
const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  if (authStore.isLoggedIn) {
    router.push('/dashboard')
  }
})
</script>

<template>
  <div>

    <!-- Hero Section -->
    <section style="background: #0f172a; padding: 80px 2rem; text-align: center;">
      <div style="max-width: 800px; margin: 0 auto;">

        <div style="display: inline-block; background: #1e3a5f; color: #93c5fd; font-size: 13px; padding: 6px 16px; border-radius: 20px; margin-bottom: 1.5rem;">
          AI-Powered Resume Analysis
        </div>

        <h1 style="color: white; font-size: 48px; font-weight: 700; line-height: 1.2; margin-bottom: 1.5rem;">
          Analyze Your Resume<br/>
          <span style="color: #3b82f6;">Match Any Job</span>
        </h1>

        <p style="color: #94a3b8; font-size: 18px; line-height: 1.7; margin-bottom: 2.5rem; max-width: 600px; margin-left: auto; margin-right: auto;">
          Upload your PDF resume, paste a job description, and get an AI-powered compatibility score with actionable improvement suggestions.
        </p>

        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <NuxtLink
            to="/register"
            style="background: #1d4ed8; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;"
          >
            Get Started Free
          </NuxtLink>
          <NuxtLink
            to="/login"
            style="background: transparent; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; border: 1px solid #334155;"
          >
            Sign In
          </NuxtLink>
        </div>

      </div>
    </section>

    <!-- Features Section -->
    <section style="padding: 80px 2rem; background: white;">
      <div style="max-width: 1100px; margin: 0 auto;">

        <h2 style="text-align: center; font-size: 32px; font-weight: 700; color: #0f172a; margin-bottom: 3rem;">
          Everything you need to land your next job
        </h2>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">

          <!-- Feature 1 -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 2rem;">
            <div style="width: 48px; height: 48px; background: #dbeafe; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
              <span style="font-size: 24px;">📄</span>
            </div>
            <h3 style="font-size: 18px; font-weight: 600; color: #0f172a; margin-bottom: 0.75rem;">PDF Resume Parsing</h3>
            <p style="color: #64748b; font-size: 14px; line-height: 1.7;">
              Upload your PDF resume and our AI extracts skills, experience, and key information automatically.
            </p>
          </div>

          <!-- Feature 2 -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 2rem;">
            <div style="width: 48px; height: 48px; background: #dcfce7; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
              <span style="font-size: 24px;">🎯</span>
            </div>
            <h3 style="font-size: 18px; font-weight: 600; color: #0f172a; margin-bottom: 0.75rem;">Job Match Score</h3>
            <p style="color: #64748b; font-size: 14px; line-height: 1.7;">
              Paste any job description and get an instant compatibility score showing how well you match.
            </p>
          </div>

          <!-- Feature 3 -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 2rem;">
            <div style="width: 48px; height: 48px; background: #fce7f3; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
              <span style="font-size: 24px;">💡</span>
            </div>
            <h3 style="font-size: 18px; font-weight: 600; color: #0f172a; margin-bottom: 0.75rem;">AI Suggestions</h3>
            <p style="color: #64748b; font-size: 14px; line-height: 1.7;">
              Get specific, actionable suggestions to improve your resume and increase your match score.
            </p>
          </div>

          <!-- Feature 4 -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 2rem;">
            <div style="width: 48px; height: 48px; background: #ede9fe; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
              <span style="font-size: 24px;">🔍</span>
            </div>
            <h3 style="font-size: 18px; font-weight: 600; color: #0f172a; margin-bottom: 0.75rem;">Missing Keywords</h3>
            <p style="color: #64748b; font-size: 14px; line-height: 1.7;">
              Identify exactly which keywords from the job description are missing from your resume.
            </p>
          </div>

          <!-- Feature 5 -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 2rem;">
            <div style="width: 48px; height: 48px; background: #fef3c7; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
              <span style="font-size: 24px;">📊</span>
            </div>
            <h3 style="font-size: 18px; font-weight: 600; color: #0f172a; margin-bottom: 0.75rem;">Analysis History</h3>
            <p style="color: #64748b; font-size: 14px; line-height: 1.7;">
              Track all your resume analyses and see how your scores improve over time.
            </p>
          </div>

          <!-- Feature 6 -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 2rem;">
            <div style="width: 48px; height: 48px; background: #ccfbf1; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
              <span style="font-size: 24px;">🔒</span>
            </div>
            <h3 style="font-size: 18px; font-weight: 600; color: #0f172a; margin-bottom: 0.75rem;">Secure & Private</h3>
            <p style="color: #64748b; font-size: 14px; line-height: 1.7;">
              JWT authentication keeps your data secure. Your resume is only visible to you.
            </p>
          </div>

        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer style="padding: 1.5rem 2rem; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
      <p style="color: #94a3b8; font-size: 14px;">© 2026 Resume Analyzer. All rights reserved.</p>
    </footer>

    <!-- CTA Section -->
    <section style="padding: 80px 2rem; background: #0f172a; text-align: center;">
      <div style="max-width: 600px; margin: 0 auto;">
        <h2 style="color: white; font-size: 36px; font-weight: 700; margin-bottom: 1rem;">
          Ready to analyze your resume?
        </h2>
        <p style="color: #94a3b8; font-size: 16px; margin-bottom: 2rem;">
          Join thousands of job seekers who use AI to land their dream jobs.
        </p>
        <NuxtLink
          to="/register"
          style="background: #1d4ed8; color: white; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;"
        >
          Start for Free
        </NuxtLink>
      </div>
    </section>

  </div>
</template>

