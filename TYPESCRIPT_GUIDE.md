# TypeScript 配置指南

本项目已成功配置 TypeScript 支持，可以与现有的 JavaScript 代码无缝共存。

## 🚀 已完成的配置

### 1. 依赖安装
- `typescript` - TypeScript 编译器
- `@types/node` - Node.js 类型定义
- `@babel/preset-typescript` - Babel TypeScript 预设
- `@typescript-eslint/parser` - TypeScript ESLint 解析器
- `@typescript-eslint/eslint-plugin` - TypeScript ESLint 插件

### 2. 配置文件
- ✅ `tsconfig.json` - TypeScript 编译配置
- ✅ `webpack.config.js` - 更新支持 `.ts` 和 `.tsx` 文件
- ✅ `.eslintrc.cjs` - 更新支持 TypeScript 代码检查
- ✅ `package.json` - 添加类型检查脚本

### 3. 类型声明
- ✅ `src/types/global.d.ts` - 全局类型声明文件
- ✅ 环境变量类型声明
- ✅ 静态资源类型声明

## 📝 使用方法

### 创建 TypeScript 文件
你可以创建以下类型的文件：
- `.ts` - TypeScript 文件
- `.tsx` - TypeScript React 组件文件

### 示例组件
查看 `src/components/example/TypeScriptExample.tsx` 了解如何编写 TypeScript React 组件。

### 类型检查
```bash
# 运行类型检查
npm run type-check

# 监听模式下的类型检查
npm run type-check:watch
```

### 代码检查
```bash
# 检查所有文件（包括 TypeScript）
npm run lint

# 自动修复可修复的问题
npm run lint:fix
```

## 🔧 TypeScript 配置说明

### tsconfig.json 主要配置
- `"allowJs": true` - 允许导入 JavaScript 文件
- `"strict": false` - 暂时关闭严格模式，便于渐进式迁移
- `"jsx": "react-jsx"` - 支持 React 17+ 的新 JSX 转换
- `"baseUrl": "."` 和 `"paths"` - 支持路径别名 `@/*`

### ESLint 配置
- 对 TypeScript 文件应用 TypeScript 规则
- 对 JavaScript 文件保持原有规则，不强制 TypeScript 规则
- 支持混合使用 `.js`、`.jsx`、`.ts`、`.tsx` 文件

## 🎯 迁移建议

### 渐进式迁移
1. **新功能优先**：新开发的组件和功能使用 TypeScript
2. **关键模块**：对核心业务逻辑模块逐步添加类型
3. **工具函数**：工具函数和 API 接口优先添加类型定义

### 迁移步骤
1. 将 `.js` 文件重命名为 `.ts`
2. 将 `.jsx` 文件重命名为 `.tsx`
3. 逐步添加类型注解
4. 修复类型错误

### 类型定义建议
```typescript
// 1. 为 Props 定义接口
interface ComponentProps {
  title: string;
  count?: number;
  onAction?: (value: string) => void;
}

// 2. 为 API 响应定义类型
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// 3. 为状态定义类型
interface AppState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
```

## 🛠️ 开发工具

### VS Code 推荐插件
- TypeScript Importer
- TypeScript Hero
- Auto Rename Tag
- Bracket Pair Colorizer

### 类型检查集成
- 开发时：`npm run type-check:watch`
- 构建前：`npm run type-check`
- CI/CD：在构建流程中添加类型检查

## 📚 学习资源

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [React TypeScript 备忘单](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript ESLint 规则](https://typescript-eslint.io/rules/)

## ❓ 常见问题

### Q: 现有的 JavaScript 代码会受到影响吗？
A: 不会。配置已经确保 JavaScript 文件继续使用原有的 ESLint 规则，不会强制应用 TypeScript 规则。

### Q: 如何处理第三方库的类型？
A: 大多数流行库都有 `@types/` 包，可以通过 `npm install --save-dev @types/库名` 安装。

### Q: 可以混合使用 JavaScript 和 TypeScript 吗？
A: 可以。项目支持 `.js`、`.jsx`、`.ts`、`.tsx` 文件混合使用。

---

🎉 现在你可以开始在项目中使用 TypeScript 了！建议从新功能开始，逐步迁移现有代码。