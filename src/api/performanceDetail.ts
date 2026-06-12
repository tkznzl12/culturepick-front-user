import { fetcher } from '@/api/client'
import { ApiEndpoints } from '@/constants/api'
import { TAG_LABELS } from '@/constants/cardTag'
import { genreList } from '@/constants/genreList'
import type {
  BookingLink,
  PerformanceActionRequest,
  PerformanceActionResponse,
  PerformanceDetailApiResponse,
  PerformanceDetailData,
  PerformanceDetailVenue,
} from '@/types/performanceDetail'

const GENRE_CODES = new Set<string>(genreList.map((genre) => genre.code))

function mapGenreToCode(genre: string): string {
  if (GENRE_CODES.has(genre)) return genre

  const matchedByName = genreList.find((item) => item.name === genre)
  if (matchedByName) return matchedByName.code

  const matchedByLabel = Object.entries(TAG_LABELS).find(
    ([code, label]) => label === genre && GENRE_CODES.has(code),
  )
  return matchedByLabel ? matchedByLabel[0] : genre
}

function normalizeVenue(venue: PerformanceDetailVenue | undefined): PerformanceDetailVenue {
  return {
    venue_id: venue?.venue_id ?? '',
    name: venue?.name ?? '',
    sido: venue?.sido ?? '',
    gugun: venue?.gugun ?? '',
    address: venue?.address ?? '',
  }
}

function normalizeBookingLinks(links: BookingLink[] | undefined): BookingLink[] {
  return (links ?? [])
    .filter((link) => Boolean(link?.url))
    .map((link) => ({
      url: link.url,
      sitename: link.sitename ?? link.site_name ?? '',
      site_name: link.site_name ?? link.sitename ?? '',
    }))
}

function mapPerformanceDetail(item: PerformanceDetailApiResponse): PerformanceDetailData {
  const venue = normalizeVenue(item.venue)
  const bookingLinks = normalizeBookingLinks(item.booking_links)

  return {
    performance_id: item.performance_id,
    title: item.title,
    genre: mapGenreToCode(item.genre),
    start_date: item.start_date,
    end_date: item.end_date,
    status: item.status,
    cast: item.cast ?? '',
    crew: item.crew ?? '',
    runtime: item.runtime ?? '',
    age_rating: item.age_rating ?? '',
    synopsis: item.synopsis ?? '',
    story: item.synopsis ?? '',
    price_info: item.price_info ?? '',
    pirce_info: item.price_info ?? '',
    schedule_info: item.schedule_info ?? '',
    poster_url: item.poster_url ?? '',
    view_count: item.view_count ?? 0,
    zzim_count: item.zzim_count ?? 0,
    venue,
    venues: venue.name ?? '',
    local: venue.sido ?? '',
    images: item.images ?? [],
    booking_links: bookingLinks,
    bookingLink: bookingLinks,
    is_interested: Boolean(item.is_interested),
    is_watchlisted: Boolean(item.is_watchlisted),
  }
}

export async function fetchPerformanceDetail(id: string): Promise<PerformanceDetailData> {
  const response = await fetcher<PerformanceDetailApiResponse>(
    ApiEndpoints.performanceDetail(id),
  )

  return mapPerformanceDetail(response)
}

export async function postPerformanceAction(
  performanceId: string,
  payload: PerformanceActionRequest,
): Promise<PerformanceActionResponse> {
  return fetcher<PerformanceActionResponse>(ApiEndpoints.performanceActions(performanceId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
