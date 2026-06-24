import { buildApiUrl } from '@/api/index'
import {
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
} from '@/utils/auth-cookie'
import {
  getCurrentPathWithQueryAndHash,
} from '@/utils/auth-redirect'
import { handleUnauthorizedAccess } from '@/utils/auth-session'

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    throw new Error('Refresh token이 없습니다.')
  }

  try {
    const response = await fetch(buildApiUrl('/api/v1/auth/token/refresh/'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw data
    }

    setAuthCookies(data.access, data.refresh)
    return data as { access: string; refresh: string }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  let token = getAccessToken()

  let response = await fetch(buildApiUrl(endpoint), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
  })

  if (response.status === 401) {
    try {
      const refreshData = await refreshAccessToken()
      token = refreshData.access

      response = await fetch(buildApiUrl(endpoint), {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...(options?.headers || {}),
        },
      })
    } catch (error) {
      console.error(error)
      handleUnauthorizedAccess(getCurrentPathWithQueryAndHash())
    }
  }

  if (response.status === 401) {
    handleUnauthorizedAccess(getCurrentPathWithQueryAndHash())
  }

  const data = await response.json()

  if (!response.ok) {
    throw data
  }

  return data
}
