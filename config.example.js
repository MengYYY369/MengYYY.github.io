// 配置示例文件
// 复制此文件内容到 script.js 中的 CONFIG 对象

const EXAMPLE_CONFIG = {
    // GitHub仓库信息 - 必须修改
    GITHUB_USERNAME: 'your-username',        // 你的GitHub用户名
    GITHUB_REPO: 'your-blog-repo',          // 你的博客仓库名
    
    // GitHub Personal Access Token (可选)
    // 用于提高API请求限制，建议在生产环境中使用
    // 创建方法：GitHub Settings > Developer settings > Personal access tokens
    // 权限：只需要 public_repo 权限
    GITHUB_TOKEN: '',
    
    // 默认封面图片
    // 当文章中没有图片时使用此图片作为封面
    DEFAULT_COVER: 'https://via.placeholder.com/400x200/3498db/ffffff?text=Blog+Post',
    
    // 文章标签过滤
    // 只显示包含这些标签的Issues作为文章
    // 留空数组 [] 表示显示所有带标签的Issues
    ARTICLE_LABELS: ['blog', 'article'],
    
    // 可选：更多自定义配置
    SITE_TITLE: '我的博客',                  // 网站标题
    SITE_DESCRIPTION: '分享技术与生活',       // 网站描述
    AUTHOR_NAME: '你的名字',                 // 作者名称
    
    // 社交媒体链接
    SOCIAL_LINKS: {
        discord: 'https://discord.gg/your-discord',
        youtube: 'https://youtube.com/@your-channel',
        github: 'https://github.com/your-username',
        twitter: 'https://twitter.com/your-username'
    }
};

// 使用示例：
// 1. 复制上面的配置到 script.js 中的 CONFIG 对象
// 2. 修改相应的值为你的实际信息
// 3. 删除不需要的配置项