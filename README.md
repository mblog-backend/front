# mblog-front

前后分离的微博平台前端

[服务端地址](https://github.com/kingwrcy/mblog-backend)

支持的功能如下:

大体功能如下:

- 基本的文字/图片输入,支持标签
- 支持对历史博文/标签修改
- 支持单/多用户,支持开启/关闭注册
- 支持博可见性, 登录用户/所有人/只有自己 可见
- 支持按照标签,作者等条件搜索
- 支持标签管理(**一键改标签**,删除无用标签等)
- 支持上传图片(目前支持本地文件存储和七牛云,后续继续添加阿里云/腾讯云等)
- 支持开发者使用 api token
- 响应式设计,支持 pc 和手机
- 支持 RSS
- 支持 markdown 语法
- 前后端分离,前端和后端域名可以不一致,可以后端部署在 nas 上,前端部署在 cdn.
- ...更多特性等待开发

# 部署

支持 Docker 部署和 CDN 部署,详情见[这里](https://github.com/kingwrcy/mblog-backend)

# 本地开发

```
git clone https://github.com/kingwrcy/mblog-front
yarn
yarn dev
```
