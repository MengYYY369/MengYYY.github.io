// 配置信息
const CONFIG = {
    // GitHub仓库信息 - 请修改为你的仓库信息
    GITHUB_USERNAME: 'MengYYY369',
    GITHUB_REPO: 'MengYYY.github.io',
    // 默认封面图片
    DEFAULT_COVER: 'bg.png',
    // 文章标签过滤 (留空表示获取所有带标签的issues)
    ARTICLE_LABELS: [], // 可以修改为你想要的标签
    // 背景图片轮播 - 可以自定义背景图片
    BACKGROUND_IMAGES: [
        'bg.png',
        'bg2.png',
        'bg3.png',
        'bg4.png'
    ],
    // 背景轮播间隔时间（毫秒）
    SLIDESHOW_INTERVAL: 8000,

    SITE_TITLE: 'My Blog',                  // Website title
    SITE_DESCRIPTION: 'Blog',       // Website description
    AUTHOR_NAME: 'MengYYY'
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

        // 主题切换
        this.setupThemeToggle();

        // 灯箱事件
        this.setupLightboxEvents();
    }

    // 设置主题切换
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = themeToggle.querySelector('i');
        
        // 检查本地存储的主题
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(themeIcon, savedTheme);
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(themeIcon, newTheme);
        });
    }

    // 更新主题图标
    updateThemeIcon(icon, theme) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // 设置灯箱事件
    setupLightboxEvents() {
        // 灯箱关闭事件
        document.querySelector('.lightbox-close').addEventListener('click', () => {
            this.closeLightbox();
        });

        elements.lightbox.addEventListener('click', (e) => {
            if (e.target === elements.lightbox) {
                this.closeLightbox();
            }
        });

        // 灯箱导航
        document.getElementById('lightbox-prev').addEventListener('click', () => {
            this.showPrevImage();
        });

        document.getElementById('lightbox-next').addEventListener('click', () => {
            this.showNextImage();
        });

        // ESC键关闭灯箱，左右键导航
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                this.showPrevImage();
            } else if (e.key === 'ArrowRight') {
                this.showNextImage();
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
            if (elements.bgSlides.length > 1) {
                elements.bgSlides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % elements.bgSlides.length;
                elements.bgSlides[currentSlide].classList.add('active');
            }
        };

        // 开始轮播 - 只有多张图片时才轮播
        if (elements.bgSlides.length > 1) {
            setInterval(nextSlide, CONFIG.SLIDESHOW_INTERVAL);
        }
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

    // 从静态数据文件加载文章
    async loadArticles() {
        try {
            elements.loading.style.display = 'block';
            elements.articlesGrid.style.display = 'none';
            elements.noArticles.style.display = 'none';

            // 首先尝试从静态数据文件加载
            try {
                // 尝试多个可能的路径
                const possiblePaths = [
                    './data/blog-data.json',
                    'data/blog-data.json',
                    '/data/blog-data.json'
                ];
                
                let dataLoaded = false;
                for (const dataUrl of possiblePaths) {
                    try {
                        console.log(`Trying to load data file: ${dataUrl}`);
                        const response = await fetch(dataUrl);
                        if (response.ok) {
                            const blogData = await response.json();
                            console.log(`Successfully loaded data from ${dataUrl}, containing ${blogData.articles?.length || 0} articles`);
                            this.articles = this.filterArticles(blogData.articles);
                            this.renderArticles();
                            dataLoaded = true;
                            break;
                        }
                    } catch (pathError) {
                        console.log(`Path ${dataUrl} loading failed:`, pathError.message);
                    }
                }
                
                if (dataLoaded) return;
                
            } catch (staticError) {
                console.log('Static data file loading failed, trying to load directly from GitHub API...', staticError);
            }

            // 如果静态文件不存在，回退到直接API调用
            await this.loadArticlesFromAPI();

        } catch (error) {
            console.error('加载文章失败:', error);
            this.showError('Failed to load articles. Please check your network connection or repository configuration.');
        } finally {
            elements.loading.style.display = 'none';
        }
    }

    // 从GitHub API直接加载文章（回退方案）
    async loadArticlesFromAPI() {
        // 检查仓库配置
        if (!CONFIG.GITHUB_USERNAME || !CONFIG.GITHUB_REPO) {
            throw new Error('Please set the correct GitHub username and repository name in the configuration.');
        }
        
        const url = `https://api.github.com/repos/${CONFIG.GITHUB_USERNAME}/${CONFIG.GITHUB_REPO}/issues?state=open&sort=created&direction=desc`;
        
        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };

        // 注意：不再使用GITHUB_TOKEN，因为它应该为空
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
    }

    // 过滤文章
    filterArticles(articles) {
        if (CONFIG.ARTICLE_LABELS.length === 0) {
            return articles; // 静态数据已经过滤过了
        }
        
        return articles.filter(article => {
            return article.labels && article.labels.some(label => 
                CONFIG.ARTICLE_LABELS.includes(label.name.toLowerCase())
            );
        });
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

        // 使用预处理的封面图片或默认图片
        const coverImage = article.coverImage || CONFIG.DEFAULT_COVER;
        
        // 使用预处理的摘要或生成新的
        const excerpt = article.excerpt || this.generateExcerpt(article.body);
        
        // Format date
        const date = new Date(article.created_at).toLocaleDateString('en-US');

        card.innerHTML = `
            <img src="${coverImage}" alt="${article.title}" class="article-image" 
                 onerror="this.src='${CONFIG.DEFAULT_COVER}'">
            <div class="article-content">
                <h3 class="article-title">${article.title}</h3>
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
        if (!content) return 'No content preview available...';
        
        // 移除Markdown语法和HTML标签
        let text = content
            // 首先移除所有图片相关内容（包括图片语法和可能的图片描述）
            .replace(/!\[.*?\]\(.*?\)/g, '') // 移除Markdown图片
            .replace(/<img[^>]*>/gi, '') // 移除HTML图片标签
            .replace(/\[.*?\]\(.*?\)/g, '') // 移除链接
            .replace(/#{1,6}\s/g, '') // 移除标题标记
            .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体标记
            .replace(/\*(.*?)\*/g, '$1') // 移除斜体标记
            .replace(/`(.*?)`/g, '$1') // 移除代码标记
            .replace(/```[\s\S]*?```/g, '') // 移除代码块
            .replace(/<[^>]*>/g, '') // 移除所有HTML标签
            .replace(/\n+/g, ' ') // 替换换行为空格
            .replace(/\s+/g, ' ') // 合并多个空格
            .trim();

        // Further clean up possible image-related text
        text = text
            .replace(/^(图片|image|img|screenshot|截图)[:：\s]*/gi, '') // Remove image identifiers at the beginning
            .replace(/(图片|image|img|screenshot|截图)[:：\s]*$/gi, '') // Remove image identifiers at the end
            .trim();

        if (text.length > maxLength) {
            text = text.substring(0, maxLength) + '...';
        }

        return text || 'No content preview available...';
    }

    // 跳转到文章页面
    openArticlePage(article) {
        // 将文章数据存储到localStorage
        localStorage.setItem('currentArticle', JSON.stringify(article));
        // 跳转到文章页面 - 使用id或number字段
        const articleId = article.id || article.number;
        console.log('Navigating to article page, ID:', articleId, 'Article:', article.title);
        window.location.href = `article.html?id=${articleId}`;
    }


    // 打开图片灯箱
    openLightbox(src, caption = '') {
        // 收集页面中所有图片
        this.collectPageImages();
        
        // 找到当前图片的索引
        this.currentImageIndex = this.pageImages.findIndex(img => img.src === src);
        
        elements.lightboxImg.src = src;
        elements.lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // 更新导航按钮状态
        this.updateLightboxNavigation();
    }

    // 收集页面中的所有图片
    collectPageImages() {
        this.pageImages = [];
        const images = document.querySelectorAll('.article-image, #article-content img');
        images.forEach(img => {
            if (img.src && img.src !== CONFIG.DEFAULT_COVER) {
                this.pageImages.push({
                    src: img.src,
                    alt: img.alt || ''
                });
            }
        });
    }

    // 显示上一张图片
    showPrevImage() {
        if (this.pageImages && this.pageImages.length > 1) {
            this.currentImageIndex = (this.currentImageIndex - 1 + this.pageImages.length) % this.pageImages.length;
            const prevImage = this.pageImages[this.currentImageIndex];
            elements.lightboxImg.src = prevImage.src;
            this.updateLightboxNavigation();
        }
    }

    // 显示下一张图片
    showNextImage() {
        if (this.pageImages && this.pageImages.length > 1) {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.pageImages.length;
            const nextImage = this.pageImages[this.currentImageIndex];
            elements.lightboxImg.src = nextImage.src;
            this.updateLightboxNavigation();
        }
    }

    // 更新灯箱导航按钮
    updateLightboxNavigation() {
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');
        
        if (this.pageImages && this.pageImages.length > 1) {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        } else {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }
    }

    // 关闭图片灯箱
    closeLightbox() {
        elements.lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.pageImages = [];
        this.currentImageIndex = -1;
    }


    // 显示错误信息
    showError(message) {
        elements.articlesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #e74c3c;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.7;"></i>
                <p style="font-size: 1.1rem; margin-bottom: 10px;">Loading Failed</p>
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
                ">Reload</button>
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