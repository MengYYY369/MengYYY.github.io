# 教程 05 — 构建与部署

本教程介绍如何将 Fuwari 博客从本地开发到线上部署的完整流程。

---

## 前置条件

确保已安装以下工具：

| 工具 | 最低版本 | 检查命令 |
|------|:------:|----------|
| Node.js | 18+ | `node -v` |
| pnpm | 8+ | `pnpm -v` |

如果尚未安装 pnpm：

```bash
npm install -g pnpm
```

---

## 一、克隆与安装

```bash
# 克隆项目
git clone <你的仓库地址> my-blog
cd my-blog

# 安装依赖
pnpm install
```

---

## 二、本地开发

```bash
pnpm dev
```

- 开发服务器运行在 `http://localhost:4321`
- 文件修改后自动热更新（无需手动刷新）
- **草稿文章在开发模式下可见**，方便预览未完成的内容

---

## 三、检查代码

```bash
# TypeScript 类型检查
pnpm check

# 代码格式化
pnpm format
```

建议在构建前运行 `pnpm check` 确保没有类型错误。

---

## 四、生产构建

```bash
pnpm build
```

构建过程包括：

1. **Astro 构建** — 将所有页面编译为静态 HTML/CSS/JS
2. **Pagefind 索引** — 生成全文搜索索引
3. **站点地图** — 自动生成 `sitemap-index.xml`
4. **RSS** — 生成 `rss.xml`

构建产物输出到 `dist/` 目录。

> **注意**：生产构建会排除所有 `draft: true` 的文章。

---

## 五、本地预览生产构建

```bash
pnpm preview
```

这会启动一个本地服务器，预览 `dist/` 中的构建结果，和线上效果完全一致。**草稿文章不可见**。

---

## 六、部署方案

### 方案 A：Vercel（推荐，最简单）

Fuwari 默认配置了 Vercel 部署。

**步骤**：

1. 将代码推送到 GitHub 仓库
2. 访问 [vercel.com](https://vercel.com) 并登录
3. 点击「New Project」→ 导入你的 GitHub 仓库
4. Vercel 会自动识别 Astro 项目，**无需任何配置**
5. 点击「Deploy」

之后每次推送代码到 GitHub，Vercel 会自动重新构建和部署。

> 项目中的 `vercel.json` 已包含必要配置，无需手动修改。

### 方案 B：GitHub Pages

**步骤**：

1. 在 `astro.config.mjs` 中修改 `site` 和 `base`：

```js
export default defineConfig({
  site: "https://你的用户名.github.io",
  base: "/你的仓库名/",  // 如果仓库名是 用户名.github.io 则设为 "/"
  // ...
})
```

2. 创建 GitHub Actions 工作流文件 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"
      - run: pnpm install
      - run: pnpm build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

3. 在 GitHub 仓库 Settings → Pages 中，将 Source 设为 `gh-pages` 分支。

4. 推送代码，GitHub Actions 会自动构建并部署。

### 方案 C：Netlify

1. 将代码推送到 Git 仓库
2. 在 [Netlify](https://netlify.com) 导入仓库
3. 构建设置：
   - **Build command**: `pnpm build`
   - **Publish directory**: `dist`
4. 点击 Deploy

### 方案 D：Cloudflare Pages

1. 在 [Cloudflare Dashboard](https://dash.cloudflare.com/) → Workers & Pages
2. 连接 Git 仓库
3. 构建设置：
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist`
4. 部署

### 方案 E：自建服务器 / VPS

```bash
# 在服务器上构建
pnpm install
pnpm build

# 使用 Nginx 托管 dist/ 目录
# 或使用 pm2 + serve
npx serve dist -p 3000
```

Nginx 配置示例：

```nginx
server {
    listen 80;
    server_name 你的域名.com;
    root /path/to/my-blog/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ $uri.html =404;
    }
}
```

---

## 七、自定义域名

### Vercel

在项目 Settings → Domains 中添加你的域名，然后到域名 DNS 服务商添加 CNAME 记录指向 `cname.vercel-dns.com`。

### 通用步骤

1. 在部署平台绑定自定义域名
2. 在 DNS 服务商添加对应的解析记录
3. 等待 DNS 生效（通常几分钟到几小时）
4. 平台会自动申请 SSL 证书

---

## 八、SEO 优化建议

### 站点描述

在 `src/config.ts` 中配置 `description`：

```typescript
export const siteConfig: SiteConfig = {
  description: "一个关于前端开发、设计和生活的个人博客。",
}
```

### 文章级 SEO

每篇文章的 `description` 字段会自动生成为 `<meta description>`：

```markdown
---
description: 这篇详细介绍了如何使用 Astro 构建博客……
---
```

### 自动生成的内容

Fuwari 构建时自动生成以下 SEO 相关文件：

| 文件 | 作用 |
|------|------|
| `sitemap-index.xml` | 站点地图，提交给搜索引擎 |
| `sitemap-0.xml` | 文章页面地图 |
| `rss.xml` | RSS 订阅源 |
| `robots.txt` | 爬虫规则 |

### 提交到搜索引擎

构建部署后，将站点地图提交到搜索引擎：

- **Google**: [Google Search Console](https://search.google.com/search-console) → 添加 `sitemap-index.xml`
- **Bing**: [Bing Webmaster Tools](https://www.bing.com/webmasters) → 添加站点地图
- **百度**: [百度搜索资源平台](https://ziyuan.baidu.com/) → 添加站点地图

---

## 九、常见问题

### Q: 修改配置后不生效？

```bash
# 重启开发服务器
# Ctrl+C 停止，然后重新运行：
pnpm dev
```

### Q: 构建报错？

```bash
# 先运行类型检查查看具体错误
pnpm check

# 清理缓存重新构建
rm -rf dist .astro node_modules
pnpm install
pnpm build
```

### Q: 草稿文章在线上还能看到？

检查 frontmatter 中 `draft` 是否为 `true`（不是字符串 `"true"`，是布尔值 `true`）。

### Q: 搜索功能不工作？

搜索索引在 `pnpm build` 时生成。确保运行了完整的构建命令而不是只运行 `astro build`。

### Q: 图片不显示？

检查图片路径规则（参见教程 01）。

---

## 命令速查表

| 命令 | 作用 |
|------|------|
| `pnpm install` | 安装依赖 |
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 生产构建 |
| `pnpm preview` | 预览生产构建 |
| `pnpm check` | TypeScript 类型检查 |
| `pnpm format` | 代码格式化 |
| `pnpm new-post <名称>` | 创建新文章 |

---

## 教程总结

你已经完成了 Fuwari 博客的全部教程：

| 教程 | 内容 |
|:----:|------|
| 01 | 添加文章 — 三种创建方式、frontmatter 字段详解 |
| 02 | 管理文章 — 编辑、删除、草稿、批量操作 |
| 03 | 站点配置 — 基本信息、主题、导航、个人资料 |
| 04 | Markdown 扩展 — 警告框、数学公式、代码增强 |
| 05 | 构建部署 — 本地开发、Vercel/Pages/自建部署 |

祝你博客之旅愉快！🎉
