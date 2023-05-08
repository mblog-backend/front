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
  authorId: number
  resources: Array<{
    publicId: string
    url: string
    fileType: string
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
  visibility?: string
  page: number
  size: number
}

export enum MemoVisibility {
  PUBLIC = '所有人可见',
  PROTECTED = '登录用户可见',
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
