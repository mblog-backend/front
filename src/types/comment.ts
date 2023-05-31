export interface CommentDTO {
  id: number
  userId: number
  content: string
  mentioned: string
  mentionedUserId: string
  memoId: number
  userName: string
  created: Date
  updated: Date
  email: string
  link: string
  approved: number
}

export interface QueryCommentResponse {
  total: number
  totalPage: number
  list: Array<CommentDTO>
}
