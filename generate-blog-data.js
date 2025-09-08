const fs = require('fs');

// 读取Issues数据
const issues = JSON.parse(fs.readFileSync('data/issues.json', 'utf8'));

// 过滤和处理文章数据
const articles = issues
  .filter(issue => {
    // 过滤有标签的Issues作为文章
    return issue.labels && issue.labels.length > 0;
  })
  .map(issue => {
    // 提取第一张图片作为封面
    const extractFirstImage = (content) => {
      if (!content) return null;
      
      // GitHub用户上传的图片
      const githubImgRegex = /!\[.*?\]\((https:\/\/github\.com\/user-attachments\/assets\/[^)]+)\)/;
      const githubMatch = content.match(githubImgRegex);
      if (githubMatch && githubMatch[1]) return githubMatch[1];
      
      // 普通Markdown图片
      const imgRegex = /!\[.*?\]\((https?:\/\/[^)]+)\)/;
      const match = content.match(imgRegex);
      if (match && match[1]) return match[1];
      
      // HTML img标签
      const htmlImgRegex = /<img[^>]+src="([^">]+)"/;
      const htmlMatch = content.match(htmlImgRegex);
      if (htmlMatch && htmlMatch[1]) return htmlMatch[1];
      
      return null;
    };
    
    // 生成摘要
    const generateExcerpt = (content, maxLength = 150) => {
      if (!content) return '暂无内容预览...';
      
      let text = content
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[.*?\]\(.*?\)/g, '')
        .replace(/#{1,6}\s/g, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/`(.*?)`/g, '$1')
        .replace(/<[^>]*>/g, '')
        .replace(/\n+/g, ' ')
        .trim();
      
      if (text.length > maxLength) {
        text = text.substring(0, maxLength) + '...';
      }
      
      return text || '暂无内容预览...';
    };
    
    return {
      id: issue.number,
      title: issue.title,
      body: issue.body,
      excerpt: generateExcerpt(issue.body),
      coverImage: extractFirstImage(issue.body),
      labels: issue.labels.map(label => ({
        name: label.name,
        color: label.color
      })),
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      html_url: issue.html_url,
      user: {
        login: issue.user.login,
        avatar_url: issue.user.avatar_url
      }
    };
  });

// 生成博客数据文件
const blogData = {
  articles: articles,
  lastUpdated: new Date().toISOString(),
  totalCount: articles.length
};

// 写入数据文件
fs.writeFileSync('data/blog-data.json', JSON.stringify(blogData, null, 2));

console.log(`Generated blog data with ${articles.length} articles`);
