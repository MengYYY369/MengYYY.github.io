// Tools 页面配置
const TOOLS_CONFIG = {
    BACKGROUND_IMAGES: [
        '../bg.png',
        '../bg2.png', 
        '../bg3.png',
        '../bg4.png'
    ],
    SLIDESHOW_INTERVAL: 5000
};

// DOM元素
const elements = {
    hamburger: document.querySelector('.hamburger'),
    navMenu: document.querySelector('.nav-menu'),
    backToTop: document.getElementById('back-to-top'),
    bgSlides: document.querySelectorAll('.bg-slide'),
    toolCards: document.querySelectorAll('.tool-card:not(.coming-soon)')
};

// Tools 应用初始化
class ToolsApp {
    constructor() {
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupBackgroundSlideshow();
        this.setupBackToTop();
        this.setupTheme();
    }

    // 设置事件监听器
    setupEventListeners() {
        // 移动端导航菜单
        if (elements.hamburger) {
            elements.hamburger.addEventListener('click', () => {
                elements.hamburger.classList.toggle('active');
                elements.navMenu.classList.toggle('active');
            });
        }

        // 点击导航链接时关闭移动端菜单
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (elements.hamburger) {
                    elements.hamburger.classList.remove('active');
                    elements.navMenu.classList.remove('active');
                }
            });
        });

        // 工具卡片点击事件
        elements.toolCards.forEach(card => {
            card.addEventListener('click', () => {
                const toolType = card.getAttribute('data-tool');
                this.openTool(toolType);
            });
        });

        // 主题切换
        this.setupThemeToggle();
    }

    // 设置主题切换
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

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
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // 设置主题
    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // 设置背景轮播
    setupBackgroundSlideshow() {
        if (TOOLS_CONFIG.BACKGROUND_IMAGES.length === 0 || !elements.bgSlides.length) return;

        // 设置背景图片
        elements.bgSlides.forEach((slide, index) => {
            if (TOOLS_CONFIG.BACKGROUND_IMAGES[index]) {
                slide.style.backgroundImage = `url(${TOOLS_CONFIG.BACKGROUND_IMAGES[index]})`;
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
            setInterval(nextSlide, TOOLS_CONFIG.SLIDESHOW_INTERVAL);
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

    // 打开工具
    openTool(toolType) {
        console.log('Opening tool:', toolType);
        
        switch (toolType) {
            case 'config-editor':
                window.location.href = 'config-editor.html';
                break;
            default:
                console.log('Unknown tool type:', toolType);
        }
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new ToolsApp();
});

// 导出配置以便在其他地方使用
window.ToolsConfig = TOOLS_CONFIG;