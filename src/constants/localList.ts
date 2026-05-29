export interface LocalItem {
  name: string
  value: string
  code: string
}

export const localList: LocalItem[] = [
  { name: '서울', value: '서울', code: 'seoul' },
  { name: '경기/인천', value: '경기/인천', code: 'gyeonggi' },
  { name: '충청/강원', value: '충청/강원', code: 'chungcheong' },
  { name: '대구/경북', value: '대구/경북', code: 'daegu' },
  { name: '부산/경남', value: '부산/경남', code: 'busan' },
  { name: '광주/전라', value: '광주/전라', code: 'gwangju' },
  { name: '제주/기타', value: '제주/기타', code: 'jeju' },
]
