// 配置信息
const CONFIG = {
    // GitHub仓库信息 - 请修改为你的仓库信息
    GITHUB_USERNAME: 'MengYYY369',
    GITHUB_REPO: 'MengYYY.github.io',
    // 可选：GitHub Personal Access Token (用于提高API限制)
    GITHUB_TOKEN: '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', // 留空或填入你的token
    // 默认封面图片
    DEFAULT_COVER: 'https://via.placeholder.com/400x200/3498db/ffffff?text=Blog+Post',
    // 文章标签过滤 (留空表示获取所有带标签的issues)
    ARTICLE_LABELS: [], // 可以修改为你想要的标签
    // 背景图片轮播 - 可以自定义背景图片
    BACKGROUND_IMAGES: [
        'bg.png'
    ],
    // 背景轮播间隔时间（毫秒）
    SLIDESHOW_INTERVAL: 8000
};

// DOM元素
const elements = {
    loading: document.getElementById('loading'),
    articlesGrid: document.getElementById('articles-grid'),
    noArticles: document.getElementById('no-articles'),
    lightbox: document.getElementById('lightbox'),
    lightboxImg: document.getElementById('lightbox-img'),
    lightboxCaption: document.querySelector('.lightbox-caption'),
    hamburger: document.querySelector('.hamburger'),
    navMenu: document.querySelector('.nav-menu'),
    backToTop: document.getElementById('back-to-top'),
    bgSlides: document.querySelectorAll('.bg-slide')
};

// 应用初始化
class BlogApp {
    constructor() {
        this.articles = [];
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupBackgroundSlideshow();
        this.setupBackToTop();
        await this.loadArticles();
    }

