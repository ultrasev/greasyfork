# Userscripts

油猴脚本，部署在 Cloudflare Pages。

## 如何工作

1. 编辑 `public/*.user.js` 中的脚本
2. 脚本版本号 `@version` +1
3. 推送到 GitHub
4. Cloudflare Pages 自动部署
5. Greasy Fork 从 URL 自动同步更新

## 脚本列表

| 脚本 | 部署 URL |
|------|----------|
| goto_xueqiu | `https://greasyfork.tpz.works.dev/goto_xueqiu.user.js` |

## 添加新脚本

1. 将 `.user.js` 文件放到 `public/` 目录
2. 确保头部包含 `@name`、`@version`、`@match`
3. 更新 `public/index.html` 添加脚本入口
4. 推送到 GitHub，Cloudflare Pages 自动部署

## Cloudflare Pages 设置（一次性）

### 连接 Git 仓库

1. 打开 https://dash.cloudflare.com/ → Pages
2. 创建项目 → 连接到 Git
3. 选择 `greasyfork` 仓库
4. 构建设置：
   - 构建命令：留空
   - 构建输出目录：`public`
5. 部署

### 配置 Greasy Fork 同步 URL（每个脚本一次）

1. Greasy Fork 打开脚本 → 编辑 → 从外部 URL 更新
2. 输入：`https://greasyfork.tpz.works.dev/<脚本名>.user.js`
3. 保存 — 以后推送自动同步
