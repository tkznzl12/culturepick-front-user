export type TagType =
  | 'musical'
  | 'play'
  | 'classic'
  | 'koreanMusic'
  | 'concert'
  | 'dancing'
  | 'upcomming'
  | 'performing'
  | 'done'

export type GenreTagType = Exclude<TagType, 'upcomming' | 'performing' | 'done'>
export type StatusTagType = Extract<TagType, 'upcomming' | 'performing' | 'done'>
