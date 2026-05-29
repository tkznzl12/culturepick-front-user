export interface GenreItem {
  name: string
  code: string
  icon: string
}

/** 장르 필터 · 목록 헤더의 「전체」 아이콘 */
export const GENRE_ALL_ICON = '🎭'

export const genreList: GenreItem[] = [
  { name: '뮤지컬', code: 'musical', icon: '🎵' },
  { name: '연극', code: 'play', icon: '🎬' },
  { name: '클래식', code: 'classic', icon: '🎻' },
  { name: '국악', code: 'koreanMusic', icon: '🪈' },
  { name: '콘서트', code: 'concert', icon: '🎤' },
  { name: '무용/기타', code: 'dancing', icon: '💃' },
]

export function findGenreByCode(code: string): GenreItem | undefined {
  return genreList.find((genre) => genre.code === code)
}