    // 设置事件监听器
    setupEventListeners() {
        // 移动端导航菜单
        elements.hamburger.addEventListener('click', () => {
            elements.hamburger.classList.toggle('active');
            elements.navMenu.classList.toggle('active');
        });

        // 点击导航链接时关闭移动端菜单
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                elements.hamburger.classList.remove('active');
                elements.navMenu.classList.remove('active');
            });
        });

        // 灯箱关闭事件
        document.querySelector('.lightbox-close').addEventListener('click', () => {
            this.closeLightbox();
        });

        elements.lightbox.addEventListener('click', (e) => {
            if (e.target === elements.lightbox) {
                this.closeLightbox();
            }
        });

        // ESC键关闭灯箱
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeLightbox();
            }
        });
    }

    // 设置背景轮播
    setupBackgroundSlideshow() {
        if (CONFIG.BACKGROUND_IMAGES.length === 0) return;

        // 设置背景图片
        elements.bgSlides.forEach((slide, index) => {
            if (CONFIG.BACKGROUND_IMAGES[index]) {
                slide.style.backgroundImage = `url(${CONFIG.BACKGROUND_IMAGES[index]})`;
            }
        });

        let currentSlide = 0;
        
        // 轮播函数
        const nextSlide = () => {
            elements.bgSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % elements.bgSlides.length;
            elements.bgSlides[currentSlide].classList.add('active');
        };

        // 开始轮播
        setInterval(nextSlide, CONFIG.SLIDESHOW_INTERVAL);
    }

    // 设置回到顶部按钮
    setupBackToTop() {
        if (!elements.backToTop) return;

        // 滚动事件监听
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                elements.backToTop.classList.add('show');
            } else {
                elements.backToTop.classList.remove('show');
            }
        });

        // 点击回到顶部
        elements.backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 从GitHub API加载文章
    async loadArticles() {
        try {
            elements.loading.style.display = 'block';
            elements.articlesGrid.style.display = 'none';
            elements.noArticles.style.display = 'none';

            const url = `https://api.github.com/repos/${CONFIG.GITHUB_USERNAME}/${CONFIG.GITHUB_REPO}/issues?state=open&sort=created&direction=desc`;
            
            const headers = {
                'Accept': 'application/vnd.github.v3+json'
            };

            // 如果提供了token，添加到请求头
            if (CONFIG.GITHUB_TOKEN) {
                headers['Authorization'] = `token ${CONFIG.GITHUB_TOKEN}`;
            }

            const response = await fetch(url, { headers });
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const issues = await response.json();
            
            // 过滤带有指定标签的issues
            this.articles = issues.filter(issue => {
                if (CONFIG.ARTICLE_LABELS.length === 0) {
                    // 如果没有指定标签，返回所有有标签的issues
                    return issue.labels && issue.labels.length > 0;
                }
                // 检查是否包含指定的标签
                return issue.labels && issue.labels.some(label => 
                    CONFIG.ARTICLE_LABELS.includes(label.name.toLowerCase())
                );
            });

            this.renderArticles();
        } catch (error) {
            console.error('加载文章失败:', error);
            this.showError('加载文章失败，请检查网络连接或仓库配置');
        } finally {
            elements.loading.style.display = 'none';
        }
    }

    // 渲染文章列表
    renderArticles() {
        if (this.articles.length === 0) {
            elements.noArticles.style.display = 'block';
            return;
        }

        elements.articlesGrid.style.display = 'grid';
        elements.articlesGrid.innerHTML = '';

        this.articles.forEach(article => {
            const articleCard = this.createArticleCard(article);
            elements.articlesGrid.appendChild(articleCard);
        });
    }

    // 创建文章卡片
    createArticleCard(article) {
        const card = document.createElement('div');
        card.className = 'article-card';

        // 提取文章中的第一张图片作为封面
        const coverImage = this.extractFirstImage(article.body) || CONFIG.DEFAULT_COVER;
        
        // 生成文章摘要
        const excerpt = this.generateExcerpt(article.body);
        
        // 格式化日期
        const date = new Date(article.created_at).toLocaleDateString('zh-CN');

        card.innerHTML = `
            <img src="${coverImage}" alt="${article.title}" class="article-image" 
                 onerror="this.src='${CONFIG.DEFAULT_COVER}'">
            <div class="article-content">
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${excerpt}</p>
                <div class="article-meta">
                    <span class="article-date">${date}</span>
                    <div class="article-tags">
                        ${article.labels.map(label => 
                            `<span class="tag">${label.name}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;

        // 点击卡片跳转到文章页面
        card.addEventListener('click', () => {
            this.openArticlePage(article);
        });

        return card;
    }

    // 提取文章中的第一张图片
    extractFirstImage(content) {
        if (!content) return null;
        
        // 匹配GitHub用户上传的图片格式
        const githubImgRegex = /!\[.*?\]\((https:\/\/github\.com\/user-attachments\/assets\/[^)]+)\)/;
        const githubMatch = content.match(githubImgRegex);
        
        if (githubMatch && githubMatch[1]) {
            return githubMatch[1];
        }
        
        // 匹配普通Markdown图片语法
        const imgRegex = /!\[.*?\]\((https?:\/\/[^)]+)\)/;
        const match = content.match(imgRegex);
        
        if (match && match[1]) {
            return match[1];
        }

        // 匹配HTML img标签
        const htmlImgRegex = /<img[^>]+src="([^">]+)"/;
        const htmlMatch = content.match(htmlImgRegex);
        
        if (htmlMatch && htmlMatch[1]) {
            return htmlMatch[1];
        }

        return null;
    }

    // 生成文章摘要
    generateExcerpt(content, maxLength = 150) {
        if (!content) return '暂无内容预览...';
        
        // 移除Markdown语法和HTML标签
        let text = content
            .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
            .replace(/\[.*?\]\(.*?\)/g, '') // 移除链接
            .replace(/#{1,6}\s/g, '') // 移除标题标记
            .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体标记
            .replace(/\*(.*?)\*/g, '$1') // 移除斜体标记
            .replace(/`(.*?)`/g, '$1') // 移除代码标记
            .replace(/<[^>]*>/g, '') // 移除HTML标签
            .replace(/\n+/g, ' ') // 替换换行为空格
            .trim();

        if (text.length > maxLength) {
            text = text.substring(0, maxLength) + '...';
        }

        return text || '暂无内容预览...';
    }

    // 跳转到文章页面
    openArticlePage(article) {
        // 将文章数据存储到localStorage
        localStorage.setItem('currentArticle', JSON.stringify(article));
        // 跳转到文章页面
        window.location.href = `article.html?id=${article.number}`;
    }


    // 打开图片灯箱
    openLightbox(src, caption = '') {
        elements.lightboxImg.src = src;
        elements.lightboxCaption.textContent = caption;
        elements.lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // 关闭图片灯箱
    closeLightbox() {
        elements.lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }


    // 显示错误信息
    showError(message) {
        elements.articlesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #e74c3c;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.7;"></i>
                <p style="font-size: 1.1rem; margin-bottom: 10px;">加载失败</p>
                <p style="color: #666; font-size: 0.9rem;">${message}</p>
                <button onclick="location.reload()" style="
                    margin-top: 20px; 
                    padding: 10px 20px; 
                    background: #3498db; 
                    color: white; 
                    border: none; 
                    border-radius: 6px; 
                    cursor: pointer;
                    font-size: 0.9rem;
                ">重新加载</button>
            </div>
        `;
        elements.articlesGrid.style.display = 'grid';
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new BlogApp();
});

// 导出配置以便在其他地方使用
window.BlogConfig = CONFIG;