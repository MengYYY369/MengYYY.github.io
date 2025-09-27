// Config Editor 配置
const CONFIG_EDITOR_CONFIG = {
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
    configInput: document.getElementById('config-input'),
    parseBtn: document.getElementById('parse-config-btn'),
    clearBtn: document.getElementById('clear-input-btn'),
    exampleBtn: document.getElementById('load-example-btn'),
    expandAllBtn: document.getElementById('expand-all-btn'),
    collapseAllBtn: document.getElementById('collapse-all-btn'),
    exportBtn: document.getElementById('export-config-btn'),
    outputSection: document.getElementById('config-output-section'),
    parsedClasses: document.getElementById('parsed-classes')
};

// Config Editor 应用
class ConfigEditorApp {
    constructor() {
        this.parsedData = [];
        this.originalContent = '';
        this.configStructure = null; // 存储完整的配置结构
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

        // 解析按钮
        if (elements.parseBtn) {
            elements.parseBtn.addEventListener('click', () => {
                this.parseConfig();
            });
        }

        // 清空按钮
        if (elements.clearBtn) {
            elements.clearBtn.addEventListener('click', () => {
                this.clearInput();
            });
        }




        // 展开全部按钮
        if (elements.expandAllBtn) {
            elements.expandAllBtn.addEventListener('click', () => {
                this.expandAll();
            });
        }

        // 收起全部按钮
        if (elements.collapseAllBtn) {
            elements.collapseAllBtn.addEventListener('click', () => {
                this.collapseAll();
            });
        }

        // 导出按钮
        if (elements.exportBtn) {
            elements.exportBtn.addEventListener('click', () => {
                this.exportConfig();
            });
        }

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
        if (CONFIG_EDITOR_CONFIG.BACKGROUND_IMAGES.length === 0 || !elements.bgSlides.length) return;

        // 设置背景图片
        elements.bgSlides.forEach((slide, index) => {
            if (CONFIG_EDITOR_CONFIG.BACKGROUND_IMAGES[index]) {
                slide.style.backgroundImage = `url(${CONFIG_EDITOR_CONFIG.BACKGROUND_IMAGES[index]})`;
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

        // 开始轮播
        if (elements.bgSlides.length > 1) {
            setInterval(nextSlide, CONFIG_EDITOR_CONFIG.SLIDESHOW_INTERVAL);
        }
    }

    // 设置回到顶部按钮
    setupBackToTop() {
        if (!elements.backToTop) return;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                elements.backToTop.classList.add('show');
            } else {
                elements.backToTop.classList.remove('show');
            }
        });

        elements.backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 清空输入
    clearInput() {
        if (elements.configInput) {
            elements.configInput.value = '';
            elements.outputSection.style.display = 'none';
            this.parsedData = [];
        }
    }



    // 加载示例（已移除按钮，保留方法以备后用）
    loadExample() {
        // 示例方法已移除，不再使用
        return;
    }

    // 解析配置
    parseConfig() {
        if (!elements.configInput || !elements.outputSection || !elements.parsedClasses) return;

        const configContent = elements.configInput.value.trim();
        if (!configContent) {
            alert('Please input config.cpp file content');
            return;
        }

        this.originalContent = configContent;

        try {
            // 解析完整的配置结构
            this.configStructure = this.parseCompleteStructure(configContent);
            
            // 提取可编辑的类
            const classes = this.extractEditableClasses(this.configStructure);
            if (classes.length === 0) {
                alert('No inheritance classes found in cfgVehicles.\n\nPlease ensure:\n1. class cfgVehicles { ... } block exists\n2. Inheritance classes like "class MyClass : ParentClass" exist in cfgVehicles\n3. Pure declaration classes (like "class BaseClass;") are skipped');
                return;
            }

            this.parsedData = classes;
            this.renderParsedClasses(classes);
            elements.outputSection.style.display = 'block';
            
            // 滚动到结果区域
            elements.outputSection.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Error parsing config file:', error);
            alert('Error parsing config file, please check file format:\n\n' + error.message + '\n\nPlease ensure the config file contains complete class cfgVehicles { ... }; structure');
        }
    }

    // 解析完整的配置结构
    parseCompleteStructure(content) {
        const structure = {
            beforeCfgVehicles: '',
            cfgVehicles: {
                classes: [],
                declarations: []
            },
            afterCfgVehicles: ''
        };

        // 找到 cfgVehicles 的位置
        const cfgStart = content.indexOf('class cfgVehicles');
        if (cfgStart === -1) {
            throw new Error('未找到 cfgVehicles 类');
        }

        // 保存 cfgVehicles 之前的内容
        structure.beforeCfgVehicles = content.substring(0, cfgStart);

        // 找到 cfgVehicles 的大括号
        const cfgOpenBrace = content.indexOf('{', cfgStart);
        if (cfgOpenBrace === -1) {
            throw new Error('未找到 cfgVehicles 开始大括号');
        }

        // 找到 cfgVehicles 的结束位置
        let braceCount = 1;
        let cfgEnd = cfgOpenBrace + 1;
        while (cfgEnd < content.length && braceCount > 0) {
            if (content[cfgEnd] === '{') {
                braceCount++;
            } else if (content[cfgEnd] === '}') {
                braceCount--;
            }
            cfgEnd++;
        }

        // 保存 cfgVehicles 之后的内容
        structure.afterCfgVehicles = content.substring(cfgEnd);

        // 解析 cfgVehicles 内容
        const cfgContent = content.substring(cfgOpenBrace + 1, cfgEnd - 1);
        this.parseCfgVehiclesContent(cfgContent, structure.cfgVehicles);

        return structure;
    }

    // 解析 cfgVehicles 内容
    parseCfgVehiclesContent(content, cfgVehicles) {
        const lines = content.split('\n');
        let i = 0;

        while (i < lines.length) {
            const line = lines[i].trim();
            
            // 跳过空行和注释
            if (!line || line.startsWith('//') || line.startsWith('/*')) {
                i++;
                continue;
            }

            // 检查是否是类声明（class Name;）
            const declarationMatch = line.match(/^class\s+(\w+)\s*;/);
            if (declarationMatch) {
                cfgVehicles.declarations.push({
                    name: declarationMatch[1],
                    line: line
                });
                i++;
                continue;
            }

            // 检查是否是类定义（class Name : Parent）
            const classMatch = line.match(/^class\s+(\w+)\s*:\s*(\w+)/);
            if (classMatch) {
                const className = classMatch[1];
                const parentClass = classMatch[2];
                
                // 提取完整的类内容
                const classData = this.extractCompleteClass(lines, i);
                if (classData) {
                    cfgVehicles.classes.push({
                        name: className,
                        parent: parentClass,
                        rawContent: classData.content,
                        parameters: this.extractParameters(classData.content)
                    });
                    i = classData.endIndex;
                } else {
                    i++;
                }
            } else {
                i++;
            }
        }
    }

    // 提取完整的类（包括原始格式）
    extractCompleteClass(lines, startIndex) {
        let braceCount = 0;
        let classContent = [];
        let foundOpenBrace = false;
        let i = startIndex;

        while (i < lines.length) {
            const line = lines[i];
            
            // 计算大括号
            const openBraces = (line.match(/\{/g) || []).length;
            const closeBraces = (line.match(/\}/g) || []).length;
            
            if (!foundOpenBrace && openBraces > 0) {
                foundOpenBrace = true;
                braceCount = openBraces - closeBraces;
                // 保存大括号后的内容
                const braceIndex = line.indexOf('{');
                if (braceIndex < line.length - 1) {
                    classContent.push(line.substring(braceIndex + 1));
                }
            } else if (foundOpenBrace) {
                braceCount += openBraces - closeBraces;
                
                if (braceCount > 0) {
                    classContent.push(line);
                } else {
                    // 类结束
                    const braceIndex = line.lastIndexOf('}');
                    if (braceIndex > 0) {
                        classContent.push(line.substring(0, braceIndex));
                    }
                    break;
                }
            }
            i++;
        }

        return {
            content: classContent.join('\n'),
            endIndex: i + 1
        };
    }

    // 提取可编辑的类
    extractEditableClasses(structure) {
        return structure.cfgVehicles.classes.map(classData => ({
            name: classData.name,
            parent: classData.parent,
            parameters: classData.parameters,
            _originalContent: classData.rawContent // 保存原始内容用于重建
        }));
    }

    // 提取 cfgVehicles 中的类 - 最简单的方法（保留作为备用）
    extractCfgVehiclesClasses(content) {
        const classes = [];
        
        // 简单查找 cfgVehicles 开始位置
        const cfgStart = content.indexOf('class cfgVehicles');
        if (cfgStart === -1) {
            throw new Error('未找到 cfgVehicles 类');
        }
        
        // 找到 cfgVehicles 的开始大括号
        const cfgOpenBrace = content.indexOf('{', cfgStart);
        if (cfgOpenBrace === -1) {
            throw new Error('未找到 cfgVehicles 开始大括号');
        }
        
        // 简单计算大括号，找到 cfgVehicles 结束位置
        let braceCount = 1;
        let cfgEnd = cfgOpenBrace + 1;
        while (cfgEnd < content.length && braceCount > 0) {
            if (content[cfgEnd] === '{') {
                braceCount++;
            } else if (content[cfgEnd] === '}') {
                braceCount--;
            }
            cfgEnd++;
        }
        
        const cfgVehiclesContent = content.substring(cfgOpenBrace + 1, cfgEnd - 1);
        console.log('cfgVehicles content length:', cfgVehiclesContent.length);
        
        // 简单查找有继承的类
        const lines = cfgVehiclesContent.split('\n');
        console.log(`Searching for classes in ${lines.length} lines`);
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // 查找类定义行：class Name : Parent
            const classMatch = line.match(/^class\s+(\w+)\s*:\s*(\w+)/);
            if (classMatch) {
                const className = classMatch[1];
                const parentClass = classMatch[2];
                
                console.log(`Found class: ${className} : ${parentClass} at line ${i}`);
                console.log(`Line content: "${line}"`);
                
                // 简单提取类内容
                console.log(`Calling extractSimpleClassContent for ${className}`);
                const classContent = this.extractSimpleClassContent(cfgVehiclesContent, className, i);
                console.log(`extractSimpleClassContent returned:`, classContent ? classContent.length : 'null');
                
                if (classContent) {
                    const classData = {
                        name: className,
                        parent: parentClass,
                        parameters: this.extractParameters(classContent)
                    };
                    console.log(`Class ${className} final content length:`, classContent.length);
                    classes.push(classData);
                } else {
                    console.log(`Failed to extract content for class ${className}`);
                }
            }
        }

        return classes;
    }

