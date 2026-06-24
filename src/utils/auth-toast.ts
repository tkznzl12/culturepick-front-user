export const AUTH_TOAST_EVENT = 'auth-required-toast'

type AuthToastDetail = {
  message: string
}

export function showAuthRequiredToast(message: string): void {
  window.dispatchEvent(
    new CustomEvent<AuthToastDetail>(AUTH_TOAST_EVENT, {
      detail: { message },
    }),
  )
}
