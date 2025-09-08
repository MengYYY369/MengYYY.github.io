// 文章页面JavaScript

// 配置信息 - 从主页面继承
const CONFIG = {
    GITHUB_USERNAME: 'MengYYY369',
    GITHUB_REPO: 'MengYYY.github.io',
    // 背景图片轮播
    BACKGROUND_IMAGES: [
        'bg.png',
        'bg2.png',
        'bg3.png',
        'bg4.png'
    ],
    SLIDESHOW_INTERVAL: 5000
};

// DOM元素
const elements = {
    loading: document.getElementById('loading'),
    articleContent: document.getElementById('article-content'),
    articleError: document.getElementById('article-error'),
    lightbox: document.getElementById('lightbox'),
    lightboxImg: document.getElementById('lightbox-img'),
    lightboxCaption: document.querySelector('.lightbox-caption'),
    hamburger: document.querySelector('.hamburger'),
    navMenu: document.querySelector('.nav-menu'),
    backToTop: document.getElementById('back-to-top'),
    bgSlides: document.querySelectorAll('.bg-slide')
};

// 文章页面应用
class ArticleApp {
    constructor() {
        this.article = null;
        this.allArticles = [];
        this.currentIndex = -1;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupBackgroundSlideshow();
        this.setupBackToTop();
        await this.loadArticle();
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

    // 加载文章
    async loadArticle() {
        try {
            // 从URL参数获取文章ID
            const urlParams = new URLSearchParams(window.location.search);
            const articleId = urlParams.get('id');

            if (!articleId) {
                // 尝试从localStorage获取文章数据
                const storedArticle = localStorage.getItem('currentArticle');
                if (storedArticle) {
                    this.article = JSON.parse(storedArticle);
                    await this.loadAllArticles(); // 加载所有文章以获取下一篇
                    this.renderArticle();
                    return;
                }
                throw new Error('Article ID not found');
            }

            // 先加载所有文章
            await this.loadAllArticles();

            // 尝试从静态数据中找到文章
            
            const articleFromStatic = this.allArticles.find(article => {
                // 尝试多种匹配方式
                return article.id == articleId || article.number == articleId;
            });
            
            if (articleFromStatic) {
                this.article = articleFromStatic;
                this.renderArticle();
                return;
            }

            // 如果静态数据中没有，从GitHub API获取
            await this.loadArticleFromAPI(articleId);

        } catch (error) {
            console.error('Failed to load article:', error);
            this.showError(error.message);
        } finally {
            elements.loading.style.display = 'none';
        }
    }

    // 从GitHub API加载单篇文章
    async loadArticleFromAPI(articleId) {
        const url = `https://api.github.com/repos/${CONFIG.GITHUB_USERNAME}/${CONFIG.GITHUB_REPO}/issues/${articleId}`;
        
        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };

        // 不再使用GITHUB_TOKEN
        const response = await fetch(url, { headers });
        
        if (!response.ok) {
            console.error(`API request failed: ${response.status} ${response.statusText}`);
            if (response.status === 404) {
                throw new Error(`Article not found: Issue #${articleId} not found. It may have been deleted or repository configuration is incorrect.`);
            } else if (response.status === 403) {
                throw new Error(`Access denied: Possible API limit or private repository. Status code: ${response.status}`);
            } else {
                throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
            }
        }

        this.article = await response.json();
        this.renderArticle();
    }

    // 加载所有文章
    async loadAllArticles() {
        try {
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
                        const response = await fetch(dataUrl);
                        if (response.ok) {
                            const blogData = await response.json();
                            this.allArticles = blogData.articles;
                            dataLoaded = true;
                            break;
                        }
                    } catch (pathError) {
                        // Continue to next path
                    }
                }
                
