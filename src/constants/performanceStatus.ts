import { TAG_LABELS } from '@/constants/cardTag'
import type { StatusTagType } from '@/types/tag'

export interface PerformanceStatusItem {
  code: StatusTagType
  name: string
}

const STATUS_CODES: StatusTagType[] = ['upcomming', 'performing', 'done']

export const performanceStatusList: PerformanceStatusItem[] = STATUS_CODES.map((code) => ({
  code,
  name: TAG_LABELS[code],
}))