    // 简单提取类内容
    extractSimpleClassContent(cfgContent, className, startLineIndex) {
        const lines = cfgContent.split('\n');
        
        // 从类定义行开始查找
        let classStartIndex = -1;
        for (let i = startLineIndex; i < lines.length; i++) {
            if (lines[i].includes(`class ${className}`) && lines[i].includes(':')) {
                classStartIndex = i;
                break;
            }
        }
        
        if (classStartIndex === -1) {
            console.log(`Could not find class ${className} definition`);
            return null;
        }
        
        // 找到类的开始大括号
        let openBraceIndex = -1;
        for (let i = classStartIndex; i < lines.length; i++) {
            if (lines[i].includes('{')) {
                openBraceIndex = i;
                break;
            }
        }
        
        if (openBraceIndex === -1) {
            console.log(`Could not find opening brace for class ${className}`);
            return null;
        }
        
        // 简单计算大括号，找到类结束
        let braceCount = 0;
        let classContent = [];
        
        console.log(`Starting brace counting for ${className} from line ${openBraceIndex}`);
        
        for (let i = openBraceIndex; i < lines.length; i++) {
            const line = lines[i];
            
            // 计算这行的大括号
            const openBraces = (line.match(/\{/g) || []).length;
            const closeBraces = (line.match(/\}/g) || []).length;
            braceCount += openBraces - closeBraces;
            
            console.log(`Line ${i}: "${line.trim()}" | braces: +${openBraces} -${closeBraces} | total: ${braceCount}`);
            
            // 如果不是第一行（类定义行），添加到内容
            if (i > openBraceIndex) {
                if (braceCount > 0) {
                    classContent.push(line);
                } else {
                    // 大括号平衡了，类结束
                    console.log(`Class ${className} ended at line ${i}, collected ${classContent.length} lines`);
                    break;
                }
            } else {
                // 第一行，初始化大括号计数
                if (braceCount === 0) {
                    // 如果第一行就平衡了，说明是空类
                    console.log(`Empty class ${className} detected`);
                    break;
                }
            }
        }
        
        const result = classContent.join('\n');
        console.log(`Extracted ${className} content length: ${result.length}`);
        return result;
    }

