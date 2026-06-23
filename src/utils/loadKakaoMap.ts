let kakaoMapLoadPromise: Promise<any> | null = null

const KAKAO_SCRIPT_ID = 'kakao-map-sdk'

function getSdkUrl(appKey: string): string {
  return `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${appKey}&libraries=services`
}

export function loadKakaoMap(): Promise<any> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Kakao Map can only be loaded in browser environment.'))
  }

  if (window.kakao?.maps) {
    return new Promise((resolve) => {
      window.kakao.maps.load(() => resolve(window.kakao))
    })
  }

  if (kakaoMapLoadPromise) {
    return kakaoMapLoadPromise
  }

  const appKey = import.meta.env.VITE_KAKAO_MAP_KEY
  if (!appKey) {
    return Promise.reject(new Error('VITE_KAKAO_MAP_KEY is not defined.'))
  }

  kakaoMapLoadPromise = new Promise((resolve, reject) => {
    const onKakaoReady = () => {
      if (!window.kakao?.maps) {
        kakaoMapLoadPromise = null
        reject(new Error('Kakao Map SDK is loaded, but window.kakao.maps is unavailable.'))
        return
      }

      window.kakao.maps.load(() => resolve(window.kakao))
    }

    const existingScript = document.getElementById(KAKAO_SCRIPT_ID) as HTMLScriptElement | null
    if (existingScript) {
      existingScript.addEventListener('load', onKakaoReady, { once: true })
      existingScript.addEventListener(
        'error',
        () => {
          kakaoMapLoadPromise = null
          reject(new Error('Failed to load Kakao Map SDK script.'))
        },
        { once: true },
      )
      return
    }

    const script = document.createElement('script')
    script.id = KAKAO_SCRIPT_ID
    script.src = getSdkUrl(appKey)
    script.async = true

    script.addEventListener('load', onKakaoReady, { once: true })
    script.addEventListener(
      'error',
      () => {
        kakaoMapLoadPromise = null
        reject(new Error('Failed to load Kakao Map SDK script.'))
      },
      { once: true },
    )

    document.head.appendChild(script)
  })

  return kakaoMapLoadPromise
}
