export interface CommunityPostApiItem {
  id: number
  author: number
  author_email: string
  author_nickname: string
  author_display_name: string
  category: string
  category_label: string
  title: string
  content: string
  content_format: string
  thumbnail_url: string
  view_count: number
  comment_count: number
  created_at: string
  updated_at: string
}

export type CommunityApiCategory =
  | 'performance_review'
  | 'performance_recommendation'
  | 'information'
  | 'free_discussion'

export interface CommunityPostsParams {
  category?: string
  keyword?: string
  page?: number
  pageSize?: number
}

export interface CommunityPostListItem {
  id: number
  category: string
  categoryLabel: string
  title: string
  contentPreview: string
  authorDisplayName: string
  commentCount: number
  createdAt: string
}

export interface CommunityPostDetailItem {
  id: number
  authorId: number
  category: string
  categoryLabel: string
  title: string
  content: string
  contentFormat: string
  authorDisplayName: string
  commentCount: number
  viewCount: number
  createdAt: string
}

export interface CommunityPostsResponse {
  items: CommunityPostListItem[]
  totalCount: number
  page: number
  pageSize: number
}

export interface CommunityPostDetailResponse extends CommunityPostApiItem {}

export interface CreateCommunityPostRequest {
  category: CommunityApiCategory
  title: string
  content: string
  content_format: 'html'
  thumbnail_url?: string
}

export interface CreateCommunityPostResponse extends CommunityPostApiItem {}

export interface UpdateCommunityPostRequest {
  category?: CommunityApiCategory
  title?: string
  content?: string
  content_format?: 'html'
}

export interface CommunityImageUploadResponse {
  id: number
  image_url: string
  original_name: string
  size: number
  content_type: string
  created_at: string
}

export interface CommunityPostsApiResponse {
  count?: number
  total?: number
  total_count?: number
  totalCount?: number
  page?: number
  pageNum?: number
  page_num?: number
  pageSize?: number
  page_size?: number
  next?: string | null
  previous?: string | null
  results?: CommunityPostApiItem[]
}

export interface CommunityCommentApiItem {
  id: number
  post: number
  author: number
  author_email: string
  author_nickname: string
  author_display_name: string
  content: string
  created_at: string
  updated_at: string
}

export interface CommunityCommentItem {
  id: number
  postId: number
  authorId: number
  authorDisplayName: string
  content: string
  createdAt: string
}

export interface CommunityCommentsApiResponse {
  total: number
  next: string | null
  previous: string | null
  results: CommunityCommentApiItem[]
}
