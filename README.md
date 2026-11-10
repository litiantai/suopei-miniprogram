# 索赔售后微信小程序

员工查看指派给自己的车辆，快速填报维修结果；获授权的管理者查看看板、登记车辆、派工、验收并人工确认提车。后端来自 `litiantai/suopeiweb` 的 Hono API。

## 开发

```sh
npm ci --ignore-scripts
cp config.example.json config.local.json
# config.local.json 填写自己的 HTTPS API 公开地址
npm run build
```

微信开发者工具打开本目录，`project.config.json` 的 `miniprogramRoot` 为 `dist/`。已保留用户提供的 AppID。修改源文件后重新构建，不能直接修改 dist。数据库、OSS长期凭证、密码不放在小程序里；服务端私有配置统一保存在 Web 项目的 `application.yaml`。

`config.local.json` 只包含公开的客户端 API base，Git忽略该文件。正式网络需配置 request、uploadFile、downloadFile 合法域名；正式小程序不能只填公网IP。

## 接口契约

`contracts/openapi.json` 是后端发布的1.0.0契约快照，`src/generated/api.ts` 为生成结果。

```sh
# 从相邻 Web 仓库同步
npm run generate:api
# 独立仓库中更新契约
npm run generate:api -- /绝对路径/openapi.json
npm run check:contract -- contracts/openapi.json
npm run build
```

## 页面

- 登录：白名单账号密码、首次修改密码。
- 工作台：待处理、处理中、待验收、已处理；车辆搜索和分页。
- 车辆详情：指派改派、计划、维修内容与草稿、图片视频上传、索赔单PDF、附件预览下载、验收返工、提车确认和历史记录。
- 车辆登记：选施工类型及多个维修标签。
- 管理看板：1/7/30日、日期范围、当前/历史人员、维修方案筛选、六阶段、调漆件数及返工统计。

微信对文件保存、媒体播放、网络域名的限制需要开发者工具和真机验收。TypeScript构建通过不等同于微信审核或发布成功。暂未上传微信体验版或正式版。
