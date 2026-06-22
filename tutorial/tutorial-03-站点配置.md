# 教程 03 — 站点配置

本教程介绍 Fuwari 博客的核心配置项，帮助你打造个性化站点。

---

## 配置文件概览

| 文件 | 作用 |
|------|------|
| `src/config.ts` | **主配置文件**，站点信息、导航、个人资料、许可证 |
| `src/constants/constants.ts` | 布局常量，分页数、横幅高度、页面宽度 |
| `astro.config.mjs` | Astro 构建配置，一般无需修改 |
| `tailwind.config.cjs` | Tailwind CSS 配置 |
| `frontmatter.json` | Front Matter CMS 扩展配置 |

---

## 一、站点基本信息（siteConfig）

编辑 `src/config.ts` 中的 `siteConfig` 对象：

```typescript
export const siteConfig: SiteConfig = {
  title: "我的博客",              // 站点标题
  subtitle: "记录学习与生活",      // 副标题
  lang: "zh_CN",                  // 站点默认语言
  description: "一个基于 Fuwari 的个人博客",  // SEO 描述
}
```

### 支持的语言代码

| 代码 | 语言 |
|------|------|
| `zh_CN` | 简体中文 |
| `zh_TW` | 繁体中文 |
| `en` | 英语 |
| `ja` | 日语 |
| `ko` | 韩语 |
| `es` | 西班牙语 |
| `th` | 泰语 |
| `vi` | 越南语 |
| `id` | 印尼语 |
| `tr` | 土耳其语 |

---

## 二、主题颜色

在 `src/config.ts` 中设置色相值（0-360），站点会自动生成整套配色方案：

```typescript
export const siteConfig: SiteConfig = {
  // ...
  themeColor: {
    hue: 250,     // 色相，0-360。250 为紫色，200 为蓝色，0 为红色
    fixed: false, // true = 固定颜色，用户不能切换；false = 用户可自行调节
  },
}
```

常用色相参考：

| 色相值 | 颜色 |
|:------:|------|
| 0 | 红色 |
| 30 | 橙色 |
| 60 | 黄色 |
| 120 | 绿色 |
| 200 | 蓝色 |
| 250 | 紫色（默认） |
| 300 | 粉红色 |

---

## 三、横幅（Banner）

```typescript
banner: {
  enable: true,                 // 是否启用横幅
  src: "assets/images/demo-banner.png",  // 横幅图片路径
  position: "center",           // 图片定位："center" | "top" | "bottom"
  credit: {
    enable: true,               // 是否显示图片来源署名
    text: "图片来源说明",
    url: "https://example.com"
  }
},
```

横幅高度可在 `src/constants/constants.ts` 中调整：

```typescript
export const BANNER_HEIGHT = 35       // 内页横幅高度（vh 单位）
export const BANNER_HEIGHT_HOME = 65  // 首页横幅高度
```

---

## 四、导航栏（navBarConfig）

```typescript
export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,     // 首页（预设）
    LinkPreset.Archive,  // 归档（预设）
    LinkPreset.About,    // 关于（预设）
    {
      name: "GitHub",                    // 自定义链接名称
      url: "https://github.com/你的用户名",  // 链接地址
      external: true,                    // 是否外链（新标签打开）
    },
  ],
}
```

三种预设链接：

| 预设 | 对应路由 |
|------|----------|
| `LinkPreset.Home` | `/` 首页 |
| `LinkPreset.Archive` | `/archive/` 归档页 |
| `LinkPreset.About` | `/about/` 关于页 |

---

## 五、个人资料（profileConfig）

显示在侧边栏的个人信息：

