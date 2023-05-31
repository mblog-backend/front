export interface User {
  id: number
  username: string
  email: string
  displayName: string
  bio: string
  created: string
  updated: string
  role: string
  avatarUrl: string
  defaultVisibility: string
  defaultEnableComment: string
}

export interface RegisterUserDTO {
  username: string
  password: string
  repeatPassword: string
  displayName: string
  bio: string
  email: string
}
