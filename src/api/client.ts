import { getAccessToken } from '@/utils/auth-cookie'

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

const refreshAccessToken = async () => {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
  })

  const data = await response.json()

  if (!response.ok) {
    throw data
  }

  return data as { accessToken: string }
}

export async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  let token = getAccessToken()

  let response = await fetch(`${BASE_URL}${endpoint}`, {
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
      token = refreshData.accessToken

      response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...(options?.headers || {}),
        },
      })
    } catch (error) {
      window.location.href = '/login'
      throw error
    }
  }

  const data = await response.json()

  if (!response.ok) {
    throw data
  }

  return data
}