    // 提取平衡大括号内的内容
    extractBalancedBraces(content, startIndex) {
        const lines = content.split('\n');
        let currentIndex = 0;
        let lineIndex = 0;
        
        // 找到开始位置对应的行
        for (let i = 0; i < lines.length; i++) {
            if (currentIndex + lines[i].length >= startIndex) {
                lineIndex = i;
                break;
            }
            currentIndex += lines[i].length + 1; // +1 for newline
        }
        
        let braceCount = 0;
        let foundStart = false;
        let contentLines = [];
        
        for (let i = lineIndex; i < lines.length; i++) {
            const line = lines[i];
            const openBraces = (line.match(/\{/g) || []).length;
            const closeBraces = (line.match(/\}/g) || []).length;
            
            if (!foundStart && openBraces > 0) {
                foundStart = true;
                braceCount = openBraces - closeBraces;
                // 提取大括号后的内容
                const braceIndex = line.indexOf('{');
                if (braceIndex !== -1 && braceIndex < line.length - 1) {
                    contentLines.push(line.substring(braceIndex + 1));
                }
                continue;
            }
            
            if (foundStart) {
                braceCount += openBraces - closeBraces;
                
                if (braceCount > 0) {
                    contentLines.push(line);
                } else if (braceCount === 0) {
                    // 找到匹配的结束大括号
                    const braceIndex = line.lastIndexOf('}');
                    if (braceIndex > 0) {
                        contentLines.push(line.substring(0, braceIndex));
                    }
                    break;
                }
            }
        }
        
        return contentLines.join('\n');
    }



    // 提取类参数
    extractParameters(classContent) {
        const parameters = {};

        // 基础参数定义
        const basicParams = [
            { name: 'displayName', type: 'string', description: 'Display name of the item in game' },
            { name: 'descriptionShort', type: 'string', description: 'Short description shown in item details' },
            { name: 'weight', type: 'float', description: 'Item weight in grams, affects character carrying capacity' },
            { name: 'varWetMax', type: 'float', description: 'Maximum wetness value (0-1), affects thermal insulation' },
            { name: 'heatIsolation', type: 'float', description: 'Heat isolation value (0-1), affects thermal protection' },
            { name: 'itemSize', type: 'size_array', description: 'Slots occupied in inventory [width, height]' },
            { name: 'itemsCargoSize', type: 'size_array', description: 'Internal storage space when used as container [width, height]' },
            { name: 'attachments', type: 'string_array', description: 'List of attachment types that can be attached to this item' }
        ];

        basicParams.forEach(param => {
            console.log(`Looking for parameter: ${param.name}`);
            const value = this.extractParameterValue(classContent, param.name);
            console.log(`Parameter ${param.name} value:`, value);
            if (value !== null) {
                parameters[param.name] = {
                    value: value,
                    type: param.type,
                    description: param.description
                };
                console.log(`Added parameter ${param.name}:`, parameters[param.name]);
            } else {
                console.log(`Parameter ${param.name} not found`);
            }
        });

        // 提取 DamageSystem 中的 hitpoints（改进版）
        const damageSystemMatch = this.extractNestedClass(classContent, 'DamageSystem');
        if (damageSystemMatch) {
            const globalHealthMatch = this.extractNestedClass(damageSystemMatch, 'GlobalHealth');
            if (globalHealthMatch) {
                const healthClassMatch = this.extractNestedClass(globalHealthMatch, 'Health');
                if (healthClassMatch) {
                    const hitpoints = this.extractParameterValue(healthClassMatch, 'hitpoints');
                    if (hitpoints !== null) {
                        parameters.hitpoints = {
                            value: hitpoints,
                            type: 'float',
                            description: 'Item health/durability, determines damage item can take before breaking'
                        };
                    }
                }
            }
        }

        return parameters;
    }

    // 提取嵌套类内容
    extractNestedClass(content, className) {
        console.log(`Looking for nested class: ${className}`);
        const lines = content.split('\n');
        let i = 0;
        
        while (i < lines.length) {
            const line = lines[i].trim();
            
            // 查找类定义
            const classMatch = line.match(new RegExp(`^class\\s+${className}\\s*\\{?`, 'i'));
            if (classMatch) {
                console.log(`Found ${className} at line ${i}: ${line}`);
                
                // 提取这个嵌套类的完整内容
                const classContent = this.extractCompleteClassContent(lines, i);
                if (classContent) {
                    console.log(`Extracted ${className} content:`, classContent.content.substring(0, 100) + '...');
                    return classContent.content;
                }
            }
            i++;
        }
        
        console.log(`Class ${className} not found`);
        return null;
    }

    // 提取完整类内容
    extractCompleteClassContent(lines, startIndex) {
        let braceCount = 0;
        let classContent = [];
        let foundOpenBrace = false;
        let i = startIndex;

        while (i < lines.length) {
            const line = lines[i];
            
            const openBraces = (line.match(/\{/g) || []).length;
            const closeBraces = (line.match(/\}/g) || []).length;
            
            if (!foundOpenBrace && openBraces > 0) {
                foundOpenBrace = true;
                braceCount = openBraces - closeBraces;
                const braceIndex = line.indexOf('{');
                if (braceIndex < line.length - 1) {
                    classContent.push(line.substring(braceIndex + 1));
                }
            } else if (foundOpenBrace) {
                braceCount += openBraces - closeBraces;
                
                if (braceCount > 0) {
                    classContent.push(line);
                } else {
                    const braceIndex = line.lastIndexOf('}');
                    if (braceIndex > 0) {
                        classContent.push(line.substring(0, braceIndex));
                    }
                    break;
                }
            }
            i++;
        }

        return {
            content: classContent.join('\n'),
            endIndex: i + 1
        };
    }

