let naverMapLoadPromise: Promise<any> | null = null

const NAVER_MAP_SCRIPT_ID = 'naver-map-sdk'

function getSdkUrl(clientId: string): string {
  return `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`
}

export function loadNaverMap(): Promise<any> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Naver Map can only be loaded in browser environment.'))
  }

  if (window.naver?.maps) {
    return Promise.resolve(window.naver)
  }

  if (naverMapLoadPromise) {
    return naverMapLoadPromise
  }

  const NAVER_MAP_CLIENT_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_ID
  if (!NAVER_MAP_CLIENT_ID) {
    return Promise.reject(new Error('VITE_NAVER_MAP_CLIENT_ID is not defined.'))
  }

  naverMapLoadPromise = new Promise((resolve, reject) => {
    const onSdkLoaded = () => {
      if (!window.naver?.maps) {
        naverMapLoadPromise = null
        reject(new Error('Naver Map SDK is loaded, but window.naver.maps is unavailable.'))
        return
      }
      resolve(window.naver)
    }

    const existingScript = document.getElementById(NAVER_MAP_SCRIPT_ID) as HTMLScriptElement | null
    if (existingScript) {
      if (window.naver?.maps) {
        onSdkLoaded()
        return
      }

      existingScript.addEventListener('load', onSdkLoaded, { once: true })
      existingScript.addEventListener(
        'error',
        () => {
          naverMapLoadPromise = null
          reject(new Error('Failed to load Naver Map SDK script.'))
        },
        { once: true },
      )
      return
    }

    const script = document.createElement('script')
    script.id = NAVER_MAP_SCRIPT_ID
    script.src = getSdkUrl(NAVER_MAP_CLIENT_ID)
    script.async = true

    script.addEventListener('load', onSdkLoaded, { once: true })
    script.addEventListener(
      'error',
      () => {
        naverMapLoadPromise = null
        reject(new Error('Failed to load Naver Map SDK script.'))
      },
      { once: true },
    )

    document.head.appendChild(script)
  })

  return naverMapLoadPromise
}
