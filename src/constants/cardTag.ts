import type { TagType } from '@/types/tag'

export const TAG_LABELS: Record<TagType, string> = {
  musical: '뮤지컬',
  play: '연극',
  classic: '서양음악(클래식)',
  koreanMusic: '한국음악(국악)',
  concert: '대중음악',
  dancing: '무용(서양/한국무용)',
  upcomming: '공연예정',
  performing: '공연중',
  done: '공연완료',
}

export function getTagLabel(tag: TagType): string {
  return TAG_LABELS[tag] ?? tag
}
