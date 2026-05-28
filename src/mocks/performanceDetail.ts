import type { PerformanceDetailData } from '@/types/performanceDetail'

export const mockData: PerformanceDetailData = {
  title: '피노키오 [수원]',
  genre: 'musical',
  start_date: '2026-06-20',
  end_date: '2026-06-20',

  status: '공연예정',

  cast: '김성준, 안명주, 유지훈, 이효주, 우다연 등',
  crew: '이현진, 노태호, 이주경',
  runtime: '1시간',

  age_rating: '24개월 이상',

  pirce_info: '사전예약 15,000원',

  poster_url: 'http://www.kopis.or.kr/upload/pfmPoster/PF_PF289708_260420_120342.jpg',

  bookingLink: [
    {
      url: 'http://www.ticketlink.co.kr/product/14015',
      sitename: '티켓링크',
    },
  ],
  local: '서울',
  venues: '블루스퀘어 신한카드홀',
  story:
    '프랑스 소설가 빅토르 위고의 동명 소설을 원작으로 한 뮤지컬. 혁명의 시대를 살아가는 인물들의 이야기를 통해 자유, 사랑, 희생에 대한 메시지를 전합니다. 세계적으로 사랑받는 작품으로 국내 최대 규모의 무대 위에서 펼쳐집니다.',
}