    // 提取单个参数值
    extractParameterValue(content, paramName) {
        // 匹配字符串值（包括本地化字符串）
        const stringMatch = content.match(new RegExp(`${paramName}\\s*=\\s*"([^"]*)"`, 'i'));
        if (stringMatch) {
            console.log(`Found string ${paramName}:`, stringMatch[1]);
            return stringMatch[1];
        }

        // 匹配数组值（改进版，支持多行和嵌套）
        console.log(`Searching for array ${paramName} in content:`, content.substring(0, 200));
        
        // 尝试多种数组格式
        const arrayPatterns = [
            // 格式1: itemSize[] = {4,4};
            new RegExp(`${paramName}\\s*\\[\\]\\s*=\\s*\\{([^}]+)\\};?`, 'i'),
            // 格式2: attachments[]= 多行格式
            new RegExp(`${paramName}\\s*\\[\\]\\s*=\\s*\\{([\\s\\S]*?)\\};?`, 'i'),
            // 格式3: 无空格格式
            new RegExp(`${paramName}\\[\\]\\s*=\\s*\\{([^}]+)\\}`, 'i')
        ];
        
        for (let pattern of arrayPatterns) {
            const arrayMatch = content.match(pattern);
            if (arrayMatch) {
                const arrayContent = arrayMatch[1];
                console.log(`Found array ${paramName} with pattern:`, pattern.source);
                console.log(`Array content:`, arrayContent);
                
                // 解析数组内容
                const elements = [];
                
                // 如果包含引号，按引号分割
                if (arrayContent.includes('"')) {
                    const matches = arrayContent.match(/"([^"]*)"/g);
                    if (matches) {
                        elements.push(...matches.map(m => m.replace(/"/g, '')));
                    }
                } else {
                    // 按逗号分割数字或简单值
                    const parts = arrayContent.split(',');
                    for (let part of parts) {
                        const cleaned = part.trim();
                        if (cleaned && !cleaned.match(/^\s*$/)) {
                            elements.push(cleaned);
                        }
                    }
                }
                
                console.log(`Parsed array ${paramName}:`, elements);
                return elements.filter(el => el.length > 0);
            }
        }
        
        console.log(`Array ${paramName} not found`);
        
        // 匹配数值（包括小数和负数）
        const numberMatch = content.match(new RegExp(`${paramName}\\s*=\\s*([\\d.-]+)`, 'i'));
        if (numberMatch) {
            console.log(`Found number ${paramName}:`, numberMatch[1]);
            return parseFloat(numberMatch[1]);
        }

        // 匹配整数值
        const intMatch = content.match(new RegExp(`${paramName}\\s*=\\s*(\\d+)`, 'i'));
        if (intMatch) {
            console.log(`Found int ${paramName}:`, intMatch[1]);
            return parseInt(intMatch[1]);
        }

        console.log(`Parameter ${paramName} not found with any pattern`);
        return null;
    }

    // 渲染解析结果
    renderParsedClasses(classes) {
        elements.parsedClasses.innerHTML = '';

        classes.forEach(classData => {
            const classDiv = document.createElement('div');
            classDiv.className = 'parsed-class';

            const header = document.createElement('div');
            header.className = 'class-header';
            header.innerHTML = `
                <span class="class-name">${classData.name} : ${classData.parent}</span>
                <i class="fas fa-chevron-down toggle-icon"></i>
            `;

            const content = document.createElement('div');
            content.className = 'class-content';

            // 基础参数组
            const basicGroup = document.createElement('div');
            basicGroup.className = 'parameter-group';
            basicGroup.innerHTML = '<h4><i class="fas fa-cog"></i>Basic Parameters</h4>';

            // DamageSystem 参数组
            const damageGroup = document.createElement('div');
            damageGroup.className = 'parameter-group';
            damageGroup.innerHTML = '<h4><i class="fas fa-heart"></i>Damage System</h4>';

            let hasBasicParams = false;
            let hasDamageParams = false;

            Object.entries(classData.parameters).forEach(([paramName, paramData]) => {
                const paramDiv = this.createParameterElement(paramName, paramData);
                
                if (paramName === 'hitpoints') {
                    damageGroup.appendChild(paramDiv);
                    hasDamageParams = true;
                } else {
                    basicGroup.appendChild(paramDiv);
                    hasBasicParams = true;
                }
            });

            if (hasBasicParams) {
                content.appendChild(basicGroup);
            }
            if (hasDamageParams) {
                content.appendChild(damageGroup);
            }

            classDiv.appendChild(header);
            classDiv.appendChild(content);
            elements.parsedClasses.appendChild(classDiv);

            // 添加展开/收起功能
            header.addEventListener('click', () => {
                const isExpanded = content.classList.contains('expanded');
                content.classList.toggle('expanded');
                header.classList.toggle('expanded');
            });
        });
    }

    // 创建参数元素
    createParameterElement(paramName, paramData) {
        const paramDiv = document.createElement('div');
        paramDiv.className = 'parameter';

        let inputHTML = '';
        
        if (paramData.type === 'size_array') {
            // itemSize 和 itemsCargoSize 使用两个输入框
            const values = Array.isArray(paramData.value) ? paramData.value : ['1', '1'];
            inputHTML = `
                <div class="size-array-inputs">
                    <input type="number" class="parameter-input size-input" value="${values[0] || 1}" data-param="${paramName}" data-index="0" placeholder="Width" min="1" oninput="validateSizeInput(this)" />
                    <span class="size-separator">×</span>
                    <input type="number" class="parameter-input size-input" value="${values[1] || 1}" data-param="${paramName}" data-index="1" placeholder="Height" min="1" oninput="validateSizeInput(this)" />
                </div>
            `;
        } else if (paramData.type === 'string_array') {
            // attachments 使用动态列表
            const values = Array.isArray(paramData.value) ? paramData.value : [];
            inputHTML = `
                <div class="string-array-container" data-param="${paramName}">
                    <div class="string-array-list">
                        ${values.map((value, index) => `
                            <div class="string-array-item">
                                <input type="text" class="parameter-input array-item-input" value="${value}" data-param="${paramName}" data-index="${index}" />
                                <button type="button" class="array-btn remove-btn" onclick="this.closest('.string-array-item').remove()">
                                    <i class="fas fa-minus"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    <button type="button" class="array-btn add-btn" onclick="addArrayItem(this)">
                        <i class="fas fa-plus"></i> Add
                    </button>
                </div>
            `;
        } else {
            // 普通输入框
            const displayValue = Array.isArray(paramData.value) 
                ? paramData.value.join(', ') 
                : (paramData.value || (paramData.type === 'string' ? '' : '1'));
            const inputType = paramData.type === 'int' || paramData.type === 'float' ? 'number' : 'text';
            const step = paramData.type === 'float' ? '0.01' : '1';
            const min = paramData.type === 'int' || paramData.type === 'float' ? '0' : '';
            
            // 添加输入限制
            let inputRestrictions = '';
            if (paramData.type === 'int' || paramData.type === 'float') {
                // 特殊处理 weight, varWetMax, heatIsolation
                if (paramName === 'weight' || paramName === 'varWetMax' || paramName === 'heatIsolation') {
                    inputRestrictions = `step="${step}" oninput="validateFloatInput(this)"`;
                } else if (paramName === 'hitpoints') {
                    // hitpoints 必须大于0
                    inputRestrictions = `min="0.01" step="${step}" oninput="validateHitpointsInput(this)"`;
                } else {
                    inputRestrictions = `min="${min}" ${paramData.type === 'float' ? `step="${step}"` : ''} oninput="validateNumberInput(this)"`;
                }
            } else if (paramName !== 'displayName' && paramName !== 'descriptionShort') {
                inputRestrictions = 'oninput="validateEnglishInput(this)"';
            }
            
            inputHTML = `
                <input type="${inputType}" class="parameter-input" value="${displayValue}" data-param="${paramName}" ${inputRestrictions} placeholder="${paramData.type === 'string' ? 'Enter text' : 'Enter value'}" />
            `;
        }

        paramDiv.innerHTML = `
            <div class="parameter-label">${paramName}</div>
            ${inputHTML}
            <div class="parameter-type">${paramData.type}</div>
            <div class="parameter-description">${paramData.description}</div>
        `;

        return paramDiv;
    }

    // 展开全部
    expandAll() {
        document.querySelectorAll('.class-content').forEach(content => {
            content.classList.add('expanded');
        });
        document.querySelectorAll('.class-header').forEach(header => {
            header.classList.add('expanded');
        });
    }

    // 收起全部
    collapseAll() {
        document.querySelectorAll('.class-content').forEach(content => {
            content.classList.remove('expanded');
        });
        document.querySelectorAll('.class-header').forEach(header => {
            header.classList.remove('expanded');
        });
    }

    // 导出配置
    exportConfig() {
        if (this.parsedData.length === 0 || !this.originalContent) {
            alert('No data to export, please parse config file first');
            return;
        }

        // 收集所有修改后的参数值
        const updatedData = this.collectUpdatedData();
        
        console.log('=== EXPORT DEBUG ===');
        console.log('Updated data collected:', updatedData);
        updatedData.forEach(classData => {
            console.log(`Class ${classData.name}:`);
            Object.entries(classData.parameters).forEach(([paramName, paramData]) => {
                console.log(`  ${paramName}: ${JSON.stringify(paramData.value)}`);
            });
        });
        
        // 直接在原始内容上进行精确替换
        const rebuiltContent = this.updateOriginalContent(this.originalContent, updatedData);
        
        // 创建下载链接
        const blob = new Blob([rebuiltContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'config.cpp';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 收集更新后的数据
    collectUpdatedData() {
        const updatedData = JSON.parse(JSON.stringify(this.parsedData));
        
        // 处理普通输入框
        document.querySelectorAll('.parameter-input:not(.size-input):not(.array-item-input)').forEach(input => {
            const paramName = input.getAttribute('data-param');
            const value = input.value;
            
            console.log(`Collecting regular parameter ${paramName} with value: ${value}`);
            
            // 找到对应的类和参数
            const classDiv = input.closest('.parsed-class');
            const className = classDiv.querySelector('.class-name').textContent.split(' : ')[0];
            
            const classData = updatedData.find(c => c.name === className);
            if (classData && classData.parameters[paramName]) {
                // 根据类型转换值
                const paramType = classData.parameters[paramName].type;
                let newValue;
                if (paramType === 'float') {
                    newValue = parseFloat(value) || 0;
                } else if (paramType === 'int') {
                    newValue = parseInt(value) || 0;
                } else {
                    newValue = value;
                }
                console.log(`Setting ${paramName} for ${className} to:`, newValue);
                classData.parameters[paramName].value = newValue;
            } else {
                console.log(`Failed to find class data or parameter for ${paramName} in ${className}`);
            }
        });
        
        // 处理尺寸数组（itemSize, itemsCargoSize）
        document.querySelectorAll('.size-array-inputs').forEach(container => {
            const inputs = container.querySelectorAll('.size-input');
            if (inputs.length === 2) {
                const paramName = inputs[0].getAttribute('data-param');
                const classDiv = container.closest('.parsed-class');
                const className = classDiv.querySelector('.class-name').textContent.split(' : ')[0];
                
                console.log(`Collecting size array ${paramName} for class ${className}`);
                console.log(`  Input values: [${inputs[0].value}, ${inputs[1].value}]`);
                
                const classData = updatedData.find(c => c.name === className);
                if (classData && classData.parameters[paramName]) {
                    const newValues = [
                        Math.max(1, parseInt(inputs[0].value) || 1),
                        Math.max(1, parseInt(inputs[1].value) || 1)
                    ];
                    console.log(`Final ${paramName} values for ${className}:`, newValues);
                    classData.parameters[paramName].value = newValues;
                } else {
                    console.log(`Failed to find class data or parameter for ${paramName} in ${className}`);
                }
            }
        });
        
        // 处理字符串数组（attachments）
        document.querySelectorAll('.string-array-container').forEach(container => {
            const paramName = container.getAttribute('data-param');
            const inputs = container.querySelectorAll('.array-item-input');
            const classDiv = container.closest('.parsed-class');
            const className = classDiv.querySelector('.class-name').textContent.split(' : ')[0];
            
            console.log(`Collecting string array ${paramName} for class ${className}`);
            const classData = updatedData.find(c => c.name === className);
            if (classData && classData.parameters[paramName]) {
                const values = [];
                inputs.forEach((input, index) => {
                    const value = input.value.trim();
                    console.log(`  Item ${index}: "${value}"`);
                    if (value) {
                        values.push(value);
                    }
                });
                console.log(`Final ${paramName} values for ${className}:`, values);
                classData.parameters[paramName].value = values;
            } else {
                console.log(`Failed to find class data or parameter for ${paramName} in ${className}`);
            }
        });
        
        return updatedData;
    }

    // 精确更新原始文件内容
    updateOriginalContent(originalContent, updatedData) {
        let content = originalContent;
        
        // 为每个更新的类替换参数值
        updatedData.forEach(classData => {
            console.log(`Processing class ${classData.name} for export`);
            
            // 更新每个参数
            Object.entries(classData.parameters).forEach(([paramName, paramData]) => {
                console.log(`Updating parameter ${paramName} in class ${classData.name}:`, paramData.value);
                
                if (paramName === 'hitpoints') {
                    // 特殊处理 hitpoints（在特定类的 DamageSystem 中）
                    content = this.updateHitpointsInClass(content, paramData.value, classData.name);
                    console.log(`Updated hitpoints to ${paramData.value} in class ${classData.name}`);
                    
                } else if (paramData.type === 'string') {
                    // 字符串参数
                    content = this.updateParameterInClass(content, paramName, `"${paramData.value}"`, classData.name);
                    console.log(`Updated string ${paramName} to "${paramData.value}" in class ${classData.name}`);
                    
                } else if (paramData.type === 'size_array') {
                    // 尺寸数组
                    const arrayValues = Array.isArray(paramData.value) 
                        ? paramData.value.join(',')
                        : '1,1';
                    content = this.updateParameterInClass(content, `${paramName}[]`, `{${arrayValues}}`, classData.name);
                    console.log(`Updated size array ${paramName} to {${arrayValues}} in class ${classData.name}`);
                    
                } else if (paramData.type === 'string_array') {
                    // 字符串数组 - 更复杂的处理
                    content = this.updateStringArray(content, paramName, paramData.value, classData.name);
                    
                } else {
                    // 数值类型（int, float）
                    content = this.updateParameterInClass(content, paramName, paramData.value, classData.name);
                    console.log(`Updated number ${paramName} to ${paramData.value} in class ${classData.name}`);
                }
            });
        });
        
        return content;
    }

    // 更新特定类中的参数（通用方法）
    updateParameterInClass(content, paramName, newValue, className) {
        console.log(`Updating ${paramName} to ${newValue} in class ${className}`);
        
        // 查找类的开始位置
        const classPattern = new RegExp(`class\\s+${className}\\s*:\\s*[^{]+\\{`, 'i');
        const classMatch = content.match(classPattern);
        
        if (!classMatch) {
            console.log(`Class ${className} not found`);
            return content;
        }
        
        const classStartIndex = content.indexOf(classMatch[0]);
        
        // 找到该类的结束位置
        let braceCount = 1;
        let classEndIndex = classStartIndex + classMatch[0].length;
        
        while (classEndIndex < content.length && braceCount > 0) {
            if (content[classEndIndex] === '{') {
                braceCount++;
            } else if (content[classEndIndex] === '}') {
                braceCount--;
            }
            classEndIndex++;
        }
        
        // 在该类的范围内查找和替换参数
        const classContent = content.substring(classStartIndex, classEndIndex);
        
        // 根据参数名生成对应的正则表达式
        let paramPattern;
        if (paramName.includes('[]')) {
            // 数组参数，如 itemSize[]
            const baseName = paramName.replace('[]', '');
            paramPattern = new RegExp(`(${baseName}\\[\\]\\s*=\\s*)\\{[^}]*\\}`, 'i');
        } else {
            // 普通参数
            paramPattern = new RegExp(`(${paramName}\\s*=\\s*)[^;]+`, 'i');
        }
        
        if (paramPattern.test(classContent)) {
            const updatedClassContent = classContent.replace(paramPattern, `$1${newValue}`);
            
            // 替换原始内容中的类部分
            const before = content.substring(0, classStartIndex);
            const after = content.substring(classEndIndex);
            content = before + updatedClassContent + after;
            console.log(`Successfully updated ${paramName} in class ${className}`);
        } else {
            console.log(`${paramName} not found in class ${className}`);
        }
        
        return content;
    }

    // 更新特定类中的 hitpoints
    updateHitpointsInClass(content, newValue, className) {
        console.log(`Updating hitpoints to ${newValue} in class ${className}`);
        
        // 查找类的开始位置
        const classPattern = new RegExp(`class\\s+${className}\\s*:\\s*[^{]+\\{`, 'i');
        const classMatch = content.match(classPattern);
        
        if (!classMatch) {
            console.log(`Class ${className} not found`);
            return content;
        }
        
        const classStartIndex = content.indexOf(classMatch[0]);
        
        // 找到该类的结束位置
        let braceCount = 1;
        let classEndIndex = classStartIndex + classMatch[0].length;
        
        while (classEndIndex < content.length && braceCount > 0) {
            if (content[classEndIndex] === '{') {
                braceCount++;
            } else if (content[classEndIndex] === '}') {
                braceCount--;
            }
            classEndIndex++;
        }
        
        // 在该类的范围内查找和替换 hitpoints
        const classContent = content.substring(classStartIndex, classEndIndex);
        const hitpointsPattern = /(\s*hitpoints\s*=\s*)[^;]+/;
        
        if (hitpointsPattern.test(classContent)) {
            const updatedClassContent = classContent.replace(hitpointsPattern, `$1${newValue}`);
            
            // 替换原始内容中的类部分
            const before = content.substring(0, classStartIndex);
            const after = content.substring(classEndIndex);
            content = before + updatedClassContent + after;
            console.log(`Successfully updated hitpoints in class ${className}`);
        } else {
            console.log(`hitpoints not found in class ${className}`);
        }
        
        return content;
    }

    // 更新字符串数组的辅助方法
    updateStringArray(content, paramName, newValues, className) {
        console.log(`Updating string array ${paramName} for class ${className}`);
        
        // 查找类的开始位置
        const classPattern = new RegExp(`class\\s+${className}\\s*:\\s*[^{]+\\{`, 'i');
        const classMatch = content.match(classPattern);
        
        if (!classMatch) {
            console.log(`Class ${className} not found`);
            return content;
        }
        
        const classStartIndex = content.indexOf(classMatch[0]);
        
        // 在该类中查找参数
        const paramPattern = new RegExp(`${paramName}\\[\\]\\s*=\\s*\\{([\\s\\S]*?)\\};`, 'i');
        const paramMatch = content.substring(classStartIndex).match(paramPattern);
        
        if (paramMatch) {
            const fullMatch = paramMatch[0];
            const paramStartIndex = classStartIndex + content.substring(classStartIndex).indexOf(fullMatch);
            
            // 生成新的数组内容
            let newArrayContent;
            if (Array.isArray(newValues) && newValues.length > 0) {
                const arrayItems = newValues.map(v => `\t\t\t"${v}"`).join(',\n');
                newArrayContent = `${paramName}[]=\n\t\t{\n${arrayItems}\n\t\t};`;
            } else {
                newArrayContent = `${paramName}[]={};`;
            }
            
            // 替换内容
            const before = content.substring(0, paramStartIndex);
            const after = content.substring(paramStartIndex + fullMatch.length);
            content = before + newArrayContent + after;
            console.log(`Updated string array ${paramName}`);
        } else {
            console.log(`String array ${paramName} not found in class ${className}`);
        }
        
        return content;
    }

    // 重建配置文件
    rebuildConfigFile(updatedData) {
        let content = '';
        
        // 添加 cfgVehicles 之前的内容
        content += this.configStructure.beforeCfgVehicles;
        
        // 重建 cfgVehicles
        content += 'class cfgVehicles\n{\n';
        
        // 添加类声明
        this.configStructure.cfgVehicles.declarations.forEach(decl => {
            content += '\t' + decl.line + '\n';
        });
        
        // 添加类定义
        this.configStructure.cfgVehicles.classes.forEach(originalClass => {
            const updatedClass = updatedData.find(c => c.name === originalClass.name);
            if (updatedClass) {
                content += this.rebuildClass(updatedClass, originalClass);
            } else {
                // 如果没有更新，使用原始内容
                content += this.rebuildClassFromOriginal(originalClass);
            }
        });
        
        content += '};\n';
        
        // 添加 cfgVehicles 之后的内容（清理多余分号）
        let afterContent = this.configStructure.afterCfgVehicles;
        // 移除多余的分号
        afterContent = afterContent.replace(/;\s*;+/g, ';').trim();
        if (afterContent && !afterContent.endsWith('\n')) {
            afterContent += '\n';
        }
        content += afterContent;
        
        return content;
    }

    // 获取参数在原始内容中的顺序
    getParameterOrder(originalContent, parameters) {
        const paramOrder = [];
        const lines = originalContent.split('\n');
        
        for (const line of lines) {
            const trimmed = line.trim();
            
            // 跳过 DamageSystem 相关内容
            if (trimmed.includes('class DamageSystem') || trimmed.includes('class GlobalHealth') || 
                trimmed.includes('class Health') || trimmed.includes('hitpoints')) {
                continue;
            }
            
            // 检查每个参数
            for (const paramName of Object.keys(parameters)) {
                if (paramName !== 'hitpoints') {
                    const paramPattern = new RegExp(`^\\s*${paramName}(\\[\\])?\\s*=`, 'i');
                    if (paramPattern.test(trimmed) && !paramOrder.includes(paramName)) {
                        paramOrder.push(paramName);
                    }
                }
            }
        }
        
        // 添加任何没有在原始内容中找到的参数
        for (const paramName of Object.keys(parameters)) {
            if (paramName !== 'hitpoints' && !paramOrder.includes(paramName)) {
                paramOrder.push(paramName);
            }
        }
        
        return paramOrder;
    }

    // 重建单个类
    rebuildClass(updatedClass, originalClass) {
        let classContent = `\tclass ${updatedClass.name} : ${updatedClass.parent}\n\t{\n`;
        
        // 按照原始顺序重建参数，确保结构正确
        const parameterOrder = this.getParameterOrder(originalClass.rawContent, updatedClass.parameters);
        
        // 首先添加非 hitpoints 参数
        parameterOrder.forEach(paramName => {
            if (paramName !== 'hitpoints' && updatedClass.parameters[paramName]) {
                classContent += this.rebuildParameter(paramName, updatedClass.parameters[paramName], originalClass.rawContent);
            }
        });
        
        // 添加其他未处理的内容（不包括 DamageSystem）
        const otherContent = this.extractOtherContent(originalClass.rawContent, updatedClass.parameters);
        if (otherContent) {
            classContent += otherContent;
        }
        
        // 最后添加 DamageSystem（如果有 hitpoints）
        if (updatedClass.parameters.hitpoints) {
            classContent += this.rebuildParameter('hitpoints', updatedClass.parameters.hitpoints, originalClass.rawContent);
        }
        
        classContent += '\t};\n';
        return classContent;
    }

    // 重建参数
    rebuildParameter(paramName, paramData, originalClassContent = '') {
        if (paramName === 'hitpoints') {
            // 特殊处理 hitpoints - 重建整个 DamageSystem
            return this.rebuildDamageSystem(paramData.value, originalClassContent);
        }
        
        switch (paramData.type) {
            case 'string':
                return `\t\t${paramName} = "${paramData.value}";\n`;
            
            case 'float':
            case 'int':
                return `\t\t${paramName} = ${paramData.value};\n`;
            
            case 'size_array':
                const sizeValues = Array.isArray(paramData.value) 
                    ? paramData.value.join(',') 
                    : '1,1';
                return `\t\t${paramName}[] = {${sizeValues}};\n`;
            
            case 'string_array':
                if (Array.isArray(paramData.value) && paramData.value.length > 0) {
                    const arrayItems = paramData.value.map(v => `\t\t\t"${v}"`).join(',\n');
                    return `\t\t${paramName}[]=\n\t\t{\n${arrayItems}\n\t\t};\n`;
                } else {
                    return `\t\t${paramName}[]={};`;
                }
            
            default:
                return `\t\t${paramName} = ${paramData.value};\n`;
        }
    }

    // 重建 DamageSystem（保留原始结构和格式）
    rebuildDamageSystem(hitpointsValue, originalClassContent) {
        // 从原始内容中提取完整的 DamageSystem
        const damageSystemMatch = this.extractNestedClass(originalClassContent, 'DamageSystem');
        if (!damageSystemMatch) {
            // 如果没有找到原始 DamageSystem，创建基本结构
            return `\t\tclass DamageSystem
\t\t{
\t\t\tclass GlobalHealth
\t\t\t{
\t\t\t\tclass Health
\t\t\t\t{
\t\t\t\t\thitpoints=${hitpointsValue};
\t\t\t\t};
\t\t\t};
\t\t};
`;
        }

        // 保留原始 DamageSystem 结构，只更新 hitpoints 值
        let rebuiltDamageSystem = damageSystemMatch;
        
        // 使用更精确的方式替换 hitpoints 值
        const hitpointsRegex = /(\s*hitpoints\s*=\s*)[^;]+/;
        if (hitpointsRegex.test(rebuiltDamageSystem)) {
            rebuiltDamageSystem = rebuiltDamageSystem.replace(hitpointsRegex, `$1${hitpointsValue}`);
        }
        
        // 保持原始格式，只添加基础缩进
        const lines = rebuiltDamageSystem.split('\n');
        const formattedLines = [];
        
        for (const line of lines) {
            if (line.trim()) {
                // 保持原始的相对缩进，只添加基础缩进
                formattedLines.push('\t\t' + line);
            } else {
                formattedLines.push('');
            }
        }
        
        return `\t\tclass DamageSystem\n\t\t{\n${formattedLines.join('\n')}\n\t\t};\n`;
    }

    // 提取其他未处理的内容（保持原始格式）
    extractOtherContent(originalContent, processedParams) {
        // 保留原始内容中未被处理的部分
        const lines = originalContent.split('\n');
        const otherLines = [];
        let inDamageSystem = false;
        let damageSystemBraceCount = 0;
        let inArray = false;
        let arrayBraceCount = 0;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();
            
            // 跳过空行和注释（但保留它们）
            if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) {
                if (!inDamageSystem && !inArray) {
                    // 保持原始缩进
                    otherLines.push(line.startsWith('\t') ? '\t' + line : '\t\t' + line);
                }
                continue;
            }
            
            // 检查是否进入 DamageSystem
            if (trimmed.includes('class DamageSystem')) {
                inDamageSystem = true;
                damageSystemBraceCount = 0;
                continue;
            }
            
            // 如果在 DamageSystem 内，跟踪大括号
            if (inDamageSystem) {
                const openBraces = (line.match(/\{/g) || []).length;
                const closeBraces = (line.match(/\}/g) || []).length;
                damageSystemBraceCount += openBraces - closeBraces;
                
                if (damageSystemBraceCount <= 0) {
                    inDamageSystem = false;
                }
                continue;
            }
            
            // 检查是否是已处理的参数
            let isProcessed = false;
            for (const paramName of Object.keys(processedParams)) {
                // 更精确的参数匹配
                const paramPattern = new RegExp(`^\\s*${paramName}(\\[\\])?\\s*=`, 'i');
                if (paramPattern.test(trimmed)) {
                    isProcessed = true;
                    break;
                }
            }
            
            // 如果是数组参数，需要跟踪整个数组结构
            if (isProcessed && trimmed.includes('{')) {
                inArray = true;
                arrayBraceCount = (trimmed.match(/\{/g) || []).length - (trimmed.match(/\}/g) || []).length;
                
                // 如果在同一行就结束了数组，直接跳过
                if (arrayBraceCount <= 0) {
                    inArray = false;
                }
                continue;
            }
            
            // 如果在数组内，继续跟踪大括号
            if (inArray) {
                const openBraces = (line.match(/\{/g) || []).length;
                const closeBraces = (line.match(/\}/g) || []).length;
                arrayBraceCount += openBraces - closeBraces;
                
                if (arrayBraceCount <= 0) {
                    inArray = false;
                }
                continue;
            }
            
            // 跳过已处理的单行参数
            if (isProcessed) {
                continue;
            }
            
            // 添加未处理的内容，保持原始格式
            if (trimmed) {
                // 保持原始缩进
                otherLines.push(line.startsWith('\t') ? '\t' + line : '\t\t' + line);
            }
        }
        
        return otherLines.length > 0 ? otherLines.join('\n') + '\n' : '';
    }

    // 从原始内容重建类（未修改的类）
    rebuildClassFromOriginal(originalClass) {
        return `\tclass ${originalClass.name} : ${originalClass.parent}\n\t{\n` +
               originalClass.rawContent.split('\n').map(line => '\t\t' + line).join('\n') + '\n' +
               '\t};\n';
    }
}

// 全局函数：添加数组项
window.addArrayItem = function(button) {
    // 从按钮元素向上查找到对应的容器
    const container = button.closest('.string-array-container');
    if (container) {
        const paramName = container.getAttribute('data-param');
        const listContainer = container.querySelector('.string-array-list');
        if (listContainer) {
            const itemCount = listContainer.children.length;
            const newItem = document.createElement('div');
            newItem.className = 'string-array-item';
            newItem.innerHTML = `
                <input type="text" class="parameter-input array-item-input" value="" data-param="${paramName}" data-index="${itemCount}" placeholder="Enter attachment name" oninput="validateEnglishInput(this)" />
                <button type="button" class="array-btn remove-btn" onclick="this.closest('.string-array-item').remove()">
                    <i class="fas fa-minus"></i>
                </button>
            `;
            listContainer.appendChild(newItem);
        }
    }
};

// 全局函数：验证数字输入
window.validateNumberInput = function(input) {
    const value = input.value;
    // 移除非数字字符（保留小数点和负号）
    const cleanValue = value.replace(/[^\d.-]/g, '');
    
    if (cleanValue !== value) {
        input.value = cleanValue;
        // 显示提示
        showInputWarning(input, 'Numbers only');
    }
    
    // 检查是否为空，如果为空则设置为1
    if (input.value === '' || input.value === null) {
        input.value = '1';
    }
};

// 全局函数：验证英文输入（不允许中文）
window.validateEnglishInput = function(input) {
    const value = input.value;
    // 移除中文字符
    const cleanValue = value.replace(/[\u4e00-\u9fa5]/g, '');
    
    if (cleanValue !== value) {
        input.value = cleanValue;
        // 显示提示
        showInputWarning(input, 'Chinese characters not allowed');
    }
    
    // 如果为空且是字符串类型，保持为空
    if (input.value === '' || input.value === null) {
        const paramType = input.closest('.parameter').querySelector('.parameter-type').textContent;
        if (paramType !== 'string') {
            input.value = '1';
        }
    }
};

// 全局函数：验证尺寸输入（itemSize 和 itemsCargoSize）
window.validateSizeInput = function(input) {
    const value = input.value;
    
    // 移除非数字字符（只保留正整数）
    const cleanValue = value.replace(/[^\d]/g, '');
    
    if (cleanValue !== value) {
        input.value = cleanValue;
        // 显示提示
        showInputWarning(input, 'Positive integers only');
    }
    
    // 检查是否为空或小于1
    const numValue = parseInt(input.value);
    if (input.value === '' || isNaN(numValue) || numValue < 1) {
        input.value = '1';
        if (value !== '' && value !== '1') {
            showInputWarning(input, 'Size cannot be less than 1');
        }
    }
    
    // 移除了最大值限制 - 允许任意大的数值
};

// 全局函数：验证 hitpoints 输入（必须大于0）
window.validateHitpointsInput = function(input) {
    const value = input.value;
    
    // 允许数字和小数点
    const cleanValue = value.replace(/[^\d.]/g, '');
    
    // 确保只有一个小数点
    let finalValue = cleanValue;
    const dotCount = (cleanValue.match(/\./g) || []).length;
    if (dotCount > 1) {
        const firstDotIndex = cleanValue.indexOf('.');
        finalValue = cleanValue.substring(0, firstDotIndex + 1) + cleanValue.substring(firstDotIndex + 1).replace(/\./g, '');
    }
    
    if (finalValue !== value) {
        input.value = finalValue;
        showInputWarning(input, 'Positive numbers only');
    }
    
    // 检查是否为空或小于等于0
    const numValue = parseFloat(input.value);
    if (input.value === '' || input.value === '.' || isNaN(numValue) || numValue <= 0) {
        input.value = '1';
        if (value !== '' && value !== '1') {
            showInputWarning(input, 'Hitpoints must be greater than 0');
        }
    }
};

// 全局函数：验证浮点数输入（weight, varWetMax, heatIsolation）
window.validateFloatInput = function(input) {
    const value = input.value;
    
    // 允许数字、小数点、负号
    const cleanValue = value.replace(/[^\d.-]/g, '');
    
    // 确保只有一个小数点和一个负号（在开头）
    let finalValue = cleanValue;
    
    // 处理多个小数点
    const dotCount = (cleanValue.match(/\./g) || []).length;
    if (dotCount > 1) {
        const firstDotIndex = cleanValue.indexOf('.');
        finalValue = cleanValue.substring(0, firstDotIndex + 1) + cleanValue.substring(firstDotIndex + 1).replace(/\./g, '');
    }
    
    // 处理多个负号或不在开头的负号
    const minusCount = (finalValue.match(/-/g) || []).length;
    if (minusCount > 1 || (finalValue.includes('-') && finalValue.indexOf('-') !== 0)) {
        if (finalValue.startsWith('-')) {
            finalValue = '-' + finalValue.replace(/-/g, '');
        } else {
            finalValue = finalValue.replace(/-/g, '');
        }
    }
    
    if (finalValue !== value) {
        input.value = finalValue;
        // 显示提示
        showInputWarning(input, 'Numbers only (decimals and negatives allowed)');
    }
    
    // 如果为空，设为0
    if (input.value === '' || input.value === '-' || input.value === '.') {
        input.value = '0';
    }
    
    // 验证是否为有效数字
    const numValue = parseFloat(input.value);
    if (isNaN(numValue)) {
        input.value = '0';
        if (value !== '' && value !== '0') {
            showInputWarning(input, 'Please enter a valid number');
        }
    }
};

// 显示输入警告
function showInputWarning(input, message) {
    // 移除现有警告
    const existingWarning = input.parentNode.querySelector('.input-warning');
    if (existingWarning) {
        existingWarning.remove();
    }
    
    // 创建新警告
    const warning = document.createElement('div');
    warning.className = 'input-warning';
    warning.style.cssText = `
        color: #e74c3c;
        font-size: 0.8rem;
        margin-top: 2px;
        animation: fadeIn 0.3s ease;
    `;
    warning.textContent = message;
    
    // 插入警告
    input.parentNode.insertBefore(warning, input.nextSibling);
    
    // 3秒后移除警告
    setTimeout(() => {
        if (warning.parentNode) {
            warning.remove();
        }
    }, 3000);
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new ConfigEditorApp();
});