export interface SysConfig {
  CORS_DOMAIN_LIST: string
  DOMAIN: string
  OPEN_REGISTER: string
  QINIU_PARAM: string
  STORAGE_TYPE: string
  WEBSITE_TITLE: string
  MEMO_MAX_LENGTH: string
  INDEX_WIDTH: string
  USER_MODEL: string
  [k: string]: any
}

export interface OssStorage {
  accessKey: string
  secretKey: string
  bucket: string
  domain: string
  prefix: string
  suffix: string
}
