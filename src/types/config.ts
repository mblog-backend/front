export interface SysConfig {
  CORS_DOMAIN_LIST: string
  DOMAIN: string
  OPEN_REGISTER: boolean
  QINIU_PARAM: string
  STORAGE_TYPE: string
  WEBSITE_TITLE: string
  [k: string]: any
}

export interface OssStorage {
  accessKey: string
  secretKey: string
  bucket: string
  domain: string
  prefix: string
}
