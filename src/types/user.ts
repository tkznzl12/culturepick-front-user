/**
 * 사용자(User) 도메인 타입 정의
 * TODO: API 연동 시 요청/응답 스키마 확장
 */

export type UserProfile = {
  id: string | number
  nickname: string
  email: string
}
