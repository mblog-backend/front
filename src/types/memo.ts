export interface MemoDTO {
  id: number
  userId: number
  content: string
  tags: string
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
