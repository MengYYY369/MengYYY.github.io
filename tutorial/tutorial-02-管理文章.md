# 教程 02 — 管理文章

本教程涵盖编辑、删除、草稿管理以及文章组织等日常操作。

---

## 编辑文章

### 直接编辑文件

文章就是普通的 Markdown 文件，用任何文本编辑器打开即可编辑。推荐 VS Code，因为项目配置了 [Front Matter CMS](https://frontmatter.codes/) 支持。

```bash
# 以 VS Code 打开项目
code .
```

然后导航到 `src/content/posts/` 找到要编辑的文章。

### 编辑时可实时预览

```bash
pnpm dev
```

开发服务器运行在 `http://localhost:4321`，每次保存文件后浏览器自动刷新。

---

## 删除文章

### 方式一：直接删除文件

```bash
# 删除独立文件
rm src/content/posts/old-post.md

# 删除子目录文章（包含所有附属资源）
rm -rf src/content/posts/old-post/
```

删除后无需任何额外操作，下次构建时文章会自动从站点中消失。

### 方式二：设为草稿（推荐，可恢复）

如果你不确定是否要永久删除，可以先设为草稿：

```markdown
---
title: 旧文章
published: 2024-01-01
draft: true    # 改为 true
---
```

**草稿行为**：

| 环境 | 草稿文章是否可见 |
|------|:--:|
| `pnpm dev`（开发） | ✅ 可见 |
| `pnpm build`（生产构建） | ❌ 隐藏 |
| `pnpm preview`（预览生产） | ❌ 隐藏 |

> 这样你可以在本地继续编辑草稿，但线上访问者看不到它。

---

## 草稿管理完整流程

### 创建草稿

```markdown
---
title: 还在写的文章
published: 2025-06-20
draft: true          # 关键：设为 true
description: 这篇文章还没写完
tags: []
---
```

### 草稿发布

文章写好后，将 `draft` 改为 `false`（或直接删除该行），然后构建部署即可：

```markdown
---
title: 还在写的文章
published: 2025-06-20
draft: false         # 改为 false，正式发布
---
```

### 快速查找所有草稿

```bash
# 搜索所有 draft: true 的文章
grep -r "draft: true" src/content/posts/
```

---

## 文章属性修改

### 修改标题

直接修改 frontmatter 中的 `title` 字段。**注意**：文章标题和文件名可以不同，标题是显示给读者看的，文件名只影响 URL。

### 修改发布日期

```markdown
published: 2025-06-20   # 改为需要的日期
```

日期格式必须为 `YYYY-MM-DD`。

### 修改标签和分类

```markdown
tags: [JavaScript, Astro, 前端]
category: 技术教程
```

- `tags` 是数组，可添加多个
- `category` 是字符串，一篇文章只能有一个分类（若要多个分类，建议用标签代替）

### 修改封面图

```markdown
image: ./new-cover.jpg    # 相对于文章文件
# 或
image: /images/cover.jpg  # 相对于 public/ 目录
# 或
image: https://example.com/pic.jpg  # 网络图片
```

---

## 文章组织建议

### 推荐的目录结构

```
src/content/posts/
├── 2025/
│   ├── 01-getting-started/
│   │   ├── index.md
│   │   └── cover.png
│   └── 02-advanced/
│       ├── index.md
│       └── assets/
│           ├── diagram.png
│           └── demo.mp4
```

按年份分组，每篇文章一个独立目录，资源就近存放。

### 文章命名规范

| 规范 | 示例 | 说明 |
|------|------|------|
| 英文小写+连字符 | `hello-world.md` | URL 友好，推荐 |
| 中文文件名 | `你好世界.md` | 可用但不推荐，URL 会有编码 |
| 数字前缀 | `01-intro.md` | 方便排序浏览 |

---

## 批量操作技巧

### 批量修改 frontmatter

如果你用的是 VS Code，可以：

1. `Ctrl+Shift+F` 全局搜索
2. 限定搜索范围为 `src/content/posts/`
3. 使用正则替换

例如：将所有文章的 `category: 旧分类` 替换为 `category: 新分类`。

### 批量添加标签

```bash
# 给所有文章追加一个标签（需要手动操作，此处仅示意）
# 建议使用 VS Code 的跨文件查找替换功能
```

---

## 文章间导航

Fuwari 自动为每篇文章生成上一篇/下一篇链接（基于发布日期排序）。你不需要手动设置 `prevSlug`、`nextSlug` 等字段——这些是构建时自动填充的内部变量。

---

## 下一步

- 配置站点标题、Logo、导航栏 → **教程 03 — 站点配置**
- 使用 Fuwari 的扩展 Markdown 功能 → **教程 04 — Markdown 扩展语法**