```typescript
export const profileConfig: ProfileConfig = {
  avatar: "assets/images/demo-avatar.png",  // 头像路径
  name: "你的名字",
  bio: "前端开发者 / 开源爱好者",            // 简介
  links: [
    {
      name: "GitHub",
      icon: "fa6-brands:github",            // FontAwesome 6 图标名
      url: "https://github.com/你的用户名",
    },
    {
      name: "Twitter",
      icon: "fa6-brands:twitter",
      url: "https://twitter.com/你的用户名",
    },
    {
      name: "Email",
      icon: "material-symbols:mail",
      url: "mailto:your@email.com",
    },
  ],
}
```

图标使用 [Iconify](https://icon-sets.iconify.design/) 格式，常见图标：

| 平台 | 图标名 |
|------|--------|
| GitHub | `fa6-brands:github` |
| Twitter/X | `fa6-brands:x-twitter` |
| B站 | `fa6-brands:bilibili` |
| 邮箱 | `material-symbols:mail` |
| 网站 | `material-symbols:link` |
| RSS | `fa6-solid:rss` |

---

## 六、许可证（licenseConfig）

每篇文章底部显示的版权声明：

```typescript
export const licenseConfig: LicenseConfig = {
  enable: true,
  name: "CC BY-NC-SA 4.0",           // 许可证名称
  url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
}
```

不想显示许可证信息时，设为 `enable: false`。

---

## 七、文章目录（TOC）

```typescript
toc: {
  enable: true,     // 是否启用目录
  depth: 1,         // 目录深度，显示到几级标题（1-3）
}
```

- `depth: 1` — 只显示 `#` 一级标题
- `depth: 2` — 显示 `#` 和 `##`（推荐）
- `depth: 3` — 显示到 `###`

---

## 八、favicon（网站图标）

将你的 favicon 图片放到 `public/favicon/` 目录，然后在 `src/config.ts` 中配置：

```typescript
favicon: {
  enable: true,
  src: "/favicon/favicon.png",    // 相对于 public/ 目录
}
```

---

## 九、关于页面

关于页面内容来自 `src/content/spec/about.md`，直接编辑该文件即可：

```markdown
## 关于我

你好，我是……

## 关于本站

这个博客使用 Fuwari 构建……
```

---

## 十、分页设置

在 `src/constants/constants.ts` 中调整首页每页文章数：

```typescript
export const PAGE_SIZE = 8  // 默认每页 8 篇，可按需调整
```

---

## 完整配置示例

```typescript
// src/config.ts
import type { SiteConfig, NavBarConfig, ProfileConfig, LicenseConfig } from "./types/config"

export const siteConfig: SiteConfig = {
  title: "张三的博客",
  subtitle: "代码 / 摄影 / 生活",
  lang: "zh_CN",
  description: "张三的个人博客，分享前端开发、摄影和生活感悟。",
  themeColor: { hue: 200, fixed: false },
  banner: {
    enable: true,
    src: "assets/images/banner.jpg",
    position: "center",
    credit: { enable: false, text: "", url: "" }
  },
  toc: { enable: true, depth: 2 },
  favicon: { enable: true, src: "/favicon/favicon.png" },
}

export const navBarConfig: NavBarConfig = {
  links: [LinkPreset.Home, LinkPreset.Archive, LinkPreset.About],
}

export const profileConfig: ProfileConfig = {
  avatar: "assets/images/avatar.jpg",
  name: "张三",
  bio: "前端开发者",
  links: [
    { name: "GitHub", icon: "fa6-brands:github", url: "https://github.com/zhangsan" },
    { name: "Email", icon: "material-symbols:mail", url: "mailto:hi@example.com" },
  ],
}

export const licenseConfig: LicenseConfig = {
  enable: true,
  name: "CC BY-NC-SA 4.0",
  url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
}
```

---

## 修改后生效

编辑配置文件后，如果开发服务器正在运行，浏览器会自动刷新。如果没有自动刷新，重启一下：

```bash
pnpm dev
```

---

## 下一步

- 探索 Fuwari 的 Markdown 扩展功能 → **教程 04 — Markdown 扩展语法**
- 了解如何构建和部署站点 → **教程 05 — 构建与部署**
