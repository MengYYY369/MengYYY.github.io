# 教程 04 — Markdown 扩展语法

Fuwari 在标准 Markdown 基础上扩展了多种实用功能，本教程逐一介绍。

---

## 一、警告框（Admonitions）

用特殊的 blockquote 语法创建彩色警告框，支持 5 种类型。

### 基本用法

```markdown
:::note
这是一条普通提示信息。
:::

:::tip
这是一条小技巧或建议。
:::

:::important
这是重要信息，需要特别关注。
:::

:::warning
这是一条警告，请注意风险。
:::

:::caution
这是危险警告，请务必小心。
:::
```

### 实际效果预览

| 类型 | 颜色 | 适用场景 |
|------|:--:|----------|
| `note` | 🔵 蓝 | 补充说明、备注 |
| `tip` | 🟢 绿 | 技巧、建议、最佳实践 |
| `important` | 🟣 紫 | 重要提示、关键信息 |
| `warning` | 🟡 黄 | 警告、注意事项 |
| `caution` | 🔴 红 | 危险操作、错误提示 |

### 自定义标题

在类型后面用方括号指定标题：

```markdown
:::note[我的自定义标题]
内容文字……
:::

:::warning[兼容性提醒]
此功能仅在 Astro 5.x 中可用。
:::
```

### GitHub 风格（兼容语法）

也支持 GitHub 风格的警告语法：

```markdown
> [!NOTE]
> 这是一条提示。

> [!WARNING]
> 这是一条警告。
```

---

## 二、GitHub 仓库卡片

嵌入一个 GitHub 仓库的信息卡片，页面加载时通过 GitHub API 自动获取数据。

```markdown
::github{repo="saicaca/fuwari"}
```

只需要提供 `owner/repo` 格式的仓库名，卡片会自动显示：
- 仓库名称和描述
- ⭐ Star 数量
- 🍴 Fork 数量
- 主要编程语言

---

## 三、数学公式（KaTeX）

Fuwari 内置 KaTeX，支持 LaTeX 数学公式。

### 行内公式

用单个 `$` 包裹：

```markdown
爱因斯坦质能方程：$E = mc^2$

圆的面积：$A = \pi r^2$
```

### 块级公式

用双 `$$` 包裹，公式会居中显示：

```markdown
$$
\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$

$$
f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}(x-a)^n
$$
```

### 常用公式示例

```markdown
分数：$\frac{a}{b}$

根号：$\sqrt{x}$

上下标：$x^2$  $a_i$

矩阵：
$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
$$
```

---

## 四、隐藏文字（Spoiler）

创建可点击展开的隐藏内容：

```markdown
答案揭晓：:spoiler[42]
```

读者需要点击（或悬停）才能看到隐藏文字。

---

## 五、代码块增强

### 语法高亮

````markdown
```python
def hello():
    print("Hello, Fuwari!")
```
````

### 添加标题

在语言标记后用 `title="..."` 指定标题：

````markdown
```js title="hello.js"
console.log("Hello!")
```
````

### 行号高亮

高亮特定行：

````markdown
```js {2, 4-5}
// 第1行
const a = 1    // 第2行会高亮
const b = 2
const c = 3    // 第4行会高亮
const d = 4    // 第5行会高亮
```
````

### Diff 语法

展示代码变更：

````markdown
```diff
- const oldApi = "https://v1.api.com"
+ const newApi = "https://v2.api.com"
```
````

### 可折叠代码块

````markdown
```js collapse
// 这段代码默认折叠
const longCode = "点击展开查看"
```
````

### 终端框架

将代码块显示为终端样式：

````markdown
```bash frame="terminal"
$ npm install
$ npm run build
```
````

---

## 六、图片增强

### 基本图片

```markdown
![替代文字](./image.png)
```

### 带标题的图片

```markdown
![替代文字](./image.png "图片标题")
```

### 点击放大

Fuwari 内置 [PhotoSwipe](https://photoswipe.com/) 图片灯箱，点击任意图片即可放大浏览，支持手势缩放。

---

## 七、表格

```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| A   | B   | C   |
| D   | E   | F   |
```

### 对齐方式

```markdown
| 左对齐 | 居中 | 右对齐 |
|:-------|:----:|-------:|
| 文字   | 文字 | 文字   |
```

---

## 八、脚注

```markdown
这是一段带脚注的文字。[^1]

[^1]: 这是脚注的内容。
```

脚注会自动渲染到文章末尾。

---

## 九、任务列表

```markdown
- [x] 已完成的任务
- [ ] 待完成的任务
- [ ] 另一项任务
```

---

## 十、综合示例

将多种语法组合使用：

```markdown
---
title: Fuwari 功能展示
published: 2025-06-20
tags: [教程, Markdown]
---

## 概述

本文展示 Fuwari 支持的各种 Markdown 扩展功能。

:::tip[提示]
阅读本文时建议开启 `pnpm dev` 实时预览效果。
:::

## 数学公式

勾股定理：$a^2 + b^2 = c^2$

## 代码示例

```js title="main.js" {1, 3-4}
import { hello } from "./utils"
// 
const result = hello("Fuwari")
console.log(result)
```

## GitHub 仓库

::github{repo="saicaca/fuwari"}

## 隐藏内容

剧透警告：:spoiler[主角最后获得了胜利]

## 任务进度

- [x] 安装依赖
- [x] 配置站点
- [ ] 写第一篇文章
- [ ] 部署上线
```

---

## 下一步

- 构建并部署你的站点 → **教程 05 — 构建与部署**
