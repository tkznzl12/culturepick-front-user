<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { socialLogin } from '@/api/auth'
import { SiteRouter } from '@/constants/routes'
import type { OAuthProvider, SocialLoginRequest } from '@/types/auth'
import { clearAuthCookies, setAuthCookies } from '@/utils/auth-cookie'
import { clearNaverOAuthState, getNaverOAuthState } from '@/utils/oauth'

const props = defineProps<{
  provider: OAuthProvider
}>()

const route = useRoute()
const router = useRouter()

const getCodeFromQuery = () => {
  const code = route.query.code
  if (typeof code !== 'string' || !code) {
    throw new Error('OAuth authorization code가 없습니다.')
  }

  return code
}

const validateNaverState = () => {
  const state = route.query.state
  if (typeof state !== 'string' || !state) {
    throw new Error('Naver OAuth state가 없습니다.')
  }

  const storedState = getNaverOAuthState()
  if (!storedState || storedState !== state) {
    throw new Error('Naver OAuth state 검증에 실패했습니다.')
  }

  clearNaverOAuthState()
  return state
}

const handleOAuthCallback = async () => {
  const providerError = route.query.error
  if (typeof providerError === 'string' && providerError) {
    throw new Error(`OAuth Provider 인증이 거부되었습니다: ${providerError}`)
  }

  const code = getCodeFromQuery()
  const requestData: SocialLoginRequest = {
    provider: props.provider,
    code,
    redirect_uri: `${window.location.origin}/auth/callback/${props.provider}`,
  }

  if (props.provider === 'naver') {
    requestData.state = validateNaverState()
  }

  const response = await socialLogin(requestData)
  setAuthCookies(response.access, response.refresh)
  await router.push(SiteRouter.index)
}

onMounted(async () => {
  try {
    await handleOAuthCallback()
  } catch (error) {
     console.error('OAuth Error:', error)

    debugger

    if (props.provider === 'naver') {
      clearNaverOAuthState()
    }

    clearAuthCookies()
    await router.push(SiteRouter.login)
  }
})
</script>

<template>
  <div />
</template>
