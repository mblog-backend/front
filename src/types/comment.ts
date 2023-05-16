export interface CommentDTO {
  id: number
  userId: number
  content: string
  mentioned?: Array<string>
  memoId: number
  userName: string
  created: Date
  updated: Date
}

export interface QueryCommentResponse {
  total: number
  totalPage: number
  list: Array<CommentDTO>
}
