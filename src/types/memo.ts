export interface MemoDTO {
  id: number
  userId: number
  content: string
  tags?: string
  visibility: string
  status: string
  created: string
  updated: string
  authorName: string
  authorRole: string
  email: string
  bio: string
  priority: number
  commentCount: number
  unApprovedCommentCount: number
  likeCount: number
  enableComment: number
  viewCount: number
  liked: number
  source: string
  resources: Array<{
    publicId: string
    url: string
    fileType: string
    suffix: string
    storageType: string
    fileName: string
  }>
}

export type MemoInputDto = Partial<MemoDTO>

export interface ListMemoResponse {
  items: Array<MemoDTO>
  total: number
  totalPage: number
}

export interface MemoSearchParam {
  tag?: string
  userId?: number
  username?: string
  visibility?: string
  page: number
  size: number
  begin?: Date
  end?: Date
}

export interface MemoSaveParam {
  id?: number
  content?: string
  publicIds?: Array<string>
  visibility?: string
  priority?: number
  enableComment?: number | string
  deleteMemo?: boolean
}
export enum MemoVisibility {
  PUBLIC = '所有人可见',
  PROTECT = '登录用户可见',
  PRIVATE = '自己可见',
}

export const getVisbilityDesc = (value: string) => {
  return Object.entries(MemoVisibility).find(([key]) => key === value)?.[1]
}

export const getVisbilitys = () => {
  return Object.entries(MemoVisibility).map(([key, val]) => {
    return {
      label: val,
      value: key,
    }
  })
}

export interface StatisticsDTO {
  totalMemos: number
  totalDays: number
  totalTags: number
  items: Array<{
    date: string
    total: number
  }>
}
