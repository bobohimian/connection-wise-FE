/**
 * ESLint 配置文件
 * 
 * 该配置文件定义了项目的代码规范和质量检查规则
 * 详细文档: https://eslint.org/docs/latest/use/configure/
 */
module.exports = {
  // 标记为根配置文件，ESLint 不会继续向上查找配置
  root: true,
  
  // 定义代码运行的环境
  env: { 
    browser: true, // 浏览器环境中的全局变量
    es2020: true,  // 添加所有 ECMAScript 2020 的全局变量
    node: true,    // Node.js 全局变量和作用域
    jest: true,    // Jest 全局变量
  },
  
  // 继承的规则集合
  extends: [
    // 基础 ESLint 推荐规则
    'eslint:recommended',
    // React 推荐规则
    'plugin:react/recommended',
    // React 17+ 的 JSX 运行时规则
    'plugin:react/jsx-runtime',
    // React Hooks 规则
    'plugin:react-hooks/recommended',
    // 导入/导出语法规则
    'plugin:import/recommended',
  ],
  
  // 忽略检查的文件和目录
  ignorePatterns: [
    'dist',         // 构建输出目录
    '.eslintrc.cjs', // ESLint 配置文件本身
    'node_modules',  // 依赖包目录
    'build',         // 构建目录
    'coverage',      // 测试覆盖率报告目录
  ],
  
  // JavaScript 语言选项
  parserOptions: { 
    ecmaVersion: 'latest', // 使用最新的 ECMAScript 版本
    sourceType: 'module',  // 使用 ECMAScript 模块
    ecmaFeatures: {
      jsx: true,           // 启用 JSX
    },
  },
  
  // 共享设置
  settings: { 
    react: { 
      version: '18.2'      // 指定 React 版本
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'] // 导入解析器支持的扩展名
      }
    }
  },
  
  // 使用的插件
  plugins: [
    'react-refresh', // React Fast Refresh 插件
    'react',         // React 插件
    'import',        // import/export 语法插件
  ],
  
  // 自定义规则配置
  rules: {
    // React Fast Refresh 规则
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    
    // React 相关规则
    'react/prop-types': 'off',           // 暂时禁用组件 props 类型检查
    'react/jsx-uses-react': 'off',        // React 17+ 不需要导入 React
    'react/react-in-jsx-scope': 'off',    // React 17+ 不需要在 JSX 文件中导入 React
    'react/display-name': 'off',          // 禁用组件定义必须有 displayName 的检查
    'react/jsx-filename-extension': ['warn', { 'extensions': ['.jsx', '.js'] }], // JSX 可以在 .jsx 和 .js 文件中
    'react/jsx-indent': ['warn', 2],      // JSX 缩进为 2 个空格
    'react/jsx-indent-props': ['warn', 2], // JSX 属性缩进为 2 个空格
    'react/jsx-closing-bracket-location': ['warn', 'line-aligned'], // JSX 闭合标签位置
    
    // React Hooks 规则
    'react-hooks/rules-of-hooks': 'error', // Hooks 规则检查
    'react-hooks/exhaustive-deps': 'warn', // Hooks 依赖检查
    
    // 常规 JavaScript 规则
    'no-console': ['warn', { allow: ['warn', 'error', 'info', 'log'] }], // 允许一些console使用，但仍然提示警告
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }], // 未使用变量警告，忽略下划线开头的变量和参数
    'prefer-const': 'warn',               // 优先使用 const
    'arrow-body-style': ['warn', 'as-needed'], // 箭头函数体风格
    'no-param-reassign': 'warn',          // 禁止参数重新赋值
    'no-prototype-builtins': 'off',       // 允许直接调用Object.prototype方法
    
    // 代码风格规则
    'indent': ['warn', 2, { 'SwitchCase': 1 }], // 使用 2 空格缩进
    'quotes': ['warn', 'single', { 'avoidEscape': true }], // 使用单引号
    'semi': ['warn', 'always'],           // 始终使用分号
    'comma-dangle': ['warn', 'always-multiline'], // 多行时尾随逗号
    'object-curly-spacing': ['warn', 'always'], // 对象花括号内的空格
    
    // 导入/导出规则
    'import/order': ['warn', {             // 导入顺序
      'groups': [
        'builtin',                        // 内置模块
        'external',                        // 外部模块
        'internal',                        // 内部模块
        ['parent', 'sibling', 'index']     // 相对导入
      ],
      'newlines-between': 'never',         // 不要求组之间空行
      'alphabetize': {
        'order': 'asc',                   // 按字母顺序排序
        'caseInsensitive': true           // 不区分大小写
      }
    }],
    'import/no-unresolved': 'warn',        // 确保导入的模块可以解析
    'import/named': 'error',               // 确保命名导入对应命名导出
  },
  
  // 针对特定文件的覆盖规则
  overrides: [
    {
      files: ['*.test.js', '*.test.jsx', '*.spec.js', '*.spec.jsx'],
      rules: {
        // 测试文件中放宽一些规则
        'no-unused-expressions': 'off',
      }
    }
  ]
}