                if (dataLoaded) return;
                
            } catch (staticError) {
                // Static data file not available, fallback to API
            }

            // 回退到API加载
            await this.loadAllArticlesFromAPI();

        } catch (error) {
            console.error('Failed to load article list:', error);
        }
    }

    // 从API加载所有文章
    async loadAllArticlesFromAPI() {
        const url = `https://api.github.com/repos/${CONFIG.GITHUB_USERNAME}/${CONFIG.GITHUB_REPO}/issues?state=open&sort=created&direction=desc`;
        
        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };

        // 不再使用GITHUB_TOKEN
        const response = await fetch(url, { headers });
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const issues = await response.json();
        
        // 过滤文章（与主页逻辑相同）
        this.allArticles = issues.filter(issue => {
            if (CONFIG.ARTICLE_LABELS && CONFIG.ARTICLE_LABELS.length > 0) {
                return issue.labels && issue.labels.some(label => 
                    CONFIG.ARTICLE_LABELS.includes(label.name.toLowerCase())
                );
            }
            return issue.labels && issue.labels.length > 0;
        });
    }

    // 渲染文章
    renderArticle() {
        if (!this.article) {
            this.showError();
            return;
        }

        // Update page title
        document.title = `${this.article.title} - Personal Blog`;

        // 转换Markdown到HTML
        const htmlContent = this.markdownToHtml(this.article.body);
        
        elements.articleContent.innerHTML = `
            <h1>${this.article.title}</h1>
            <div class="article-meta" style="margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #e1e5e9;">
                <span style="color: #666; font-size: 0.95rem;">
                    <i class="fas fa-calendar-alt" style="margin-right: 8px;"></i>
                    Published on ${new Date(this.article.created_at).toLocaleDateString('en-US')}
                </span>
                <div class="article-tags" style="margin-top: 15px;">
                    ${this.article.labels.map(label => 
                        `<span class="tag">${label.name}</span>`
                    ).join('')}
                </div>
            </div>
            <div class="article-body">${htmlContent}</div>
        `;

        // 为文章中的图片添加灯箱功能
        this.setupImageLightbox();
        
        // 处理iframe自适应
        this.setupResponsiveIframes();

        // 设置下一篇文章按钮
        this.setupNextArticleButton();

        elements.articleContent.style.display = 'block';
        
        // 确保在文章渲染完成后再次设置按钮（防止时序问题）
        setTimeout(() => {
            this.setupNextArticleButton();
        }, 100);
    }

    // 设置下一篇文章按钮
    setupNextArticleButton() {
        if (!this.article || this.allArticles.length === 0) {
            return;
        }

        // 找到当前文章在列表中的位置
        this.currentIndex = this.allArticles.findIndex(article => {
            const match = (article.number === this.article.number) || 
                         (article.id === this.article.id) ||
                         (article.number == this.article.number) || 
                         (article.id == this.article.id);
            return match;
        });
        
        if (this.currentIndex === -1) {
            // 如果找不到当前文章，尝试用第一篇作为当前文章
            this.currentIndex = 0;
        }

        const nextButton = document.getElementById('next-article');
        if (!nextButton) {
            return;
        }

        // 总是显示下一篇按钮（如果有文章的话）
        if (this.allArticles.length > 0) {
            // 计算下一篇文章的索引（循环到第一篇）
            const nextIndex = (this.currentIndex + 1) % this.allArticles.length;
            const nextArticle = this.allArticles[nextIndex];
            
            if (nextArticle) {
                nextButton.style.display = 'inline-flex';
                nextButton.innerHTML = `Next Article <i class="fas fa-arrow-right"></i>`;
                
                const nextArticleId = nextArticle.id || nextArticle.number;
                const nextUrl = `article.html?id=${nextArticleId}`;
                nextButton.href = nextUrl;
                nextButton.title = nextArticle.title;
                
                // 如果是循环到第一篇，添加提示
                if (nextIndex === 0 && this.allArticles.length > 1) {
                    nextButton.title = `${nextArticle.title} (Back to first article)`;
                }
                
                // 移除任何可能阻止导航的事件处理器
                nextButton.onclick = null;
                nextButton.removeAttribute('onclick');
            }
        } else {
            nextButton.style.display = 'none';
        }
    }

    // 简单的Markdown到HTML转换
    markdownToHtml(markdown) {
        if (!markdown) return '';
        
        let html = markdown
            // 代码块
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            // 行内代码
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // 标题
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // 粗体
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // 斜体
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // 链接
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
            // 图片 - 修复GitHub图片显示
            .replace(/!\[([^\]]*)\]\((https:\/\/github\.com\/user-attachments\/assets\/[^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />')
            .replace(/!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />')
            // 处理没有协议的图片链接
            .replace(/!\[([^\]]*)\]\(([^)]+\.(jpg|jpeg|png|gif|webp|svg))\)/gi, '<img src="$2" alt="$1" loading="lazy" />')
            // 引用
            .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
            // 列表
            .replace(/^\* (.*$)/gim, '<li>$1</li>')
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
            // 换行
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');

        // 处理列表
        html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
        
        // 包装段落
        html = '<p>' + html + '</p>';
        
        // 清理空段落和重复标签
        html = html.replace(/<p><\/p>/g, '')
                  .replace(/<p>(<h[1-6]>)/g, '$1')
                  .replace(/(<\/h[1-6]>)<\/p>/g, '$1')
                  .replace(/<p>(<pre>)/g, '$1')
                  .replace(/(<\/pre>)<\/p>/g, '$1')
                  .replace(/<p>(<blockquote>)/g, '$1')
                  .replace(/(<\/blockquote>)<\/p>/g, '$1')
                  .replace(/<p>(<ul>)/g, '$1')
                  .replace(/(<\/ul>)<\/p>/g, '$1');
        
        return html;
    }

    // 设置图片灯箱功能
    setupImageLightbox() {
        const images = elements.articleContent.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('click', () => {
                this.openLightbox(img.src, img.alt);
            });
        });
    }

    // 设置响应式iframe
    setupResponsiveIframes() {
        const iframes = elements.articleContent.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            // 为iframe添加响应式包装器
            const wrapper = document.createElement('div');
            wrapper.style.cssText = `
                position: relative;
                width: 100%;
                height: 0;
                padding-bottom: 56.25%; /* 16:9 比例 */
                margin: 20px 0;
            `;
            
            iframe.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: none;
                border-radius: 8px;
            `;
            
            iframe.parentNode.insertBefore(wrapper, iframe);
            wrapper.appendChild(iframe);
        });
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

    // Show error message
    showError(message = 'Failed to load article') {
        elements.articleError.style.display = 'block';
        elements.articleContent.style.display = 'none';
        
        // 更新错误信息显示
        const errorContainer = elements.articleError;
        if (errorContainer) {
            // 查找错误信息段落，如果不存在则创建
            let errorMessage = errorContainer.querySelector('.error-message');
            if (!errorMessage) {
                errorMessage = document.createElement('p');
                errorMessage.className = 'error-message';
                errorMessage.style.cssText = 'color: #666; margin: 15px 0; font-size: 1rem;';
                // 插入到h3标题后面
                const h3 = errorContainer.querySelector('h3');
                if (h3 && h3.nextSibling) {
                    errorContainer.insertBefore(errorMessage, h3.nextSibling);
                } else if (h3) {
                    errorContainer.appendChild(errorMessage);
                }
            }
            errorMessage.textContent = message;
        }
        
        // Output detailed information to console
        console.error('Article loading error details:', {
            message: message,
            url: window.location.href,
            articleId: new URLSearchParams(window.location.search).get('id'),
            timestamp: new Date().toISOString()
        });
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new ArticleApp();
});