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

`contracts/openapi.json` 是后端发布的1.1.0契约快照，`src/generated/api.ts` 为生成结果。

```sh
# 从相邻 Web 仓库同步
npm run generate:api
# 独立仓库中更新契约
npm run generate:api -- /绝对路径/openapi.json
npm run check:contract -- contracts/openapi.json
npm run build
```

## 页面

- 登录：微信一键登录，首次登录填写姓名并等待主管开通；员工无需设置平台密码。
- 工作台：待处理、处理中、待验收、已处理；车辆搜索和分页。
- 车辆详情：指派改派、计划、维修内容与草稿、图片视频上传、索赔单PDF、附件预览下载、验收返工、提车确认和历史记录。
- 车辆登记：选施工类型及多个维修标签。
- 管理看板：1/7/30日、日期范围、当前/历史人员、维修方案筛选、六阶段、调漆件数及返工统计。

构建先检查 WXML 表达式和 WXSS 选择器；macOS 安装微信开发者工具时自动调用工具内的 `wcc` / `wcsc`，编译全部页面模板及样式。可运行 `npm run check:templates -- --native` 强制要求原生编译器；其他环境的静态检查不代替微信编译。

2026-11-10 已在微信开发者工具验证登录页正常启动，修复了 WXSS 通配符选择器和 WXML 表达式实体转义导致的编译错误。微信对文件保存、媒体播放、网络域名的限制仍需真机验收；登录及业务操作需要配置可访问的正式 API。暂未上传微信体验版或正式版。

## 正式接入

当前 API 为 `https://suopei.litiantai.top/api/v1`，写入本地 `config.local.json` 后构建。微信后台需配置 request 合法域名 `https://suopei.litiantai.top`，uploadFile 和 downloadFile 合法域名 `https://suopei-oss.oss-cn-beijing.aliyuncs.com`。若平台要求备案或绑定自定义 OSS 域名，应先完成官方要求。保持域名校验开启，配置后在开发工具刷新域名信息并重新编译。

微信登录由服务端用 AppSecret 换取 OpenID，同一 AppID 下复用员工身份；不接受客户端直接提交 OpenID。新账号处于待开通状态，仅能维护自己的申请姓名、刷新状态和退出。主管在 Web「人员与权限」确认姓名、选择角色、启用账号后才可执行业务；已停用员工不能重新登录获取业务权限。Web 管理员保留密码登录。
