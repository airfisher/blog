# Airfisher 的个人博客

使用 Astro 和 Markdown 构建的静态博客，托管于 Cloudflare Pages。

## 本地运行

需要 Node.js 22.22.1（见 `.nvmrc`）。

```sh
npm ci
npm run dev
```

打开 http://localhost:4321 。验证和构建：

```sh
npm run check
npm run build
npm run preview
```

## 写文章

在 `src/content/posts/` 新建 Markdown 文件，文件名就是文章路径，例如 `my-first-post.md` 对应 `/posts/my-first-post/`。

```md
---
title: '文章标题'
description: '文章摘要'
date: 2026-09-28
tags: ['技术']
draft: false
---

正文从这里开始。
```

`draft: true` 的文章不会出现在站点、RSS 或站点地图中。日期用于排序，不用于定时发布。`hello-world.md` 是可删除或替换的示例文章。

修改 `src/site.ts` 可更新博客名称和简介；页面布局使用 Tailwind CSS 工具类；浅色／深色配色和 Markdown 排版位于 `src/styles/global.css`。

导航栏的太阳／月亮按钮用于切换主题。首次访问跟随系统设置，手动选择会保存在浏览器中，刷新和跳转页面后继续生效。主题在页面绘制前应用，代码高亮也随主题切换。

## GitHub

远端仓库：git@github.com:airfisher/blog.git

默认分支：`main`。GitHub Actions 在提交和 PR 时执行类型检查和构建。

## Cloudflare Pages 部署

1. 登录 Cloudflare，进入 Workers & Pages，创建 Pages 项目并连接 GitHub 仓库 `airfisher/blog`。
2. 生产分支设为 `main`，框架选择 Astro。
3. 构建命令为 `npm run build`，输出目录为 `dist`，根目录保持仓库根目录。
4. 添加生产环境变量 `SITE_URL`，值为最终访问地址，例如 `https://你的项目名.pages.dev`。自定义域名启用后改成该域名并重新部署。
5. Node 版本由 `.nvmrc` 指定；也可设置 `NODE_VERSION=22.22.1`。
6. 保存并部署。后续推送 `main` 会触发 Cloudflare 自动发布。

不设置 `SITE_URL` 时，Cloudflare 构建使用 `CF_PAGES_URL`，本地构建使用 `http://localhost:4321`。正式上线请固定生产地址，让 canonical、RSS 和 sitemap 使用同一域名。无需 Cloudflare SSR 适配器或数据库。

本地验证生产地址可运行：

```sh
SITE_URL=https://你的域名 npm run build
```

不要将账号令牌或 `.env` 文件提交到公开仓库。

部署参考：https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
