# 教程 01 — 添加文章

本教程将带你完成为 Fuwari 博客添加新文章的完整流程，包含三种创建方式。

---

## 文章存放位置

所有博客文章存放在 `src/content/posts/` 目录下。支持两种组织方式：

```
src/content/posts/
├── my-first-post.md          # 独立文件（适合简单文章）
├── my-second-post/
│   ├── index.md              # 子目录中的文章（推荐，方便管理资源）
│   └── cover.png             # 封面图片等附属资源
```

> **推荐使用子目录方式**：当你需要附带图片、视频等资源时，子目录结构更整洁。

---

## 方式一：CLI 脚本创建（最快）

项目内置了快速创建脚本，一键生成带模板的文章文件。

```bash
pnpm new-post <文件名>
```

**示例**：

```bash
# 创建一篇名为 "hello-world" 的文章
pnpm new-post hello-world
```

执行后会在 `src/content/posts/` 下生成 `hello-world.md`，内容如下：

```markdown
---
title: hello-world
published: 2025-06-20
description: ''
image: ''
tags: []
category: ''
draft: false
lang: ''
---
```

> **提示**：
> - 文件名无需写 `.md` 后缀，脚本会自动添加
> - 发布日期会自动填为当天日期
> - 如果文件已存在，脚本会报错并中止

---

## 方式二：手动创建（最灵活）

直接在 `src/content/posts/` 下创建 Markdown 文件，推荐使用子目录结构：

```bash
# 创建文章目录及文件
mkdir -p src/content/posts/my-article
touch src/content/posts/my-article/index.md
```

然后打开 `index.md`，手动编写 frontmatter 和正文。

---

## 方式三：Front Matter CMS（VS Code 可视化）

如果你使用 VS Code，可安装 [Front Matter CMS](https://frontmatter.codes/) 扩展，通过图形界面管理文章。

安装后，扩展会自动读取项目中的 `frontmatter.json` 配置，提供表单式的文章创建和编辑体验。

---

## Frontmatter 字段详解

每篇文章的开头必须包含 YAML 格式的 frontmatter，用 `---` 包裹。

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|:--:|--------|------|
| `title` | 字符串 | ✅ | — | 文章标题，显示在列表和详情页 |
| `published` | 日期 | ✅ | — | 发布日期，格式 `YYYY-MM-DD` |
| `updated` | 日期 | ❌ | — | 最后更新日期 |
| `draft` | 布尔 | ❌ | `false` | 草稿状态，`true` 则在生产构建中隐藏 |
| `description` | 字符串 | ❌ | `""` | 文章摘要，显示在首页卡片上 |
| `image` | 字符串 | ❌ | `""` | 封面图片路径（见下方路径规则） |
| `tags` | 字符串数组 | ❌ | `[]` | 标签列表 |
| `category` | 字符串 | ❌ | `""` | 分类（每篇文章只能一个分类） |
| `lang` | 字符串 | ❌ | `""` | 单篇文章语言覆盖（如 `"en"`） |

### 封面图片路径规则

| 路径格式 | 指向位置 | 示例 |
|----------|----------|------|
| `http://` 或 `https://` 开头 | 网络图片 | `https://example.com/cover.jpg` |
| `/` 开头 | `public/` 目录 | `/favicon/favicon.png` |
| 其他 | 相对于 Markdown 文件所在目录 | `./cover.png` 或 `cover.jpg` |

### 完整示例

```markdown
---
title: 我的第一篇博客
published: 2025-06-20
updated: 2025-06-21
description: 这是文章摘要，会显示在首页卡片中。
image: ./cover.jpg
tags: [教程, Fuwari, Astro]
category: 技术
draft: false
lang: zh_CN
---

## 正文开始

在这里写文章的正文内容，支持完整的 Markdown 语法……

![配图](./screenshot.png)

文章写完了。
```

---

## 文章正文编写

### 基本 Markdown

Fuwari 支持标准 Markdown 语法：

```markdown
# 一级标题
## 二级标题
### 三级标题

**粗体** *斜体* ~~删除线~~ `行内代码`

- 无序列表
- 无序列表

1. 有序列表
2. 有序列表

> 引用文字

[链接文字](https://example.com)

![图片描述](./image.png)
```

### 代码块

支持语法高亮和行号：

````markdown
```js
console.log("Hello, Fuwari!")
```
````

还可以添加标题：

````markdown
```js title="hello.js"
console.log("Hello!")
```
````

### 扩展语法

Fuwari 内置了多种扩展语法，详见 **教程 04 — Markdown 扩展语法**。

---

## 实时预览

启动开发服务器，编辑文章时浏览器会自动刷新：

```bash
pnpm dev
```

浏览器打开 `http://localhost:4321` 即可看到效果。

---

## 文章排序规则

文章在首页按 **发布日期（`published`）降序**排列——最新的排在最前面。如果你想让某篇文章置顶，只需设置一个未来的日期即可。

---

## 下一步

- 了解如何编辑、删除和管理文章 → **教程 02 — 管理文章**
- 了解如何配置站点基本信息 → **教程 03 — 站点配置**
